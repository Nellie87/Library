<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;
use App\Models\Preference;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReaderController extends Controller
{
    private $url;
    public function __construct()
    {
        $this->url = url() . '/files/profile';
    }
    public function myaccount($id)
    {
        try {
            $account = User::where('id', $id)
                ->join('user_detail', 'user_detail.user_id', '=', 'users.id')
                ->select(
                    'title',
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
                    'country_code',
                    'user_image'
                )->get();

            return response()->json(["data" => $account]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex]);
        }
    }
    public function update($id, Request $request)
    {
        $req = $request->all();
        try {
            $updateDetail = array(
                "gender" => $req["gender"],
                "dob" => $req["dob"],
                "address" => $req["address"],
                "city" => $req["city"],
                "identification_number" => $req["identification_number"],
                "country" => $req["country"]
            );
            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "user",
                "module_id" => Auth::id(),
                "activity" => "update detail",
                "platform" => "mobile",
                "device_id" => "",
                "useragent" => ""
            );
            $old = DB::table('user_detail')->Where(['user_id' => Auth::id()])->first();
            $new = $updateDetail;
            $return = audit($audit_data, $old, $new);
            if ($req["user_image"]) {
                $file_data = $req["user_image"];
                $file_name = 'image_' . time() . '.png'; //generating unique file name;
                file_put_contents('files/profile/' . $file_name, base64_decode($file_data));
                $updateDetail["user_image"] = $file_name;
            }
          
            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "user",
                 "module_id" => Auth::id(),
                "activity" => "update",
                "platform" => "mobile",
                "device_id" => "",
                "useragent" => ""
            );
            $old = DB::table('users')->Where(['id' => Auth::id()])->first();
            $new =array(
                "title" => $req["title"],
                "first_name" => $req["first_name"],
                "middle_name" => $req["middle_name"],
                "last_name" => $req["last_name"],
                "email" => $req["email"],
                "country_code" => $req["country_code"],
                "mobile" => $req["mobile"],
            );
            $return = audit($audit_data, $old, $new);
            $update = User::where(['id' => $id])->update([
                "title" => $req["title"],
                "first_name" => $req["first_name"],
                "middle_name" => $req["middle_name"],
                "last_name" => $req["last_name"],
                "email" => $req["email"],
                "country_code" => $req["country_code"],
                "mobile" => $req["mobile"],
            ]);
            // $update->
            $userDetail = DB::table('user_detail')->where('user_id', $id)->update($updateDetail);

            $upadatedData = User::join('user_detail', 'user_detail.user_id', '=', 'users.id')
                ->select(
                    'id',
                    'title',
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
                    'country_code',
                    'user_image'
                )
                ->where('user_id', Auth::id())
                ->first();
            return $this->apiResponse(200, 'update successfully', $upadatedData);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex]);
        }
    }
    public function preferences(Request $request)
    {
        try {
            $interest = array();
            $intr = $request->interest;
            foreach ($intr as $value) {
                if ($value['value'] == 1) {
                    $arr[] = $value['id'];
                }
            }
            $areainterest = implode(",", $arr);
            $update = array(
                "interest_categories" => $areainterest,
                "time_zone" => $request->timezone,
                "affiliation" => $request->checkbox
            );
            $pref = DB::table('user_detail')->Where(['user_id' => $request->user_id])->update($update);


            $getpreferance = DB::table('user_detail')->Where(['user_id' => $request->user_id])->first();
            $category = DB::table('categories')->get();
            $area_of_interest = explode(",", $getpreferance->interest_categories);
            foreach ($category as $key => $value) {
                $ischecked = (in_array($value->category_id, $area_of_interest)) ? 1 : 0;
                array_push($interest, array("id" => $value->category_id, "key" => $value->category_name, "value" => $ischecked));
            }
            $data = array(
                'interest' => $interest,
                'timezone' => ($getpreferance->time_zone) ? $getpreferance->time_zone : null,
                'checkbox' => ($getpreferance->affiliation) ? $getpreferance->affiliation : 0,
            );
            return $this->apiResponse(200, 'Preference add successfully', $data);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex]);
        }
    }
    public function preferencesShow($id)
    {
        try {
            $interest = array();
            $preferenceCheck = DB::table('user_detail')
                ->select('user_id', 'affiliation', 'interest_categories as area_of_interest', 'time_zone')
                ->Where('user_id', $id)->first();
            $category = DB::table('categories')->get();
            $area_of_interest = explode(",", $preferenceCheck->area_of_interest);
            foreach ($category as $key => $value) {
                $ischecked = (in_array($value->category_id, $area_of_interest)) ? 1 : 0;
                array_push($interest, array("id" => $value->category_id, "key" => $value->category_name, "value" => $ischecked));
            }


            $data = array(
                'user_id' => ($preferenceCheck->user_id) ? $preferenceCheck->user_id : (int)$id,
                'interest' => $interest,
                'timezone' => ($preferenceCheck->time_zone) ? $preferenceCheck->time_zone : null,
                'checkbox' => ($preferenceCheck->affiliation) ? $preferenceCheck->affiliation : 0,
            );

            return $this->apiResponse(200, 'Preference fetch', $data);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex]);
        }
    }
}
