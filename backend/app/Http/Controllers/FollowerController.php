<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\JWTAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
// use Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Comment;
use App\Models\Follower;
use App\User;

class FollowerController extends Controller
{
    private $maxResults;
    function __construct()
    {
        $this->maxResults = maxresult();
    }

    public function getfollower(Request $request)
    {
        try {
            $result = DB::table('followers')
                ->join('users', 'users.id', '=', 'followers.user_id')
                ->select('followers.is_follow', 'users.first_name', 'users.last_name', 'users.email')
                ->where('publisher_id', Auth::id())->paginate($this->maxResults);
            return api_response(200, "get follower list", $result);
        } catch (\Exception $ex) {
            Log::Info('Get follower list exception');
            Log::Info($ex);
            return api_response(201, "Execption in get follower list", $ex->getMessage());
        }
    }
    public function follow(Request $request)
    {
        try {
            $query = DB::table('followers');
            $count = $query->where([
                'user_id' => $request->reader_id,
                'publisher_id' => $request->publisher_id,
            ]);
            if ($count->count() > 0) {
                $result = $count->first();
                $is_follow =  ($result->is_follow == 1) ? 0 : 1;
                $query->where([
                    'user_id' => $request->reader_id,
                    'publisher_id' => $request->publisher_id,
                ])->update(['is_follow' => $is_follow]);
            } else {
                $query->insert([
                    'user_id' => $request->reader_id,
                    'publisher_id' => $request->publisher_id,
                    'is_follow' => 1
                ]);
            }
           $publisher = get_user_detail($request->publisher_id);
           $publisher_name = '';
           if($publisher){
               $publisher_name=$publisher->username;
           }
            return api_response(200, "Followed publisher $publisher_name", $query->first());
        } catch (\Exception $ex) {
            Log::Info('follow publisher exception');
            Log::Info($ex->getMessage());
            return api_response(201, "follow publisher exception", $ex->getMessage());
        }
    }
    public function getfollowpublisher(Request $request)
    {
        try {
            $follower = follower::select('follower_id', 'publisher_id', 'user_id', 'is_follow')->where(['user_id'=> Auth::id(),'is_follow'=>1])->paginate($this->maxResults);
            // Log::Info($follower);
            // $follower->each(function ($follow) {
            foreach( $follower as $key => $follow){
                $result = User::select('user_image as profile_image', 'users.*')->join('user_detail', 'user_detail.user_id', '=', 'users.id')->where(['id' => $follow->publisher_id])->first();//, 'user_type' => 'publisher'
                if (!empty($result->id)) {
                    $follow->publisher_id = $result->id;
                    $follow->first_name = $result->first_name;
                    $follow->last_name = $result->last_name;
                    $follow->email = $result->email;
                    $follow->profile_image = $result->profile_image;
                }else{
                    unset($follower[$key]);
                }
            }
            $pagination = array(
                'current_page' => $follower->currentPage(),
                'total' => $follower->total(),
                'lastPage' => $follower->lastPage(),
                'per_page' => $follower->perPage(),
                'next_page' => ($follower->lastPage() < $follower->currentPage() + 1) ? null : $follower->lastPage(),
                'path' => $follower->path(),
            );
            // foreach()
            return api_response(200, "your followed publisher", ['data' => $follower->items(), 'pagination' => $pagination]);
        } catch (\Exception $ex) {
            return api_response(201, "followed publisher exception", $ex->getMessage());
        }
    }
    public function allpublisher(Request $request)
    {
        try {

            $result = User::select('users.id as publisher_id','user_image as profile_image', 'users.first_name', 'users.last_name', 'users.email')->join('user_detail', 'user_detail.user_id', '=', 'users.id')->where(['user_type' => 'publisher'])->paginate();
            $result->each(function($res){
                $is_follow =follower::where(['publisher_id'=>$res->publisher_id,'user_id'=>Auth::id()])->pluck('is_follow')->first();
                $res->no_of_follower = follower::where('publisher_id',$res->publisher_id)->count();
                $res->is_follow = (!empty($is_follow))?$is_follow:0;
            });
            $pagination = array(
                'current_page' => $result->currentPage(),
                'total' => $result->total(),
                'lastPage' => $result->lastPage(),
                'per_page' => $result->perPage(),
                'next_page' => ($result->lastPage() < $result->currentPage() + 1) ? null : $result->lastPage(),
                'path' => $result->path(),
            );
            // foreach()
            return api_response(200, "All publisher list", ['data' => $result->items(), 'pagination' => $pagination]);
        } catch (\Exception $ex) {
            return api_response(201, "All publisher list exception", $ex->getMessage());
        }
    }
}
