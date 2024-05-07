<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Controllers\BookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Content;
use Validator;
use ZipArchive;
use Illuminate\Support\Facades\DB;
use App\User;
use App\Models\ContentViews;
use App\Models\Categories;
use App\Models\Rating;
use App\Models\Comment;
use App\Models\Transaction;
use App\Models\MembershipSubscription;
use App\Models\Loggedin;
use App\Models\Readercontents;

class DashboardController extends Controller
{

    private $url;
    private $trending;
    private $maxResults;
    function __construct(BookController $Books)
    {
        // $this->middleware('auth:api');
        $this->url = url() . '/image';
        $this->trending = $Books->trendingQuery();
        $this->maxResults = maxresult();
    }
    public function dashboard($id)
    {
        try {
            $where = array(
                'publisher_id' => Auth::id()
            );
            $classes = DB::table('classes')->select('class_id', 'class_name', 'class_title_s', 'class_title_p')->get();
            if ($classes) {
                $classes->each(function ($class) {
                    $class->class_name = $class->class_name;
                    $class->total_content_count =  Content::Where('class_id', $class->class_id)
                        ->where('publisher_id', Auth::id())
                        ->where('temp_record', '!=', 1)
                        ->where('is_deleted', 0)
                        ->count();
                });
            }
            return $this->apiResponse(
                200,
                'successfully fetch',
                [
                    "classes" => $classes,
                    "top_selling" => $this->selling(),
                    "newRelease" => $this->newRelease(),
                    'revenue' => $this->transaction()
                ]
            );
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()]);
        }
    }

  function kidsCorner()
    {
        DB::enableQueryLog();
        // $quries = DB::getQueryLog();
        // dd($quries);
        $data = array();
        $catalog = Content::leftjoin('users', 'users.id', '=', 'contents.author_id')
            ->select(
                'contents.title as title',
                'contents.category_id',
                'contents.publisher_id',
                'contents.description',
                'contents.content_type',
                'contents.class_id',
                'contents.image_cover',
                'contents.image_index',
                'contents.images_other',
                'contents.content_id',
                'contents.content_id as encrypted_content_id'
            )->where(['contents.is_deleted' => 0])
            ->whereIn('content_reader',['junior'])
            ->orderBy('content_id', 'DESC')->paginate($this->maxResults);

        foreach ($catalog as $key => $value) :
            $cover = $value->image_cover;
            if (!empty($cover)) {
                $cover = get_content_files_path($cover);
            }
            $image_index = $value->image_index;
            if (!empty($image_index)) {
                $image_index = get_content_files_path($image_index);
            }
            $images_other = $value->images_other;
            if (!empty($images_other)) {
                $images_other = get_content_files_path($images_other);
            }
            $class_detail = get_class_detail($value->class_id);
            array_push(
                $data,
                array(
                    "content_id" => $value->content_id,
                    'encrypted_content_id' => $value->encrypted_content_id,
                    'title' => $value->title,
                    'author' => $value->first_name,
                    'description' => $value->description,
                    'publisher_id' => $value->publisher_id,
                    "category_id" => $value->category_id,
                    "class_id" => $value->class_id,
                    "class_title_s" => $class_detail->class_title_s,
                    "class_name" => $class_detail->class_name,
                    "content_type" => $value->content_type,
                    "content_price" => $value->content_price,
                    "image_cover" =>  $cover,
                    "main_content_image" => $cover,
                    "image_index" => $image_index,
                    "images_other" => $images_other,
                    "rating" => $this->rating($value->content_id)
                )
            );
        endforeach;
        return $data;
    }

    public function newRelease()
    {
        DB::enableQueryLog();
        // $quries = DB::getQueryLog();
        // dd($quries);
        $data = array();
        $catalog = Content::leftjoin('users', 'users.id', '=', 'contents.author_id')
            ->select(
                'contents.title as title',
                'contents.category_id',
                'contents.publisher_id',
                'contents.description',
                'contents.content_type',
                'contents.class_id',
                'contents.image_cover',
                'contents.image_index',
                'contents.images_other',
                'contents.content_id',
                'contents.content_id as encrypted_content_id'
            )->where('contents.publisher_id', "=", Auth::id())->where(['contents.is_deleted' => 0])->orderBy('content_id', 'DESC')->take(10)->get();

        foreach ($catalog as $key => $value) :
            $cover = $value->image_cover;
            if (!empty($cover)) {
                $cover = get_content_files_path($cover);
            }
            $image_index = $value->image_index;
            if (!empty($image_index)) {
                $image_index = get_content_files_path($image_index);
            }
            $images_other = $value->images_other;
            if (!empty($images_other)) {
                $images_other = get_content_files_path($images_other);
            }
            $class_detail = get_class_detail($value->class_id);
            array_push(
                $data,
                array(
                    "content_id" => $value->content_id,
                    'encrypted_content_id' => $value->encrypted_content_id,
                    'title' => $value->title,
                    'author' => $value->first_name,
                    'description' => $value->description,
                    'publisher_id' => $value->publisher_id,
                    "category_id" => $value->category_id,
                    "class_id" => $value->class_id,
                    "class_title_s" => $class_detail->class_title_s,
                    "class_name" => $class_detail->class_name,
                    "content_type" => $value->content_type,
                    "content_price" => $value->content_price,
                    "image_cover" =>  $cover,
                    "main_content_image" => $cover,
                    "image_index" => $image_index,
                    "images_other" => $images_other,
                    "rating" => $this->rating($value->content_id)
                )
            );
        endforeach;
        return $data;
    }
    public function transaction()
    {

        $last = \Carbon\Carbon::now()->subWeek()->format('Y-m-d');  // returns 2016-02-03
        $current = \Carbon\Carbon::now()->format('Y-m-d');  // returns 2016-02-10

        $tnx = Transaction::join('orders', 'orders.transaction_id', '=', 'transactions.transaction_id')
            ->join('contents', 'contents.content_id', '=', 'orders.order_for_id')
            ->select(DB::raw('SUM(transactions.total_amount) as sum'))
            ->whereRaw('transactions.created_at BETWEEN "' . $last . '" and "' . $current . '" ')
            ->where('contents.publisher_id', "=", Auth::id())->get();

        $date = \Carbon\Carbon::today()->subDays(7);
        $pdate = \Carbon\Carbon::today()->subDays(14);
        $previoustnx = Transaction::join('orders', 'orders.transaction_id', '=', 'transactions.transaction_id')
            ->join('contents', 'contents.content_id', '=', 'orders.order_for_id')
            ->select(DB::raw('SUM(transactions.total_amount) as sum'))
            ->whereRaw('transactions.created_at BETWEEN "' . $pdate . '" and "' . $date . '" ')
            ->where('contents.publisher_id', "=", Auth::id())->get();

        $prev = ($previoustnx[0]->sum != null) ? $previoustnx[0]->sum : 0;
        $thisweek = ($tnx[0]->sum != null) ? $tnx[0]->sum : 0;

        return array("thisWeek" => $thisweek, "previousWeek" => $prev);
    }
    public function rating($id)
    {
        $return = DB::table('comments')->where('content_id', $id)->avg('rating');
        return ($return) ? round($return, 1) : 0;
    }
    public function selling()
    {
        $where = [];
        $data = [];
        DB::enableQueryLog();
        // $catalog =  Readercontents::
        $catalog = Content::rightjoin('content_views', 'content_views.content_id', '=', 'contents.content_id')->select(
            'contents.*',
            'content_views.*',
            'contents.content_id as encrypted_content_id'
        )->where('contents.publisher_id', Auth::id())->where(['contents.is_deleted' => 0])->orderby('content_views.views', 'DESC')->paginate($this->maxResults);
        $quries = DB::getQueryLog();
        //     dd($quries);

        $pagination = array(
            'current_page' => $catalog->currentPage(),
            'total' => $catalog->total(),
            'lastPage' => $catalog->lastPage(),
            'per_page' => $catalog->perPage(),
            'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? NULL : $catalog->lastPage(),
            'path' => $catalog->path(),

        );
        foreach ($catalog as $key => $value) :
            $cover = $value->image_cover;
            if (!empty($cover)) {
                $cover = get_content_files_path($cover);
            }
            $image_index = $value->image_index;
            if (!empty($image_index)) {
                $image_index = get_content_files_path($image_index);
            }
            $images_other = $value->images_other;
            if (!empty($images_other)) {
                $images_other = get_content_files_path($images_other);
            }
             $class_detail = get_class_detail($value->class_id);
            array_push(
                $data,
                array(
                    "content_id" => $value->content_id,
                    'encrypted_content_id' => $value->encrypted_content_id,
                    'title' => $value->title,
                    'description' => $value->description,
                    'publisher_id' => $value->publisher_id,
                    "category_id" => $value->category_id,
                    "class_id" => $value->class_id,
                    "class_title_s" => $class_detail->class_title_s,
                    "class_name" => $class_detail->class_name,
                    "content_type" => $value->content_type,
                    "content_price" => $value->content_price,
                    "image_cover" => $cover,
                    "main_content_image" => $cover,
                    "image_index" => $image_index,
                    "images_other" => $images_other,
                    "tags" => $value->tags,
                    "status" => $value->status,
                    "rating" => $this->rating($value->content_id)
                )
            );
        endforeach;
        array_reverse($data);
        return $data;
    }


    public function admin_dashboard(Request $request)
    {
        try {
            Log::Info('Admin dashboard');
            DB::enableQueryLog();
            $classes = DB::table('classes')->select('class_id', 'class_name', 'class_title_s', 'class_title_p')
                ->get();
            if ($request->filter) {
                Log::Info('filter:' . $request->filter);
            }
       if ($classes) {
                    $classes->each(function ($class) use($request){
                        $class->class_name = $class->class_name;
                        $class->class_title_s = $class->class_title_s;
                        if(!empty($request->filter)){
                            $class->price = $this->transactionbyclass($class->class_id,$request->filter);
                        }
                        $query = Content::Where('contents.class_id', $class->class_id)
                            ->where('contents.temp_record', '!=', 1)
                            ->where('contents.is_deleted', 0);
                         if ($request->filter == "week") {
                              $thisWeekStart = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');   // returns 2016-02-03
                            $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');   // returns 2016-02-10
                          $class->total_content_count = $query->whereBetween(DB::raw("DATE(contents.created_at)"), [$thisWeekStart, $thisWeekEnd])->count();
                         } else if ($request->filter == "month") {
                              $thismonthStart = \Carbon\Carbon::now()->month;
                                 $class->total_content_count =  $query->whereMonth(DB::raw("DATE(contents.created_at)"), $thismonthStart)->count();
                         }else if ($request->filter == "year") {
                             $thisyearStart = \Carbon\Carbon::now()->year;
                             $class->total_content_count = $query->whereYear(DB::raw("DATE(contents.created_at)"), $thisyearStart)->count();
                         }else{
                             $class->total_content_count =  $query->count();
                         }
                      
                    });
                }
            

            // Log::Info(print_r(DB::getQueryLog(),true));

            return api_response(
                200,
                'successfully fetch',
                [
                    "classes" => $classes,
                    "users" => $this->user($request),
                    "graph" => $this->graph($request),
                    'revenue' => $this->admin_transaction($request),
                    'graph_user' => $this->graph_new_user($request),
                    'book_revenue' => $this->admin_book_transaction($request),
                    'user_loggedin' => $this->admin_user_count($request),
                    'loggedin' => $this->loggedin($request),
                    'circle_graph'=>$this->circle_graph($request),
                ]
            );
        } catch (\Exception $ex) {
            Log::Info('admin dashboard exceptions');
            Log::Info($ex);
            return api_response(201, 'admin dashboard exceptions');
        }
    }

    public function admin_transaction($request)
    {

        $query = Transaction::select(DB::raw('SUM(transactions.total_amount) as sum'))
                ->join('orders as co','co.transaction_id','=','transactions.transaction_id')
                ;
        if(!empty($request->financial_filter_by) && !empty($request->financial_filter_by_data)){
            switch($request->financial_filter_by){
                case "readers":
                   $query->where('co.user_id',$request->financial_filter_by_data);
                    break;
                case "publishers":
                    $query->join('contents','contents.content_id','co.content_id')
                        ->where('contents.publisher_id',$request->financial_filter_by_data);
                    break;
                case "contents":
                     $query->join('contents','contents.content_id','co.content_id')
                        ->where('contents.content_id',$request->financial_filter_by_data);
                    break;
            }
        }
        $previoustnx = '';
        if ($request->filter == "week") {
            $last = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
            $current = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10

            $date = \Carbon\Carbon::today()->subDays(7);
            $pdate = \Carbon\Carbon::today()->subDays(14);

            $tnx = $query
                ->whereRaw('transactions.created_at BETWEEN "' . $last . '" and "' . $current . '" ')
                ->get();

            $previoustnx = $query
                ->whereRaw('transactions.created_at BETWEEN "' . $pdate . '" and "' . $date . '" ')
                ->get();
        } else if ($request->filter == "month") {
            $thismonthStart = \Carbon\Carbon::now()->month;
            $prevmonthStart = \Carbon\Carbon::now()->subMonth()->format('m');

            $tnx = $query
                ->whereMonth(DB::raw("DATE(transactions.created_at)"), $thismonthStart)
                ->get();

            $previoustnx = $query
                ->whereMonth(DB::raw("DATE(transactions.created_at)"), $prevmonthStart)
                ->get();
        } else if ($request->filter == "year") {
            $thisyearStart = \Carbon\Carbon::now()->year;
            $prevyearStart = \Carbon\Carbon::now()->subYear()->format('y');

            $tnx = $query
                ->whereYear(DB::raw("DATE(transactions.created_at)"), $thisyearStart)
                ->get();

            $previoustnx = $query
                ->whereYear(DB::raw("DATE(transactions.created_at)"), $prevyearStart)
                ->get();
        }

        $prev = (!empty($previoustnx[0]) && !empty($previoustnx[0]->sum)) ? $previoustnx[0]->sum : 0;
        $thisweek = (!empty($tnx[0]) && !empty($tnx[0]->sum)) ? $tnx[0]->sum : 0;

        return array("thisWeek" => $thisweek, "previousWeek" => $prev);
    }

    public function admin_book_transaction($request)
    {

        $thisWeekquery =   $prevWeekquery = Transaction::join('orders', 'orders.transaction_id', '=', 'transactions.transaction_id')
            ->join('contents', 'contents.content_id', '=', 'orders.order_for_id')
            ->select(DB::raw('SUM(transactions.total_amount) as sum'));
        if (!empty($request->filter)) {
            if ($request->filter == "week") {
                $last = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
                $current = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10

                $date = \Carbon\Carbon::today()->subDays(7);
                $pdate = \Carbon\Carbon::today()->subDays(14);

                $thisWeekquery = $thisWeekquery
                    ->whereRaw('transactions.created_at BETWEEN "' . $last . '" and "' . $current . '" ')
                    ->first();
                $prevWeekquery = $prevWeekquery
                    ->whereRaw('transactions.created_at BETWEEN "' . $pdate . '" and "' . $date . '" ')
                    ->first();
            } else if ($request->filter == "month") {
                $thismonthStart = \Carbon\Carbon::now()->month;
                $prevmonthStart = \Carbon\Carbon::now()->subMonth()->format('m');

                $thisWeekquery = $thisWeekquery
                    ->whereMonth(DB::raw("DATE(transactions.created_at)"), $thismonthStart)
                    ->first();
                $prevWeekquery = $prevWeekquery
                    ->whereMonth(DB::raw("DATE(transactions.created_at)"), $prevmonthStart)
                    ->first();
            } else if ($request->filter == "year") {
                $thisyearStart = \Carbon\Carbon::now()->year;
                $prevyearStart = \Carbon\Carbon::now()->subYear()->format('y');

                $thisWeekquery = $thisWeekquery
                    ->whereYear(DB::raw("DATE(transactions.created_at)"), $thisyearStart)
                    ->first();
                $prevWeekquery = $prevWeekquery
                    ->whereYear(DB::raw("DATE(transactions.created_at)"), $prevyearStart)
                    ->first();
            }
        }


        $prevWeek = (!empty($prevWeekquery->sum)) ? $prevWeekquery->sum : 0;
        $thisweek = (!empty($thisWeekquery->sum)) ? $thisWeekquery->sum : 0;

        return array("thisWeek" => $thisweek, "previousWeek" => $prevWeek);
    }

    public function transactionbyclass($class_id, $request)
    {
        $query = Transaction::join('orders', 'orders.transaction_id', '=', 'transactions.transaction_id')
            ->join('contents', 'contents.content_id', '=', 'orders.order_for_id')
            ->select(DB::raw('SUM(transactions.total_amount) as sum'))
            ->where('contents.class_id', "=", $class_id);

        if ($request == "week") {
            $last = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
            $current = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10
            $tnx =  $query
                ->whereRaw('transactions.created_at BETWEEN "' . $last . '" and "' . $current . '" ')
                ->get();
        } else if ($request == "month") {
            $thismonthStart = \Carbon\Carbon::now()->month;
            $tnx =  $query
                ->whereMonth(DB::raw("DATE(transactions.created_at)"), $thismonthStart)
                ->get();
        } else if ($request == "year") {
            $thisyearStart = \Carbon\Carbon::now()->year;
            $tnx =  $query
                ->whereYear(DB::raw("DATE(transactions.created_at)"), $thisyearStart)
                ->get();
        }
        $thisweek = ($tnx[0]->sum != null) ? $tnx[0]->sum : 0;
        return $thisweek;
    }

    public function user($request)
    {
        Log::Info('user details');
        // Log::Info(print_r($request->all(),true));
        $thisWeekStart = "";
        $thisWeekEnd = "";
        $thismonthStart = "";
        $thisyearStart = "";
        if ($request->filter == "week") {
            $thisWeekStart = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
            $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10
        } else if ($request->filter == "month") {
            $thismonthStart = \Carbon\Carbon::now()->month;
        } else if ($request->filter == "year") {
            $thisyearStart = \Carbon\Carbon::now()->year;
        }
        $total_user =  User::Where('user_type', '!=', 'admin')
            ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
                if (!empty($request->filter)) {
                    if ($request->filter == "week") {
                        $query->whereBetween(DB::raw("DATE(users.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                    } else if ($request->filter == "month") {
                        $query->whereMonth(DB::raw("DATE(users.created_at)"), $thismonthStart);
                    } else if ($request->filter == "year") {
                        $query->whereYear(DB::raw("DATE(users.created_at)"), $thisyearStart);
                    }
                }
            })
            ->count();
        $subscribed_users =  MembershipSubscription::leftjoin('users', 'users.id', '=', 'member_subscription.user_id')
            ->leftjoin('user_detail', 'user_detail.user_id', '=', 'member_subscription.user_id')
            ->where('member_subscription.end_date','>=',date('Y-m-d'))
            ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
                if ($request->filter == "week") {
                    $query->whereBetween(DB::raw("DATE(member_subscription.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(member_subscription.created_at)"), $thismonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(member_subscription.created_at)"), $thisyearStart);
                }
            })
            ->count();
        $active_user =  User::Where('user_type', '!=', 'admin')
            ->Where("is_deleted", '!=', 1)
            ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
                if ($request->filter == "week") {
                    $query->whereBetween(DB::raw("DATE(users.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(users.created_at)"), $thismonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(users.created_at)"), $thisyearStart);
                }
            })
            ->count();
        $non_subscribed_users =  $total_user - $subscribed_users;
        $users_array = array(
            "total_user" => $total_user,
            "subscribed_users" => $subscribed_users,
            "non_subscribed_users" => $non_subscribed_users,
            "active_user" => $active_user
        );

        return $users_array;
    }

    public function graph($request)
    {

        $thisWeekStart = "";
        $thisWeekEnd = "";
        $thismonthStart = "";
        $week_sub = array();
        $week_new_user = array();
        $days = array();
        if ($request->filter == "week" || $request->from_date || $request->to_date) {
            if ($request->filter == "week") {
                $thisWeekStart = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
                $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10
            } else {
                $thisWeekStart = $request->from_date;  // returns 2016-02-03
                $thisWeekEnd = $request->to_date;  // returns 2016-02-10
            }


            $new_subscribe_user =  MembershipSubscription::select(
                DB::raw("DATE(member_subscription.created_at) as Date"),
                DB::raw("count(*) as count")
            )
                ->leftjoin('users', 'users.id', '=', 'member_subscription.user_id')
                ->leftjoin('user_detail', 'user_detail.user_id', '=', 'member_subscription.user_id')
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->where('member_subscription.end_date','>=',date('Y-m-d'));
                    $query->Where("users.is_deleted", '!=', 1);
                    if ($request->filter == "week" || $request->from_date || $request->to_date) {
                        $query->whereBetween(DB::raw("DATE(member_subscription.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                    }
                    if ($request->filter == "month") {
                        $query->whereMonth("member_subscription.created_at", $thismonthStart);
                    }
                })
                ->groupBy(DB::raw("DATE(member_subscription.created_at)"))
                ->get();

            if ($new_subscribe_user && $request->filter == "week") {
                $new_subscribe_user->each(function ($sub) {
                    $sub->Date = date('D', strtotime($sub->Date));
                });
            }

            $new_user = User::select(
                DB::raw("DATE(users.created_at) as Date"),
                DB::raw("count(*) as count")
            )
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->Where('user_type', '!=', 'admin');
                    $query->Where("is_deleted", '!=', 1);
                    if ($request->filter == "week" || $request->from_date || $request->to_date) {
                        $query->whereBetween(DB::raw("DATE(users.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                    }
                    if ($request->filter == "month") {
                        $query->whereMonth("users.created_at", $thismonthStart);
                    }
                })

                ->groupBy(DB::raw("DATE(users.created_at)"))
                ->get();

            if ($new_user && $request->filter == "week") {
                $new_user->each(function ($new) {
                    $new->Date = date('D', strtotime($new->Date));
                });
            }

            if ($request->filter == "week") {
                $days = array('Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat');

                for ($i = 0; $i < count($days); $i++) {
                    $array = json_decode(json_encode($new_subscribe_user), true);
                    $key = array_search($days[$i], array_column($array, 'Date'));
                    $week_sub[] = ($key !== false) ? $array[$key]['count'] : 0;
                }

                for ($i = 0; $i < count($days); $i++) {
                    $array = json_decode(json_encode($new_user), true);
                    $key = array_search($days[$i], array_column($array, 'Date'));
                    $week_new_user[] = ($key !== false) ? $array[$key]['count'] : 0;
                }
            } else if ($request->from_date || $request->to_date) {


                foreach ($new_subscribe_user as $user) {
                    $week_sub[] = $user->count;
                }

                foreach ($new_user as $user) {
                    $week_new_user[] = $user->count;
                }
            }
        } else if ($request->filter == "month") {
            $thismonthStart = \Carbon\Carbon::now()->month;

            $new_subscribe_user =  MembershipSubscription::select(
                DB::raw("count(*) as count")
            )
                ->leftjoin('users', 'users.id', '=', 'member_subscription.user_id')
                ->leftjoin('user_detail', 'user_detail.user_id', '=', 'member_subscription.user_id')
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->where('member_subscription.end_date','>=',date('Y-m-d'));
                    $query->Where("users.is_deleted", '!=', 1);
                    if ($request->filter == "month") {
                        $query->whereMonth("member_subscription.created_at", $thismonthStart);
                    }
                })
                ->get();

            $new_user = User::select(
                DB::raw("count(*) as count")
            )
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->Where('user_type', '!=', 'admin');
                    $query->Where("is_deleted", '!=', 1);
                    if ($request->filter == "month") {
                        $query->whereMonth("users.created_at", $thismonthStart);
                    }
                })
                ->get();

            $month = array('JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC');
            for ($i = 0; $i < count($month); $i++) {
                if ($i == ($thismonthStart - 1)) {
                    $days[] = $month[$i];
                }
            }


            foreach ($new_subscribe_user as $user) {
                $week_sub[] = $user->count;
            }

            foreach ($new_user as $user) {
                $week_new_user[] = $user->count;
            }
        } else if ($request->filter == "year") {
            $thisyearStart = \Carbon\Carbon::now()->year;
            // print_r($thismonthStart);
            $new_subscribe_user =  MembershipSubscription::select(
                DB::raw("count(*) as count")
            )
                ->leftjoin('users', 'users.id', '=', 'member_subscription.user_id')
                ->leftjoin('user_detail', 'user_detail.user_id', '=', 'member_subscription.user_id')
                ->where(function ($query) use ($request, $thisyearStart) {
                    $query->where('member_subscription.end_date','>=',date('Y-m-d'));
                    $query->Where("users.is_deleted", '!=', 1);
                    if ($request->filter == "year") {
                        $query->whereYear("member_subscription.created_at", $thisyearStart);
                    }
                })
                ->get();

            $new_user = User::select(
                DB::raw("count(*) as count")
            )
                ->where(function ($query) use ($request, $thisyearStart) {
                    $query->Where('user_type', '!=', 'admin');
                    $query->Where("is_deleted", '!=', 1);
                    if ($request->filter == "year") {
                        $query->whereYear("users.created_at", $thisyearStart);
                    }
                })
                ->get();
            $days = array($thisyearStart);

            foreach ($new_subscribe_user as $user) {
                $week_sub[] = $user->count;
            }

            foreach ($new_user as $user) {
                $week_new_user[] = $user->count;
            }
        }

        return array("subscribe_user" => $week_sub, "new_user" => $week_new_user, "labels" => $days);
    }

    public function graph_new_user($request)
    {
        $this_new_subscribe_user = 0;
        $this_new_user = 0;
        $prev_new_subscribe_user = 0;
        $prev_new_user = 0;
        $thisWeekStart = "";
        $thisWeekEnd = "";
        $date = "";
        $pdate = "";
        $thismonthStart = "";
        $prevmonthStart = "";
        $thisyearStart = "";
        $prevyearStart = "";
        if ($request->filter == "week") {

            $thisWeekStart = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
            $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10

            $date = \Carbon\Carbon::today()->subDays(7);
            $pdate = \Carbon\Carbon::today()->subDays(14);
        } else if ($request->filter == "month") {
            $thismonthStart = \Carbon\Carbon::now()->month;
            $prevmonthStart = \Carbon\Carbon::now()->subMonth()->format('m');
        } else if ($request->filter == "year") {
            $thisyearStart = \Carbon\Carbon::now()->year;
            $prevyearStart = \Carbon\Carbon::now()->subYear()->format('y');
        }

        $this_new_subscribe_user =  MembershipSubscription::leftjoin('users', 'users.id', '=', 'member_subscription.user_id')
            ->leftjoin('user_detail', 'user_detail.user_id', '=', 'member_subscription.user_id')
            ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
                $query->where('member_subscription.end_date','>=',date('Y-m-d'));
                $query->Where("users.is_deleted", '!=', 1);
                if ($request->filter == "week" || $request->from_date || $request->to_date) {
                    $query->whereBetween(DB::raw("DATE(member_subscription.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(member_subscription.created_at)"), $thismonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(member_subscription.created_at)"), $thisyearStart);
                }
            })
            ->count();
        $prev_new_subscribe_user =  MembershipSubscription::leftjoin('users', 'users.id', '=', 'member_subscription.user_id')
            ->leftjoin('user_detail', 'user_detail.user_id', '=', 'member_subscription.user_id')
            ->where(function ($query) use ($request, $pdate, $date, $prevmonthStart, $prevyearStart) {
                $query->where('member_subscription.end_date','>=',date('Y-m-d'));
                $query->Where("users.is_deleted", '!=', 1);
                if ($request->filter == "week" || $request->from_date || $request->to_date) {
                    $query->whereBetween(DB::raw("DATE(member_subscription.created_at)"), [$pdate, $date]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(member_subscription.created_at)"), $prevmonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(member_subscription.created_at)"), $prevyearStart);
                }
            })
            ->count();



        $this_new_user = User::where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
            $query->Where('user_type', '!=', 'admin');
            $query->Where("is_deleted", '!=', 1);
            if ($request->filter == "week" || $request->from_date || $request->to_date) {
                $query->whereBetween(DB::raw("DATE(users.created_at)"), [$thisWeekStart, $thisWeekEnd]);
            } else if ($request->filter == "month") {
                $query->whereMonth(DB::raw("DATE(users.created_at)"), $thismonthStart);
            } else if ($request->filter == "year") {
                $query->whereYear(DB::raw("DATE(users.created_at)"), $thisyearStart);
            }
        })
            ->count();

        $prev_new_user = User::where(function ($query) use ($request, $pdate, $date, $prevmonthStart, $prevyearStart) {
            $query->Where('user_type', '!=', 'admin');
            $query->Where("is_deleted", '!=', 1);
            if ($request->filter == "week" || $request->from_date || $request->to_date) {
                $query->whereBetween(DB::raw("DATE(users.created_at)"), [$pdate, $date]);
            } else if ($request->filter == "month") {
                $query->whereMonth(DB::raw("DATE(users.created_at)"), $prevmonthStart);
            } else if ($request->filter == "year") {
                $query->whereYear(DB::raw("DATE(users.created_at)"), $prevyearStart);
            }
        })
            ->count();



        return array("thisWeek_sub_user" => $this_new_subscribe_user, "previousWeek_sub_user" => $prev_new_subscribe_user, "thisWeek_new_user" => $this_new_user, "previousWeek_new_user" => $prev_new_user);
    }
    public function homepage()
    {
        try {
            $where = [];
            $data = [];
            DB::enableQueryLog();
            // $catalog =  Readercontents::
            $catalog = Content::rightjoin('content_views', 'content_views.content_id', '=', 'contents.content_id')->select(
                'contents.*',
                'content_views.*',
                'contents.content_id as encrypted_content_id'
            )->where(['contents.is_deleted' => 0])->orderby('content_views.views', 'DESC')->paginate($this->maxResults);
            $quries = DB::getQueryLog();
            //     dd($quries);

            $pagination = array(
                'current_page' => $catalog->currentPage(),
                'total' => $catalog->total(),
                'lastPage' => $catalog->lastPage(),
                'per_page' => $catalog->perPage(),
                'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? NULL : $catalog->lastPage(),
                'path' => $catalog->path(),

            );
            foreach ($catalog as $key => $value) :
                $cover = $value->image_cover;
                if (!empty($cover)) {
                    $cover = get_content_files_path($cover);
                }
                $image_index = $value->image_index;
                if (!empty($image_index)) {
                    $image_index = get_content_files_path($image_index);
                }
                $images_other = $value->images_other;
                if (!empty($images_other)) {
                    $images_other = get_content_files_path($images_other);
                }
                   $class_detail = get_class_detail($value->class_id);
              
                array_push(
                    $data,
                    array(
                        "content_id" => $value->content_id,
                        'encrypted_content_id' => $value->encrypted_content_id,
                        'title' => $value->title,
                        'description' => $value->description,
                        'publisher_id' => $value->publisher_id,
                        "category_id" => $value->category_id,
                        "class_id" => $value->class_id,
                        "class_title_s" => $class_detail->class_title_s,
                        "class_name" => $class_detail->class_name,
                        "content_type" => $value->content_type,
                        "content_price" => $value->content_price,
                        "image_cover" => $cover,
                        "main_content_image" => $cover,
                        "image_index" => $image_index,
                        "images_other" => $images_other,
                        "tags" => $value->tags,
                        "status" => $value->status,
                        "rating" => $this->rating($value->content_id)
                    )
                );
            endforeach;
            array_reverse($data);

            return $this->apiResponse(
                200,
                'successfully fetch',
                [

                    "top_selling" => $data,
                    "newRelease" => $this->newRelease(),
                    "kids_corner" => $this->kidsCorner(),
                ]
            );
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()]);
        }
    }
    public function read(){
        $data=[];
        $catalog = Content::join('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
            ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'reader_contents.*')
            // ->Where(['reader_contents.reader_id' => $reader_id])
            ->where('is_reading', 1)->orderBy('reader_contents.updated_at', 'desc')
            ->limit(10)->get();
        // Log::Info(print_r($catalog, true));
        foreach ($catalog as $key => $value) :
            $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';

            array_push(
                $data,
                array(
                    "content_id" => $value->content_id,
                    "encrypted_content_id" => $value->encrypted_content_id,
                    'title' => $value->title,
                    'description' => $value->description,
                    'publisher_id' => $value->publisher_id,
                    "category_id" => $value->category_id,
                    "author" => array(
                        "author_id" => $value->author_id,
                        "author_name" => $value->author_name,
                    ),
                    "class_id" => $value->class_id,
                    "content_type" => $value->content_type,
                    "content_price" => $value->content_price,
                    "main_content_image" => $cover,
                    "tags" => $value->tags,
                    "status" => $value->status,
                    "reader_id" => $value->reader_id,
                    "is_reading" => ($value->is_reading == 1) ? 1 : 0,
                    "total_length" => $value->total_length,
                    "total_duration" => $value->total_duration,
                    "read_duration" => $value->read_duration,
                    "upload_content" =>  get_content_files_path($value->upload_content),
                  
                )
            );
        endforeach;
        return $data;
    }
    public function admin_user_count(Request $request){
       
        $thisWeekStart = "";
        $thisWeekEnd = "";
        $thismonthStart = "";
        $week_sub = array();
        $week_new_user = array();
        $days = array();
        if ($request->filter == "week" || $request->from_date || $request->to_date) {
            if ($request->filter == "week") {
                $thisWeekStart = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
                $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10
            } else {
                $thisWeekStart = $request->from_date;  // returns 2016-02-03
                $thisWeekEnd = $request->to_date;  // returns 2016-02-10
            }


            $new_subscribe_user =  Loggedin::select(
                DB::raw("DATE(login_activities.created_at) as Date"),
                DB::raw("count(*) as count")
            )
                ->leftjoin('users', 'users.id', '=', 'login_activities.user_id') 
                ->Where("users.user_type", '=', 'publisher')
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->Where("users.is_deleted", '!=', 1);
                    if ($request->filter == "week" || $request->from_date || $request->to_date) {
                        $query->whereBetween(DB::raw("DATE(login_activities.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                    }
                    if ($request->filter == "month") {
                        $query->whereMonth("login_activities.created_at", $thismonthStart);
                    }
                })
                ->groupBy(DB::raw("DATE(login_activities.created_at)"))
                ->get();

            if ($new_subscribe_user && $request->filter == "week") {
                $new_subscribe_user->each(function ($sub) {
                    $sub->Date = date('D', strtotime($sub->Date));
                });
            }

            $new_user =Loggedin::select(
                DB::raw("DATE(login_activities.created_at) as Date"),
                DB::raw("count(*) as count")
            )
                ->leftjoin('users', 'users.id', '=', 'login_activities.user_id')
                ->Where("users.user_type", '=', 'reader')
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->Where("users.is_deleted", '!=', 1);
                    
                    if ($request->filter == "week" || $request->from_date || $request->to_date) {
                        $query->whereBetween(DB::raw("DATE(login_activities.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                    }
                    if ($request->filter == "month") {
                        $query->whereMonth("login_activities.created_at", $thismonthStart);
                    }
                })
                ->groupBy(DB::raw("DATE(login_activities.created_at)"))
                ->get();

            if ($new_subscribe_user && $request->filter == "week") {
                $new_subscribe_user->each(function ($sub) {
                    $sub->Date = date('D', strtotime($sub->Date));
                });
            }

            if ($new_user && $request->filter == "week") {
                $new_user->each(function ($new) {
                    $new->Date = date('D', strtotime($new->Date));
                });
            }

            if ($request->filter == "week") {
                $days = array('Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat');

                for ($i = 0; $i < count($days); $i++) {
                    $array = json_decode(json_encode($new_subscribe_user), true);
                    $key = array_search($days[$i], array_column($array, 'Date'));
                    $week_sub[] = ($key !== false) ? $array[$key]['count'] : 0;
                }

                for ($i = 0; $i < count($days); $i++) {
                    $array = json_decode(json_encode($new_user), true);
                    $key = array_search($days[$i], array_column($array, 'Date'));
                    $week_new_user[] = ($key !== false) ? $array[$key]['count'] : 0;
                }
            } else if ($request->from_date || $request->to_date) {


                foreach ($new_subscribe_user as $user) {
                    $week_sub[] = $user->count;
                }

                foreach ($new_user as $user) {
                    $week_new_user[] = $user->count;
                }
            }
        } else if ($request->filter == "month") {
            $thismonthStart = \Carbon\Carbon::now()->month;

            $new_subscribe_user =  Loggedin::select(
                DB::raw("count(*) as count")
            )
                ->leftjoin('users', 'users.id', '=', 'login_activities.user_id')
                ->Where("users.user_type", '=', 'publisher')
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->Where("users.is_deleted", '!=', 1);
                    if ($request->filter == "month") {
                        $query->whereMonth("login_activities.created_at", $thismonthStart);
                    }
                })
                ->get();

            $new_user = Loggedin::select(
                DB::raw("count(*) as count")
            )
            ->leftjoin('users', 'users.id', '=', 'login_activities.user_id')
            ->Where("users.user_type", '=', 'reader')
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart) {
                    $query->Where('user_type', '!=', 'admin');
                    $query->Where("is_deleted", '!=', 1);
                    if ($request->filter == "month") {
                        $query->whereMonth("login_activities.created_at", $thismonthStart);
                    }
                })
                ->get();

            $month = array('JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC');
            for ($i = 0; $i < count($month); $i++) {
                if ($i == ($thismonthStart - 1)) {
                    $days[] = $month[$i];
                }
            }


            foreach ($new_subscribe_user as $user) {
                $week_sub[] = $user->count;
            }

            foreach ($new_user as $user) {
                $week_new_user[] = $user->count;
            }
        } else if ($request->filter == "year") {
            $thisyearStart = \Carbon\Carbon::now()->year;
            // print_r($thismonthStart);
            $new_subscribe_user =  Loggedin::select(
                DB::raw("count(*) as count")
            )
                ->leftjoin('users', 'users.id', '=', 'login_activities.user_id')
                ->Where("users.user_type", '=', 'publisher')
                ->where(function ($query) use ($request, $thisyearStart) {
                    $query->Where("users.is_deleted", '!=', 1);
                    if ($request->filter == "year") {
                        $query->whereYear("login_activities.created_at", $thisyearStart);
                    }
                })
                ->get();

            $new_user = Loggedin::select(
                DB::raw("count(*) as count")
            )
            ->leftjoin('users', 'users.id', '=', 'login_activities.user_id')
            ->Where("users.user_type", '=', 'reader')
                ->where(function ($query) use ($request, $thisyearStart) {
                    $query->Where('user_type', '!=', 'admin');
                    $query->Where("is_deleted", '!=', 1);
                    if ($request->filter == "year") {
                        $query->whereYear("login_activities.created_at", $thisyearStart);
                    }
                })
                ->get();
            $days = array($thisyearStart);

            foreach ($new_subscribe_user as $user) {
                $week_sub[] = $user->count;
            }

            foreach ($new_user as $user) {
                $week_new_user[] = $user->count;
            }
        }
      
        return array('thismonthStart'=>$thismonthStart,"subscribe_user" => $week_sub, "new_user" => $week_new_user, "labels" => $days);
    }
    public function loggedin($request)
    {
        $this_publisher = 0;
        $this_reader = 0;
        $prev_publisher= 0;
        $prev_reader = 0;
        $thisWeekStart = "";
        $thisWeekEnd = "";
        $date = "";
        $pdate = "";
        $thismonthStart = "";
        $prevmonthStart = "";
        $thisyearStart = "";
        $prevyearStart = "";
        if ($request->filter == "week") {

            $thisWeekStart = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
            $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10

            $date = \Carbon\Carbon::today()->subDays(7);
            $pdate = \Carbon\Carbon::today()->subDays(14);
        } else if ($request->filter == "month") {
            $thismonthStart = \Carbon\Carbon::now()->month;
            $prevmonthStart = \Carbon\Carbon::now()->subMonth()->format('m');
        } else if ($request->filter == "year") {
            $thisyearStart = \Carbon\Carbon::now()->year;
            $prevyearStart = \Carbon\Carbon::now()->subYear()->format('y');
        }

        $this_publisher =  Loggedin::leftjoin('users', 'users.id', '=', 'login_activities.user_id')
            ->Where("users.user_type", '=', 'publisher')
            ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
               
                $query->Where("users.is_deleted", '!=', 1);
                if ($request->filter == "week" || $request->from_date || $request->to_date) {
                    $query->whereBetween(DB::raw("DATE(login_activities.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(login_activities.created_at)"), $thismonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(login_activities.created_at)"), $thisyearStart);
                }
            })
            ->count();
        $prev_publisher =  Loggedin::leftjoin('users', 'users.id', '=', 'login_activities.user_id')
        ->Where("users.user_type", '=', 'publisher')
            ->where(function ($query) use ($request, $pdate, $date, $prevmonthStart, $prevyearStart) {
               
                $query->Where("users.is_deleted", '!=', 1);
                if ($request->filter == "week" || $request->from_date || $request->to_date) {
                    $query->whereBetween(DB::raw("DATE(login_activities.created_at)"), [$pdate, $date]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(login_activities.created_at)"), $prevmonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(login_activities.created_at)"), $prevyearStart);
                }
            })
            ->count();



        $this_reader = Loggedin::leftjoin('users', 'users.id', '=', 'login_activities.user_id')
        ->Where("users.user_type", '=', 'reader')
        ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
            $query->Where('user_type', '!=', 'admin');
            $query->Where("is_deleted", '!=', 1);
            if ($request->filter == "week" || $request->from_date || $request->to_date) {
                $query->whereBetween(DB::raw("DATE(login_activities.created_at)"), [$thisWeekStart, $thisWeekEnd]);
            } else if ($request->filter == "month") {
                $query->whereMonth(DB::raw("DATE(login_activities.created_at)"), $thismonthStart);
            } else if ($request->filter == "year") {
                $query->whereYear(DB::raw("DATE(login_activities.created_at)"), $thisyearStart);
            }
        })
            ->count();

        $prev_reader = Loggedin::leftjoin('users', 'users.id', '=', 'login_activities.user_id')
        ->Where("users.user_type", '=', 'reader')->where(function ($query) use ($request, $pdate, $date, $prevmonthStart, $prevyearStart) {
            $query->Where('user_type', '!=', 'admin');
            $query->Where("is_deleted", '!=', 1);
            if ($request->filter == "week" || $request->from_date || $request->to_date) {
                $query->whereBetween(DB::raw("DATE(login_activities.created_at)"), [$pdate, $date]);
            } else if ($request->filter == "month") {
                $query->whereMonth(DB::raw("DATE(login_activities.created_at)"), $prevmonthStart);
            } else if ($request->filter == "year") {
                $query->whereYear(DB::raw("DATE(login_activities.created_at)"), $prevyearStart);
            }
        })
            ->count();



        return array("thisWeek_publisher" => $this_publisher, "previousWeek_publisher" => $prev_publisher, "thisWeek_reader" => $this_reader, "previousWeek_reader" => $prev_reader);
    }
    public function circle_graph(Request $request)
    {
        try {
            $thisWeekStart = "";
            $thisWeekEnd = "";
            $date = "";
            $pdate = "";
            $thismonthStart = "";
            $prevmonthStart = "";
            $thisyearStart = "";
            $prevyearStart = "";
            if ($request->filter == "week") {

                $thisWeekStart = \Carbon\Carbon::now()->startOfWeek()->format('Y-m-d');  // returns 2016-02-03
                $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek()->format('Y-m-d');  // returns 2016-02-10

                $date = \Carbon\Carbon::today()->subDays(7);
                $pdate = \Carbon\Carbon::today()->subDays(14);
            } else if ($request->filter == "month") {
                $thismonthStart = \Carbon\Carbon::now()->month;
                $prevmonthStart = \Carbon\Carbon::now()->subMonth()->format('m');
            } else if ($request->filter == "year") {
                $thisyearStart = \Carbon\Carbon::now()->year;
                $prevyearStart = \Carbon\Carbon::now()->subYear()->format('y');
            }
            DB::enableQueryLog();

            $reading_book = Readercontents::leftjoin('users','users.id','=','reader_contents.reader_id')->
                rightjoin('contents','contents.content_id','=','reader_contents.content_id')->where('is_reading', 1)
                ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
                    $query->Where("users.is_deleted", '!=', 1);
                    if($request->financial_filter_by=='readers'){
                        $query->Where("reader_contents.reader_id", '=', $request->financial_filter_by_data);
                    }
                    if($request->financial_filter_by=='publishers'){
                        $query->Where("contents.publisher_id", '=', $request->financial_filter_by_data);
                    }
                    
                    if ($request->filter == "week" || $request->from_date || $request->to_date) {
                        $query->whereBetween(DB::raw("DATE(reader_contents.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                    } else if ($request->filter == "month") {
                        $query->whereMonth(DB::raw("DATE(reader_contents.created_at)"), $thismonthStart);
                    } else if ($request->filter == "year") {
                        $query->whereYear(DB::raw("DATE(reader_contents.created_at)"), $thisyearStart);
                    }
                })->count();

            $borrow = Readercontents::rightjoin('contents','contents.content_id','=','reader_contents.content_id')->where(['content_type'=>'free'])
            ->where('no_of_copies','>',0)
            ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
                $query->Where("contents.is_deleted", '!=', 1);
                if($request->financial_filter_by=='readers'){
                    $query->Where("reader_contents.reader_id", '=', $request->financial_filter_by_data);
                }
                if($request->financial_filter_by=='publishers'){
                    $query->Where("contents.publisher_id", '=', $request->financial_filter_by_data);
                }
                if ($request->filter == "week" || $request->from_date || $request->to_date) {
                    $query->whereBetween(DB::raw("DATE(reader_contents.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(reader_contents.created_at)"), $thismonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(reader_contents.created_at)"), $thisyearStart);
                }
            })->count();
            $purchased = Readercontents::rightjoin('contents','contents.content_id','=','reader_contents.content_id')->where(['content_type'=>'paid'])
            ->where('no_of_copies','>',0)
            ->where(function ($query) use ($request, $thisWeekStart, $thisWeekEnd, $thismonthStart, $thisyearStart) {
                $query->Where("contents.is_deleted", '!=', 1);
                if($request->financial_filter_by=='readers'){
                    $query->Where("reader_contents.reader_id", '=', $request->financial_filter_by_data);
                }
                if($request->financial_filter_by=='publishers'){
                    $query->Where("contents.publisher_id", '=', $request->financial_filter_by_data);
                }
                if ($request->filter == "week" || $request->from_date || $request->to_date) {
                    $query->whereBetween(DB::raw("DATE(reader_contents.created_at)"), [$thisWeekStart, $thisWeekEnd]);
                } else if ($request->filter == "month") {
                    $query->whereMonth(DB::raw("DATE(reader_contents.created_at)"), $thismonthStart);
                } else if ($request->filter == "year") {
                    $query->whereYear(DB::raw("DATE(reader_contents.created_at)"), $thisyearStart);
                }
            })->count();
                // dd(DB::getQueryLog()); // Show results of log
            return ['reading_book'=> $reading_book,'borrow'=>$borrow,'purchased'=>$purchased];
        } catch (\Exception $ex) {
            Log::Info('circle graph exception' . $ex->getMessage());
            return api_response(201, 'Circle graph exception',$ex->getMessage());
        }
    }
}
