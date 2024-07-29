<?php

namespace App\Http\Controllers;


use App\Models\RolePermission;
use App\Models\UserDevices;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Content;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Invoice;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\UserDetail;
use App\Models\MembershipSubscription;
use App\User;
use App\Models\PaymentMethods;
use App\Models\Transaction;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Nette\Utils\Json;
use Throwable;
use function React\Promise\all;

class SSOController extends Controller
{
    public function getLogin(Request $request)
    {
        Session::put("state", $state = Str::random(40));

        $query = http_build_query([
            'client_id' => env('SSO_CLIENT_ID'),
            'redirect_uri' => env('APP_URL') . '/callback/oauth/authorize',
            'response_type' => 'code',
            'scope' => '',
            'state' => $state
        ]);

        return redirect("https://accounts.ecitizen.go.ke/oauth/authorize?{$query}");
    }


    function membershipUpdate(Request $request)
    {

        $requestData = $request->all();
        $userId = $requestData['userId'];
        $token = $requestData['token'];
        Log::info('MEMBERSHIP UPDATE- Request Data: ' . $userId);

        // Retrieve user ID from the requst or adjust as per your actual data structure

        $data = [];

        if ($userId) {
            // Check and update user's plan information
            $activePlan = is_membership_user($userId);
            if ($activePlan) {
                $data["plan"] = $activePlan;
                $data["is_membership_user"] = 1;
                $data["is_member"] = 1;
            } else {
                $data["is_membership_user"] = 0;
            }
            Log::Info('updated MEMBERSHIP:' . json_encode($data));
            // Save the changes
            //$user->save();

            // Send a response with a success message and updated user data
            return response()->json([

                'data' => $data, // Include the updated user data in the response if needed
            ]);
        } else {
            // User not found, send an appropriate response
            return response()->json(['message' => 'ERROR OCCURRED'], 404);
        }
    }
    
    
    function paymentcallback(Request $request)
    {

        $requestData = $request->all();
        $userId = $requestData['userId'];
        $token = $requestData['token'];
        Log::info('CALLBACK PESA-FLOW - Request Data: ' . $userId);

        // Retrieve user ID from the requst or adjust as per your actual data structure

        $data = [];

        if ($userId) {
            // Check and update user's plan information
            $activePlan = is_membership_user($userId);
            if ($activePlan) {
                $data["plan"] = $activePlan;
                $data["is_membership_user"] = 1;
                $data["is_member"] = 1;
            } else {
                $data["is_membership_user"] = 0;
            }
            Log::Info('updated user profile:' . json_encode($data));
            // Save the changes
            //$user->save();

            // Send a response with a success message and updated user data
            return response()->json([
                'message' => 'Payment successful',
                'data' => $data, // Include the updated user data in the response if needed
            ]);
        } else {
            // User not found, send an appropriate response
            return response()->json(['message' => 'ERROR OCCURRED'], 404);
        }
    }

    function createTransactionEntry($requestInvoice, $requestData, string $reference)
    {
        Log::Info('createTransactionEntry');
        Log::Info("invoice to be settled".json_encode($requestInvoice));
        Log::Info("call back data from pesaflow ->createtrans".json_encode($requestData));

        $payment_method_id = PaymentMethods::query()->firstWhere([
            'payment_key' => strtolower($requestData['payment_channel'])
        ]);

        Log::Info('$payment_method_id :' . $payment_method_id);
        if (empty($payment_method_id)) {
            $transactionArray = array(
                'user_id' => $requestInvoice->userid,
                'payment_for' => $requestInvoice->payment_for,
                'total_amount' => $requestData['amount_paid'],
                'bank_refrence' => $reference,
                'payment_method' => 4,

            );

        }

        $transactionArray = array(
            'user_id' => $requestInvoice->userid,
            'payment_for' => $requestInvoice->payment_for,
            'total_amount' => $requestData['amount_paid'],
            'bank_refrence' => $reference,
            'payment_method' => 1,

        );

        $invoice_id = $requestData ['client_invoice_ref'];
        Log::info("client_invoice_ref/billref ".json_encode($invoice_id));
        $transactionArray['payment_request'] = json_encode($requestInvoice);
           Log::info("transaction array payment request ".json_encode($requestInvoice));
        $transactionArray['payment_response'] = json_encode($requestData);

        if (isset($_SERVER['REMOTE_ADDR'])) {
            $transactionArray['customer_remote_addr'] = $_SERVER['REMOTE_ADDR'];
        }

        if (!empty($requestData['phone_number'])) {
            $imobile = str_replace(' ', '', $requestData['phone_number']);
            $imobile = ltrim($imobile, '0');

            // Check if the phone number starts with +254
            if (strpos($imobile, '+254') === 0) {
                // Remove the +254 prefix
                $imobile = substr($imobile, 4);
            } elseif (strpos($imobile, '254') === 0) {
                // Remove the '254' prefix
                $imobile = substr($imobile, 3);
            }

            $transactionArray['mobile'] = $imobile;
        }

        $transactionResult = Transaction::create($transactionArray);

        return $transactionResult;
    }

    
    function createOrderEntry( $invoice,  $transactionResult,  $depositResponse)
    {
        if ($invoice->payment_for == 'cart') {
            Log::Info('CONTENT IDS'.$invoice->planId );
            Log::Info('invoice ====>'.$invoice);
            $jsonData = json_decode($invoice->planId, true); // Decode the JSON string into an associative array
            //Log::Info('$jsonData checkout data ====>'.$jsonData);
            if (isset($jsonData['checkout_data']) && is_array($jsonData['checkout_data'])) {
                foreach ($jsonData['checkout_data'] as $value) {
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
                        'user_id' => $invoice->userid,
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
            }else{
                Log::info('No checkout data found or invalid format');
                return false;
            }
        } else {

            $plan_detail = DB::table('plan')->where('plan_id', $invoice["planId"])->first();
            if ($plan_detail) {
                $data_array = array(
                    'order_for_id' => $invoice->planId,
                    'user_id' => $invoice->userid,
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


    public function paymentnotify(Request $callbackRequest)
    {
        try {

            $requestData = $callbackRequest->json()->all();
            Log::info("Data from paymentcallback: " . json_encode($requestData));

            /** @var Invoice $invoice */
            $invoice = Invoice::query()->firstWhere([
                'invoice_id' => $callbackRequest->json('client_invoice_ref')
            ]);

            $mobile = str_replace(' ', '', $callbackRequest->phone_number);
            $mobile = ltrim($mobile, '0');

            // Check if the phone number starts with +254
            if (strpos($mobile, '+254') === 0) {
                // Remove the +254 prefix
                $mobile = substr($mobile, 4);
            }
            // Check if the status is pending before updating
            if ($invoice->status === 'pending') {
                // Update the invoice status
                $invoice->update([
                    'status' => $callbackRequest->json('status')
                ]);

                Log::info("Invoice status updated successfully.");
                Log::Info("invoice selected from client_reference_id :".json_encode($invoice));

                if ($invoice->payment_for != 'membership') {
                    // Handle non-membership payment logic
                    $reference = 'content-' . uniqid();
                    $msg = 'Amount:' .$callbackRequest->amount_paid. ' paid successfully for content purchased.';
                    $response_msg = 'Your Payment has been submitted for processing. Access the content under My library > Subscribed once you complete the MPESA Payment.Thank you for choosing vtabu.';
                    // Verify amount with backendCart

                } else {
                    // Handle membership payment logic
                    $response_msg = 'Your payment has been submitted for processing. Access all membership content once your MPESA payment is complete. Thank you for choosing vtabu.';
                    $msg = 'Amount:' . $callbackRequest->amount_paid . ' paid successfully for membership subscription.';
                    $reference = 'membership-' . uniqid();
                }
                    $transactionEntryResult = $this->createTransactionEntry($invoice, $requestData, $reference);

                    if ($transactionEntryResult) {
                        Log::info('Transaction entry created successfully.');
                        $createOrders = $this->createOrderEntry($invoice, $transactionEntryResult, $callbackRequest);
                        $resultTransaction = Transaction::where(['bank_refrence' => $transactionEntryResult->bank_refrence])->first();
                        Log::info('result transaction from transaction entry'.json_encode($resultTransaction));
                        $this->SuccessfulPayment($resultTransaction, $callbackRequest);
                        $audit_data = [
                            "user_id" => $invoice->userid,
                            "module" => "Transaction",
                            "module_id" => $transactionEntryResult->transaction_id,
                            "platform" => "web",
                            "device_id" => "",
                            "useragent" => "",
                            "activity" => "create"
                        ];

                        audit($audit_data);

                        // Uncomment the following line if you have the `send_sms` function defined
                        send_sms($mobile, $msg);

                        return api_response(200, $response_msg);
                    } else {
                        Log::info('Payment transaction: Unable to insert.');
                        return api_response(201, 'Payment transaction: Unable to insert.');
                    }

            } else {
                Log::info("Invoice status is not pending, no action taken.");
            }
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $ex) {
            // Invoice not found, handle appropriately
            Log::info("Invoice not found: " . $ex->getMessage());
            return response()->json(['message' => 'Invoice not found'], 404);
        } catch (\Exception $ex) {
            // Handle other exceptions
            Log::error("An error occurred: " . $ex->getMessage());
            return response()->json(['message' => 'An error occurred'], 500);
        }
    }

    function SuccessfulPayment($resultTransaction, $request)
    {

        if ($resultTransaction) {
            if ($resultTransaction->payment_for == 'cart') {
                $orders = DB::table('orders')->where('transaction_id', $resultTransaction->transaction_id)->get();
                Log::info("Order found, update plan or cart.");
                if (!$orders->isEmpty()) {
                    foreach ($orders as $order) {
                        create_reader_content($order->order_for_id, $order->user_id);
                    }
                }
            } else if ($resultTransaction->payment_for == 'membership') {
                $latest_membership_plan = latest_membership_plan($resultTransaction->user_id);
                $order = DB::table('orders')->where('transaction_id', $resultTransaction->transaction_id)->first();
                Log::info("Order found, update plan");
                $plan_id = $order->order_for_id;
                $plan_detail = DB::table('plan')->where('plan_id', $plan_id)->first();
//                if ($plan_detail) {
//
//                    $subscription_array = array(
//                        'user_id' => $resultTransaction->user_id,
//                        'plan' => $plan_id
//                    );
//                    if ($latest_membership_plan) {
//                        $subscription_array['start_date'] = date("Y-m-d", strtotime($latest_membership_plan->end_date . ' +1 day'));
//
//                        $subscription_array['end_date'] = date("Y-m-d", strtotime($subscription_array['start_date'] . "+" . $plan_detail->no_of_days . " day"));
//                    } else {
//                        $nexttotaldays = "+" . $plan_detail->no_of_days . " day";
//                        $subscription_array['start_date'] = date("Y-m-d");
//                        $subscription_array['end_date'] = date("Y-m-d", strtotime($nexttotaldays));
//                    }
//                    if ($subscription_array['end_date'] >= date('Y-m-d')) {
//                        $resultTransaction->is_membership_user = 1;
//                    } else {
//                        $resultTransaction->is_membership_user = 0;
//                    }
//                    $subscription_array['transaction_id'] = $resultTransaction->transaction_id;
//                    $subscription_array['status'] = 'done';
//                    UserDetail::where('user_id', $resultTransaction->user_id)->update(['is_member' => 1]);
//                    $result = MembershipSubscription::create($subscription_array);
//
//
//                } else {
//                    return api_response(201, 'No plan found');
//                }
                if ($plan_detail) {
                    $subscription_array = array(
                        'user_id' => $resultTransaction->user_id,
                        'plan' => $plan_id
                    );
                    Log::info("PLAN DETAIL .".json_encode($plan_detail));
                    if ($latest_membership_plan) {
                        $subscription_array['start_date'] = date("Y-m-d H:i:s", strtotime($latest_membership_plan->end_date . ' +24 hour'));
                        $subscription_array['end_date'] = date("Y-m-d H:i:s", strtotime($subscription_array['start_date'] . "+" . ($plan_detail->no_of_days * 24) . " hours"));
                    } else {
                        $nexttotalhours = "+" . ($plan_detail->no_of_days * 24) . " hour"; // Convert days to hours
                        $subscription_array['start_date'] = date("Y-m-d H:i:s");
                        $subscription_array['end_date'] = date("Y-m-d H:i:s", strtotime($nexttotalhours));
                    }
                    if ($subscription_array['end_date'] >= date('Y-m-d H:i:s')) {
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
                Log::Info("transaction result success payment:".json_encode($resultTransaction));
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

    public function payment(Request $request)
    {
        $requestData = $request->json()->all();
        $prefix = "INV";
        $randomNumber = uniqid($prefix);
        $billDesc = $request->json('billDesc');
        $amount = $request->json('amount');

        $planID = 0;

        if (strpos(strtolower($billDesc), 'membership') !== false) {

            if ($amount == 20) {
                $serviceID = 6017917; // Assigning serviceid 20
                $planID = 1;
            } elseif ($amount == 100) {
                $serviceID = 6017953; // Assigning serviceid 100
                $planID = 2;
            } elseif ($amount == 500) {
                $serviceID = 6017963; // Default serviceid 500
                $planID = 3;
            } elseif ($amount == 1500) {
                $serviceID = 6017965; // Default serviceid 1500
                $planID = 5;
            } elseif ($amount == 2500) {
                $serviceID = 6017979; // Default serviceid 2500
                $planID = 6;
            }
        } else {
            // $billDesc does not contain "membership"
            $serviceID = 6923233; // You can assign a different value or handle it accordingly
            $planID =$request->all('checkout_data');
            $planID = json_encode($planID);
            Log::Info($planID);
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
                  return api_response(201, 'Amount mismatch'); //uncomment it later when remove amount editable on cart
            }

        }


        // Log the data
        Log::info("data from payment membership/Cart: " . json_encode($requestData));
        Log::info($serviceID);
        $apiClientID = env('API_CLIENT_ID');
        $amount = $request->json('amount');
        $clientMSISDN = $request->json('mobile');
        $clientEmail = $request->json('email');

        $clientIDNumber = $request->json('clientIDNumber');;
        $currency = "KES";
        $billRefNumber = strtoupper($randomNumber);
        $billDesc = $request->json('billDesc');
        $clientName = $request->json('clientName');
        $secret = env('PESA_FLOW_SECRET');  // Note that the secret is directly used here
        $key = env('PESA_FLOW_KEY');

        $data_string = $apiClientID . $amount . $serviceID . $clientIDNumber . $currency . $billRefNumber . $billDesc . $clientName . $secret;

        // Hash the values using HMAC-SHA256
        $hash = hash_hmac('sha256', $data_string, $key);

        // Append the hash values
        $secureHash = base64_encode($hash);

        // Replace the URL with the actual endpoint you want to send the request to
        // $apiEndpoint = 'https://test.pesaflow.com/PaymentAPI/iframev2.1.php';
        $apiEndpoint = env('PESA_FLOW_PAYEMENT_URL');
        // Replace this array with your actual payload
        $jsonPayloadArray = [
            "apiClientID" => env('API_CLIENT_ID'),
            "serviceID" => $serviceID,
            "billDesc" => $billDesc,
            "currency" => $currency,
            "billRefNumber" => $billRefNumber,
            "clientMSISDN" => $clientMSISDN,
            "clientName" => $clientName,
            "clientIDNumber" => $clientIDNumber,
            "clientEmail" => $clientEmail,
            "callBackURLOnSuccess" => env('APP_URL') . '/pesaflow/callback',
            "amountExpected" => $amount,
            "notificationURL" => env('APP_URL') . '/backend/public/pesaflow/notify',
            "secureHash" => $secureHash,
            "format" => "JSON",
            "sendSTK" => "false",
            "PictureURL" => ""
        ];

        // ALTER TABLE invoices ADD COLUMN planId VARCHAR(255) NOT NULL

        Log::info("PAYLOAD====>", $jsonPayloadArray);

        // Create a new invoice
        $invoice = Invoice::create([
            "userId" => Auth::id(),
            "planId" => $planID,
            'payment_request' => json_encode($jsonPayloadArray),  // Assuming payment_request column can store JSON data
            'status' => "pending",  // Default status
            'invoice_id' => $billRefNumber,  // Use the invoice's ID as the invoice_id
            'payment_for' => $billDesc,
        ]);

        if ($invoice) {
            Log::Info('Invoice created :' . $invoice);
        }
        // Send POST request
        //$response = Http::asJson()->post($apiEndpoint, $jsonPayloadArray);
        return response()->json($jsonPayloadArray);
        // $response->throw();

        // // Check the response
        // if ($response->successful()) {
        //     // Request was successful
        //     $responseData = $response->body();
        //     // Process the response data as needed
        //     echo($responseData);
        // } else {
        //     // Request failed
        //     $errorData = $response->body();
        //     // Handle the error
        //     echo($errorData);
        // }
    }

    public function getCallback(Request $request)
    {
        try {

            $state = Session::pull('state');

            throw_unless(strlen($state) > 0 && $state == $request->state,
                InvalidArgumentException::class
            );

            if ($request->query('error') && $request->query('error_description')) {

                $errorCode = $request->json('error');
                $errorMessage = $request->json('error_description');

            } else {

                $response = Http::asForm()->post('https://accounts.ecitizen.go.ke/oauth/access-token', [
                    'grant_type' => 'authorization_code',
                    'client_id' => env('SSO_CLIENT_ID'),
                    'client_secret' => env('SSO_CLIENT_SECRET'),
                    'redirect_uri' => env('APP_URL') . '/callback/oauth/token',
                    'code' => $request->code
                ]);

                // dump($response->body());

                $response->throw();

                if ($response->status() == 400) {

                    $errorCode = $response->json('error');
                    $errorMessage = $response->json('error_description');
                } else {

                    $response = Http::asForm()->get('https://accounts.ecitizen.go.ke/api/user-info', [
                        'access_token' => $response->json('access_token')
                    ]);

                    // dump($response->body());

                    $response->throw();

                    $id = $response->json("id");
                    $idNumber = $response->json("id_number");
                    $email = $response->json("email");
                    $active = $response->json("active");
                    $firstName = $response->json("first_name");
                    $lastName = $response->json("last_name");
                    $surname = $response->json("surname");
                    $accountType = $response->json("account_type");
                    $mobileNumber = $response->json("mobile_number");
                    $mobileVerified = $response->json("mobile_verified");
                    $gender = $response->json("gender");

                    //  $user = User:: query()->where('email', $email)->firstOrFail();

                    // dump($user);

                    return redirect(route(''));
                }
            }
        } catch (Throwable $e) {
            // throw $e;
            Log::log("user not FOUND ===>", e);
            // return redirect('login'); //->withError("Failed to get login information! Try again.");
        }
    }

    
    public function getUser(Request $request): JsonResponse
    {
        $req = $request->all();

        try {

            $validator = Validator::make($request->all(),
                [
                    'authCode' => 'required',
                    'authState' => 'required',
                ],
                [
                    'authCode.required' => 'Invalid login details, 001',
                    'authState.required' => 'Invalid login details, 002'
                ]
            );

            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            $authCode = $request->get("authCode");
            $authState = $request->get("authState");

            $response = Http::asForm()->post("https://accounts.ecitizen.go.ke/oauth/access-token", [
                'grant_type' => 'authorization_code',
                'client_id' => env('SSO_CLIENT_ID'),
                'client_secret' => env('SSO_CLIENT_SECRET'),
                'redirect_uri' => env('APP_URL') . '/callback/oauth/token',
                'code' => $authCode
            ]);
            //Log::info("DATA FROM ECITIZEN",$response->json());
            // dump($response->body());

            $response->throw();

            if ($response->status() == 400) {

                $errorCode = $response->json('error');
                $errorMessage = $response->json('error_description');

                return api_response(400, "Authenticate Error: $errorCode|$errorMessage",);
            }

            $response = Http::asForm()->get("https://accounts.ecitizen.go.ke/api/user-info", [
                'access_token' => $response->json('access_token')
            ]);

            // dump($response->body());

            $response->throw();
            // Log::info("user infor",$response->json());

            $id = $response->json("id");
            $idNumber = $response->json("id_number");
            $email = $response->json("email");
            $active = $response->json("active");
            $firstName = $response->json("first_name");
            $lastName = $response->json("last_name");
            $surname = $response->json("surname");
            $accountType = $response->json("account_type");
            $mobileNumber = $response->json("mobile_number");
            $mobileVerified = $response->json("mobile_verified");
            $gender = $response->json("gender");
            // Log::info("DATA FROM ECITIZEN");

            //$user = User:: query()->where('email', $email)->firstOrFail();
            try {
                $user = User::query()
                    ->where('email', $email)
                    //->orWhere('', $idNumber)
                    ->first();
                //              $userByNationalId = User::query()
//                    ->firstWhere([
//                        'identification_type' => $email,
//                        'identification_number' => 'NATIONALID'
//                    ]);
//
//                if($userByEmail != null && preg_match("/@knls/", $userByEmail->email)){
//
//
//                }

                if ($user == null) {

                    return response()->json([
                        'code' => 201,
                        'message' => 'Complete your profile. Please try again or if you are new to v.tabu <button> <a href="' . get_frontend_url() . '/complete-profile">Update Profile</a></button>',
                        'data' => [
                            'user_info' => $response->json(),
                            'authState' => $authState
                        ]
                    ], 201);
                }

                $user = User::where('email', $email)
                    ->where('is_deleted', '=', 0)
                    // ->where('is_blocked', '=', 0)
                    ->where(function ($query) {
                        $request_type = api_request_from();
                        if (!empty($request_type) && $request_type == 'mobile') {
                            $query->whereIn('user_type', ['reader', 'junior_reader']);
                        }
                    })
                    ->join('user_detail', 'user_detail.user_id', '=', 'users.id')
                    ->select(
                        'id',
                        'first_name',
                        'middle_name',
                        'last_name',
                        'email',
                        'mobile',
                        'gender',
                        'dontask',
                        'dob',
                        'address',
                        'city',
                        'identification_number',
                        'country',
                        'country_code',
                        'interest_categories as area_of_interest',
                        'interest_categories',
                        'interest_sub_categories',
                        'user_image',
                        'user_image as profile_image',
                        'user_type',
                        'post_code',
                        'state',
                        'is_member',
                        'password',
                        'verified_email',
                        'is_blocked',
                        'attempts_count',
                        'identification_type'
                    )
                    ->first();

                //Log::Info('user found');

//                if ($user->verified_email == 0) {
//
//
//                    $user->update([
//                        "verified_email" => true
//                    ]);
//                    // return api_response(201, 'Please go to your inbox to verify your email address');
//                }

                if ($user->is_blocked == 1) {
                    return api_response(201, 'Your Accounts is temporary inactive, Please Contact Admin');
                }

                $hashedPassword = app('hash')->make($authState);
                $user->update([
                    'password' => $hashedPassword
                ]);

                $user->username = "{$user->first_name} {$user->last_name}";

                $user->persmission = RolePermission::where('role_name', $user->user_type)
                    ->where('is_permission', 1)
                    ->where('permission_route', '!=', null)
                    ->pluck(
                        'permission_route'
                    )->all();

                $user->all_persmission = RolePermission::where('role_name', $user->user_type)
                    ->where('permission_route', '!=', null)
                    ->pluck(
                        'permission_route'
                    )->all();

                $user->backend_permissions = RolePermission::where('role_name', $user->user_type)
                    ->where('is_permission', 1)
                    ->where('backend_route', '!=', null)
                    ->pluck(
                        'backend_route'
                    )->all();

                $user->backend_all_persmission = RolePermission::where('role_name', $user->user_type)
                    ->where('backend_route', '!=', null)
                    ->pluck(
                        'backend_route'
                    )->all();

                $attempt_array = ['email' => $user->email, 'password' => $authState, 'verified_email' => 1, 'is_blocked' => 0, 'is_deleted' => 0];
                $token = Auth::setTTL(7200)->attempt($attempt_array);
                if ($token) {
                    Log::Info('token found');
                    $token_info = $this->respondWithToken($token, $user);
                    $data = array(
                        'token_info' => $token_info
                    );
                    //Log::Info(print_r($token_info, true));
                    $devices_array = array(
                        'user_id' => Auth::id(),
                        'user_agent' => $request->userAgent()
                    );
                    loginactivity();
                    $user_device = UserDevices::where($devices_array)->first();
                    if ($user_device) {
                        UserDevices::where('device_id', $user_device->device_id)->update($devices_array);
                    } else {
                        UserDevices::insert($devices_array);
                    }

                    // set is membership user
                    $active_plan = is_membership_user($user->id);
                    if ($active_plan) {
                        $user->plan = $active_plan;
                        $user->is_membership_user = 1;
                        $user->is_member = 1;
                    } else {
                        $user->is_membership_user = 0;
                    }

                    if (env('APP_ENV') != 'local') {

                        if (empty($user->dontask)) {
                            $data['dontask'] = true;
                        } else {
                            $current = Carbon::now()->format('Y-m-d H:i:s');
                            $to = Carbon::parse($user->dontask);
                            $from = Carbon::parse($current);
                            $days = $to->diffInDays($from);
                            Log::Info('from' . $from);
                            Log::Info('to' . $to);
                            Log::Info('days' . $days);
                            $data['dontask'] = ($days < 30) ? true : false;
                        }
                        // Log::Info('dontask:' . $data['dontask'] . ' mobile:' . $user->mobile);
                        if ($data['dontask'] == false && !empty($user->mobile)) {
                            Log::Info('calling send sms and insert otp');
                            $otp = rand(100000, 999999);
                            User::where('id', $user->id)->update(['mobile_otp' => Hash::make($otp)]);
                            $msg = 'Please enter this One Time PIN: ' . $otp . ' to log onto your v.tabu account.';
                            send_sms($user->mobile, $msg);
                            return api_response(200, "Login successfully, and otp send on ($user->mobile)", $data);
                        }
                    } else {
                        $data['dontask'] = true;
                    }
                    return api_response(200, 'Login successfully.', $data);
                } else {
                    return api_response(201, 'Invalid email/password!');
                }


            } catch (Exception $ex) {
                Log::Info('Authenticate exception ssocontroller 1' . $ex);
                //return api_response(201, 'Authenticate exception', $ex->getMessage());
                // User not found, handle the exception (e.g., return a response, log, etc.)
                // For example:
                //Log::inf0("user not found");
                //return api_response(201, 'Complete your profile. Please try again or if you are new to v.tabu<button> <a href="' . get_frontend_url() . '/complete-profile">Update Profile</a></button>',['user_info' => $response->json(), 'authState' => $authState]);

                return response()->json([
                    'code' => 201,
                    'message' => 'Complete your profile. Please try again or if you are new to v.tabu <button> <a href="' . get_frontend_url() . '/complete-profile">Update Profile</a></button>',
                    'data' => [
                        'user_info' => $response->json(),
                        'authState' => $authState
                    ]
                ], 201);
                //return response()->json(['status' => 'Authenticate exception', 'user_info' => $response->json(), 'authState' => $authState], 204);
                // return response()->json(['error' => 'User not found'], 404);
            }


        } catch (Exception $ex) {
            Log::Info('Authenticate exception ssocontroller' . $ex);
            return api_response(201, 'Authenticate exception', $ex->getMessage());
        }
    }
}
