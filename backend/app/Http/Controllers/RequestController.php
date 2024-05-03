<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Requests;
use App\Models\RequestReply;
use App\User;
use Validator;

class RequestController extends Controller
{
    public function addRequest(Request $request)
    {
        // $req= $request->all();
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required',
                'description' => 'required',
                'subject_class' => 'required'
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required', $validator->errors());
            }

            $data_array = array(
                'title' => $request->title,
                'description' => $request->description,
                'subject_class' => $request->subject_class,
                'user_id' => Auth::id()
            );

            $result = Requests::create($data_array);
            if ($result) {
                if (!empty($request->subject_class)) {
                    $reason = '';
                    // $emailRecord = User::select('email')->whereIn('user_type', ['admin']) ->where('contents.content_id', $request->content_id)->first();
                    $subject = "Request for help";
                    
                    $body = array(
                        'title' => $request->title,
                        'description' => $request->description,
                        'subject_class' => $request->subject_class,
                    );
                    $emails = User::whereIn('user_type', ['admin'])->pluck('email')->all();
                    email('request', $body, $subject, $emails);
                }
                return api_response(200, 'Your request has been recorded. Thank you for choosing v.tabu.', $result);
            } else {
                return api_response(201, 'Add Requests error');
            }
        } catch (\Exception $ex) {
            return api_response(201, 'Add Requests exception', $ex);
        }
    }

    public function getRequest(Request $request)
    {
        // echo $request;
        try {
            $requests = Requests::select(
                'request_id',
                'requests.title',
                'requests.description',
                'requests.user_id',
                'requests.subject_class',
                'requests.is_deleted',
                'users.first_name',
                'users.last_name'
            )
                ->join('users', 'id', '=', 'requests.user_id')
                ->where('requests.is_deleted', '!=', 1)
                ->where(function ($query) {
                    if (Auth::user()->user_type == 'publisher') {
                        $query->where('user_id', Auth::id());
                    } elseif (Auth::user()->user_type == 'reader') {
                        $query->where('user_id', Auth::id());
                    };
                })
                ->orderby('requests.created_at', 'desc')
                ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);

            if ($requests) {
                $requests->each(function ($req) {
                    $req->total_reply =  RequestReply::Where('request_id', $req->request_id)
                        ->count();
                });
            }

            Log::Info('Requests');
            // Log::Info(print_r($requests, true));
            if ($requests) {
                return api_response(200, 'Get requests detail.', $requests);
            } else {
                return api_response(201, 'get requests detail error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get requests exception' . $ex);
            return api_response(201, 'Get requests exception', $ex);
        }
    }

    public function deleteRequest(Request $request)
    {
        try {
            Log::Info('deleteRequest');
            // Log::Info(print_r(Auth::user(), true));
            $requestId = $request->request_id;

            $data = array(
                "is_deleted" => 1
            );

            $deleteRequest = DB::table('requests')->whereIn('request_id', $requestId)->update($data);

            Log::Info('deleteRequest');
            // Log::Info(print_r($deleteRequest, true));
            if ($deleteRequest) {
                return api_response(200, 'Request successfully deleted', $deleteRequest);
            } else {
                return api_response(201, 'Delete Request error');
            }
        } catch (\Exception $ex) {
            Log::Info('Delete Request exceptions'.$ex->getMessage());
            return api_response(201, 'Delete Request exceptions');
        }
    }

    public function addRequestReply(Request $request)
    {
        // $req= $request->all();
        try {
            $validator = Validator::make($request->all(), [
                'request_id' => 'required',
                'reply_message' => 'required',
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required', $validator->errors());
            }

            $data_array = array(
                'request_id' => $request->request_id,
                'reply_message' => $request->reply_message,
                'reply_user_id' => Auth::id(),
            );

            $result = RequestReply::create($data_array);
            if ($result) {
                if (!empty($request->reply_message)) {
                    $reason = '';
                    $emailRecord = Requests::select('users.id','users.email','requests.title','requests.description')->join('users','users.id','=','requests.user_id')->where('request_id',$request->request_id)->first();
                    $subject = "Request reply";
                    
                    $body = array(
                        'title' => $emailRecord->title,
                        'description' => $emailRecord->description,
                        'subject_class'=>'',
                        'reply' => $request->reply_message,
                    );
                    $user='';
                    if ($emailRecord->id==Auth::id()) {
                        $emails = User::whereIn('user_type', ['admin'])->pluck('email')->all();
                    }
                    else{
                        $emails= $emailRecord->email;
                    }
                    if (!empty($user)) {
                        email('request', $body, $subject, $emails);
                    }
                }
                return api_response(200, 'You reply has been sent', $result);
            } else {
                return api_response(201, 'Add Reply error');
            }
        } catch (\Exception $ex) {
            Log::Info('Add Reply exception'.$ex->getMessage());
            return api_response(201, 'Add Reply exception');
        }
    }

    public function viewReplyComments(Request $request)
    {
        // echo $request;
        try {
            $requests = RequestReply::where('request_id', '=', $request->request_id)->get();
            if ($requests) {
                $requests->each(function ($req) {
                    $req->name =  User::select('first_name', 'last_name')
                        ->Where('id', $req->reply_user_id)
                        ->first();
                });
            }

            Log::Info('viewReplyComments');
            // Log::Info(print_r($requests, true));
            if ($requests) {
                return api_response(200, 'Get Reply Comments.', $requests);
            } else {
                return api_response(201, 'get Reply Comments error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get Reply Comments exception' . $ex->getMessage());
            return api_response(201, 'Get Reply Comments exception');
        }
    }
}
