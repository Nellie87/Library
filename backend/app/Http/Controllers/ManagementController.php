<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;
use App\Models\Feedback;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\UserDevices;
use App\Models\UserDetail;
use App\Models\RolePermission;
use App\Models\Module;
use App\Models\Readercontents;
use Validator;


class ManagementController extends controller
{

    private $url;
    private $profileUrl;
    private $maxResults;
    function __construct()
    {
        $this->url = url() . '/files/profile';
        $this->profileUrl = get_profile_path();
        $this->maxResults= maxresult();
    }
    public function roles($user_type)
    {
        $role = DB::table('authorized_duties')->where('user_type', $user_type)->get();
        return response()->json(['data' => $role]);
    }
    public function add_permission(Request $request)
    {
        try {
            $data = $request->all();
            $checkRecord = DB::table('authorized_duties')->where('user_type', $data['user_type'])->count();

            if (empty($checkRecord)) {

                $recordStatus = DB::table('authorized_duties')->insert($data);
            } else {
                // unset($data['user_type']);
                $recordStatus = DB::table('authorized_duties')->where('user_type', $data['user_type'])->update($data);
            }
            $record = DB::table('authorized_duties')->where('user_type', $data['user_type'])->get();
            return response()->json(['data' => $record]);
        } catch (\Exception $ex) {
            return response()->json(["error" => $ex]);
        }
    }

    public function getuserlist(Request $request)
    {
        try {

            Log::Info('Get user list');
            // Log::Info(print_r(Auth::user(), true));
      $list = User::join('user_detail', 'user_detail.user_id', '=', 'users.id')
                ->select(
                    'id',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'email',
                    'mobile',
                    'user_image as profile_image',
                    'user_type',
                    'is_blocked'
                )
                ->where("is_deleted", '!=', 1)
                ->where('user_type','!=','apiuser')
                ->where(function ($query) use ($request) {
                    $query->where("id", '!=',Auth::id());
                    if (Auth::user()->user_type == 'senior_librarian') {
                        $query->where("user_type", '=', "reader");
                    }
                    if (!empty($request->user_type)) {
                        $request->current_page = 1;
                        $query->where('user_type', $request->user_type);
                    }

                    if (!empty($request->from_date) && !empty($request->to_date)) {
                        $request->current_page = 1;
                        $query->whereBetween('users.created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                    }

                    if (!empty($request->search_text)) {
                        $request->current_page = 1;
                        $query->where(function ($query) use ($request) {
                            $query->where('users.first_name', 'like', "%$request->search_text%")
                                ->orWhere('users.last_name', 'like', "%$request->search_text%")
                                ->orWhere('users.email', 'like', "%$request->search_text%")
                                ->orWhere('users.mobile', 'like', "%$request->search_text%");
                        });
                    }

                    if (!empty($request->area_of_intrest)) {
                        $request->current_page = 1;
                        $area_of_intrest = explode(',', $request->area_of_intrest);

                        $query->where(function ($query) use ($area_of_intrest) {
                            foreach ($area_of_intrest as $area_of_intrest_no) {
                                $query->orWhere(function ($query) use ($area_of_intrest_no) {
                                    $query->whereRaw('FIND_IN_SET(' . $area_of_intrest_no . ',user_detail.interest_categories)');
                                });
                            }
                        });
                    }
                })
                ->orderby('users.created_at', 'desc')
                ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);

            Log::Info('Get user list');
            // Log::Info(print_r($list, true));

            if ($list) {
                return api_response(200, 'Success', $list);
            } else {
                return api_response(201, 'Get user list error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get user list exceptions');
            Log::Info($ex);
            return api_response(201, 'Get user list exceptions');
        }
    }

    public function deleteUser(Request $request)
    {
        try {
         
            // Log::Info(print_r(Auth::user(), true));
            $userId = $request->user_id;

            $data = array(
                "is_deleted" => 1
            );

            $update_delete = DB::table('users')->whereIn('id', $request->user_id)->update($data);

              
            // Log::Info(print_r($update_delete, true));
            if ($update_delete) {
                foreach($request->user_id as $user_id){
                      $audit_data = array(
            "user_id" => Auth::id(),
            "module_id" => $user_id,
            "module" => "User",
            "activity" => "Delete",

        );
        $old =$new = [];        
        $return = audit($audit_data, $old, $new);
                }
                   
                return api_response(200, 'User successfully deleted', $update_delete);
            } else {
                return api_response(201, 'Delete user error');
            }
        } catch (\Exception $ex) {
            Log::Info('Delete user exceptions');
            Log::Info($ex);
            return api_response(201, 'Delete user exceptions');
        }
    }

    public function adduser(Request $request)
    {
        $req = $request->all();
          Log::Info('adduser');
         Log::Info(print_r($req,true));
        try {

            $validator = Validator::make($request->all(), [
                'user_type' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
                'email' => 'required',
                'mobile' => 'required',
                'dob'=>'required',
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required', $validator->errors());
            }

            $email_check = User::select('email')
                ->where('email', $req['email'])
                 ->where('is_deleted', 0)
                ->first();
            if ($email_check) {
                    return api_response(201, 'A user with this email already exists');
            }


            $data = array(
                "user_type" => $req['user_type'],
                "first_name" => $req['first_name'],
                "last_name" => $req['last_name'],
                "email" => $req['email'],
                "mobile" => $req['mobile']

            );
            Log::Info(print_r($data,true));
            $result = User::create($data);
            if($result){
            $user_detail_data = array(
                "user_id" => $result->id,
                "identification_number" => $req['identification_number'],
                "address" => $req['address'],
                "country" => $req['country'],
                "state" => $req['state'],
                "city" => $req['city'],
                "gender" => $req['gender'],
                "user_image" => $this->uploadImage($request, "user_image")
            );
            if(!empty($req['dob'])){
                $user_detail_data['dob'] = $req['dob'];
            }

            $user_result = UserDetail::create($user_detail_data);

            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "User",
                "module_id" => $result->id,
                "activity" => "create"
            );
            $return = audit($audit_data);
            if ($user_result) {
                $email = $req['email'];
                $user_token = custom_encryption('encrypt', $result->id);
                $data['set_url'] = get_frontend_url() . '/set-password?user_token=' . $user_token;
                Log::Info('set_url:' . $data['set_url']);
                Mail::send('set_password', $data, function ($message) use ($email) {
                    $message->to($email, 'User')->subject('Set Password');
                });
                return api_response(200, 'New user successfully created');
            } else {
                return api_response(201, 'Error in Creating User');
            }
            
            }else{
                return api_response(201, 'Error in Creating User'); 
            }
        } catch (\Exception $ex) {
            Log::info('Error in Creating User ' . $ex);
            return api_response(201, 'Creating User exception');
        }
    }

    public function uploadImage($req, $imageData)
    {
        $file_input_name = $imageData;
        $image_cover_url = null;
        if ($req->hasFile($file_input_name)) {
            $destinationPath = base_path() . '/public/files/profile';
            $image = $req->file($imageData);
            $name = uniqid() . '.' . $image->getClientOriginalExtension();
            $result = $image->move($destinationPath, $name);
            $image_cover_url = $name;
        }

        return $image_cover_url;
    }

    public function getuserdetail(Request $request)
    {
        try {

            Log::Info('Get user detail');
            // Log::Info(print_r(Auth::user(), true));

            $account = User::where('id', $request->user_id)
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
                    'user_image as profile_image',
                    'affiliation',
                    'interest_categories as area_of_interest',
                    'interest_categories',
                    'interest_sub_categories',
                    'loans',
                    'overdue',
                    'borrowing',
                    'state',
                    'user_type'
                )->first();

            Log::Info('Get user detail');
            // Log::Info(print_r($account, true));

            if ($account) {
                return api_response(200, 'Success', $account);
            } else {
                return api_response(201, 'Get user detail error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get user detail exceptions');
            Log::Info($ex);
            return api_response(201, 'Get user detail exceptions');
        }
    }

    public function userdetailupdate(Request $request)
    {
        $req = $request->all();
        try {
            Log::Info('Update user detail');
            // Log::Info(print_r(Auth::user(), true));

            $validator = Validator::make($request->all(), [
                'user_type' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
                'email' => 'required',
                'mobile' => 'required',
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required', $validator->errors());
            }

            $email_check = User::select('email', "id")
                ->where('email', $req['email'])
                ->first();
            if ($email_check) {
                if ($email_check->id != $req['user_id']) {
                    return api_response(201, 'Email already exists!');
                }
            }

            

            $data = array(
                "user_type" => $req['user_type'],
                "first_name" => $req['first_name'],
                "last_name" => $req['last_name'],
                "email" => $req['email'],
                "mobile" => $req['mobile'],
            );

            $update = User::find($req['user_id']);
          
            
            if (!empty($request)) {
                $audit_data = array(
                    "user_id" => Auth::id(),
                    "module" => "User",
                    "module_id" => $req['user_id'],
                    "activity" => "update",
                );
                $old = $update;
                $new = $request->all();
                unset($new['user_id']);
                unset($new['user_image']);
                $return = audit($audit_data, $old, $new);
            }
              $update->update($req);
            $user_detail_data = array(
                "identification_number" => $req['identification_number'],
                "address" => $req['address'],
                "country" => $req['country'],
                "state" => $req['state'],
                "city" => $req['city'],
                "gender" => $req['gender']
            );
              if(!empty($req['dob'])){
                $user_detail_data['dob'] = $req['dob'];
            }
            if ($req['user_image']) {
                $user_detail_data["user_image"] = $this->uploadImage($request, "user_image");
            }
            $userDetail = DB::table('user_detail')->where('user_id', $req['user_id'])->update($user_detail_data);

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
                    'user_image as profile_image',
                    'affiliation',
                   'interest_categories as area_of_interest',
                    'interest_categories',
                    'interest_sub_categories',
                    'loans',
                    'overdue',
                    'borrowing',
                    'state',
                    'user_type'
                )
                ->where('user_id', $req['user_id'])
                ->first();

            Log::Info('Update Update user detail');
            // Log::Info(print_r($upadatedData, true));

            if ($upadatedData) {
                return api_response(200, 'Update successfully', $upadatedData);
            } else {
                return api_response(201, 'Update Update user detail error');
            }
        } catch (\Exception $ex) {
            Log::Info('Update Update user detail exeptions');
            Log::Info($ex);
            return api_response(201, 'Update Update user detail exeptions' . $ex);
        }
    }

    
    
     public function updateUserByAdmin(Request $request)
    {
        $req = $request->all();
        try {
            Log::Info('Update user detail');
            // Log::Info(print_r(Auth::user(), true));

            $validator = Validator::make($request->all(), [
                'user_type' => 'required',
                'first_name' => 'required',
                'last_name' => 'required'
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required', $validator->errors());
            }

             $update = User::find($req['user_id']);
            if (!empty($request)) {
                $audit_data = array(
                    "user_id" => Auth::id(),
                    "module" => "User",
                    "module_id" => $req['user_id'],
                    "activity" => "update",
                );
                $old = $update;
                $new = $request->all();
                unset($new['user_id']);
                unset($new['user_image']);
                $return = audit($audit_data, $old, $new);
            }
              $update->update($req);
            $user_detail_data = array(
                "identification_number" => $req['identification_number'],
                "address" => $req['address'],
                "country" => $req['country'],
                "state" => $req['state'],
                "city" => $req['city'],
                "gender" => $req['gender']
            );
              if(!empty($req['dob'])){
                $user_detail_data['dob'] = $req['dob'];
            }
            if ($req['user_image']) {
                $user_detail_data["user_image"] = $this->uploadImage($request, "user_image");
            }
            $userDetail = DB::table('user_detail')->where('user_id', $req['user_id'])->update($user_detail_data);

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
                    'user_image as profile_image',
                    'affiliation',
                    'interest_categories as area_of_interest',
                    'interest_categories',
                    'interest_sub_categories',
                    'loans',
                    'overdue',
                    'borrowing',
                    'state',
                    'user_type'
                )
                ->where('user_id', $req['user_id'])
                ->first();

            Log::Info('Update Update user detail');
            // Log::Info(print_r($upadatedData, true));

            if ($upadatedData) {
                return api_response(200, 'You have successfully updated user profile.', $upadatedData);
            } else {
                return api_response(201, 'Unable to update user profile!');
            }
        } catch (\Exception $ex) {
            Log::Info('Update Update user detail exeptions');
            Log::Info($ex);
            return api_response(201, 'Update Update user detail exeptions' . $ex);
        }
    }
    public function role_and_permission(Request $request)
    {
        try {

            $permission = $request->permission;
            $roles = $request->roles;
            // Log::Info(print_r($request, true));
            foreach ($permission as $key => $value) {
                $data_array = array(
                    'is_permission' => $value["is_permission"],
                );
                // $permission_role = RolePermission::create($data_array);
                $permission_role = DB::table('roles_permission')
                    ->where('role_name', $roles)
                    ->where('permission', $value["name"])
                    ->update($data_array);
            }
            Log::Info('Update role_and_permission');
            // Log::Info(print_r(DB::getQueryLog(), true));

            return api_response(200, 'User permission updated');
        } catch (\Exception $ex) {
            Log::Info('permission Exception' . $ex);
            return api_response(201, 'permission Exception');
        }
    }

    public function get_role_and_permission(Request $request)
    {
        try {

            Log::Info('get_role_and_permission');
            // Log::Info(print_r(Auth::user(), true));

            $get_detail = RolePermission::where('role_name', $request->role_name)
                ->select(
                    'permission',
                    'is_permission',
                    'role_name',
                    'permission_title'
                )->get();

            Log::Info('get_role_and_permission');
            // Log::Info(print_r($get_detail, true));

            if ($get_detail) {
                return api_response(200, 'Success', $get_detail);
            } else {
                return api_response(201, 'get_role_and_permission error');
            }
        } catch (\Exception $ex) {
            Log::Info('get_role_and_permission exceptions');
            Log::Info($ex);
            return api_response(201, 'get_role_and_permission exceptions');
        }
    }

    public function get_permission(Request $request)
    {
        try {


            $get_detail = RolePermission::where('role_name', Auth::user()->user_type)
                ->select(
                    'permission',
                    'is_permission',
                    'role_name',
                    'permission_route'
                )->get();


            if ($get_detail) {
                return api_response(200, 'Success', $get_detail);
            } else {
                return api_response(201, 'get_permission error');
            }
        } catch (\Exception $ex) {
            Log::Info('get_permission exceptions');
            Log::Info($ex);
            return api_response(201, 'get_permission exceptions');
        }
    }
    public function loggedinuser(Request $request)
    {
        try {

            Log::Info('Get Logged in user');
            // Log::Info(print_r(Auth::user(), true));

            $list = User::join('user_detail', 'user_detail.user_id', '=', 'users.id')
                ->select(
                    'id',
                    'first_name',
                    'middle_name',
                    'last_name',
                    'email',
                    'mobile',
                    'user_image as profile_image',
                    'user_type',
                    'interest_categories as area_of_interest',
                    'interest_categories',
                    'interest_sub_categories',
                    'address',
                    DB::raw("DATE_FORMAT(users.last_login_at, '%d-%M-%Y  %H:%i') as updatedat")
                )
                ->where("user_type", '!=', "admin")
                ->where("is_deleted", '!=', 1)
                ->where("last_login_at", '!=', null)
                ->where(function ($query) use ($request) {
                    if (!empty($request->user_type)) {
                        $request->current_page = 1;
                        $query->where('user_type', $request->user_type);
                    }

                    if (!empty($request->from_date) && !empty($request->to_date)) {
                        $request->current_page = 1;
                        $query->whereBetween('users.created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                    }

                    if (!empty($request->search_text)) {
                        $request->current_page = 1;
                        $query->where(function ($query) use ($request) {
                            $query->where('users.first_name', 'like', "%$request->search_text%")
                                ->orWhere('users.last_name', 'like', "%$request->search_text%")
                                ->orWhere('users.email', 'like', "%$request->search_text%")
                                ->orWhere('users.mobile', 'like', "%$request->search_text%");
                        });
                    }

                    if (!empty($request->area_of_intrest)) {
                        $request->current_page = 1;
                        $area_of_intrest = explode(',', $request->area_of_intrest);

                        $query->where(function ($query) use ($area_of_intrest) {
                            foreach ($area_of_intrest as $area_of_intrest_no) {
                                $query->orWhere(function ($query) use ($area_of_intrest_no) {
                                    $query->whereRaw('FIND_IN_SET(' . $area_of_intrest_no . ',user_detail.interest_categories)');
                                });
                            }
                        });
                    }
                })
                ->orderby('users.created_at', 'desc')
                ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);
            $list->each(function ($interest) {
                // 'area_of_interest',
                $interest->area_of_interest = $this->area_of_interest($interest->area_of_interest);
            });
            Log::Info('Get Logged in user');
            // Log::Info(print_r($list, true));

            if ($list) {
                return api_response(200, 'Success', $list);
            } else {
                return api_response(201, 'Get user list error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get user list exceptions');
            Log::Info($ex->getMessage());
            return api_response(201, 'Get user list exceptions' . $ex->getMessage());
        }
    }
    public function loggedInHistory(Request $request){
        $user = get_user_detail($request->user_id);
        $result=DB::table('login_activities')->where(['user_id'=>$request->user_id])->paginate($this->maxResults);
        return api_response(200,'Logged in user history',['user'=>$user,'login_activities'=>$result]);
    }
    function area_of_interest($interest)
    {
        $arrinterest = explode(',', $interest);
        $data = DB::table('categories')->select('category_name')->whereIn('category_id', $arrinterest)->get();
        $category_name =array();
        foreach($data as $value){
            $category_name[]=$value->category_name;
        }
        $category_name = (!empty($data))?implode(",",$category_name) : '';
        return $category_name;
    }

    public function blockUser(Request $request)
    {
        try {
            Log::Info('blockUser');
            // Log::Info(print_r(Auth::user(), true));
            $userId = $request->user_id;
            $blockStatus = $request->block_status;
            $activity_status= ($blockStatus==0)?"unblocked":"blocked";

            $data = array(
                "is_blocked" => $blockStatus,
                "attempts_count"=>0
            );

            $update_block = DB::table('users')->where('id', $request->user_id)->update($data);

            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "User",
                "module_id" => $request->user_id,
                "activity" => $activity_status
            );
    
            $return = audit($audit_data);
            Log::Info('blockUser');
            // Log::Info(print_r($update_block, true));
            if ($update_block) {
                return api_response(200, 'User '.$activity_status.' successfully.', $update_block);
            } else {
                return api_response(201, 'blocked user error');
            }
        } catch (\Exception $ex) {
            Log::Info('blocked user exceptions');
            Log::Info($ex);
            return api_response(201, 'blocked user exceptions');
        }
    }

    public function get_publisher_name(Request $request)
    {
        try {

            Log::Info('get_publisher_name');
            // Log::Info(print_r(Auth::user(), true));

            $get_detail = User::where('user_type', 'publisher')
                ->where('is_deleted','!=',1)
                ->select(
                    'first_name',
                    'last_name',
                    'id'
                )->get();

            Log::Info('get_publisher_name');
            // Log::Info(print_r($get_detail, true));

            if ($get_detail) {
                return api_response(200, 'Success', $get_detail);
            } else {
                return api_response(201, 'get_publisher_name error');
            }
        } catch (\Exception $ex) {
            Log::Info('get_publisher_name exceptions');
            Log::Info($ex);
            return api_response(201, 'get_publisher_name exceptions');
        }
    }

    public function addModule(Request $request)
    {
        $req = $request->all();
        try {

            $validator = Validator::make($request->all(), [
                'module_key' => 'required',
                'module_description' => 'required',
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required', $validator->errors());
            }
            

            $data = array(
                "module_description" => $req['module_description'],
            );
            $result = DB::table('modules')
                    ->where('module_key', $req['module_key'])
                    ->update($data);

           
            if ($result) {
                return api_response(200, 'Successfully');
            } else {
                return api_response(201, 'Error in add module');
            }
        } catch (\Exception $ex) {
            Log::info('Error in add module  ' . $ex);
            return api_response(201, 'Add module exception');
        }
    }

    public function getModule(Request $request)
    {
        try {
            $req = $request->all();
            Log::Info('getModule');
            // Log::Info(print_r(Auth::user(), true));

            $get_detail = Module::where('module_key', $req['module_key'])
                ->select(
                    'module_key',
                    'module_description'
                )->first();

            Log::Info('getModule');
            // Log::Info(print_r($get_detail, true));

            if ($get_detail) {
                return api_response(200, 'Success', $get_detail);
            } else {
                return api_response(201, 'Get Module error');
            }
        } catch (\Exception $ex) {
            Log::Info('getModule exceptions');
            Log::Info($ex);
            return api_response(201, 'Get Module exceptions');
        }
    }

    public function contentSubscribedEnd(Request $request)
    {
        try {
            Log::Info('contentSubscribedEnd');
         
            $reader_id = Readercontents::where('subscription_remove','!=',1)
                    ->where( 'subscription_end', '<', \Carbon\Carbon::now())
                    ->pluck(
                        'reader_content_id'
                    )->all();


            $data = array(
                "subscription_remove" => 1
            );

            $update_subscribed = DB::table('reader_contents')->whereIn('reader_content_id', $reader_id)->update($data);
           
            Log::Info('contentSubscribedEnd');
            // Log::Info(print_r($update_subscribed, true));
          
            return api_response(200, 'successfully.', $update_subscribed);
        
        } catch (\Exception $ex) {
            Log::Info('Content Subscribed End exceptions');
            Log::Info($ex);
            return api_response(201, 'Content Subscribed End exceptions');
        }
    }

    public function contentSubscribedEndEmailNotification(Request $request)
    {
        try {
            DB::enableQueryLog();
            Log::Info('contentSubscribedEndEmailNotification');
            // print_r(\Carbon\Carbon::now()->addDays(4)->toDateString());
            $date=\Carbon\Carbon::now()->addDays(4)->toDateString();
            $reader_id = Readercontents::where('subscription_remove','!=',1)
                    ->where(DB::raw('DATE(subscription_end)'),'=', $date)
                    ->pluck(
                        'reader_id'
                    )->all();

            // dd(DB::getQueryLog());
        //     print_r($reader_id);
        //    die;
            if($reader_id){
                foreach($reader_id as $key=>$value){
                    $email = User::select('email','first_name')
                        ->where('id', $value) 
                        ->first();
                    if (!empty($email)) {
                        $subject = "KNLS Book Subscription Expire Message";
                        $body = array(
                            'username'=>$email->first_name,
                            'title' => "Your knls book subscription expire soon!",
                            'description' => "knls book subscription expire in 4 day",
                            'subject_class'=>'knls book subscription expire in 4 day',
                        );
                        $to = $email->email;
                        email('subscription', $body, $subject, $to);
                    }
                }
            }             
                   
            Log::Info('contentSubscribedEndEmailNotification');
            
          
            // return api_response(200, 'successfully.', $update_subscribed);
        
        } catch (\Exception $ex) {
            Log::Info('content Subscribed End Email Notification exceptions');
            Log::Info($ex->getMessage());
            return api_response(201, 'Content Subscribed End Email Notification exceptions');
        }
    }

}
