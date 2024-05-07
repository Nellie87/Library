<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Audit;
use Illuminate\Support\Facades\DB;
use App\Models\Categories;
use Illuminate\Support\Facades\Log;
use App\Models\Content;
use App\Models\Classes;
use App\User;
use App\Models\Authors;

class AuditController extends Controller
{
    private $maxResults;
    function __construct()
    {
        $this->maxResults = maxresult();
    }
    public function index(Request $request){
        try{
            $category_id_arry = json_decode($request->category_id, true);
            if (is_array($category_id_arry) && count($category_id_arry) > 0) {
                $categories = implode(',', $category_id_arry);
            }
            $return = get_categories(explode(",",$categories));
            // $data = array();
            // foreach($return as $key=>$value){
            //     $data[] = $value->category_name;
            // }
            // $cat = implode(", ",$data);
            // print_r($return);
            return api_response(200,'get categories list',$return);
        }
        catch(\Exception $ex){
            return api_response(200,$ex->getMessage());
        }
       
    }
    public function get(Request $request)
    {
        try {

            DB::enableQueryLog();
            $get = Audit::select('audit_id', 'module', 'module_id', 'user_id', 'activity', 'platform', 'created_at as created_on')

                ->where(function ($query) use ($request) {
                    if (!empty($request->module)) {
                        $module = str_replace("-", " ", $request->module);
                        $query->where('module', $module);
                    }

                    if (!empty($request->activity)) {
                        $request->current_page = 1;
                        $query->where('activity', $request->activity);
                    }


                    if ($request->filter == "week") {
                        $thisWeekStart = \Carbon\Carbon::now()->startOfWeek();  // returns 2016-02-03
                        $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek();  // returns 2016-02-10         
                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $request->current_page = 1;
                            $query->whereBetween('created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                        }
                    } else if ($request->filter == "month") {
                        $thismonthStart = \Carbon\Carbon::now()->month;

                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $request->current_page = 1;
                            $query->whereBetween('created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                        }
                    } else if ($request->filter == "year") {
                        $thisyearStart = \Carbon\Carbon::now()->year;
                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $request->current_page = 1;
                            $query->whereYear(DB::raw("DATE(contents.created_at)"), $thisyearStart);
                        }
                    } else {
                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $request->current_page = 1;
                            $query->whereBetween('created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                        }
                    }
                  

                })
                ->orderBy('audit_id', 'desc')->paginate($request->per_page_limit);
                Log::Info(print_r(DB::getQueryLog(),true));
            $get->each(function ($fetch) {
                $fetch->detail = $this->audit_detail($fetch);
                $fetch->user_detail = $this->userdetail($fetch->user_id);
                if (!empty($fetch->module_id)) {
                    switch ($fetch->module) {
                        case "DRM settings":
                            $content_id =  DB::table('content_drm_settings')->where('setting_id', $fetch->module_id)->pluck('content_id')->first();
                            $fetch->module_detail = $content = Content::where('content_id', $content_id)
                                ->select('contents.*', 'contents.content_id as encrypted_content_id')
                                ->first();
                              if($content){
                                $fetch->module_title = $content->title;
                              }
                            break;
                        case "Content":
                            $fetch->module_detail = $content = Content::where('content_id', $fetch->module_id)
                                ->select('contents.*', 'contents.content_id as encrypted_content_id')
                                ->first();
                            if($content){
                                $fetch->module_title = $content->title;
                            }
                            
                            break;
                        case "User":
                            $result = DB::table('users')
                                ->where('id', $fetch->module_id)
                                ->first();
                            if ($result) {
                                $fetch->module_detail = $result;
                                if (!empty($result->last_name)) {
                                    $fetch->module_title = $result->first_name . ' ' . $result->last_name;
                                } else {
                                    $fetch->module_title = $result->first_name;
                                }
                            }

                            break;

                        case "Transaction":
                            $transaction = DB::table('transactions')
                            ->where('transaction_id', $fetch->module_id)
                            ->join('payment_methods','payment_methods.payment_methods_id','=','transactions.payment_method')
                            ->select('transactions.*','payment_methods.payment_title','payment_methods.payment_key')
                            ->first();
                            if($transaction){
                                $fetch->module_detail = $transaction;
                                $fetch->module_title = $transaction->payment_for;
                            }
                            
                            break;
                    }
                }
            });
         
            return api_response(200, "Get audit list", $get);
        } catch (\Exception $ex) {
            Log::Info('Get Audit exception');
            Log::Info($ex);
            return api_response(201, "Execption in get audit");
        }
    }
    public function audit_detail($audit)
    {
        $audit_details = DB::table('audit_detail')
            ->where(['audit_id' => $audit->audit_id])
            ->get();
        $audit_details->each(function ($audit_detail) use ($audit) {

            if ($audit->module == 'Content' && $audit->activity == 'search') {
                switch ($audit_detail->table_column) {
                    case "categories":
                        if (!empty($audit_detail->new_value)) {
                            if (strpos($audit_detail->new_value, ',') !== false) {
                                $cats = explode(',', $audit_detail->new_value);
                                $cats_titles = [];
                                foreach ($cats as $cat) {
                                    $cats_titles[] = Categories::where('category_id', $cat)->pluck('category_name')->first();
                                }
                                $audit_detail->new_value = implode(', ', $cats_titles);
                            } else {
                                $audit_detail->new_value = Categories::where('category_id', $audit_detail->new_value)->pluck('category_name')->first();
                            }
                        }
                        if (!empty($audit_detail->old_value)) {
                            if (!empty($audit_detail->old_value)) {
                                if (strpos($audit_detail->old_value, ',') !== false) {
                                    $cats = explode(',', $audit_detail->old_value);
                                    $cats_titles = [];
                                    foreach ($cats as $cat) {
                                        $cats_titles[] = Categories::where('category_id', $cat)->pluck('category_name')->first();
                                    }
                                    $audit_detail->old_value = implode(', ', $cats_titles);
                                } else {
                                    $audit_detail->old_value =  Categories::where('category_id', $audit_detail->old_value)->pluck('category_name')->first();
                                }
                            }
                        }
                        break;
                    case "classes":
                        if (!empty($audit_detail->new_value)) {
                            $audit_detail->new_value = Classes::where('class_id', $audit_detail->new_value)->pluck('class_title_s')->first();
                        }
                        if (!empty($audit_detail->old_value)) {
                            $audit_detail->old_value = Classes::where('class_id', $audit_detail->old_value)->pluck('class_title_s')->first();
                        }
                        break;
                    case "publisher":
                        if (!empty($audit_detail->new_value)) {
                            $user = User::where('id', $audit_detail->new_value)->select('first_name', 'last_name')->first();
                            if (!empty($user->first_name)) {
                                $audit_detail->new_value = $user->first_name;
                            }
                            if (!empty($user->first_name) && !empty($user->last_name)) {
                                $audit_detail->new_value = $user->first_name . ' ' . $user->last_name;
                            }
                        }
                        if (!empty($audit_detail->old_value)) {
                            $user = User::where('id', $audit_detail->old_value)->select('first_name', 'last_name')->first();
                            if (!empty($user->first_name)) {
                                $audit_detail->old_value = $user->first_name;
                            }
                            if (!empty($user->first_name) && !empty($user->last_name)) {
                                $audit_detail->old_value = $user->first_name . ' ' . $user->last_name;
                            }
                        }
                        break;

                    case "author":
                        if (!empty($audit_detail->new_value)) {
                            $audit_detail->new_value = DB::table('authors')->where('authors_id', $audit_detail->new_value)->pluck('author_name')->first();
                        }
                        if (!empty($audit_detail->old_value)) {
                            $audit_detail->old_value = DB::table('authors')->where('authors_id', $audit_detail->old_value)->pluck('author_name')->first();
                        }
                        break;
                }
            }else if ($audit->module == 'Transaction'){
                  switch ($audit_detail->table_column) {
                      case "user_id":
                           $user = User::where('id', $audit_detail->new_value)->select('first_name', 'last_name')->first();
                            if (!empty($user->first_name)) {
                                $audit_detail->new_value = $user->first_name;
                            }
                            if (!empty($user->first_name) && !empty($user->last_name)) {
                                $audit_detail->new_value = $user->first_name . ' ' . $user->last_name;
                            }
                          break;
                            case "content_id":
                           $title = Content::where('content_id', $audit_detail->new_value)->pluck('title')->first();
                            if (!empty($title)) {
                                $audit_detail->new_value = $title;
                            }
                          break;
                  }
            }
        });

        return $audit_details;
    }
    public function userdetail($user_id)
    {
        $user = DB::table('users')->where(['id' => $user_id])->first();

        return array(
            'username' => (!empty($user->first_name)) ? $user->first_name . ' ' . $user->last_name : '',
            // 'user_type' => $user->user_type,
        );
    }
    public function search_keyword(Request $request)
    {
        try {
            DB::enableQueryLog();
            $audit = Audit::join('audit_detail', 'audit_detail.audit_id', '=', 'audit.audit_id')->select('new_value as keyword')->distinct()
                ->where(function ($query) use ($request) {
                    if (!empty($request->search)) {
                        $request->current_page = 1;
                        if ($request->search == 'categories') {
                            $category = $this->category();
                            foreach ($category as $caty) {
                                Log::Info('area_of_intrest_no' . $caty->category_id);
                                $query->orWhere(function ($query) use ($caty) {
                                    $query->whereRaw('FIND_IN_SET(' . $caty->category_id . ',new_value)');
                                });
                            }
                        } else {
                            $query->where(['table_column' => $request->search]);
                        }
                    } else {
                        $query->where(['table_column' => 'search_text']);
                        $query->where(['table_column' => 'class_id']);
                    }
                    if (!empty($request->search)) {
                        $request->current_page = 1;
                        $query->where('activity', 'search');
                    }

                    if ($request->filter == "week") {

                        $thisWeekStart = \Carbon\Carbon::now()->startOfWeek();  // returns 2016-02-03
                        $thisWeekEnd = \Carbon\Carbon::now()->endOfWeek();  // returns 2016-02-10         
                        // if (!empty($request->from_date) && !empty($request->to_date)) {
                        $request->current_page = 1;
                        $query->whereBetween('created_at', [$thisWeekStart . " 00:00:00", $thisWeekEnd . " 23:59:59"]);
                        // }
                    } else if ($request->filter == "month") {
                        $thismonthStart = \Carbon\Carbon::now()->month;

                        // if (!empty($request->from_date) && !empty($request->to_date)) {
                        $request->current_page = 1;
                        $query->whereMonth(DB::raw("DATE(created_at)"), $thismonthStart);
                        // }
                    } else if ($request->filter == "year") {
                        $thisyearStart = \Carbon\Carbon::now()->year;
                        // if (!empty($request->from_date) && !empty($request->to_date)) {
                        $request->current_page = 1;
                        $query->whereYear(DB::raw("DATE(created_at)"), $thisyearStart);
                        // }
                    } else {
                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $request->current_page = 1;
                            $query->whereBetween('created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                        }
                    }
                })
                ->get();
            $audit->each(function ($fetch) use ($request) {
                $fetch->count = $this->count_search($fetch->keyword);
            });
            $audit->each(function ($fetch) use ($request) {
                $fetch->label = $this->search_name($fetch->keyword, $request->search);
            });
            // $qlog=DB::getQueryLog();
            // dd($qlog);

            return api_response(200, 'Search keyword record fetch', $audit);
        } catch (\Exception $ex) {
            return response()->json($ex->getMessage());
        }
    }
    public function searchContentReport(Request $request)
    {

        DB::enableQueryLog();
        $labels_data = [];

        if (!empty($request->search_content)) {
            if ($request->search_duration == 'lastyear') {
                $labels_data = get_all_months();
            } elseif ($request->search_duration == 'currentyear') {
                $labels_data = get_all_months(date('m'));
            } elseif ($request->search_duration == 'date_range' && !empty($request->from_date) && !empty($request->to_date)) {
                $labels_data = get_dates_from_date_range($request->from_date, $request->to_date);
            } elseif (in_array($request->search_duration, [7, 30])) {
                $labels_data = get_last_days_dates($request->search_duration);
            }
        }

        $search_content_query = Audit::join('audit_detail', 'audit_detail.audit_id', '=', 'audit.audit_id')
            ->where(function ($query) use ($request, $labels_data) {
                if (!empty($request->search_content)) {
                    $request->current_page = 1;
                    $query->where('activity', 'search');
                }
                $query->where('table_column', $request->search_content);
                if ($request->search_duration == 'lastyear') {
                    $query->whereIn(DB::raw('month(created_at)'), range(1, 12))
                        ->where(DB::raw('year(created_at)'), date("Y") - 1);
                } else if ($request->search_duration == 'currentyear') {
                    $query->whereIn(DB::raw('month(created_at)'), range(1, date('m')))
                        ->where(DB::raw('year(created_at)'), date("Y"));
                } elseif ($request->search_duration == 'date_range' && !empty($request->from_date) && !empty($request->to_date)) {
                    $query->whereBetween(DB::raw('date(created_at)'), [$request->from_date, $request->to_date]);
                } else {
                    $query->whereBetween(DB::raw('date(created_at)'), [$labels_data[0], $labels_data[$request->search_duration]]);
                }
            });
        $search_contents =  $search_content_query
            ->distinct('new_value')
            ->select('new_value')
            ->get();

        $search_contents->labels_data = $labels_data;
        $search_contents->each(function ($search_content) use ($search_contents, $request) {

            switch ($request->search_content) {
                case "categories":
                    $search_content->content_name = Categories::orwhere(['category_id'=>$search_content->new_value,'category_name'=>$search_content->new_value])->pluck('category_name')->first();
                    break;
                case "search_text":
                    $search_content->content_name = $search_content->new_value;
                    break;
                case "classes":
                    $search_content->content_name = Classes::orwhere(['class_id'=>$search_content->new_value,'class_name'=>$search_content->new_value])->pluck('class_title_s')->first();
                    break;
                case "publisher":
                    $user = User::where('id', $search_content->new_value)->select('id as user_name')->first();
                    $search_content->content_name = $user->user_name;
                    break;
                case "author":
                    $search_content->content_name = Authors::where('authors_id', $search_content->new_value)->pluck('author_name')->first();
                    break;
            }

            if (in_array($request->search_duration, [7, 30]) || $request->search_duration == 'date_range' && !empty($request->from_date) && !empty($request->to_date)) {

                $counts_data = array();
                $total_sum_count = 0;
                foreach ($search_contents->labels_data as $to_date) {
                    $count_data = Audit::join('audit_detail', 'audit_detail.audit_id', '=', 'audit.audit_id')
                        ->where('new_value', $search_content->new_value)
                        ->where(DB::raw('DATE(created_at)'), $to_date)
                        ->count();
                    array_push($counts_data, $count_data);
                    $total_sum_count = $total_sum_count + $count_data;
                }
                $search_content->counts_data = $counts_data;
                $search_content->total_sum_count = $total_sum_count;
            } elseif ($request->search_duration == 'lastyear' || $request->search_duration == 'currentyear') {
                $counts_data = array();
                $total_sum_count = 0;
                foreach ($search_contents->labels_data as $month) {
                    $count_data = Audit::join('audit_detail', 'audit_detail.audit_id', '=', 'audit.audit_id')
                        ->where('new_value', $search_content->new_value)
                        ->where(DB::raw('month(created_at)'), trim(date("m", strtotime($month))))
                        ->where(function ($query) use ($request) {
                            if ($request->search_duration == 'lastyear') {
                                $query->where(DB::raw('year(created_at)'), date("Y") - 1);
                            } else if ($request->search_duration == 'currentyear') {
                                $query->where(DB::raw('year(created_at)'), date("Y"));
                            }
                        })
                        ->count();
                    array_push($counts_data, $count_data);
                    $total_sum_count = $total_sum_count + $count_data;
                }
                $search_content->counts_data = $counts_data;
                $search_content->total_sum_count = $total_sum_count;
            }
        });



        $graph_data = $this->prepareGraphData($search_contents);

        return api_response(200, 'Search content report', $graph_data);
    }


    public function prepareGraphData($search_contents)
    {

        $datasets = array();
        $piedatasets = array();
        $bg_cc = ['#ec470d', '#3c3b97', '#F1DD8C', '#6DFC66', '#6692FC', '#7B59FA', '#C759FA', '#637FE0', '#3c3b97', '#AABA6D', '#6FB5D5', '#5D4343', '#FCC0C0'];
        $index = 0;
        $labels_data = $search_contents->labels_data;
        $pie_labels_data = [];
          $pieObj =  new \stdClass();
        foreach ($search_contents as $search_content) {
            $firstObj = new \stdClass();
            $firstObj->label = $search_content->content_name . '(' . $search_content->total_sum_count . ')';
            $firstObj->data = $search_content->counts_data;
            $firstObj->fill =  false;
            if (!isset($bg_cc[$index])) {
                $index = 0;
            }
            $firstObj->backgroundColor = [$bg_cc[$index], $bg_cc[$index]];
            $firstObj->borderColor = [$bg_cc[$index], $bg_cc[$index]];
            $firstObj->tension =  0.4;
            array_push($datasets, $firstObj);
           
            $pieObj->label = $pie_labels_data[] = $search_content->content_name;
            $pieObj->data[] = $search_content->total_sum_count;
            $pieObj->backgroundColor[] = $bg_cc[$index];
            $pieObj->borderColor[] =$bg_cc[$index];
             
            $index++;
        }
       
       
            $pieObj->fill =  false;
       
            $pieObj->tension =  0.4;
            array_push($piedatasets, $pieObj);
        


        return ['piedatasets' => $piedatasets,
            'pie_labels_data' => $pie_labels_data,
            'datasets' => $datasets, 'labels' => $labels_data,
            'transactions'=>$search_contents];
    }
    public function search_name($keyword, $search)
    {
        switch ($search) {
            case "categories":
                $key = explode(",", $keyword);
                $new_value = Categories::whereRaw('FIND_IN_SET(' . $key[0] . ',category_id)')->pluck('category_name')->first();
                return $new_value;
                break;
            case "class_id":
                $new_value = DB::table('classes')->where('class_id', $keyword)->pluck('class_title_s')->first();
                return $new_value;
                break;
            default:
                return $keyword;
        }
    }
    public function count_search($keyword)
    {

        $count =  Audit::join('audit_detail', 'audit_detail.audit_id', '=', 'audit.audit_id')->select('created_at', DB::raw('count(audit_detail.audit_id) as count'))->groupBy('created_at')->where('audit_detail.new_value', $keyword)->get();
        return $count;
    }
    public function category()
    {
        $cat = DB::table('categories')->get();
        return $cat;
    }
}
