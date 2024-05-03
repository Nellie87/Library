<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\JWTAuth;
use Auth;
use App\Models\Classes;
use App\Models\Categories;
use App\Models\AsFields;
use App\Models\City;
use App\Models\State;
use App\Models\Country;
use App\User;
use Illuminate\Support\Facades\DB;
use App\Models\ContentViews;
use App\Models\Contentlikes;
use App\Models\Content;
use App\Models\Readercontents;
use App\Models\Theme;
use App\Models\Bookmark;
use App\Models\Plan;
use Validator;
use App\Models\Subcategories;
use Illuminate\Support\Facades\Log;
class CommonController extends Controller
{
    public function __construct()
    {
    }
    public function index()
    {
    }
    public function categories()
    {
        try {
            $category = Categories::select('category_id', 'category_name', 'is_active', DB::raw('DATE_FORMAT(created_at,"%Y-%m-%d %H:%i") as createdat'), DB::raw('DATE_FORMAT(updated_at,"%Y-%m-%d %H:%i") as updatedat'))->OrderBy('category_id', 'desc')->get();
            $updated_at = Categories::select('category_id')->max('updated_at');
             Log::Info('updated_at:'.$updated_at); 
            // $data=[]
            $current_datetime = date('Y-m-d H:i:s'); 

            $createCatObj = new Categories;
            $all_option =[
                'category_id'=>-1,
            'category_name'=>'All',
            'createdat'=>$current_datetime,
            'updatedat'=>$current_datetime,
            'is_active'=>1
        ];
        $desiredResult = $createCatObj->newInstance($all_option, true);
            $category->push($desiredResult);
            $categories = $category;
            $categories = $categories->sortBy([
                            ['category_id', 'asc']                            
                        ]);
            // Log::Info(print_r($categories,true)); 
            return $this->apiResponse(200, 'categories succesfully fetch', ['updated_at' => $current_datetime, 'categories' => $categories]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }

    public function classes()
    {
        try {
            $class = Classes::select('class_id', 'class_title_s as class_name', 'is_active', 'class_name as class_name_key')->get();

                $createClsObj = new Classes;
            $all_option =[
                'class_id'=>-2,
            'class_name'=>'All',
            'class_name_key'=>'all',
            'is_active'=>1
        ];
        $desiredResult = $createClsObj->newInstance($all_option, true);
            $class->push($desiredResult);
            $class = $class->sortBy([
                            ['class_id', 'asc']                            
                        ]);



            return $this->apiResponse(200, 'classes succesfully fetch', $class);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function filter(Request $request)
    {
        try {
            $filter = [];
            $class = AsFields::where('field_status', 1)->get();
            foreach ($class as $key => $value) {
                if (!Auth::check() && $value->field_key == 'content_type') {
                    continue;
                }
                array_push(
                    $filter,
                    array(
                        'field_id' => $value->field_id,
                        'field_name' => $value->field_name,
                        'field_key' => $value->field_key,
                        'field_type' => $value->field_type,
                        'field_status' => $value->field_status,
                        'field_data' => $this->field_data($value->field_key,$request),
                        'created_at' => $value->created_at,
                        'updated_at' => $value->updated_at
                    )
                );
            }
            $price_range = Content::selectRaw(" MIN(content_price) AS min_price, MAX(content_price) AS max_price")
                ->where('content_price', '!=', 0)
                ->first();
            $data = ['filter' => $filter, 'price_range' => $price_range];
            return $this->apiResponse(200, 'search filter data', $data);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function field_data($type,$request)
    {
        switch ($type) {
            case 'categories':
                $categories = Categories::select('category_id as id', 'category_name as name','category_image', 'is_active')
                    ->get();
                $categories->each(function ($query) {
                    if (!empty($query->category_image)) {
                        $query->category_image = url() . '/files/contents/category_icons/' . $query->category_image;
                    }
                });
                return $categories;
                break;
            case 'classes':
                return Classes::select('class_id as id', 'class_title_s as name', 'is_active')
                    ->get();
                break;
            case 'authors':
                return DB::table('authors')
                    ->select('author_name as name', 'authors_id as id')
                    ->where('author_name', '!=', '')
                    ->take(30)->get();
                break;
            case 'publishers':
                return User::select(DB::raw('CONCAT(first_name,last_name) AS name'), 'id')
                    ->where('user_type', 'publisher')
                    ->where('verified_email', 1)
                    ->where('first_name', '!=', '')
                    ->where('is_blocked', 0)
                    ->take(30)->get();
                break;
            case 'sub_category':
                return Subcategories::select('sub_category_id as id', 'category_id', 'sub_category_name as name', 'is_active')
                    ->get();
                break;
            case 'date_of_publication':
                return $this->publishing();
                break;
            case 'content_type':
                return $this->content_types($request);
                break;
            default:
                return [];
                break;
        }
    }
    function publishing()
    {
        $data = Content::select('publishing_year')
            ->distinct()
                ->where('publishing_year','!=',null)
                ->orderby('publishing_year','asc')
            ->get();
        $data->each(function ($query) {
            $query->id = null;
        });
        return $data;
    }
    function content_types($request)
    {
        if(!empty($request->web)){
            return [
            ['name' => 'Free', 'id' => 'free'],
            ['name' => 'For sale', 'id' => 'paid'],
            ['name' => 'For Members', 'id' => 'membership']
        ];
        }
         return [
            ['name' => 'Free', 'id' => 1],
            ['name' => 'For sale', 'id' => 2],
            ['name' => 'For Members', 'id' => 3]
        ];
       
    }
    
 
    public function country()
    {
        try {
            $country = Country::select('id', 'name', 'phonecode')->get();
            return $this->apiResponse(200, 'Country list', $country);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function city(Request $request)
    {
        try {
            $req = $request->all();
            $city = City::select('id', 'name', 'country_id')->where(['country_id' => $req['country_id']])->get();
            return $this->apiResponse(200, 'Country list', $city);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function city_new(Request $request)
    {
        try {
            $req = $request->all();
            $city = City::select('id', 'name', 'country_id')->where(['state_id' => $req['state_id']])->get();
            return $this->apiResponse(200, 'Country list', $city);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function state(Request $request)
    {
        try {
            $req = $request->all();
            $state = State::select('id', 'name', 'country_id')->where(['country_id' => $req['country_id'], 'is_active' => 1])->get();
            return $this->apiResponse(200, 'State list', $state);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function views(Request $request)
    {
        try {

            $id = (!empty($request->encrypted_content_id)) ? $request->encrypted_content_id : $request->content_id;
            $contentId = custom_encryption('decrypt', $id);
            $request_array = ["content_id" => $contentId, "reader_id" => $request->reader_id];
            $exists = Readercontents::where($request_array)->first();
            if($exists){
                Readercontents::where($request_array)->update(["is_reading" => 1]);
            }else{
               $content = Content::where(['content_id' => $contentId])->first();
               if($content && $content->content_type == 'free' && $content->no_of_copies==-1){
                $readercontent =  create_reader_content($contentId,$request->reader_id);
                if($readercontent){
                   Readercontents::where('reader_content_id',$readercontent->reader_content_id)->update(["is_reading" => 1]); 
                }
               }
            }
            
            
             $view = ContentViews::where($request_array)->first();
            if (!empty($view)) {
                $views = ($view->views + 1);
                $status = ContentViews::where($request_array)->update(["views" => $views]);
            } else {
                $request_array['views'] = 1;
                $status = ContentViews::insert($request_array);
            }
            $data = ContentViews::where(["content_id" => $request->content_id])->sum('views');
            return  $this->apiResponse('200', "View add successfully", $data);
        } catch (\Exception $ex) {
            return  response()->json(['error' => $ex]);
        }
    }
    public function like(Request $request)
    {
        try {

            $like = Contentlikes::where(["content_id" => $request->content_id, "user_id" => $request->user_id])->first();
            if (!empty($like)) {
                $liked = ($like->likes == 1) ? 0 : 1;
                $status = Contentlikes::where(["content_id" => $request->content_id, "user_id" => $request->user_id])
                    ->update(["likes" => $liked]);
            } else {
                $status = Contentlikes::insert([
                    "content_id" => $request->content_id,
                    "user_id" => $request->user_id,
                    "likes" => $request->likes
                ]);
            }
            $data = Contentlikes::select('likes')->where(["content_id" => $request->content_id, "user_id" => $request->user_id])->first();
            return  $this->apiResponse('200', "content likes", $data);
        } catch (\Exception $ex) {
            return  response()->json(['error' => $ex]);
        }
    }
    public function getfieldconfig(Request $request)
    {
        try {
            $data = [];
            $class = AsFields::get();
            foreach ($class as $key => $value) {
                array_push(
                    $data,
                    array(
                        'field_id' => $value->field_id,
                        'field_name' => $value->field_name,
                        'field_key' => $value->field_key,
                        'field_type' => $value->field_type,
                        'field_status' => $value->field_status,
                        'field_data' => $this->field_data($value->field_key,$request),
                        'created_at' => $value->created_at,
                        'updated_at' => $value->updated_at
                    )
                );
            }
            return $this->apiResponse(200, 'search filter data', $data);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function fieldconfig(Request $request)
    {
        try {
            $req = $request->all();
            // print_r($req);
            // $audit_data = array(
            //     "user_id" => Auth::id(),
            //     "module" => "Field",
            //     // "module_id" => 0,
            //     "activity" => "update",
            //     "platform" => "web",
            //     "device_id" => "",
            //     "useragent" => ""
            // );
            // $old =Theme::where(['theme_id'=>$request->theme_id])->first();
            // $new =$request->all();
            // unset($new['theme_id']);
            // audit($audit_data, $old, $new);

            if (!empty($req)) {
                foreach ($req['categories'] as $key => $value) {

                    $update = AsFields::where(["field_key" => $value['field_key']])->update(['field_status' => $value['field_status']]);
                }
            }
            return $this->apiResponse(200, 'Field configration successfully updated', $req);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Field configration Exceptions');
        }
    }
    public function getthemeconfig()
    {
        try {

            $theme = Theme::first();
            return $this->apiResponse(200, 'Get theme configuration', $theme);
        } catch (\Exception $ex) {
            return  response()->json(['error' => $ex]);
        }
    }
    public function themeconfig(Request $request)
    {
        try {

            $updatetheme = [
                "layout" => $request->layout,
                "search_results_display_type" => $request->display_type,
                "search_total_results" => $request->total_results,
                "advertising" => $request->advertising,
            ];

            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "Theme",
                "module_id" => $request->theme_id,
                "activity" => "update",
                "platform" => "web",
                "device_id" => "",
                "useragent" => ""
            );
            $old = Theme::where(['theme_id' => $request->theme_id])->first();
            $new = $updatetheme;
            unset($new['theme_id']);
            audit($audit_data, $old, $new);

            $theme = Theme::where(['theme_id' => $request->theme_id])->update($updatetheme);
            return $this->apiResponse(200, 'theme configuration successfully updated', $updatetheme);
        } catch (\Exception $ex) {
            return  response()->json(['error' => $ex]);
        }
    }
    public function contentview()
    {
        try {
            DB::enableQueryLog();
            $getviews = ContentViews::select('content_id', DB::raw('sum(views) as views'))->groupBy('content_id')->paginate(10);
            $getviews->each(function ($views) {
                $views->content_detail = $this->content_detail($views->content_id);
            });
            // $quries = DB::getQueryLog();
            //     dd($quries);
            return $this->apiResponse(200, 'Get Contents Views', $getviews);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'exceptions', $ex);
        }
    }
    public function content_detail($content_id)
    {
        $detail = Content::Where(['content_id' => $content_id])->select('title', 'author_name', 'content_price')->first();
        return $detail;
    }
    public function addbookmark(Request $request)
    {
        Log::Info('addbookmark');
        try {
            $bookmark = Bookmark::where([
                'content_id' => $request->content_id,
                'reader_id' => Auth::id()
            ]);
            if ($bookmark->count() > 0) {
                $data = $bookmark->first();
                $is_bookmarded = $data->is_bookmarked;
                $bookmark->update([
                    'is_bookmarked' => ($is_bookmarded == 1) ? 0 : 1
                ]);
                if ($is_bookmarded == 1) {
                    $msg = 'Content removed from your wishlist';
                } else {
                    $msg = 'Content added to your wishlist';
                }
            } else {
                $result = Bookmark::insert([
                    'content_id' => $request->content_id,
                    'reader_id' => Auth::id(),
                    'is_bookmarked' => 1
                ]);
               $is_bookmarded =1;
                $msg = 'Content successfully added to wishlist.';
            }
            return api_response(200, $msg, ['bookmark' => ($is_bookmarded == 1) ? 0 : 1]);
        } catch (\Exception $ex) {
              Log::Info('Add/update bookmark exceptions'.$ex->getMessage());
            return api_response(201, 'Add/update bookmark exceptions');
        }
    }
    public function getbookmark(Request $request)
    {
        try {
            $data = array();
            DB::enableQueryLog();
            $mybook = Content::join('bookmark', 'bookmark.content_id', '=', 'contents.content_id')
                ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                ->select(
                    'contents.*',
                    'authors.*',
                    'contents.image_cover as main_content_image',
                    'contents.content_id as encrypted_content_id',
                    'bookmark.is_bookmarked'
                )
                ->where(['bookmark.reader_id' => Auth::id(), 'is_bookmarked' => 1])
                ->paginate(10);
            // $query= DB::getQueryLog();
            // print_r($query);
            // die;
            $pagination = array(
                'current_page' => $mybook->currentPage(),
                'total' => $mybook->total(),
                'lastPage' => $mybook->lastPage(),
                'per_page' => $mybook->perPage(),
                'next_page' => ($mybook->lastPage() < $mybook->currentPage() + 1) ? null : $mybook->lastPage(),
                'path' => $mybook->path(),

            );

            if ($mybook) {
                foreach ($mybook as $key => $value) {
                    $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';
                      $class_detail = get_class_detail( $value->class_id);
                    array_push(
                        $data,
                        array(
                            "content_id" => $value->content_id,
                            "encrypted_content_id" => $value->encrypted_content_id,
                            'title' => $value->title,
                            'description' => $value->description,
                            'publisher_id' => $value->publisher_id,
                            "class_id" => $value->class_id,
                            "class_title_s" => $class_detail->class_title_s,
                            "class_name" => $class_detail->class_name,
                            "content_type" => $value->content_type,
                            "content_price" => $value->content_price,
                            "main_content_image" => $cover,
                            "tags" => $value->tags,
                            "author" => array(
                                "author_id" => $value->author_id,
                                "author_name" => $value->author_name,
                            ),
                            "status" => $value->status,
                            "is_bookmarked" => ($value->is_bookmarked == 1) ? true : false


                        )
                    );
                }
            }
            return $this->apiResponse(200, 'successfully fetch bookmark list', ["data" => $data, "pagination" => $pagination]);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'bookmark list exception');
        }
    }
    public function addSubcategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category_id'    => 'required|int',
                'sub_category_name'    => 'required|string',
            //    'sub_category_title_s'    => 'required|string',
            //    'sub_category_title_p'    => 'required|string',
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            $record = Subcategories::insert([
                'category_id' => $request->category_id,
                'sub_category_name' => $request->sub_category_name,
                'sub_category_title_s' => $request->sub_category_name,
                'sub_category_title_p' => $request->sub_category_name,
                'is_active' => 1
            ]);
            return $this->apiResponse(200, 'Sub-category successfully added');
        } catch (\Exception $ex) {
            return $this->apiResponse(200, 'Sub Category exceptions');
        }
    }
    public function subcategories()
    {
        try {
            $category = Subcategories::select('sub_category_id', 'category_id', 'sub_category_name', 'is_active', DB::raw('DATE_FORMAT(created_at,"%Y-%m-%d %H:%i") as createdat'), DB::raw('DATE_FORMAT(updated_at,"%Y-%m-%d %H:%i") as updatedat'))->OrderBy('sub_category_id', 'desc')->paginate('10');
            $category->each(function ($query) {
                $query->category_name = Categories::where(['category_id' => $query->category_id])->pluck('category_name')->first();
            });
            $updated_at = Subcategories::select('category_id')->max('updated_at');
            // $data=[]
            return $this->apiResponse(200, 'categories succesfully fetch', ['updated_at' => $updated_at, 'categories' => $category]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function getsubcategory(Request $request)
    {
        try {
            $category = Subcategories::select('sub_category_id', 'category_id', 'sub_category_name', 'is_active', 'created_at', 'updated_at')
                ->where('sub_category_id', $request->sub_category_id)->first();
            // $data=[]
            return $this->apiResponse(200, 'categories succesfully fetch', $category);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function editsubcategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category_id'    => 'required|int',
                'sub_category_name'    => 'required|string',
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            $record = Subcategories::where(['sub_category_id' => $request->sub_category_id])->update([
                'category_id' => $request->category_id,
                'sub_category_name' => $request->sub_category_name,
            ]);
            return $this->apiResponse(200, 'Sub Category Successfully updated');
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Sub Category exceptions');
        }
    }
    public function deletesubcategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'sub_category_id'    => 'required|int',
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            //$del_sub_category = Subcategories::where(['category_id' => $request->category_id])->update(['is_active'=>'0']);
            //$record = Content::where(['category_id' => $request->category_id])->update(['is_active'=>'0']);

            return $this->apiResponse(200, 'Sub Category Successfully deleted');
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Sub Category exceptions');
        }
    }
    public function getcategory(Request $request)
    {
        try {
            $category = Categories::select('category_id', 'category_name', 'category_image', 'is_active', 'created_at', 'updated_at')
                ->where('category_id', $request->category_id)->first();
            // $data=[]
            return $this->apiResponse(200, 'categories succesfully fetch', $category);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex], 401);
        }
    }
    public function addcategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category_name'       => 'required|string',
            //    'category_title_s'    => 'required|string',
            //    'category_title_p'    => 'required|string',
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }
            $record = Categories::insert([
                'category_name' => $request->category_name,
                'category_title_s' => $request->category_name,
                'category_title_p' => $request->category_name,
                'is_active' => 1
            ]);
            if ($request->hasFile("image_cover")) {
                $record['category_image'] = $this->uploadImage($request, "image_cover");
            }
            return $this->apiResponse(200, 'Category Successfully added');
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Category add exceptions' . $ex->getMessage());
        }
    }
    public function uploadImage($request, $imageData)
    {
        $file_input_name = $imageData;
        $image_cover_url = null;
        if ($request->hasFile($file_input_name)) {

            $destinationPath = base_path() . '/public/files/contents/category_icons';
            $image = $request->file($imageData);
            $name = 'category_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $result = $image->move($destinationPath, $name);
            $image_cover_url = $name;
        }

        return $image_cover_url;
    }
    public function editcategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category_name'    => 'required|string',
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }
            $cat_array = [];
            if ($request->category_name) {
                $cat_array['category_name'] = $request->category_name;
            }
            if ($request->hasFile("image_cover")) {
                $cat_array['category_image'] = $this->uploadImage($request, "image_cover");
            }
            $record = Categories::where(['category_id' => $request->category_id])->update($cat_array);
            return $this->apiResponse(200, 'Category Successfully updated');
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Category exceptions');
        }
    }
    public function deletecategory(Request $request)
    {
      
        try {
            $validator = Validator::make($request->all(), [
                'category_id'    => 'required|int',
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }
            // $del_category = Categories::where(['category_id' => "'".$request->category_id."'"])->update(['is_active'=>'0']);
            //$del_sub_category = Subcategories::where(['category_id' => $request->category_id])->update(['is_active'=>'0']);
            //$record = Content::where(['category_id' => $request->category_id])->update(['is_active'=>'0']);
            return $this->apiResponse(200, 'Category Successfully deleted');
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Category exceptions');
        }
    }
    public function getplan(Request $request)
    {
        try {
            $data = [];
            if (!empty($request->plan_id)) {
                $data = Plan::where('plan_id', $request->plan_id)->first();
            } else {
                $data = Plan::where('is_deleted',0)->get();
            }

            return $this->apiResponse(200, 'Get Plan', $data);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Get plan exceptions');
        }
    }
      public function getActiveplans(Request $request)
    {
        try {
            $data = [];

            if (!empty($request->plan_id)) {

                $data['plan'] = Plan::where('plan_id', $request->plan_id)->first();
            } else {
                $data['planlist'] = Plan::where('is_enabled',1)->where('is_deleted',0)->get();
            }

                $active_plan=is_membership_user(Auth::id());
                        if($active_plan){
                           $data['active_plan_membership'] = $active_plan; 
                         $data['active_plan'] = Plan::where('plan_id',$active_plan->plan)->first();
                           $data['is_membership_user'] = 1; 
                           $data['is_member'] = 1; 
                      return api_response(200, 'plan details', $data);
                        }else{
                            $data['is_membership_user'] =0;  
                        }
            return $this->apiResponse(200, 'Get getActiveplans', $data);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'Get getActiveplans exception');
        }
    }
    public function addplan(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'plan_title'    => 'required|string',
                'charges'    => 'required|numeric',
                'no_of_days' => 'required|numeric'
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            $record = Plan::create([
                'service' => 'Membership',
                'duration' => $request->plan_title,
                'charges' => $request->charges,
                'no_of_days' => $request->no_of_days,
            ]);
            return $this->apiResponse(200, 'Subscription plan successfully added');
        } catch (\Exception $ex) {
            Log::Info('Add plan exception:'. $ex->getMessage());
            return $this->apiResponse(201, 'Add plan exception');
        }
    }
    public function editplan(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'plan_title'    => 'required|string',
                'charges'    => 'required|numeric',
                'no_of_days' => 'required|numeric'
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            $record = Plan::where(['plan_id' => $request->plan_id])->update([
                'duration' => $request->plan_title,
                'charges' => $request->charges,
                'no_of_days' => $request->no_of_days,
            ]);
            return $this->apiResponse(200, 'Subscription plan updated');
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'edit plan exceptions');
        }
    }

    public function enablePlan(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'is_enabled'    => 'required|numeric',
                'plan_id' => 'required|numeric'
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            $record = Plan::where(['plan_id' => $request->plan_id])->update([
                'is_enabled' => $request->is_enabled,
            ]);
            
            if($request->is_enabled == 1){
                $msg = 'Plan enabled successfully';
            }else{
                $msg = 'Plan disabled successfully';
            }
            return $this->apiResponse(200, $msg);
        } catch (\Exception $ex) {
            Log::Info('enablePlan exception:'. $ex->getMessage());
            return $this->apiResponse(201, 'Unable to update plan');
        }

    }
    
    public function deletePlan(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'plan_id' => 'required|numeric'
            ]);
            if ($validator->fails()) {
                return api_response(201, $validator->errors()->first());
            }

            $record = Plan::where(['plan_id' => $request->plan_id])->update([
                'is_deleted' => 1,
            ]);
            
            return $this->apiResponse(200, 'Plan deleted successfully');
        } catch (\Exception $ex) {
            Log::Info('deletePlan exception:'. $ex->getMessage());
            return $this->apiResponse(201, 'Unable to delete plan');
        }

    }
    
    public function financialsFilter(){
        $filter = [
            'readers' => 'Readers',
            'publishers' => 'Publishers',
            'contents' => 'Contents'
            ];
        $data['readers'] = User::whereIn('user_type',['reader','junior_reader'])
                ->Where("is_deleted", '!=', 1)
                ->select(DB::raw("CONCAT(first_name,' ',last_name) as option_value"),'id as option_key')
                ->get();
        $data['publishers'] = User::whereIn('user_type',['publisher'])
                ->Where("is_deleted", '!=', 1)
                ->select(DB::raw("CONCAT(first_name,' ',last_name) as option_value"),'id as option_key')
                ->get();
        $data['contents'] = Content::Where("status",'published')
                    ->where('content_type','paid')
                    ->where(function ($query){
                         if (Auth::user()->user_type == 'publisher') {
                            $query->where('publisher_id', Auth::id());
                        } 
                    })
                ->select('title as option_value','content_id as option_key')
                ->get();
                    
        return api_response('success','Filter data fetched successfully',['filter'=>$filter,'filter_data'=>$data]);
    }
}
