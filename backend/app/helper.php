<?php

use Illuminate\Support\Facades\Crypt;
use App\Models\Content;
use App\Models\Readercontents;
use Illuminate\Support\Facades\Auth;
use App\Models\RolePermission;
use Illuminate\Support\Facades\Mail;
use phpDocumentor\Reflection\PseudoTypes\True_;


  function sendTestEmail()
    {
        $template = $body = $message = '<div>Hello world</div>';
        $subject = 'test';
        $email = ['prakash.bhatnagar@5exceptions.com', 'prakashbhatnager@gmail.com'];
        Mail::send('test', array(), function ($message) use ($email, $subject) {
            $message->to($email, 'User')->subject($subject);
        });
    }
function api_response($code = '', $message = '', $informationData = array()) {
    if (empty($code)) {
        $code = 404;
    }

    switch ($code) {
        case "success":
            $code = 200;
            break;
        case "failure":
            $code = 201;
            break;

        default:
            $code = $code;
    }

    $resdata = $informationData;
    if (empty($informationData)) {
        $resdata = new stdClass();
    }

    if (empty($message)) {
        $message = 'failure';
    }

    $data['code'] = $code;
    $data['message'] = $message;
    $data['data'] = $resdata;
    return response()->json($data, $code);
}

function soap_xml_curl($url, $xml_post_string) {
    Log::Info('soap_xml_curl'.$url);
    try {
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $headers = array(
            "Content-Type: text/xml;charset=UTF-8",
            "Accept: application/xml",
        );
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $xml_post_string);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        Log::Info('curl exec......');
        $response = curl_exec($curl);
        Log::Info('curl exec error');
        Log::Info(curl_error($curl));
        $info = curl_getinfo($curl);
        Log::Info('curl_getinfo');
        // Log::Info(print_r($info, true));
        Log::Info('response');
        Log::Info($response);
        curl_close($curl);
        return $response;
    } catch (Exception $ex) {
        Log::Info('Exception' . $ex);
    }
}

function get_date_format($ts) {
    return date('d M Y', strtotime($ts));
}

function get_datetime_format($ts) {
    return date('d M Y h:i a', strtotime($ts));
}

function get_content_files_path($path = '') {
    if (!empty($path)) {
        return get_site_public_path('files/contents/' . $path);
    }
}

function get_feedback_files_path($path = '') {
    if (!empty($path)) {
        return get_site_public_path('files/feedback/' . $path);
    }
}

function get_profile_path($path = '') {
    if (!empty($path)) {
        return get_site_public_path('files/profile/' . $path);
    }
}

function get_site_public_path($path = '') {
    if (env('APP_ENV') == 'local') {
        if (!empty($path)) {
            $path = app('url')->asset($path);
        }
    } else {
        if (!empty($path)) {
            $path = app('url')->asset($path);
        }
    }
    return $path;
}

function get_user_detail($id) {
    $result = DB::table('users')->where('id', $id)->first();
    if ($result) {
        $result->username = $result->first_name . ' ' . $result->middle_name . ' ' . $result->last_name;
        return $result;
    }
}

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }

    if (!is_dir($dir)) {
        return unlink($dir);
    }

    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }
    }
    return rmdir($dir);
}

function get_categories($ids = []) {
    // Log::Info('Get Audit category data ids '. $ids);
    $categories = DB::table('categories')->select('category_id', 'category_name')
            ->where(function ($query) use ($ids) {
                if (!empty($ids) && is_array($ids)) {
                    $query->whereIn('category_id', $ids);
                }
            })
            ->get();
    if ($categories) {
        $categories->each(function ($category) {
            $category->category_name = ucfirst($category->category_name);
        });
        return $categories;
    }
}

function get_categories_titles_comma_seperated($ids = []) {
    // Log::Info('Get Audit category data ids '. $ids);
    $categories = DB::table('categories')
            ->where(function ($query) use ($ids) {
                if (!empty($ids) && is_array($ids)) {
                    $query->whereIn('category_id', $ids);
                }
            })->pluck('category_name')
            ->all();

    if ($categories && count($categories)>0) {
        return  implode(', ',$categories);
    }
}

function get_sub_categories($ids = []) {
    $categories = DB::table('sub_categories')->select('sub_category_id', 'sub_category_name')
            ->where(function ($query) use ($ids) {
                if (!empty($ids) && is_array($ids)) {
                    $query->whereIn('sub_category_id', $ids);
                }
            })
            ->get();
    if ($categories) {
        $categories->each(function ($category) {
            $category->sub_category_name = ucfirst($category->sub_category_name);
        });
        return $categories;
    }
}

function get_sub_categories_comma_seperated($ids = []) {
    $categories = DB::table('sub_categories')
            ->where(function ($query) use ($ids) {
                if (!empty($ids) && is_array($ids)) {
                    $query->whereIn('sub_category_id', $ids);
                }
            })
            ->pluck('sub_category_name')
            ->all();
    if ($categories & count($categories)>0) {
       return  implode(', ',$categories);
    }
}

function get_class_detail($class_id) {
    return DB::table('classes')->where('class_id', $class_id)->first();
}

function get_class_id_by_class_name($class_name) {
    return DB::table('classes')->where('class_name', $class_name)->pluck('class_id')->first();
}

function custom_encryption($encrypt_or_decrypt, $data) {
    //echo $data;
    $result_data = "";
    if ($encrypt_or_decrypt == 'encrypt') {
        $result_data = Crypt::encrypt($data);
    } else {
        $result_data = Crypt::decrypt($data);
    }
    return $result_data;
}



function create_reader_content($contentId,$user_id=0) {
       Log::Info("create_reader_content");
    $content = Content::where(['content_id' => $contentId])->first();
    $reader_id = $user_id;
    $insertdata = [
        "content_id" => $contentId,
        "reader_id" => $reader_id
    ];
    $insertdata["subscription_on"] = date("Y-m-d");
    if(empty($content->display_upto)){
         $nextdate = "+30 day";
        $insertdata["subscription_end"] = date("Y-m-d", strtotime($nextdate));
    }else{

    if ($content->display_upto != -1) {
        $nextdate = "+" . $content->display_upto . " day";
        $insertdata["subscription_end"] = date("Y-m-d", strtotime($nextdate));
    } else {
        //$insertdata["subscription_end"] = date("Y-m-d");
        $insertdata["subscription_end"] = null;
    }

      }
         Log::Info(print_r($insertdata,true));
      $result = Readercontents::where($insertdata)->first();
      if(!$result){
            $readercontent = Readercontents::insertGetId($insertdata);
            if ($readercontent) {
                return $readercontent;
            }
      }else{
          return $result->reader_content_id;
      }


}

function audit($data, $old = [], $new = []) {

    if (getenv('APP_ENV') == 'production') {
        try {
            insert_audit_record($data, $old, $new);
        } catch (Exception $ex) {
            Log::Info("Insert Audit exception");
            Log::Info($ex);
        }
    } else {
        insert_audit_record($data, $old, $new);
    }
}

function insert_audit_record($data, $old, $new) {


    $data["platform"] = api_request_from();

    $data["device_id"] = "";
    $data["useragent"] = $_SERVER["HTTP_USER_AGENT"];

    $audit_id = DB::table('audit')->insertGetId($data);
    $count = count($new);
    Log::Info("key insert audit");
    // Log::Info(print_r($new, true));
    $oldvalue = $old;
    // print_r($old);
    if ($count > 0) {
        $audit_detail = array();
        foreach ($new as $key => $value) {

            if (empty($oldvalue) || !empty($oldvalue) && isset($oldvalue->$key)) {
                if (!empty($value) || in_array($data['module'], ['DRM settings'])) {
                    if (in_array($key, ['categories', 'author', 'publisher', 'classes', 'area_of_interest'])  && $data['module']!='Content'  && $data['activity']!='search') {
                        Log::Info("insie cat case");
                        if (is_array($value)) {
                            switch ($key) {
                                case "interest_categories":
                                    $ids = audit_category($value);
                                    break;
                                 case "interest_sub_categories":
                                    $ids = audit_subcategory($value);
                                    break;
                                case "categories":
                                    $ids = audit_category($value);
                                    break;
                                case "classes":
                                    $ids = audit_class($value);
                                    break;
                                case "author":
                                    $ids = audit_author($value);
                                    break;
                                case "publisher":
                                    $ids = audit_publisher($value);
                                    break;
                                default:
                                    $ids = $value;
                            }
                        } else {
                            if (strpos($value, ',') !== false) {
                                Log::Info("string found");
                                $arrayid = explode(",", $value);
                                switch ($key) {
                                    case "interest_categories":
                                        $ids = audit_category($arrayid);
                                        break;
                                         case "interest_sub_categories":
                                        $ids = audit_subcategory($arrayid);
                                        break;
                                    case "categories":
                                        $ids = audit_category($arrayid);
                                        break;
                                    case "classes":
                                        $ids = audit_class($arrayid);
                                        break;
                                    case "author":
                                        $ids = audit_author($arrayid);
                                        break;
                                    case "publisher":
                                        $ids = audit_publisher($arrayid);
                                        break;
                                    default:
                                        $ids = $arrayid;
                                }
                            } else {
                                if ($key == "classes") {
                                    $ids = audit_class(array($value));
                                } else {
                                    $ids = array($value);
                                }
                            }
                        }
                        if (!empty($ids)) {
                            foreach ($ids as $id) {
                                array_push(
                                        $audit_detail, array(
                                    "audit_id" => $audit_id,
                                    "table_column" => $key,
                                    "old_value" => !empty($oldvalue) && !empty($oldvalue->$key) ? $oldvalue->$key : "",
                                    "new_value" => $id
                                        )
                                );
                            }
                        }
                    } else {
                        // Log::Info('Get Audit data'.$data['module']);
                        if(!empty($data['module']) && $data['module']=='Content' && $data['activity']=='update'){
                              Log::Info('module Content case key:'.$key.' value: '.$value);
                            switch($key){
                                case 'class_id':
                                    // Log::Info('Get Audit category data '. $value);
                                    $value = get_class_name($value);
                                    $old_value = get_class_name($oldvalue->$key);
                                  $key = 'Class';
                                break;

                               case 'publisher_id':
                                    // Log::Info('Get Audit category data '. $value);
                                    $value = get_user_name($value);
                                    $old_value = get_user_name($oldvalue->$key);
                                 $key = 'Original Uploader';
                                break;
                             case 'edited_by':
                                    // Log::Info('Get Audit category data '. $value);
                                    $value = get_user_name($value);
                                    $old_value = get_user_name($oldvalue->$key);
                                 $key = 'Last updated by';
                                break;
                                case 'category_id':
                                      $category_id_arry = json_decode($value, true);
                                    $value = get_categories_titles_comma_seperated($category_id_arry);
                                    $old_value = get_categories_titles_comma_seperated(explode(",",$oldvalue->$key));
                                    $key = 'Category';
                                break;

                                case 'sub_category_id':
                                    $category_id_arry = json_decode($value, true);
                                    $value = get_sub_categories_comma_seperated($category_id_arry);
                                    $old_value = get_sub_categories_comma_seperated(explode(",",$oldvalue->$key));
                                        $key = 'Subcategory';
                                break;
                                default:
                                    $value= $value;
                                    $old_value=$oldvalue->$key;

                            }
                        }
                        array_push(
                                $audit_detail, array(
                                    "audit_id" => $audit_id,
                                    "table_column" => $key,
                                    "old_value" => !empty($old_value) ? $old_value: "",
                                    "new_value" => is_array($value) ? json_encode($value) : $value
                                )
                        );
                    }
                }
            }
        }

        // Log::Info(print_r($audit_detail, true));
        DB::table('audit_detail')->insert($audit_detail);
    }
}

function audit_category($value) {
    $cat = DB::table('categories')->get();
    $data = array();
    foreach ($cat as $key => $val) {
        if (in_array($val->category_id, $value)) {
            $data[] = $val->category_name;
        }
    }
    Log::Info('Get Audit category data '. json_encode($data));
    return $data;
}

function audit_subcategory($value) {
    $cat = DB::table('sub_categories')->get();
    $data = array();
    foreach ($cat as $key => $val) {
        if (in_array($val->sub_category_id, $value)) {
            $data[] = $val->sub_category_name;
        }
    }
    Log::Info('Get Audit subcategory data '. json_encode($data));
    return $data;
}

function audit_author($value) {
    $cat = DB::table('authors')->get();
    $data = array();
    foreach ($cat as $key => $val) {
        if (in_array($val->authors_id, $value)) {
            $data[] = $val->author_name;
        }
    }
    return $data;
}

function audit_publisher($value) {
    $cat = DB::table('users')->where(['user_type' => 'publisher'])->get();
    $data = array();
    foreach ($cat as $key => $val) {
        if (in_array($val->id, $value)) {
            $data[] = $val->first_name . ' ' . $val->last_name;
        }
    }
    return $data;
}

function audit_class($value) {
    $cat = DB::table('classes')->get();
    $data = array();
    foreach ($cat as $key => $val) {
        if (in_array($val->class_id, $value)) {
            $data[] = $val->class_name;
        }
    }
    return $data;
}

function get_classes_keys() {
    return DB::table('classes')->pluck('class_name')->all();
}
function get_class_name($class_id)
    {
        $class_name = DB::table('classes')->where('class_id', $class_id)->pluck('class_name')->first();
        if (!empty($class_name)) {
            return $class_name;
        }
    }
function maxresult() {
    $result = DB::table('theme_configuration')->select('search_total_results')->first();
    return ($result->search_total_results) ? $result->search_total_results : 10;
}

function get_permission() {

    $userType = Auth::user()->user_type;

    $backend_persmission = RolePermission::where('role_name', $userType)
                    ->where('is_permission', 1)
                    ->where('backend_route', '!=', null)
                    ->pluck(
                            'backend_route'
                    )->all();

    return $backend_persmission;
}

function get_permission_all() {

    $userType = Auth::user()->user_type;
    $backend_all_persmission = RolePermission::where('role_name', $userType)
                    ->where('backend_route', '!=', null)
                    ->pluck(
                            'backend_route'
                    )->all();


    return $backend_all_persmission;
}

function loginactivity() {
    DB::table('users')->where('id', Auth::id())->update(['last_login_at' => \Carbon\Carbon::now()->toDateTimeString()]);
    DB::table('login_activities')->insert([
        'user_id' => Auth::id(),
        'user_agent' => \Illuminate\Support\Facades\Request::header('User-Agent'),
        'ip_address' => \Illuminate\Support\Facades\Request::ip()
    ]);
}

function blockeduser($id) {
    $return = DB::table('login_activities')->select('id', 'created_at')->where([
                'user_id' => $id,
            ])->orderBy('id', 'desc')->first();
    if($return){
        $password_expiry_at = \Carbon\Carbon::parse($return->created_at)->addDays(120);
        Log::Info('password_expiry_at');
        Log::Info($password_expiry_at);
        Log::Info('\Carbon\Carbon::now()');
        Log::Info(\Carbon\Carbon::now());
        if ($password_expiry_at->lessThan(\Carbon\Carbon::now())) {
            DB::table('users')->where('id', $id)->update(['is_blocked' => 1]);
            return True;
        }
    }
    return false;
}

function get_last_days_dates($days) {
    $date_pre = date('Y-m-d', strtotime(\Carbon\Carbon::today()->subDay($days)));
    $dates = array($date_pre);
    for ($i = 1; $i <= $days; $i++) {
        $to_date = date('Y-m-d', strtotime('+' . $i . ' day', strtotime($date_pre)));
        array_push($dates, $to_date);
    }
    return $dates;
}

function get_dates_from_date_range($date1, $date2, $format = 'Y-m-d') {
    $dates = array();
    $current = strtotime($date1);
    $date2 = strtotime($date2);
    $stepVal = '+1 day';
    while ($current <= $date2) {
        $dates[] = date($format, $current);
        $current = strtotime($stepVal, $current);
    }
    return $dates;
}

function get_all_months($current_month = "") {
    Log::Info('current_month' . $current_month);
    $months = array();
    for ($m = 1; $m <= 12; $m++) {
        if ($current_month != "" && $m > $current_month) {
            break;
        }
        $month = date('F', mktime(0, 0, 0, $m, 1, date('Y')));
        array_push($months, $month);
    }
    // Log::Info(print_r($months, true));
    return $months;
}

function get_user_name($user_id) {
    Log::Info('get_user_name' . $user_id);
    $result = App\User::where('id', $user_id)->select('first_name', 'last_name')->first();
    if ($result) {
        if (!empty($result->last_name)) {
            $title = $result->first_name . ' ' . $result->last_name;
        } else {
            $title = $result->first_name;
        }
        return $title;
    }
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function email($template, $body, $subject, $emails) {
    Log::Info('send email 111');
    $all_emails = [];
    try {
        if (!is_array($emails)) {
            $all_emails = [$emails];
        }else{
            $all_emails = $emails;
        }

        if (count($all_emails) > 0) {
            Log::Info(print_r($all_emails, true));
            // Mail::send($template, $body, function ($message) use ($all_emails, $subject) {
            //     $message->to($all_emails, 'User')->subject($subject);
            // });
        } else {
            Log::Info('Invalid email');
        }
    } catch (\Exception $ex) {
        Log::Info('Send email exception' . $ex->getMessage());
        return api_response(201, 'Send email exception');
    }
}

function countFilePages($path) {
    $pdftext = file_get_contents($path);
    $num = preg_match_all("/\/Page\W/", $pdftext, $dummy);
    return $num;
}

function get_class_id_by_name($class_name) {
    return DB::table('classes')->where('class_name', $class_name)->pluck('class_id')->first();
}

function getMarRecord($record, $code, $concate) {
    $mainObj = $record;
    if (!empty($record->isbns[0]) && $record->isbns[0] && $code == 020) {
        $mainObj = $record->isbns[0];
    }
    if (!empty($record->pub_year[0]) && $record->pub_year[0] && $code == 021) {
        $mainObj = $record->pub_year[0];
    }
    if ($mainObj->getField($code)) {
        if ($mainObj->getField($code)->getSubfield($concate)) {
            if ($mainObj->getField($code)->getSubfield($concate)->getData()) {
                return utf8_encode($mainObj->getField($code)->getSubfield($concate)->getData());
            }
        }
    }
}

function get_payment_credentials($payment_method) {
    $credentials = [];
    $credentials['MPESA_ACTIVE'] = env('MPESA_ACTIVE');
    $credentials['ACTIVE_CARD_PAYMENT']  = env('ACTIVE_CARD_PAYMENT');
    if ($payment_method == 'mpesa') {
        if (env('MPESA_ACTIVE') == 'live') {
            $credentials['Accountid'] = env('MPESA_LIVE_ACCOUNTID');
            $credentials['apiuser'] = env('MPESA_LIVE_APIUSER');
            $credentials['apipassword'] = env('MPESA_LIVE_APIPASSWORD');
            $credentials['request_soap_url'] = env('MPESA_LIVE_SOAPURL');
        } else {
            $credentials['Accountid'] = env('MPESA_SANDBOX_ACCOUNTID');
            $credentials['apiuser'] = env('MPESA_SANDBOX_APIUSER');
            $credentials['apipassword'] = env('MPESA_SANDBOX_APIPASSWORD');
            $credentials['request_soap_url'] = env('MPESA_SANDBOX_SOAPURL');

            // $credentials['Accountid'] = '2021KNLS123';
            // $credentials['apiuser'] = 'KNLS';
            // $credentials['apipassword'] = 'KNLS@2021#';
            // $credentials['request_soap_url'] = 'https://uat.craftsilicon.com/elmathirdpartyvendors/elmathirdpartyvendors.asmx?WSDL';
        }
    } elseif ($payment_method == 'card_payment') {

        if(env('ACTIVE_CARD_PAYMENT') == 'cybersource'){
            if(env('CYBERSOURCE_ACTIVE') == 'sandbox'){
                $credentials['SECRET_KEY'] = env('CYBERSOURCE_SANDBOX_SECRET_KEY');
                $credentials['HMAC_SHA256'] =   env('CYBERSOURCE_SANDBOX_HMAC_SHA256');
                $credentials['ACTION_URL'] =  env('CYBERSOURCE_SANDBOX_URL');
                $credentials['PROFILE_ID'] =  env('CYBERSOURCE_SANDBOX_PROFILE_ID');
                $credentials['ACCESS_KEY'] =  env('CYBERSOURCE_SANDBOX_ACCESS_KEY');
            }else{
                $credentials['SECRET_KEY'] = env('CYBERSOURCE_LIVE_SECRET_KEY');
                $credentials['HMAC_SHA256'] =   env('CYBERSOURCE_LIVE_HMAC_SHA256');
                $credentials['ACTION_URL'] =  env('CYBERSOURCE_LIVE_URL');
                $credentials['PROFILE_ID'] =  env('CYBERSOURCE_LIVE_PROFILE_ID');
                $credentials['ACCESS_KEY'] =  env('CYBERSOURCE_LIVE_ACCESS_KEY');
            }

        }else{

            if(env('INTASEND_ACTIVE') == 'sandbox'){
                $credentials['intasend_url'] = env('INTASEND_SANDBOX_URL');
                $credentials['intasend_token'] = env('INTASEND_SANDBOX_TOKEN');
                $credentials['public_key'] = env('INTASEND_SANDBOX_PUBLIC_KEY');
            }else{
                $credentials['intasend_url'] = env('INTASEND_LIVE_URL');
                $credentials['intasend_token'] = env('INTASEND_LIVE_TOKEN');
                $credentials['public_key'] = env('INTASEND_LIVE_PUBLIC_KEY');
            }
            $credentials['redirect_url'] = get_frontend_url('my-books');

        }

    }
    return $credentials;
}

function send_sms($mobile, $msg) {
    Log::Info('send_sms Mobile ' . $mobile . ' OTP ' . $msg);
    $msg = urlencode($msg);
    $mobile = str_replace(' ', '', $mobile);
    $mobile = ltrim($mobile, '0');
    $userId = 'KNLS';
    $password = 'KNLS@2023e1';
    if (env('APP_ENV') != 'local') {
        //Just for my reference
        // $url_old = "https://app.elma.bz/ExternalSMSService/Send.aspx?UserID=$userId&Password=$password&MessageID=0&MessageText=$msg&MobileNumber=254$mobile&Priority=HIGH";
		$url = "https://app.craftsilicon.com/ExternalSMSService/Send.aspx?UserID=KNLS&Password=KNLS@2023e1&MessageID=0&MessageText=$msg&MobileNumber=+254$mobile&Priority=HIGH";
        Log::Info('url:'.$url);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        $data = curl_exec($ch);
        $json = json_decode($data,true);
		Log::Info('sms api response');
		Log::Info($json);
        Log::Info(print_r($json, true));
    }
}

function api_request_from() {
    if (!empty($_SERVER['REQUEST_URI']))
        if (strpos($_SERVER['REQUEST_URI'], '/wapi/') !== false || env('APP_ENV') == 'local') {
            return 'web';
        } else {
            return 'mobile';
        }
}

function get_frontend_url($target = '') {
    // Log::Info('get_backend_url');

    if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'){
        $url = 'https://';
    }else{
        $url = 'http://';
    }
    if (env('APP_ENV') != 'local') {
       $url .=  $_SERVER['SERVER_NAME'];
    } else {
       $url .=  $_SERVER['SERVER_NAME'].':3000';
    }



    if($target != ''){
        return $url.'/'.$target;
    }
      // Log::Info($url);
    return $url;
}

function password_expiry_days() {
    return 30;
}

function get_content_type_key_by_id($content_type){
    if(is_numeric($content_type)){
        return content_type_array($content_type);
    }else{
        return $content_type;
    }

}

   function content_type_array($key=""){
        $array = [1=>'free',2=>'paid',3=>'membership'];
        if($key != ""){
            return $array[$key];
        }
        return $array;
    }

    function random_color_part($index) {
        Log::Info('random_color_part'.$index);
    return str_pad( dechex( mt_rand($index, 255 ) ), 2, '0', STR_PAD_LEFT);
}
function random_color($index) {
    return random_color_part($index) . random_color_part($index) . random_color_part($index);
}

function verification($email, $id)
    {
        try{

            $data = array('id' => $id);
            Mail::send('verification', $data, function ($message) use ($email) {
                $message->to($email, 'User')->subject('Please verify your email address');
            });

        } catch (Exception $ex) {
             Log::info('send email verification exception ' . $ex->getMessage());
        }

    }

function destination_base_contents(){
    $destinationPath = destination_base_public_path('files/contents/');
    return $destinationPath;
}

function destination_base_public_path($path=''){

    $destinationPath = base_path() . '/public/' . $path;
    return $destinationPath;
}

function delete_file($complete_path){
    $result = unlink($complete_path);
    return $result;
}

function is_membership_user($user_id){
    $membership_detail = DB::table('member_subscription')->where('user_id',$user_id)
    ->where('end_date','>=',date('Y-m-d'))->OrderBy('end_date','desc')->first();
    if($membership_detail){
        return $membership_detail;
    }
}

function latest_membership_plan($user_id){
    $membership_detail = DB::table('member_subscription')->where('user_id',$user_id)
    ->where('end_date','>=',date('Y-m-d'))
    ->orderby('end_date','desc')
    ->first();
    if($membership_detail){
        return $membership_detail;
    }
}

function checkFileExists($path){
    $full_path = base_path() . '/public/' .$path;
// Log::Info('checkFileExists full_path'. $full_path);
    if(file_exists($full_path)){
        return true;
    }
    return false;
}
