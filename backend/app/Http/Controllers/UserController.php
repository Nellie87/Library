<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;
use App\Models\Feedback;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\UserDevices;
use App\Models\MembershipSubscription;
use App\Models\UserDetail;
use App\Models\RolePermission;
//use Validator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\View;
use App\Content;
use App\Models\ContentDrmSettings;
use App\Rules\EmailExtension;
class UserController extends Controller
{
    protected $jwt;
    private $url;
    private $verfiyurl;
    public function __construct(JWTAuth $jwt)
    {
        $this->jwt = $jwt;
        $this->url = url() . '/files/profile';
        $this->verifyurl = get_frontend_url();
    }
    public function authenticate(Request $request)
    {
        $req = $request->all();
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'email'    => ['required', 'email', new EmailExtension],
                    'password' => 'required',

                ],
                [
                    'email.required' => 'Please enter your email to login',
                    'password.required' => 'Please enter your password to login'
                ]
            );


            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }
            $user = User::where('email', $req['email'])
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

            /**
             *  Check password expiration
             */
            if ($user) {
                Log::Info('user found');
                if ($user->attempts_count >= 5) {
                    return api_response(203, 'Seems you are having trouble remembering your password. Would you like to reset your password?');
                }
                if ($user->verified_email == 0) {
                    return api_response(201, 'Please go to your inbox to verify your email address');
                }

                if ($user->is_blocked == 1) {
                    return api_response(201, 'Your Accounts is temporary inactive, Please Contact Admin');
                }
                // $pwdsecurity = DB::table('password_securities')
                //     ->select('password_updated_at', 'password_expiry_days')
                //     ->where('user_id', $user->id)->first();
                // if ($pwdsecurity) {
                //     $password_updated_at = $pwdsecurity->password_updated_at;
                //     $password_expiry_days = $pwdsecurity->password_expiry_days;
                //     $password_expiry_at = \Carbon\Carbon::parse($password_updated_at)->addDays($password_expiry_days);
                //     if ($password_expiry_at->lessThan(\Carbon\Carbon::now())) {
                //         return api_response(202, 'Password expired, Please generate new password.', ['user_id' => $user->id]);
                //     }
                // }




                $user->username = $user->first_name . ' ' . $user->last_name;

                $user->persmission =  RolePermission::where('role_name', $user->user_type)
                    ->where('is_permission', 1)
                    ->where('permission_route', '!=', null)
                    ->pluck(
                        'permission_route'
                    )->all();

                $user->all_persmission =  RolePermission::where('role_name', $user->user_type)
                    ->where('permission_route', '!=', null)
                    ->pluck(
                        'permission_route'
                    )->all();

                $user->backend_permissions =  RolePermission::where('role_name', $user->user_type)
                    ->where('is_permission', 1)
                    ->where('backend_route', '!=', null)
                    ->pluck(
                        'backend_route'
                    )->all();

                $user->backend_all_persmission =  RolePermission::where('role_name', $user->user_type)
                    ->where('backend_route', '!=', null)
                    ->pluck(
                        'backend_route'
                    )->all();



                if (Hash::check($request->password, $user->password)) {
                    Log::Info('password matched');
                    $resultUpdateAttempt = User::where('email', $req['email'])->update(['attempts_count' => 0]);
                    if($resultUpdateAttempt){
                        Log::Info('attempts_count 0 updated');
                    }
                    $attempt_array = ['email' => $req['email'], 'password' => $req['password'], 'verified_email' => 1, 'is_blocked' => 0, 'is_deleted' => 0];
                    $token = Auth::setTTL(7200)->attempt($attempt_array);
                    if ($token) {
                        Log::Info('token found');
                        $token_info = $this->respondWithToken($token, $user);
                        $data = array(
                            'token_info' => $token_info
                        );
                        $devices_array = array(
                            'user_id' => Auth::id(),
                            'user_agent' => $_SERVER["HTTP_USER_AGENT"]
                        );
                        loginactivity();
                        $user_device = UserDevices::where($devices_array)->first();
                        if ($user_device) {
                            UserDevices::where('device_id', $user_device->device_id)->update($devices_array);
                        } else {
                            UserDevices::insert($devices_array);
                        }


                          // set is membership user
                        $active_plan=is_membership_user($user->id);
                        if($active_plan){
                           $user->plan = $active_plan;
                           $user->is_membership_user = 1;
                           $user->is_member = 1;
                        }else{
                            $user->is_membership_user = 0;
                        }

                        if (env('APP_ENV') != 'local') {

                            if (empty($user->dontask)) {
                                $data['dontask'] = true;
                            } else {
                                $current = \Carbon\Carbon::now()->format('Y-m-d H:i:s');
                                $to = \Carbon\Carbon::parse($user->dontask);
                                $from = \Carbon\Carbon::parse($current);
                                $days = $to->diffInDays($from);
                                    Log::Info('from'.$from);
                                  Log::Info('to'.$to);
                                  Log::Info('days'.$days);
                                $data['dontask'] = ($days < 30) ? true : false;
                            }
                            Log::Info('dontask:' . $data['dontask'] . ' mobile:' . $user->mobile);
                            if ($data['dontask'] == false && !empty($user->mobile)) {
                                Log::Info('calling send sms and insert otp');
                                $otp = rand(100000, 999999);
                                User::where('id', $user->id)->update(['mobile_otp' => Hash::make($otp)]);
                                $msg = 'Please enter this One Time PIN: ' . $otp . ' to log onto your v.tabu account.';
                                send_sms($user->mobile, $msg);
                                return  api_response(200, "Login successfully, and otp send on ($user->mobile)", $data);
                            }
                        } else {
                            $data['dontask'] = true;
                        }
                        return api_response(200, 'Login successfully.', $data);
                    } else {
                        return api_response(201, 'Invalid email/password!');
                    }
                } else {
                    $attempts_count = $user->attempts_count + 1;
                    User::where('email', $req['email'])->update(['attempts_count' => $attempts_count]);
                    return api_response(201, 'Wrong password. Please try again.');
                }
            } else {
                // $html = '<a href="/registration">Register here</a>';
                return api_response(201, 'No account was found with this email. Please try again or if you are new to v.tabu <a href="' . get_frontend_url() . '/registration">Register here</a>');
            }
        } catch (\Exception $ex) {
            Log::Info('Authenticate exception' . $ex->getMessage());
            return api_response(201, 'Authenticate exception', $ex->getMessage());
        }
    }
    function passwordRule()
    {
        return [
            'required',
            'string',
            'min:6'
            // Password::min(12)
            //     ->mixedCase()
            //     ->numbers()
            //     ->symbols()
            //     ->uncompromised(),
        ];
    }
    public function checkValidPassword(Request $request)
    {
        $req = $request->all();
        $validator = Validator::make($request->all(), [
            'password' => $this->passwordRule(),
        ]);
        if ($validator->fails()) {
            return $this->customValidatorMessage($validator);
        } else {
            return api_response(200, "Password validated successfully.");
        }
    }

    function customValidatorMessage($validator)
    {
        $password_mesg = 'Password must be a minimum of 12 characters, a mixture of both uppercase and lowercase letters, numbers and symbols';
        $mesg = $validator->errors()->first();
        Log::Info('validator->fails()');
        Log::Info($mesg);
        switch ($mesg) {
            case "The password must contain at least one uppercase and one lowercase letter.":
            case "The password must be at least 12 characters.":
            case "The password must contain at least one symbol.":
            case "The cpassword must contain at least one uppercase and one lowercase letter.":
            case "The cpassword must be at least 12 characters.":
            case "The cpassword must contain at least one symbol.":
                $mesg = $password_mesg;
                break;
            default:
                $mesg = $mesg;
                break;
        }
        return api_response(201, $mesg);
    }
    public function checkValidEmail(Request $request)
    {
        $req = $request->all();
        $validator = Validator::make($request->all(), [
            'email'    => 'required|string|email:filter'
        ]);
        if ($validator->fails()) {
            return api_response(201, 'Invalid email address. Please correct and try again');
        } else {
            return api_response(200, "Email validated successfully.");
        }
    }

    public function checkMobileExistence(Request $request)
    {
        $user = User::where('mobile', $request->mobile)
            ->where('is_deleted', 0)
            ->first();
        if ($user) {
            return api_response(201, 'A user registered with this phone number already exists!');
        } else {
            return api_response(200, "mobile number validated successfully.");
        }
    }


    public function registration(Request $request)
    {
        $req = $request->all();
        Log::Info('registration');
        try {

            $validator = Validator::make(
                $request->all(),
                [
                    'email'    => 'required|string|email:filter',
                    'password' => $this->passwordRule(),
                    'first_name' => 'required',
                    'password' => 'required',
                    'user_type' => 'required',
                    'city' => 'required',
                    'identification_number' => 'required',
                ],
                [
                    'email.required' => 'A valid email address is required'
                ]
            );
            if ($validator->fails()) {
                return $this->customValidatorMessage($validator);
            }
            if (!isValidEmail($req['email'])) {
                return api_response(201, "Email not correct!");
            }

            if ($req['user_type'] != 'junior_reader') {
                $identification = DB::table('user_detail')
                    ->join('users', 'users.id', '=', 'user_detail.user_id')
                    ->where('users.user_type', '!=', 'junior_reader')
                    ->where('is_deleted', 0)
                    ->where('identification_number', $req['identification_number'])
                    ->where('users.email', 'NOT LIKE', '%@knls.ac.ke')
                    ->first();
//                if ($identification) {
//                    return api_response(201, "Identification number already exists!");
//                }
                Log::info('check indentification:'.json_encode($identification));
                if ($identification) {
                    // If identification number exists, update the first user profile found excluding profiles with email extension "@example.com"

                    $user = User::where('id', $identification->user_id)
                        ->where('email', 'NOT LIKE', '%knls.ac.ke')
                        ->first();
                    Log::info('found user account:'.json_encode($user));
                    $userdata = array(
                        "first_name" => $req['first_name'],
                        "middle_name" => $req['middle_name'],
                        "last_name" => $req['last_name'],
                        "email" => $req['email'],
                        "mobile" => $req['mobile'],
                        'verified_email' => 1,
                        "password" => Hash::make($req['password']),
                        "user_type" => $req['user_type']
                    );
                    Log::info('found user account payload:'.json_encode($userdata));
                    if ($user) {
                        $user->update($userdata);


                    }

                    $user_detail_array = [
                        'identification_number' => !empty($req['identification_number']) ? $req['identification_number'] : $identification->identification_number,
                        'identification_type' => !empty($req['identification_type']) ? $req['identification_type'] : $identification->identification_type,
                        'country' => !empty($req['country']) ? $req['country'] : $identification->country,
                        'state' => !empty($req['state']) ? $req['state'] : $identification->state,
                        'city' => !empty($req['city']) ? $req['city'] : $identification->city,
                        'address' => !empty($req['address']) ? $req['address'] : $identification->address,
                        'gender' => !empty($req['gender']) ? $req['gender'] : $identification->gender,
                    ];

                    if (!empty($req['dob'])) {
                        $user_detail_array['dob'] = $req['dob'];
                    }

                    Log::info('Updated user detail:');
                    Log::info(print_r($user_detail_array, true));

                    DB::table('user_detail')
                        ->where('user_id', $identification->user_id)
                        ->update($user_detail_array);

                    $audit_data = [
                        'user_id' => $identification->user_id,
                        'module' => 'User',
                        'module_id' => $identification->user_id,
                        'activity' => 'update',
                    ];
                    DB::table('password_securities')
                        ->where('user_id', $identification->user_id)
                        ->update([
                            'password_expiry_days' => password_expiry_days(),
                            'password_updated_at' => Carbon::now(),
                        ]);

                    $updateMessage = 'Hi, ' . $req['first_name'] . ' ' . $req['last_name'] . '! <br> Thank you for updating your v.tabu account.';
                    return api_response(200, 'User registered successfully.', [ 'message' => $updateMessage]);
                }

//                else{
//                    Log::info('Error in Updating User');
//                    return api_response(201, 'Error in Updating User');
//                }
            }

            $user_email_exists = User::where('email', $req['email'])->where('is_deleted', 0)
                ->first();

            if ($user_email_exists) {
                return api_response(201, "User already exist");
            }

            $email = $req['email'];
            $emailParts = explode('@', $email);

            if (count($emailParts) == 2) {
                $emailDomain = $emailParts[1];

                // Check if the email domain is equal to the expected domain
                if ($emailDomain == 'knls.ac.ke') {
                $data = array(
                    "first_name" => $req['first_name'],
                    "middle_name" => $req['middle_name'],
                    "last_name" => $req['last_name'],
                    "email" => $req['email'],
                    "mobile" => $req['mobile'],
                    "password" => Hash::make($req['password']),
                    "user_type" => $req['user_type']
                );

                    // Proceed with your registration logic here using $data
                } else {
                $data = array(
                    "first_name" => $req['first_name'],
                    "middle_name" => $req['middle_name'],
                    "last_name" => $req['last_name'],
                    "email" => $req['email'],
                    "mobile" => $req['mobile'],
                    'verified_email' => 1,
                    "password" => Hash::make($req['password']),
                    "user_type" => $req['user_type']
                );
                }
            }else {
                // Handle the case where the email format is not as expected.
                Log::info('Invalid Email:');
                return api_response(201, 'Error in creating User');
            }

            $result = User::create($data);


            $user_detail_array = [
                'user_id' => $result->id,
                'identification_number' => !empty($req['identification_number']) ? $req['identification_number'] : "",
                'identification_type' => !empty($req['identification_type']) ? $req['identification_type'] : "",
                'country' => !empty($req['country']) ? $req['country'] : "",
                'state' => !empty($req['state']) ? $req['state'] : "",
                'city' => !empty($req['city']) ? $req['city'] : "",
                'address' => !empty($req['address']) ? $req['address'] : "",
                'gender' => !empty($req['gender']) ? $req['gender'] : "",
            ];
            if (!empty($req['dob'])) {
                $user_detail_array['dob'] = $req['dob'];
            }
                Log::Info('user detail');
                Log::Info(print_r($user_detail_array,true));
            DB::table('user_detail')->insert($user_detail_array);

            $audit_data = array(
                "user_id" => $result->id,
                "module" => "User",
                "module_id" => $result->id,
                "activity" => "create"
            );

            DB::table('password_securities')->insert([
                'user_id' => $result->id,
                'password_expiry_days' => password_expiry_days(),
                'password_updated_at' => Carbon::now(),
            ]);

            $mobile = $req['mobile'];
            //            $otp = rand(100000, 999999);
            //            User::where('id',$result->id)->update(['mobile_otp' => Hash::make($otp)]);

            //            $msg = 'Please enter this One Time PIN: '.$otp.' to verify your v.tabu account.';
            //            send_sms($mobile, $msg);

            $return = audit($audit_data);

            if (count($emailParts) == 2) {
               $emailDomain = $emailParts[1];

                // Check if the email domain is equal to the expected domain
                if ($emailDomain == 'knls.ac.ke') {
                    $message = 'Hi, ' . $req['first_name'] . ' ' . $req['last_name'] . '! <br>
  We have sent an email to ' . $req['email'] . ' containing a link to verify your account. Click/tap on the link to finish creating your v.tabu account.';
                    verification($req['email'], $result->id);
                    return api_response(200, 'User registered successfully.', ["user_id" => $result->id, 'mobile' => $mobile, 'message' => $message]);
                } else {
                    $message = 'Hi, ' . $req['first_name'] . ' ' . $req['last_name'] . '! <br> Thank you for creating your v.tabu account.';
                    return api_response(200, 'User registered successfully.', ["user_id" => $result->id, 'mobile' => $mobile, 'message' => $message]);
                }
            }else{return api_response(201, 'Error in Creating User');}

        } catch (\Exception $ex) {
            Log::info('Error in Creating User   ' . $ex->getMessage());
            return api_response(201, 'Error in Creating User');
        }
    }

    public function verify($id)
    {
        User::where(['id' => $id])->update(['verified_email' => 1]);
        return view('verified_success');
    }
    public function otpverify(Request $request)
    {
        try {
            DB::enableQueryLog();
            $temp_verify = false;

            $user =  User::where(['id' => $request->user_id])->first();
            if ($user) {
                if (Hash::check($request->otp, $user->mobile_otp) || $temp_verify) {
                    $to = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $user->updated_at);
                    $current = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s',\Carbon\Carbon::now()->format('Y-m-d H:i:s'));
                    Log::Info('to'.$to);
                    Log::Info('current'.$current);
                    $diff_in_minutes = $current->diffInMinutes($to);
                Log::Info('otpverify diff_in_minutes'.$diff_in_minutes);
                    if ($diff_in_minutes < 30) {
                        //don't ask otp
                        if (!empty($request->dontask) && $request->dontask == 'on') {
                            $date = \Carbon\Carbon::now()->format('Y-m-d H:i:s');
                            User::where(['id' => $request->user_id])->update(['dontask' => $date]);
                        }
                        User::where(['id' => $request->user_id])->update(['two_fa_verified' => 1, "mobile_otp" => '']);
                        return  api_response(200, "mobile number successfully verified");
                    } else {
                        return  api_response(201, "Code expired please click on Resend OTP to get a new code");
                    }
                } else {
                    return  api_response(201, "Incorrect code please try again");
                }
            } else {
                return  api_response(201, "Invalid user!");
            }
        } catch (\Exception $ex) {
            Log::info('otp verification exception' . $ex->getMessage());
            return  api_response(201, "otp verification exception");
        }
    }
    public function otpresend(Request $request)
    {
        try {
            $user = User::where('id',  $request->user_id)->first();
            if ($user) {
                $otp = rand(100000, 999999);
                User::where('id', $request->user_id)->update(['mobile_otp' => Hash::make($otp)]);
                $mobile =  $user->mobile;
                $msg = 'Please enter this One Time PIN: ' . $otp . ' to log onto your v.tabu account.';
                send_sms($mobile, $msg);
                $stared_mobile = substr_replace($mobile,"****",4,4);
                return  api_response(200, "A new code has been sent to $stared_mobile");
            } else {
                return  api_response(201, "Invalid user");
            }
        } catch (\Exception $ex) {
            Log::info('otp resend exception' . $ex->getMessage());
            return  api_response(201, "otp resend exception");
        }
    }
    public function forget(Request $request)
    {
        $req = $request->all();
        try {

            $user = User::Where(['email' => $req['email']])
             ->where('is_deleted', 0)
            ->first();
            $forget_token = custom_encryption('encrypt', rand(10000, 99999));
            if ($user) {
                if ($user->is_blocked == 1) {
                    return api_response(201, 'Your Accounts is blocked, Please Contact Admin');
                }
                if(empty($user->forgot_password)){
                    Log::Info('updating:' . $forget_token);
                $result = User::where(['email' => $req['email']])
                    ->update(['forgot_password' => $forget_token]);
                }else{
                    $forget_token = $user->forgot_password;
                }

                 if(!empty($forget_token)){
                    $email = $req['email'];
                    $data['email'] = $req['email'];
                    $data['name'] = $user->first_name;
                    $data['reset_url'] = get_frontend_url() . '/reset-password?token=' . $forget_token;
                    Log::Info('reset_url:' . $data['reset_url']);
                    Mail::send('forgot_reset', $data, function ($message) use ($email) {
                        $message->to($email, 'User')->subject('Reset Your Password');
                    });
                    return  api_response(200, "Done!<br>
We've sent an email to " . $req['email'] . " with instructions to help you reset your password.<br>Please check your inbox.");
                } else {
                    return  api_response(201, "Unable to update token!");
                }
            } else {
                return  api_response(201, "No user registered with this email address");
            }
        } catch (\Exception $ex) {
            Log::info('forgot exception' . $ex->getMessage());
            return  api_response(201, "forgot exception");
        }
    }

    public function forgetSetPassword(Request $request)
    {
        Log::Info('forgetSetPassword');

//        Log::Info(print_r($request->all(), true));

        $validator = Validator::make($request->all(), [
            'forget_token'  => 'required',
            'cpassword' => $this->passwordRule(),
            'password' => $this->passwordRule(),
        ]);
        if ($validator->fails()) {
            return $this->customValidatorMessage($validator);
        }

        if ($request->password != $request->cpassword) {
            return api_response(201, "Passwords didn't match!");
        }
        if (empty($request->forget_token)) {
            Log::Info('empty forget_token');
            return api_response(201, "Invalid request(Empty token)!");
        }

        try {
            $user = User::where('forgot_password', trim($request->forget_token))->first();
            if ($user) {
                User::where('forgot_password', trim($request->forget_token))->update(['password' => Hash::make(trim($request->password)), 'forgot_password' => '', 'verified_email' => 1]);
                DB::table('password_securities')->where('user_id', $user->id)->update([
                    'password_updated_at' => Carbon::now(),
                ]);
                $message = 'Password Reset Successful <br>
                Your password has been updated.<br>Please <a href="' . get_frontend_url() . '/login">Log in to continue.</a>';
                return api_response(200, $message, ['message' => $message]);
            } else {
                Log::Info('user not found');
                return api_response(201, "Invalid request");
            }
        } catch (\Exception $ex) {
            Log::Info('Password reset exception:' . $ex->getMessage());
            return api_response(201, "Password reset exception");
        }
    }

    public function setPassword(Request $request)
    {
        Log::Info('setPassword');

        // Log::Info(print_r($request->all(),true));

        $validator = Validator::make($request->all(), [
            'user_token'  => 'required',
            'cpassword' => $this->passwordRule(),
            'password' => $this->passwordRule(),
        ]);
        if ($validator->fails()) {
            return $this->customValidatorMessage($validator);
        }

        if ($request->password != $request->cpassword) {
            return api_response(201, "Passwords didn't match!");
        }
        if (empty($request->user_token)) {
            Log::Info('empty user token');
            return api_response(201, "No user registered with this email address!");
        }

        try {
            $id = custom_encryption('decrypt', trim($request->user_token));
            $user = User::where('id', $id)->first();
            if ($user) {
                User::where('id', $id)->update(['password' => Hash::make(trim($request->password)), 'verified_email' => 1]);
                DB::table('password_securities')->insert([
                    'user_id' => $id,
                    'password_expiry_days' => password_expiry_days(),
                    'password_updated_at' => Carbon::now(),
                ]);



                return api_response(200, "Password successfully set");
            } else {
                Log::Info('user not found');
                return api_response(201, "No user registered with this email address");
            }
        } catch (\Exception $ex) {
            Log::Info('Password reset exception:' . $ex->getMessage());
            return api_response(201, "Password reset exception");
        }
    }
    public function logout(Request $request)
    {
        try {
            $resultLogout = $this->jwt->parseToken()->invalidate();
            if ($resultLogout) {
                return api_response(200, 'Logout successfully');
            } else {
                return api_response(201, 'Unable to logout!');
            }
        } catch (\Exception $ex) {
            return api_response(200, 'Logout successfully');
        }
    }

    public function changepassword(Request $request)
    {
        //         Log::Info(print_r($request->all(), true));


        $validator = Validator::make($request->all(), [
            'newpassword' => $this->passwordRule(),
            'oldpassword' => 'required',
        ]);
        if ($validator->fails()) {
            return api_response(201, $validator->errors()->first());
        }
        try {
            $user_id = 0;
            if (Auth::check()) {
                $user_id =  Auth::id();
            } else {
                $user_id = $request->user_id;
            }
            if ($user_id == 0) {
                return api_response(201, 'User id is required!');
            }
            $user = User::find($user_id);

            if ($user) {
                Log::Info('email:' . $user->email);
                Log::Info('id:' . $user->id);

                if (!Hash::check($request->oldpassword, $user->password)) {
                    return api_response(201, "Wrong old password!");
                }

                $checkResult = Hash::check(trim($request->oldpassword), $user->password);
                if ($checkResult) {
                    $hashed_pass = Hash::make($request->newpassword);
                    $resultUpdate = User::where('id', $user->id)->update(['password' => $hashed_pass]);
                    DB::table('password_securities')->where(['user_id' => $user->id])
                        ->update([
                            'password_expiry_days' => password_expiry_days(),
                            'password_updated_at' => Carbon::now(),
                        ]);
                    if ($resultUpdate) {
                        return $this->apiResponse('200', "Password successfully changed");
                    } else {
                        return $this->apiResponse('201', "Unable to change Password!");
                    }
                } else {
                    return $this->apiResponse('201', "Incorrect old password!");
                }
            } else {
                return $this->apiResponse('201', "No user registered with this email address!");
            }
        } catch (\Exception $ex) {
            Log::Info('Change password Exception' . $ex);
            return $this->apiResponse('201', "Change password Exception", $ex->getMessage());
        }
    }



    public function userMyProfile()
    {
        try {

            Log::Info('Get my profile');
            // Log::Info(print_r(Auth::user(), true));

            $account = User::where('id', Auth::id())
                ->join('user_detail', 'user_detail.user_id', '=', 'users.id')
                ->select(
                    'first_name',
                    'middle_name',
                    'last_name',
                    'email',
                    'mobile',
                    'gender',
                    'dob',
                    'address',
                    'city',
                    'identification_number',
                    'country',
                    'post_code',
                    'user_image',
                    'user_image as profile_image',
                    'affiliation',
                    'interest_categories',
                    'interest_sub_categories',
                    'loans',
                    'overdue',
                    'borrowing',
                    'state',
                    'identification_type'
                )->first();

            Log::Info('Get my profile');
            // Log::Info(print_r($account, true));

            if ($account) {
                return api_response(200, 'Success', $account);
            } else {
                return api_response(201, 'Get my profile error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get my profile exceptions');
            Log::Info($ex);
            return api_response(201, 'Get my profile exceptions');
        }
    }
    public function userMyProfileUpdate(Request $request)
    {
        $req = $request->all();
        Log::Info(print_r($req, true));

        $userdetails = UserDetail::where('user_id', Auth::id())->first();
        if (!empty($request)) {
            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "User",
                "module_id" => Auth::id(),
                "activity" => "update",
            );
            $old = array();
            $new = $request->all();
            unset($new["user_image"]);
            $return = audit($audit_data, array(), $new);
        }
        // Log::Info(print_r($req, true));
        try {
            $updateDetail = array(
                "gender" => $req["gender"],
                "address" => $req["address"],
                "city" => $req["city"],
                "identification_number" => !empty($userdetails->identification_number) ? $userdetails->identification_number : $req['identification_number'],
                'identification_type' => !empty($userdetails->identification_type) ? $userdetails->identification_type : $req['identification_type'],
                "state" => ($req["state"]) ? $req["state"] : null,
                "country" => ($req["country"]) ? $req["country"] : null,
            );

            $updateDetail["post_code"] = (!empty($req["post_code"]) && $req["post_code"] != 'null') ? $req["post_code"] : 0;

            $updateDetail['dob'] = !empty($req['dob']) ? $req['dob'] : "";


            if (isset($req["user_image"]) && $req["user_image"]!='') {
                $file_data = $req["user_image"];
                $file_name = uniqid() . '.png'; //generating unique file name;
                file_put_contents('files/profile/' . $file_name, base64_decode($file_data));
                $updateDetail["user_image"] = $file_name;
            }else{
                $updateDetail["user_image"] = $userdetails->user_image;
            }
            $update = User::find(Auth::id());
            $update->update($req);

            $userDetail = DB::table('user_detail')->where('user_id', Auth::id())->update($updateDetail);

            $upadatedData = $update->join('user_detail', 'user_detail.user_id', '=', 'users.id')
                ->select(
                    'id',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'email',
                    'mobile',
                    'gender',
                    'dob',
                    'address',
                    'city',
                    'identification_number',
                    'country',
                    'post_code',
                    'user_image',
                    'user_image as profile_image',
                    'affiliation',
                    'area_of_interest',
                    'loans',
                    'overdue',
                    'borrowing',
                    'identification_type',
                    'state'
                )
                ->where('user_id', Auth::id())
                ->first();
            if ($upadatedData) {
                return api_response(200, 'You have successfully updated your profile.', $upadatedData);
            } else {
                return api_response(201, 'Unable to Update user profile!');
            }
        } catch (\Exception $ex) {
            Log::Info('Update my profile exeption');
            Log::Info($ex);
            return api_response(201, 'Update my profile exeption');
        }
    }
    public function userpreferance(Request $request)
    {
        $req = $request->all();
        if (!empty($request)) {
            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "User",
                "module_id" => Auth::id(),
                "activity" => "preferance update",
                "platform" => "web",
                "device_id" => "",
                "useragent" => ""
            );
            $old = array();
            $new = array(
                "affiliation" => $req['affiliation'],
                "interest_categories" => json_decode($req['interest_categories'], true),
                "interest_sub_categories" => json_decode($req['interest_sub_categories'], true)
            );
            $return = audit($audit_data, $old, $new);
        }
        try {
            Log::Info('Update my profile');
            // Log::Info(print_r(Auth::user(), true));
            $interest_categories = implode(",", json_decode($req["interest_categories"]));
            $interest_sub_categories = implode(",", json_decode($req["interest_sub_categories"]));
            $updateDetail = array(
                "affiliation" => $req["affiliation"],
                "interest_sub_categories" => $interest_sub_categories,
                "interest_categories" => $interest_categories,
            );

            $update = User::find(Auth::id());

            DB::table('user_detail')->where('user_id', Auth::id())->update($updateDetail);

            $upadatedData = $update->join('user_detail', 'user_detail.user_id', '=', 'users.id')
                ->select(
                    'id',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'email',
                    'mobile',
                    'gender',
                    'dob',
                    'address',
                    'city',
                    'identification_number',
                    'country',
                    'post_code',
                    'user_image',
                    'user_image as user_image_path',
                    'affiliation',
                    'interest_categories',
                    'interest_sub_categories',
                    'loans',
                    'overdue',
                    'borrowing',
                    'state'
                )
                ->where('user_id', Auth::id())
                ->first();

            Log::Info('Update my profile');
            // Log::Info(print_r($upadatedData, true));

            if ($upadatedData) {
                return api_response(200, 'Your preference has been updated', $upadatedData);
            } else {
                return api_response(201, 'Update my preference error');
            }
        } catch (\Exception $ex) {
            Log::Info('Update my profile exeptions');
            Log::Info($ex);
            return api_response(201, 'Update my profile exeptions');
        }
    }

    public function membershipSubscriptionPost(Request $request)
    {
        $nextdate = "+" . $request->plan . " day";
        $subscription_array = array(
            'user_id' => Auth::id(),
            'plan' => $request->plan
        );
        $subscription_array['start_date'] = date("Y-m-d");
        $subscription_array['end_date'] = date("Y-m-d", strtotime($nextdate));
        $subscription_array['status']='pending';
        $planSubscribed = MembershipSubscription::where('user_id', Auth::id())->where('is_expired', 0)->first();
        if ($planSubscribed) {
            if ($planSubscribed->plan == $request->plan) {
                return api_response(201, 'You already subscribed to this plan');
            } else if ($planSubscribed->plan > $request->plan) {
                return api_response(201, 'You are already subscribed to another plan');
            } else if ($planSubscribed->plan < $request->plan) {
                $result =  MembershipSubscription::where('member_subscription_id', $planSubscribed->member_subscription_id)->update($subscription_array);
                $msg = 'Membership plan successfully changed';
            }
        } else {
            $result = MembershipSubscription::create($subscription_array);
            $msg = 'You have successfully subscribed for membership';
        }
        if ($result) {
            return api_response(200, $msg);
        } else {
            return api_response(201, 'Unable to subscribe plan!');
        }
    }

    public function deactive()
    {
        $pwdsecurity = DB::table('password_securities')->select('password_updated_at', 'password_expiry_days')->get();
        // $password_updated_at = $pwdsecurity->password_updated_at;
        // $password_expiry_days = $pwdsecurity->password_expiry_days;
        // $password_expiry_at = \Carbon\Carbon::parse($password_updated_at)->addDays($password_expiry_days);
        // if ($password_expiry_at->lessThan(\Carbon\Carbon::now())) {
        //     return api_response(201, 'Password expired');
        // }
        return response()->json(['msg' => $pwdsecurity]);
    }
    public function viewPdf(Request $request)
    {
        Log::Info('viewPdf' . $request->getContent());
        $content = Content::where('content_id', $request->getContent())->first();
        $drm = ContentDrmSettings::where('content_id', $request->getContent())->first();
        if ($content) {
            $file_name = '';
            if ($request->preview == 'true') {
                $file_name = get_content_files_path($content->preview_file);
            } else {

                $file_name = get_content_files_path($content->upload_content);
            }
            if (!empty($request->local_file_path)) {
                $file_name = $request->local_file_path;
            }


            return view('pdf_viewer', array('file_name' => $file_name, 'drm' => $drm));
        }
    }
    public function webViewerPdf(Request $request)
    {
        // Log::Info(print_r($_SERVER,true));
        // Log::Info('viewPdf' . $request->getContent());
        //    Log::Info(print_r($request->all(),true));
        // if(!empty( $_SERVER['HTTP_REFERER'])){
        // Log::Info('HTTP_REFERER' . $_SERVER['HTTP_REFERER'] );
        // }
        //Log::info($request->getContent());

        if(!empty($_SERVER['HTTP_SEC_FETCH_DEST']) && !empty($_SERVER['HTTP_REFERER']) && $_SERVER['HTTP_SEC_FETCH_DEST'] == 'iframe' && str_contains($_SERVER['HTTP_REFERER'], 'https://vtabu.knls.ac.ke/view-play-content')
            || env('APP_ENV') == 'local'
        ){

        $content_id = custom_encryption('decrypt', $request->query("content"));
        $content = Content::where('content_id', $content_id)->first();
        Log::info($content);
        $drm = ContentDrmSettings::where('content_id', $content_id)->first();
        if ($content) {
            $read_duration=0;
            if(Auth::check()){
            $reader_content = Readercontents::where(['reader_id' => Auth::id(),
            'content_id' => $content_id])->first();
            if($reader_content){
                $read_duration=$reader_content->read_duration;
            }
            }
            $file_name = '';
            if ($request->preview == 'true') {
                $file_name = get_content_files_path($content->preview_file);
            } else {

                $file_name = get_content_files_path($content->upload_content);
            }
            if (!empty($request->local_file_path)) {
                $file_name = $request->local_file_path;
            }
            //Log::Info('file_name' . $file_name);
            $response = array('file_name' => $file_name, 'drm' => $drm,'content_id'=>$content_id,'user_id'=>$request->user_id,'read_duration'=>$read_duration);

            return view('web_pdf_viewer', $response);
            }
        }else{
              //Log::Info('-------calling from outside-------------');
              //Log::Info(print_r($_SERVER,true));
        }
    }
    public function blocked()
    {
    }
    public function callbackAuthenticate(Request $request)
    {
        $req = $request->all();

        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'email'    => 'required|email',
                    'password' => 'required',

                ],
                [
                    'email.required' => 'Please enter your email to login',
                    'password.required' => 'Please enter your password to login'
                ]
            );
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }
            $user = User::where('email', $req['email'])
                ->where('is_deleted',0)
                ->select(
                    'id',
                    'user_type',
                    'password'
                )
                ->first();

            if ($user) {
                Log::Info('user found');
                if (Hash::check($request->password, $user->password)) {
                    Log::Info('password matched');
                  $attempt_array = ['email' => $req['email'], 'password' => $req['password']];
                    $token = Auth::setTTL(7200)->attempt($attempt_array);
                    if ($token) {
                        Log::Info('token found');
                        $token_info = $this->respondWithToken($token, $user);
                        $data = array(
                            'token' => $token_info->original['token'],
                            'token_type' => 'bearer',
                        );
                        return api_response(200, 'Callback Api token generated Successfully', $data);
                    } else {
                        return api_response(201, 'Invalid email/password!');
                    }
                } else {
                    return api_response(201, 'Wrong password. Please try again.');
                }
            } else {
                return api_response(201, 'No record found');
            }
        } catch (\Exception $ex) {
            Log::Info('Callback API Authenticate exception' . $ex->getMessage());
            return api_response(201, 'Callback API Authenticate exception');
        }
    }


    public function getUserActivePlan(){
        $user = User::where('id', Auth::id())->first();
        if($user){

                 $active_plan=is_membership_user($user->id);
                        if($active_plan){
                           $user->plan = $active_plan;
                           $user->is_membership_user = 1;
                           $user->is_member = 1;
                      return api_response(200, 'plan details');
                        }

                          }
                            return api_response(201, 'Unale to get plan details');
}
}


