<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Feedback;
use App\Models\Content;
use App\Models\Readercontents;
use App\User;
use Validator;
use Illuminate\Support\Facades\DB;

Class FeedbackController extends Controller{

    private $url;
    function __construct()
    {
        // $this->middleware('auth:api');
        $this->url = url().'/files/feedback';
    }
    public function addFeedback(Request $request){
        // $req= $request->all();
         try{
            $validator = Validator::make($request->all(), [
                'feedback_for' => 'required',
                'feedback' => '',
                'feedback_for_id' => '',
                'stars' => '',
                'name' => 'required',
                'mobile' => 'required',
                'subject' => 'required',
                'attachment_file' =>''
            ]);
            if ($validator->fails()) {
                return api_response(201, 'field is required',$validator->errors());
            }

            // $userInfo = User::where('id', Auth::id())
            // ->select(
            //     'first_name',
            //     'last_name',
            //     'mobile')->first();      
            // $fullname= $userInfo->first_name." ".$userInfo->last_name;

            $data_array = array(
                'feedback_for' => $request->feedback_for,
                'feedback' => $request->feedback,
                'feedback_for_id' => $request->feedback_for_id,
                'user_id' => Auth::id(),
                'stars' => $request->stars,
                'name' => $request->name,
                'mobile' => $request->mobile,
                'subject' => $request->subject,
                'attachment_file' =>$this->uploadImage($request, "attachment_file"),
            );

            $result = Feedback::create($data_array);
            if($result){
                return api_response(200, 'Your feedback has been recorded. Thank you for choosing v.tabu.');
            }else{
                return api_response(201, 'add feedback error');
            }
      
          }catch (\Exception $ex) {
                return api_response(201, 'add feedback exception',$ex);
          
         }
    }

    public function uploadImage($request, $imageData){
        $file_input_name = $imageData;
        $image_cover_url= null;
        if ($request->hasFile($file_input_name)) {
            $destinationPath = base_path().'/public/files/feedback';
            $image = $request->file($imageData);
            $name = uniqid().'.'.$image->getClientOriginalExtension();
            $result = $image->move($destinationPath, $name);
            $image_cover_url = $name;
        }
        
        return $image_cover_url;
    }

    public function getFeedback(Request $request){
        // echo $request;
        try{
            $feedback = Feedback::where(function ($query){
                if(Auth::user()->user_type == 'publisher'){
                    $contentIds = DB::table('contents')->where('publisher_id',Auth::id())->pluck('content_id')->all();
                    if(count($contentIds)>0){
                        $query->whereIn('feedback_for_id',$contentIds);    
                    }
                    
                }elseif(Auth::user()->user_type == 'reader' || Auth::user()->user_type == 'junior_reader'){
                    $query->where('user_id',Auth::id());
                };
            })
            ->orderby('created_at','desc')
            ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);

            $feedback->each(function ($feed) {
                    $content = DB::table('contents')->where('content_id',$feed->feedback_for_id)->first();
                    if(isset($feed->attachment_file) && ($feed->attachment_file != '')){
                        $feed->attachment_path = get_site_public_path('files/feedback/'.$feed->attachment_file); 
                    }else{
                        $feed->attachment_path = ''; 
                    }
                    if($content){
                        $feed->content_title =  $content->title;   
                        $content_owner = get_user_detail($content->publisher_id); 
                        $feed->content_owner = $content_owner->username;                                           
                    }
            });
            if($feedback){
                return api_response(200, 'get feedback detail.',$feedback);
            }else{
                return api_response(201, 'get feedback detail error');
            }
        }catch (\Exception $ex) {
            return api_response(201, 'get feedback exception',$ex);
        }
    }

    public function getFeedbackContentList(Request $request){
        // echo $request->feedback_for;
        try{
            $feedback = Content::select('contents.content_id','contents.title','contents.publisher_id')
                ->join('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                ->where('reader_contents.is_reading', 1) 
                ->where('reader_contents.reader_id', Auth::id()) 
                ->where('contents.status', 'published')    
                ->get();
            $feedback = $feedback->unique();
            // print_r($feedback);
            Log::Info('getcontentlistfeedback');
            // Log::Info(print_r($feedback,true));
            if($feedback){
                return api_response(200, 'get feedback content list.',$feedback);
            }else{
                return api_response(201, 'get feedback content list error');
            }
        }catch (\Exception $ex) {
            return api_response(201, 'get feedback content list exception',$ex);
        }
    }

}