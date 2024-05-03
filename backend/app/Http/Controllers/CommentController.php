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

class CommentController extends Controller
{
    public function __construct()
    {
    }

    public function getContentComments($content_id = "")
    {
        
        $comments = DB::table('comments')
            ->where(function ($query) use ($content_id) {
                if (!empty($content_id)) {
                    $query->where('comments.content_id', $content_id);
                }
            })
            ->select('comments.comment_id', 'comments.comment', 'comments.rating', 'comments.user_id', 'comments.created_at')
              ->orderby('comments.created_at','desc')
            ->get();
        $comments->each(function ($comment) {
            $comment->created_on = get_date_format($comment->created_at);
            $comment->commenter = get_user_detail($comment->user_id);
            $comment->commenter->user_type = ucfirst($comment->commenter->user_type);
        });
        if ($comments) {
            return $comments;
        }
    }
    public function getComments($content_id)
    {
        try {
            $record=array();
            $comments = DB::table('comments')
                ->where(function ($query) use ($content_id) {
                    if (!empty($content_id)) {
                        $query->where('comments.content_id', $content_id);
                        $query->where('comments.user_id','!=',Auth::id() );
                    }
                })
                ->select('comments.comment_id', 'comments.comment', 'comments.rating', 'comments.user_id', 'comments.created_at')
                ->get();
            $comments->each(function ($comment) {
                $comment->rating=  number_format($comment->rating, 1, '.', '');
                $comment->created_on = get_date_format($comment->created_at);
                $comment->commenter = get_user_detail($comment->user_id);
                $comment->commenter->user_type = ucfirst($comment->commenter->user_type);
            });
            $record['commentbyother']=$comments;

            $comments = DB::table('comments')
                ->where(function ($query) use ($content_id) {
                    if (!empty($content_id)) {
                        $query->where('comments.content_id', $content_id);
                        $query->where('comments.user_id',Auth::id() );
                    }
                })
                ->select('comments.comment_id', 'comments.comment', 'comments.rating', 'comments.user_id', 'comments.created_at')
                        ->orderby('comments.created_at','desc')
                ->get();
            $comments->each(function ($comment) {
                $comment->rating=  number_format($comment->rating, 1, '.', '');
                $comment->created_on = get_date_format($comment->created_at);
                $comment->commenter = get_user_detail($comment->user_id);
                $comment->commenter->user_type = ucfirst($comment->commenter->user_type);
            });
            $record['Commentbyme']=$comments;
            // dd($record);
            return api_response('200', "All Comments Fetch", $record);
        } catch (\Exception $ex) {
            return response()->json(['error' => 'get Comments exception']);
        }
    }

    public function postContentComment(Request $request)
    {

        try {
            $comment_array = array(
                'comment' => $request->message,
                'rating' => $request->rating,
                'content_id' => $request->content_id,
                'user_id' => Auth::id(),

            );
            $result = Comment::insert($comment_array);
            if ($result) {
                return $this->apiResponse(200, 'Your comment has been added', $result);
            } else {
                return $this->apiResponse(201, 'Unable to add comment');
            }
        } catch (\Exception $ex) {
            Log::Info($ex);
            return api_response(201, 'add Comment exception');
        }
    }
}
