<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;
use App\Models\Feedback;
use Illuminate\Support\Facades\Log;
use Validator;
use App\Models\Content;
use App\Models\Order;
use App\Models\PaymentMethods;
use App\Models\Transaction;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Models\UserDetail;
use App\Models\MembershipSubscription;

class PGController extends Controller
{
    protected $soapUrl = "https://uat.craftsilicon.com/elmathirdpartyvendors/elmathirdpartyvendors.asmx?WSDL";

    protected function generateMpesaSessionKey($credentials)
    {


        Log::Info('generateMpesaSessionKey:' . $credentials['request_soap_url']);
        try {
            $xml_post_string = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:craf="http://craftsilicon.com/">
                    <soap:Header/>
                    <soap:Body>
                    <craf:GetSessionKey>
                    <craf:APIUserID>' . $credentials['apiuser'] . '</craf:APIUserID>
                    <craf:APIUserKey>' . $credentials['apipassword'] . '</craf:APIUserKey>
                    </craf:GetSessionKey>
                    </soap:Body>
                    </soap:Envelope>';
            $response = soap_xml_curl($credentials['request_soap_url'], $xml_post_string);
            if ($response) {
                //    echo '<br> GetSessionKey response';
                $dom = new \DOMDocument();
                $dom->loadXML($response);
                $final_content = '';
                foreach ($dom->documentElement->childNodes as $node) {
                    $final_content = $node->textContent;
                }
                // echo '<pre>';  print_r($final_content);
                $xml = simplexml_load_string($final_content);
                $json = json_encode($xml);
                $array = json_decode($json, true);
                return $array['SessionKey'];
            } else {
                Log::Info('No soap xml curl response found');
            }
        } catch (\Exception $ex) {
            echo 'Exception: ' . $ex;
        }
    }


    function createOrderEntry($request, $transactionResult, $depositResponse)
    {

        if ($request->payment_for == 'cart') {


            foreach ($request->checkout_data as $key => $value) {
                $content_amount = Content::select('contents.content_price', 'contents.discounted_price')
                    ->where('content_id', $value)
                    ->where('contents.status', 'published')
                    ->first();
                if (!$content_amount) {
                    Log::Info('Product error!');
                    return false;
                }
                $price = $content_amount->content_price;
                if ($content_amount->discounted_price != null && $content_amount->discounted_price != 0 && $content_amount->discounted_price != "") {
                    if ($content_amount->content_price > $content_amount->discounted_price) {
                        $price = $content_amount->discounted_price;
                    }
                }

                $data_array = array(
                    'order_for_id' => $value,
                    'user_id' => Auth::id(),
                    'amount' => $price,
                    'transaction_id' => $transactionResult->transaction_id
                );

                $order = DB::table('orders')->insert($data_array);
                if ($order) {
                    Log::Info('order created');

                } else {
                    Log::Info('Unable to create order entry!');
                    return false;
                }
            }
        } else {
            $plan_detail = DB::table('plan')->where('plan_id', $request->checkout_data)->first();
            if ($plan_detail) {
                $data_array = array(
                    'order_for_id' => $request->checkout_data,
                    'user_id' => Auth::id(),
                    'amount' => $plan_detail->charges,
                    'transaction_id' => $transactionResult->transaction_id

                );
                $order = DB::table('orders')->insert($data_array);
                if ($order) {
                    Log::Info('order created');
                }
            }

        }
        return true;

    }

    function createTransactionEntry($request, $depositResponse, $reference)
    {
        Log::Info('createTransactionEntry');
        Log::Info(print_r($depositResponse, true));

        $payment_method_id = PaymentMethods::where('payment_key', $request->payment_method)->pluck('payment_methods_id')->first();
        if (!empty($payment_method_id)) {
            $transactionArray = array(
                'user_id' => Auth::id(),
                'payment_for' => $request->payment_for,
                'total_amount' => $request->amount,
                'bank_refrence' => $reference
            );
            $transactionArray['payment_method'] = $payment_method_id;

            $transactionArray['payment_request'] = json_encode($request->all());
            $transactionArray['payment_response'] = json_encode($depositResponse);

            if (isset($_SERVER['REMOTE_ADDR'])) {
                $transactionArray['customer_remote_addr'] = $_SERVER['REMOTE_ADDR'];
            }
            if (!empty($request->mobile)) {
                $imobile = str_replace(' ', '', $request->mobile);
                $imobile = ltrim($imobile, '0');
                $transactionArray['mobile'] = $imobile;
            }


            $transactionResult = Transaction::create($transactionArray);
            return $transactionResult;
        }
    }

    function transactCardIntasend($request, $reference)
    {
        $credentials = get_payment_credentials($request->payment_method);
        Log::Info('transactCardIntasend' . $reference);
        $curl = curl_init();
        $post_fields = [
            "public_key" => $credentials['public_key'],
            "amount" => $request->amount,
            "currency" => "USD",
            "email" => $request->email,
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "country" => "KE",
            "redirect_url" => $credentials['redirect_url']
        ];
        Log::Info('post_fields');
        Log::Info(print_r($post_fields, true));
        curl_setopt_array($curl, array(
            CURLOPT_URL => $credentials['intasend_url'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode($post_fields),
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        Log::Info('response');
        Log::Info($response);
        $data = json_decode($response, true);
        return $data;

    }

    public function validateIntasendResponse(Request $request)
    {
        Log::Info('validateIntasendResponse');
        Log::Info(print_r($request->all(), true));
        $transaction = Transaction::where('payment_response', 'like', '%' . $request->signature . '%')
            ->orWhere('payment_response', 'like', '%' . $request->checkout_id . '%')
            ->first();
        if ($transaction) {
            Log::Info('signature found');
            return $this->afterSuccessfulPayment($transaction, $request);

        } else {
            return api_response(201, 'Unable to verify payment response!');
        }

    }


    function mpesaTransact($request, $reference)
    {
        if ($request->payment_method != 'mpesa') {
            return api_response(201, 'Wrong payment method');
        }
        $credentials = get_payment_credentials($request->payment_method);
        $sessionKey = $this->generateMpesaSessionKey($credentials);
        $imobile = str_replace(' ', '', $request->mobile);
        $imobile = ltrim($imobile, '0');
        $mobile = '254' . $imobile;
        $amount = $request->amount;

        $xml_post_string = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:craf="http://craftsilicon.com/">
                <soapenv:Header/>
                <soapenv:Body>
                <craf:Deposit>
                <craf:SessionID>' . $sessionKey . '</craf:SessionID>
                <craf:PartnerID>MPESASTKPUSH</craf:PartnerID>
                <craf:BankReference>' . $reference . '</craf:BankReference>
                <craf:MobileNumber>' . $mobile . '</craf:MobileNumber>
                <craf:RequestDetails>Accountid:' . $reference . ':Amount:' . $amount . ':INFOFIELD9:' . $mobile . '</craf:RequestDetails>
                </craf:Deposit>
                </soapenv:Body>
                </soapenv:Envelope>';
        Log::Info('xml_post_string');
        Log::Info($xml_post_string);
        $response = soap_xml_curl($credentials['request_soap_url'], $xml_post_string);
        if ($response) {
            $dom = new \DOMDocument();
            $dom->loadXML($response);
            $final_content = '';
            foreach ($dom->documentElement->childNodes as $node) {
                $final_content = $node->textContent;
            }
            $xml = simplexml_load_string($final_content);
            $json = json_encode($xml);
            $depositResponse = json_decode($json, TRUE);


            Log::Info('json response');
            Log::Info(print_r($depositResponse, true));
            return $depositResponse;
        }
    }

    function mpesaTransactOld($request, $reference)
    {
        if ($request->payment_method != 'mpesa') {
            return api_response(201, 'Wrong payment method');
        }
        $credentials = get_payment_credentials($request->payment_method);
        $sessionKey = $this->generateMpesaSessionKey($credentials);
        $imobile = str_replace(' ', '', $request->mobile);
        $imobile = ltrim($imobile, '0');
        $mobile = '254' . $imobile;
        $amount = $request->amount;

        $xml_post_string = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:craf="http://craftsilicon.com/">
                <soapenv:Header/>
                <soapenv:Body>
                <craf:Deposit>
                <craf:SessionID>' . $sessionKey . '</craf:SessionID>
                <craf:PartnerID>MPESASTKPUSH</craf:PartnerID>
                <craf:BankReference>' . $reference . '</craf:BankReference>
                <craf:MobileNumber>' . $mobile . '</craf:MobileNumber>
                <craf:RequestDetails>Accountid:' . $reference . ':Amount:' . $amount . ':INFOFIELD9:' . $mobile . '</craf:RequestDetails>
                </craf:Deposit>
                </soapenv:Body>
                </soapenv:Envelope>';
        Log::Info('xml_post_string');
        Log::Info($xml_post_string);
        $response = soap_xml_curl($credentials['request_soap_url'], $xml_post_string);
        if ($response) {
            $dom = new \DOMDocument();
            $dom->loadXML($response);
            $final_content = '';
            foreach ($dom->documentElement->childNodes as $node) {
                $final_content = $node->textContent;
            }
            $xml = simplexml_load_string($final_content);
            $json = json_encode($xml);
            $depositResponse = json_decode($json, TRUE);


            Log::Info('json response');
            Log::Info(print_r($depositResponse, true));
            return $depositResponse;
        }
    }

    public function transactionPay(Request $request)
    {
        Log::Info('transactionPay');
        Log::Info(print_r($request->all(), true));
        $validator = Validator::make($request->all(), [
            'mobile' => 'required',
            'amount' => 'required',
            'checkout_data' => 'required',
            'payment_method' => 'required',
            'payment_for' => 'required',
        ]);
        if ($validator->fails()) {
            return api_response(201, 'field is required', $validator->errors());
        }

        $imobile = str_replace(' ', '', $request->mobile);
        $imobile = ltrim($imobile, '0');
        $mobile = '254' . $imobile;
        if ($request->payment_for != 'membership') {
            $reference = 'content-' . uniqid();
            //verify amount with backend
            $total_amount = 0;
            foreach ($request->checkout_data as $key => $value) {
                $content_amount = Content::select('contents.content_price', 'contents.discounted_price')
                    ->where('content_id', $value)
                    ->where('contents.status', 'published')
                    ->first();
                if (!$content_amount) {
                    Log::Info('Product error!');
                    return api_response(201, 'Product error');
                }
                $price = $content_amount->content_price;
                if (!empty($content_amount->discounted_price) && $content_amount->content_price > $content_amount->discounted_price) {
                    $price = $content_amount->discounted_price;
                }
                $total_amount = $total_amount + $price;
            }
            if ($total_amount != $request->amount) {
                Log::Info('Amount mismatch backend amount:' . $total_amount . ' and frontend amount' . $request->amount);
                //  return api_response(201, 'Amount mismatch'); //uncomment it later when remove amount editable on cart
            }
            $response_msg = 'Your Payment has been submitted for processing. Access the content under My library > Subscribed once you complete the MPESA Payment.Thank you for choosing vtabu.';
            $msg = 'Amount:' . $total_amount . ' paid successfully for content purchased.';
        } else {
            $response_msg = 'Your Payment has been submitted for processing. Access all the membership type of contents once you complete the MPESA Payment.Thank you for choosing vtabu.';
            $msg = 'Amount:' . $request->amount . ' paid successfully for membership subscription.';
            $reference = 'membership-' . uniqid();
        }

        try {
            $responseapi = [];
            if ($request->payment_method == 'mpesa') {
                $result = $this->mpesaTransact($request, $reference);
            } elseif ($request->payment_method == 'card_payment') {
                $credentials = get_payment_credentials($request->payment_method);
                if ($credentials['ACTIVE_CARD_PAYMENT'] == 'cybersource') {
                    $result = $request->all();
                } else {
                    $result = $this->transactCardIntasend($request, $reference);
                    $responseapi['url'] = $result['url'];
                }

            }
            if ($result) {

                $transactionEntryResult = $this->createTransactionEntry($request, $result, $reference);
                if ($transactionEntryResult) {
                    Log::Info('transactionEntryResult');
                    $createOrders = $this->createOrderEntry($request, $transactionEntryResult, $result);

                    $audit_data = array(
                        "user_id" => Auth::id(),
                        "module" => "Transaction",
                        "module_id" => $transactionEntryResult->transaction_id,
                        "platform" => "web",
                        "device_id" => "",
                        "useragent" => "",
                        "activity" => "create"
                    );
                    audit($audit_data);
                    send_sms($mobile, $msg);
                    return api_response(200, $response_msg, $responseapi);

                } else {
                    Log::Info('Payment transaction,Unable to insert');
                    return api_response(201, 'Payment transaction,Unable to insert');
                }
            } else {
                Log::Info('Failed response');
                return api_response(201, 'Unable to complete transaction. Please try again or use another form of payment');
            }


        } catch (\Exception $ex) {
            Log::Info('Payment Exception:' . $request->payment_method);
            Log::Info($ex->getMessage());
            return api_response(201, 'Payment Exception:' . $request->payment_method);
        }
    }

    public function getPaymentMethods(Request $request)
    {

        $methodsData = PaymentMethods::where('payment_key', '!=', '')
            ->where(function ($query) {
                if (Auth::check() && Auth::user()->user_type != 'admin') {
                    $query->where('is_active', 1);
                }
            })
            ->get();

        $methodsData->each(function ($method) {
            if ($method->payment_key == 'card_payment') {
                $credentials = get_payment_credentials($method->payment_key);
                if ($credentials['ACTIVE_CARD_PAYMENT'] == 'cybersource') {
                    $method->action_url = $credentials['ACTION_URL'];
                    $method->profile_id = $credentials['PROFILE_ID'];
                    $method->access_key = $credentials['ACCESS_KEY'];
                    $method->transaction_uuid = uniqid();
                    $method->signed_date_time = gmdate("Y-m-d\TH:i:s\Z");

                }

            }
        });
        $result['ACTIVE_CARD_PAYMENT'] = env('ACTIVE_CARD_PAYMENT');
        $result['methodsData'] = $methodsData;
        if ($methodsData) {
            return api_response(200, 'Get payment methods', $result);
        } else {
            return api_response(201, 'Get payment methods error!');
        }
    }

    public function updatePaymentMethods(Request $request)
    {
        // Log::Info(print_r($request->all(),true));
        $methodsData = PaymentMethods::where(['payment_key' => $request->payment_key])->update(['is_active' => $request->is_active]);
        if ($methodsData) {
            return api_response(200, 'Payment method updated successfully');
        } else {
            return api_response(201, 'Update payment methods error!');
        }
    }

    public function mpesaResponse(Request $request)
    {
        Log::Info('mpesaResponse');
        Log::Info(print_r($request->all(), true));
        try {
            $validator = Validator::make($request->all(), [
                'mobile' => 'required',
                'amount' => 'required',
                'reference' => 'required',
                'payment_status' => 'required',
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required', $validator->errors());
            }

            $resultTransaction = Transaction::where(['bank_refrence' => $request->reference])->first();
            return $this->afterSuccessfulPayment($resultTransaction, $request);

        } catch (\Exception $ex) {
            Log::Info('Exception in mpesa callback:' . $ex->getMessage());
            return api_response(200, "Exception occured in callback");
        }
    }

    function afterSuccessfulPayment($resultTransaction, $request)
    {

        if ($resultTransaction) {
            if ($resultTransaction->payment_for == 'cart') {
                $orders = DB::table('orders')->where('transaction_id', $resultTransaction->transaction_id)->get();
                if (!$orders->isEmpty()) {
                    foreach ($orders as $order) {
                        create_reader_content($order->order_for_id, $order->user_id);
                    }
                }
            } else if ($resultTransaction->payment_for == 'membership') {
                $latest_membership_plan = latest_membership_plan($resultTransaction->user_id);
                $order = DB::table('orders')->where('transaction_id', $resultTransaction->transaction_id)->first();
                $plan_id = $order->order_for_id;
                $plan_detail = DB::table('plan')->where('plan_id', $plan_id)->first();
                if ($plan_detail) {

                    $subscription_array = array(
                        'user_id' => $resultTransaction->user_id,
                        'plan' => $plan_id
                    );
                    if ($latest_membership_plan) {
                        $subscription_array['start_date'] = date("Y-m-d", strtotime($latest_membership_plan->end_date . ' +1 day'));

                        $subscription_array['end_date'] = date("Y-m-d", strtotime($subscription_array['start_date'] . "+" . $plan_detail->no_of_days . " day"));
                    } else {
                        $nexttotaldays = "+" . $plan_detail->no_of_days . " day";
                        $subscription_array['start_date'] = date("Y-m-d");
                        $subscription_array['end_date'] = date("Y-m-d", strtotime($nexttotaldays));
                    }
                    if ($subscription_array['end_date'] >= date('Y-m-d')) {
                        $resultTransaction->is_membership_user = 1;
                    } else {
                        $resultTransaction->is_membership_user = 0;
                    }
                    $subscription_array['transaction_id'] = $resultTransaction->transaction_id;
                    $subscription_array['status'] = 'done';
                    UserDetail::where('user_id', $resultTransaction->user_id)->update(['is_member' => 1]);
                    $result = MembershipSubscription::create($subscription_array);


                } else {
                    return api_response(201, 'No plan found');
                }


            }
            $transactionArray = [
                "callback_status" => 1,
                'payment_status' => 'done',
                'payment_response' => json_encode($request->all())
            ];
            if (isset($_SERVER['REMOTE_ADDR'])) {
                $transactionArray['callback_remote_addr'] = $_SERVER['REMOTE_ADDR'];
            }
            $result = Transaction::where(['transaction_id' => $resultTransaction->transaction_id])->update($transactionArray);
            if ($result) {
                $msg = 'Your Payment of Ksh ' . $resultTransaction->total_amount . ' for ' . $resultTransaction->bank_refrence . ' has been received. Thank you for choosing vtabu.';
                send_sms($resultTransaction->mobile, $msg);
                Log::Info(print_r($resultTransaction, true));
                return api_response(200, $msg, $resultTransaction);
            } else {
                Log::Info("Unable to update mpesa status");
                return api_response(201, "Unable to update mpesa status");
            }
        } else {
            Log::Info("Invalid reference!");
            return api_response(201, "Invalid reference!");
        }

    }

    public function cybersourceCardPaySign(Request $request)
    {
        Log::Info('cybersourceCardPaySign');
        foreach ($request->all() as $name => $value) {
            $params[$name] = $value;
        }
        Log::Info(print_r($params, true));
        $credentials = get_payment_credentials('card_payment');
        $signature = $this->signData($this->buildDataToSign($params), $credentials);
        return api_response(200, 'signature created successfully.', ['signature' => $signature]);
    }


    function signData($data, $credentials)
    {
        Log::Info('signData' . $credentials['SECRET_KEY']);
        return base64_encode(hash_hmac($credentials['HMAC_SHA256'], $data, $credentials['SECRET_KEY'], true));
    }

    function buildDataToSign($params)
    {
        $signedFieldNames = explode(",", $params["signed_field_names"]);
        foreach ($signedFieldNames as $field) {
            $dataToSign[] = $field . "=" . $params[$field];
        }
        return $this->commaSeparate($dataToSign);
    }

    function commaSeparate($dataToSign)
    {
        return implode(",", $dataToSign);
    }

    public function testing()
    {
        $arr = [
            'test' => '5exceptions12',
            'hello' => 2
        ];
        return json_encode($arr);
    }

    public function cybersourcePaymentResponse(Request $request)
    {
        Log::Info('cybersourcePaymentResponse');
        Log::Info(print_r($request->all(), true));
        $transaction = Transaction::where('payment_request', 'like', '%' . $request->req_reference_number . '%')
            ->where('payment_request', 'like', '%' . $request->req_transaction_uuid . '%')
            ->first();
        if ($transaction) {
            Log::Info('transaction found:' . $transaction->transaction_id);
            $this->afterSuccessfulPayment($transaction, $request);
        }


    }
}
