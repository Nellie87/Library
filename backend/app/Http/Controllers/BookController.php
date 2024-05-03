<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\JWTAuth;
use Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Content;
use App\Models\Readercontents;
use Symfony\Component\CssSelector\Parser\Reader;
use Illuminate\Support\Facades\Log;
use App\Models\ContentViews;
use App\Models\Contentlikes;
use App\Models\UserDevices;
use App\User;

class BookController extends Controller {

    private $url;
    private $image_url;
    private $audio;
    private $pdf;
    private $video;
    private $maxResults;

    function __construct() {
        // $this->middleware('auth:api');
        $this->url = url() . '/files/contents';
        $this->image_url = url() . '/files/contents';
        $this->audio = url() . '/files/audio';
        $this->pdf = url() . '/files/pdf';
        $this->video = url() . '/files/video';
        $this->maxResults = maxresult();
    }

    public function index() {
        return response()->json(['pagename' => 'book page']);
    }

    public function userdevice() {
        $count = UserDevices::Where(['user_id' => Auth::id()])->count();
        return $count;
    }

    public function catalog(Request $request) {
        $req = $request->all();
         
        try {

            $data = [];

            extract($req);

            $where = [];

            // if ($categories) {
            // $where['category_id'] = $categories;
            // }
            if ($class) {
                $where['class_id'] = $class;
            }
            if ($publisher) {
                $where['publisher_id'] = $publisher ? $publisher : "";
            }
            // if ($author) {
            //     $where['author_id'] = $author;
            // }
            // if ($category) {
            //     $where['category_id'] = $category;
            // }
            // if ($isbn) {
            //     $where['isbn_content'] = $isbn;
            // }
            if ($content_type) {
                $where['content_type'] = $content_type;
            }
                
            if($categories && ($categories == -1) && $class && $where['class_id'] && $where['class_id'] == -2 ||  $class && $where['class_id'] && $where['class_id'] == -2){
                unset($where['class_id']);
            }
           
            // DB::enableQueryLog();
              
            if (!empty($isTrending) && $isTrending == 'true') {
                $catalog = ContentViews::select('content_id', DB::raw("SUM(views) as SUM"))
                        ->groupBy('content_id')
                        ->orderBy('SUM', 'desc')
                        ->paginate($this->maxResults);

                $catalog->each(function ($query) {
                    $value = Content::leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                                    ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'authors.author_name')
                                    ->Where('status', 'published')
                                    ->where(function ($query) {
                                        if (Auth::check()) {
                                            if (Auth::user()->user_type == 'junior_reader') {
                                                $query->whereIn('contents.content_reader',['junior','both']);
                                            } elseif (Auth::user()->user_type == 'reader') {
                                                $query->whereIn('contents.content_reader', ['adult', 'both']);
                                            }
                                        }
                                    })
                                    ->where(['contents.is_deleted' => 0])
                                    ->where('content_id', $query->content_id)->first();
                    if (!empty($value)) {
                        $query->encrypted_content_id = $value->encrypted_content_id;
                        $query->title = $value->title;
                        $query->description = $value->description;
                        $query->publisher_id = $value->publisher_id;
                        $query->category_id = $value->category_id;
                        $query->author_id = $value->author_id;
                        $query->author_name = $value->author_name;
                        $query->class_id = $value->class_id;
                        $query->content_type = $value->content_type;
                        $query->content_price = $value->content_price;
                        $query->main_content_image = $value->main_content_image;
                        $query->tags = $value->tags;
                        $query->status = $value->status;
                    }
                });
            } else {


                $catalog = Content::Where($where)
                                ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                                ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'authors.author_name')
                                ->Where('status', 'published')
                                ->where(function ($query) {
                                        if (Auth::check()) {
                                            if (Auth::user()->user_type == 'junior_reader') {
                                                $query->whereIn('contents.content_reader',['junior','both']);
                                            } 
                                        }
                                    })
                                ->where(['contents.is_deleted' => 0])
                                ->where(function ($query) use ($categories) {
                                    if($categories != -1){
                                    $categories = explode(",", $categories);
                                    if(is_array($categories) && count($categories)>0){
                                    foreach ($categories as $category) {
                                        if(!empty($categories)){
                                             $query->orWhere('category_id',$category);    
                                        }
                                        
                                    }
                                    }
                                    }

                                })->paginate($this->maxResults);
            }
               // Log::Info(print_r(DB::getQueryLog(),true));
            $record = $catalog;

            $pagination = array(
                'current_page' => $catalog->currentPage(),
                'total' => $catalog->total(),
                'lastPage' => $catalog->lastPage(),
                'per_page' => $catalog->perPage(),
                'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? null : $catalog->lastPage(),
                'path' => $catalog->path(),
            );

            foreach ($record as $key => $value) :
                if (!empty($value->encrypted_content_id)) {
                    $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';
                        $class_detail = get_class_detail( $value->class_id);
                    array_push(
                            $data, array(
                        "content_id" => $value->content_id,
                        "encrypted_content_id" => $value->encrypted_content_id,
                        'title' => $value->title,
                        'description' => $value->description,
                        'publisher_id' => $value->publisher_id,
                        "category_id" => get_categories(json_decode($value->category_id)),
                        "author" => array(
                            "author_id" => $value->author_id,
                            "author_name" => $value->author_name,
                        ),
                        "class_id" => $value->class_id,
                     "class_title_s" => $class_detail->class_title_s,
                    "class_name" => $class_detail->class_name,
                        "content_type" => $value->content_type,
                        "content_price" => $value->content_price,
                        "main_content_image" => $cover,
                        "tags" => $value->tags,
                        "status" => $value->status,
                            )
                    );
                }
            endforeach;

            return $this->apiResponse(200, 'successfully fetch', ["catalog" => $data, "pagination" => $pagination]);
        } catch (\Exception $ex) {
            Log::Info('update Comment status Exception:' . $ex->getMessage());
                 Log::Info('Line:' . $ex->getLine());
            return $this->apiResponse(201, 'Get catalog exceptions');
        }
    }

    public function detail($id, Request $request) {
        try {
            extract($request->all());
            $value = Content::leftjoin('content_drm_settings', 'content_drm_settings.content_id', '=', 'contents.content_id')
                            ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                            ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'authors.author_name', 'content_drm_settings.copy_paste', 'content_drm_settings.printing', 'content_drm_settings.downloads', 'content_drm_settings.number_of_devices')
                            ->where('contents.content_id', $id)->first();
            $data = [];
            $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';

            $file = ($value->upload_content) ? $value->upload_content : 'dummy-image.png';
            $download = Readercontents::where(['reader_id' => Auth::id(), 'content_id' => $id])->first();
            $is_reading = (!empty($download)) ? $download->is_reading : 0;
            $data = array(
                'content_id' => $value->content_id,
                'encrypted_content_id' => $value->encrypted_content_id,
                'title' => $value->title,
                'description' => $value->description,
                'publisher_id' => $value->publisher_id,
                "content_type" => $value->content_type,
                "content_price" => $value->content_price,
                "is_subscriptional_type" => $value->is_subscriptional_type,
                "isbn_content" => $value->isbn_content,
                "class_number" => $value->class_number,
                "content_subject" => $value->content_subject,
                "eshelve_code" => $value->eshelve_code,
                "subtitle" => $value->subtitle,
                "for_sale" => $value->for_sale,
                "book_genre_types" => $value->genre,
                "class" => $value->class_id,
                "category" => $this->category($value->category_id),
                "publisher" => $this->publisher($value->publisher_id),
                "rating" => $this->rating($value->content_id),
                "main_content_image" => $cover,
                "image_index" => $cover,
                "file" => $this->files($value->class_id) . '/' . $file,
                "tags" => $value->tags,
                "status" => $value->status,
                'isBookRead' => ($is_reading == 1) ? true : false,
                "downloadstatus" => $this->downloadstatus($reader_id, $id),
                "is_purchased" => $this->purchased($value->content_id),
                "drm_setting" => array(
                    'copy_paste' => $value->copy_paste,
                    'printing' => $value->printing,
                    'number_of_device' => (int) $value->number_of_devices,
                    'display_upto' => (int) $value->display_upto,
                    'no_of_copies' => ($value->no_of_copies) ? (int) $value->no_of_copies : 0,
                    'no_of_available' => $this->availablecopies($value->content_id, $value->no_of_copies)
                ),
                'allow_downloadable' => $value->downloads > 0 ? TRUE : FALSE,
                'views' => $this->views($value->content_id),
                'like' => $this->like($value->content_id),
                "author" => array(
                    "author_id" => $value->author_id,
                    "author_name" => $value->author_name,
                    'author_books' => $this->authorbooks($value->author_id, $value->content_id)
                ),
            );

            return $this->apiResponse(200, 'successfully fetch', $data);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'content detail exceptions');
        }
    }

    public function purchased($content_id) {
        $value = DB::table('orders')->where(['order_for_id' => $content_id, 'user_id' => Auth::id()])->count();
        return $value > 0 ? true : false;
    }

    public function availablecopies($content_id, $copies) {
        $count = Readercontents::where('content_id', $content_id)->count();
        $available = (((int) $copies - $count) > 0) ? ((int) $copies - $count) : 0;
        return ($count) ? $available : (int) $copies;
    }

    public function authorbooks($author, $contentid) {
        $data = [];
        $catalog = DB::table('contents')
                        ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                        ->select('contents.*', 'contents.image_cover as main_content_image', 'authors.*')
                        ->Where('status', 'published')
                        ->Where('contents.content_id', '!=', $contentid)
                        ->Where('author_id', $author)->paginate($this->maxResults);

        // $quries = DB::getQueryLog();
        // dd($quries);

        $pagination = array(
            'current_page' => $catalog->currentPage(),
            'total' => $catalog->total(),
            'lastPage' => $catalog->lastPage(),
            'per_page' => $catalog->perPage(),
            'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? null : $catalog->lastPage(),
            'path' => $catalog->path(),
        );
        foreach ($catalog as $key => $value) :

            $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';
            array_push(
                    $data, array(
                "content_id" => $value->content_id,
                'title' => $value->title,
                'description' => $value->description,
                'publisher_id' => $value->publisher_id,
                "author" => array(
                    "author_id" => $value->author_id,
                    "author_name" => $value->author_name,
                ),
                "category_id" => get_categories(json_decode($value->category_id)),
                "class_id" => $value->class_id,
                "content_type" => $value->content_type,
                "content_price" => $value->content_price,
                "main_content_image" => $this->url . '/' . $cover,
                "tags" => $value->tags,
                "status" => $value->status,
                    )
            );
        endforeach;

        return $data ? $data : [];
    }

    public function views($content_id) {
        $data = ContentViews::where(["content_id" => $content_id])->sum('views');
        return ($data) ? (int) $data : 0;
    }

    public function like($content_id) {
        $data = Contentlikes::where(["content_id" => $content_id, "user_id" => Auth::id()])->first();
        return ($data) ? $data->likes : 0;
    }

    public function downloadstatus($readerid, $contentid) {
        $download = Readercontents::where(['reader_id' => $readerid, 'content_id' => $contentid])->first();
        $device_list = DB::table('downloaddevice')->select('device_id')->where(['reader_id' => $readerid, 'content_id' => $contentid])->get();
        $deviceid = array();
        foreach ($device_list as $key => $value) {
            $deviceid[] = $value->device_id;
        }

        $dev = implode(',', $deviceid);
        $deviceid = (!empty($dev)) ? $deviceid : [];
        return array(
            'isDownloaded' => ($download) ? $download->isDownloaded : 0,
            'downloaded_path' => ($download) ? $download->downloaded_path : null,
            'device_id' => $deviceid
        );
    }

    public function files($id) {
        switch ($id) {
            case 1:
                return $this->url;
                break;
            case 2:
                return $this->url;
                break;
            case 3:
                return $this->url;
                break;
            default:
                return $this->url;
                break;
        }
    }

    public function publisher($id) {
        $return = DB::table('users')->where('id', $id)->first();
        $name = null;
        if ($return) {
            $name = $return->first_name . ' ' . $return->middle_name . ' ' . $return->last_name;
        }
        return $name;
    }

    public function author($id) {
        $return = DB::table('users')->where('id', $id)->first();
        $name = null;
        if ($return) {
            $name = $return->first_name . ' ' . $return->middle_name . ' ' . $return->last_name;
        }
        return $name;
    }

    public function category($id) {
        $return = DB::table('categories')->where('category_id', $id)->first();
        $name = null;
        if ($return) {
            $name = $return->category_name;
        }
        return $name;
    }

    // public function rating($id)
    // {
    //     $return = DB::table('rating')->where('content_id', $id)->avg('rating');
    //     return ($return) ? $return : 0;
    // }
    public function rating($id) {
        $return = DB::table('comments')->where('content_id', $id)->avg('rating');
        $str = (string) $return;
        $avg = number_format((float) $return, 1, '.', '');
        return ($return) ? $avg : "0.0";
    }

    public function catalogFilter(Request $request) {
        try {
            $req = $request->all();
            $where = [];
            $data = [];
            extract($req);
            $audit_data = array(
                "user_id" => Auth::id(),
                "module" => "Content",
                "activity" => "search",
            );
            $old = array();
            $new = $request->all();
            $return = audit($audit_data, $old, $new);

            if ($publisher) {
                $where['publisher_id'] = $publisher;
            }
            // if ($classes) {
            //     $where['class_id'] = $classes;
            // }
            if ($author) {
                $where['author_id'] = $author;
            }
            if ($isbn) {
                $where['isbn_content'] = $isbn;
            }
            if ($content_type) {
                $where['content_type'] = get_content_type_key_by_id($content_type);
            }
            // return response()->json($req);
            DB::enableQueryLog();
            // $catalog = DB::table('contents')->orWhere($where)->where('title', 'like', '%' . $search_title . '%')->paginate($this->maxResults);
            $catalog = Content::leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->select('contents.*', 'contents.image_cover as main_content_image', 'authors.*', 'contents.content_id as encrypted_content_id')
                    ->orWhere($where)
                    ->Where('status', 'published')
                    ->Where(function ($query) use ($classes) {
                        if (is_array($classes)) {
                            foreach ($classes as $value) {
                                $query->orWhere('class_id', $value);
                            }
                        }
                    })
                    ->Where(function ($query) use ($category) {
                        if (is_array($category)) {
                            foreach ($category as $category_id) {
                                $query->orWhere(function ($query) use ($category_id) {
                                    $query->whereRaw('FIND_IN_SET(' . $category_id . ',category_id)');
                                });
                            }
                        }
                    })
                    ->Where(function ($query) use ($sub_categories) {
                        if (!empty($sub_categories)) {
                            foreach ($sub_categories as $category_id) {
                                $query->orWhere(function ($query) use ($category_id) {
                                    $query->whereRaw('FIND_IN_SET(' . $category_id . ',sub_category_id)');
                                });
                            }
                        }
                    })
                    ->where('title', 'like', '%' . $search_title . '%')
                    ->where(['contents.is_deleted' => 0])
                    ->where(function ($query) use ($author) {
                        if (is_array($author)) {
                            foreach ($author as $author_id) {
                                $query->orWhere(function ($query) use ($author_id) {
                                    $query->where('FIND_IN_SET(' . $author_id . ',author_id)');
                                });
                            }
                        }
                    })
                    ->paginate($this->maxResults);

            // $quries = DB::getQueryLog();
            // dd($quries);

            $pagination = array(
                'current_page' => $catalog->currentPage(),
                'total' => $catalog->total(),
                'lastPage' => $catalog->lastPage(),
                'per_page' => $catalog->perPage(),
                'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? null : $catalog->lastPage(),
                'path' => $catalog->path(),
            );
            if (!empty($catalog)) {
                //  print_r($catalog);
                foreach ($catalog as $key => $value) :

                    $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';

                    $data[] = array(
                        "content_id" => $value->content_id,
                        "encrypted_content_id" => $value->encrypted_content_id,
                        'title' => $value->title,
                        'description' => $value->description,
                        'publisher_id' => $value->publisher_id,
                        "author" => array(
                            "author_id" => $value->author_id,
                            "author_name" => $value->author_name,
                        ),
                        "category_id" => get_categories(json_decode($value->category_id)),
                        "class_id" => $value->class_id,
                        "content_type" => $value->content_type,
                        "content_price" => $value->content_price,
                        "main_content_image" => $cover,
                        "tags" => $value->tags,
                        "status" => $value->status,
                    );
                endforeach;
            }

            return $this->apiResponse(200, 'library filter successfully fetch', ["catalog" => $data, "pagination" => $pagination]);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'library filter exceptions');
        }
    }

    public function trending() {
        try {

            return $this->apiResponse(200, 'successfully fetch', $this->trendingQuery());
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'get trending exceptions');
        }
    }

    public function trendingQuery() {
        $data = array();
        $catalog = ContentViews::select('content_id', DB::raw("SUM(views) as SUM"))
                ->groupBy('content_id')
                ->orderBy('SUM', 'desc')
                ->paginate($this->maxResults);

        $catalog->each(function ($query) {
            $value = Content::leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                            ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'authors.author_name')
                            ->Where('status', 'published')
                            ->where(['contents.is_deleted' => 0])
                            ->where('content_id', $query->content_id)->first();
            if (!empty($value)) {
                $query->encrypted_content_id = $value->encrypted_content_id;
                $query->title = $value->title;
                $query->description = $value->description;
                $query->publisher_id = $value->publisher_id;
                $query->category_id = $value->category_id;
                $query->author_id = $value->author_id;
                $query->author_name = $value->author_name;
                $query->class_id = $value->class_id;
                $query->content_type = $value->content_type;
                $query->content_price = $value->content_price;
                $query->main_content_image = $value->main_content_image;
                $query->tags = $value->tags;
                $query->status = $value->status;
            }
        });

        $pagination = array(
            'current_page' => $catalog->currentPage(),
            'total' => $catalog->total(),
            'lastPage' => $catalog->lastPage(),
            'per_page' => $catalog->perPage(),
            'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? NULL : $catalog->lastPage(),
            'path' => $catalog->path(),
        );
        foreach ($catalog as $key => $value) :
            if (!empty($value->encrypted_content_id)) {
                $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';
                array_push(
                        $data, array(
                    "content_id" => $value->content_id,
                    "encrypted_content_id" => $value->encrypted_content_id,
                    'title' => $value->title,
                    'description' => $value->description,
                    'publisher_id' => $value->publisher_id,
                    "category_id" => get_categories(json_decode($value->category_id)),
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
                        )
                );
            }
        endforeach;
        return ["catalog" => $data, "pagination" => $pagination];
    }

    public function catalog_filter(Request $request) {
        $req = $request->all();
        try {
            $data = [];

            extract($req);

            $where = [];

            if ($categories) {
                $where['category_id'] = $categories;
            }
            if ($class) {
                $where['class_id'] = $class;
            }
            if ($publisher) {
                $where['publisher_id'] = $publishers;
            }

            $catalog = Content::Where($where)
                    ->select(
                            'content.*', 'contents.image_cover as main_content_image', 'authors.*', 'contents.content_id as encrypted_content_id'
                    )
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->paginate($this->maxResults);

            $record = $catalog;

            $pagination = array(
                'current_page' => $catalog->currentPage(),
                'total' => $catalog->total(),
                'lastPage' => $catalog->lastPage(),
                'per_page' => $catalog->perPage(),
                'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? '' : $catalog->lastPage(),
                'path' => $catalog->path(),
            );

            foreach ($record as $key => $value) :
                $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';
                array_push(
                        $data, array(
                    "content_id" => $value->content_id,
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
                        )
                );
            endforeach;

            return $this->apiResponse(200, 'successfully fetch', ["catalog" => $data, "pagination" => $pagination]);
        } catch (\Exception $ex) {
            return $this->apiResponse(201, 'search filter exceptions');
        }
    }

    public function content_catalog(Request $request) {
        $req = $request->all();
        Log::Info(print_r($req,true));
        try {
            $data = [];

            extract($req);

            $where = [];

            if ($categories) {
                $where['category_id'] = $categories;
            }
            if ($class) {
                $where['class_id'] = $class;
            }
            if ($publishers) {
                $where['publisher_id'] = $publishers;
            }
            // if ($author) {
            //     $where['author_id'] = $author;
            // }
            // if ($category) {
            //     $where['category_id'] = $category;
            // }
            // if ($isbn) {
            //     $where['isbn_content'] = $isbn;
            // }
             if (!empty($content_type)) {
                 $where['content_type'] = get_content_type_key_by_id($content_type);
             }
            $catalog = Content::leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->select(
                            'contents.*', 'contents.image_cover as main_content_image', 'authors.*', 'contents.content_id as encrypted_content_id'
                    )
                    ->where($where)->where(['is_deleted' => 0])
                    ->paginate($this->maxResults);

            $record = $catalog;

            $pagination = array(
                'current_page' => $catalog->currentPage(),
                'total' => $catalog->total(),
                'lastPage' => $catalog->lastPage(),
                'per_page' => $catalog->perPage(),
                'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? null : $catalog->lastPage(),
                'path' => $catalog->path(),
            );

            foreach ($record as $key => $value) :
                $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';
                array_push(
                        $data, array(
                    "content_id" => $value->content_id,
                    'encrypted_content_id' => $value->encrypted_content_id,
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
                        )
                );
            endforeach;

            return $this->apiResponse(200, 'successfully fetch', ["catalog" => $data, "pagination" => $pagination]);
        } catch (\Exception $ex) {
            Log::Info('content filter exceptions'.$ex->getMessage());
            return $this->apiResponse(201, 'content filter exceptions');
        }
    }
    
     public function reportsListOfBooks(Request $request) {
        $req = $request->all();
        Log::Info(print_r($req,true));
        try {
            $data = [];

            extract($req);

            $where = [];

         
            if ($class) {
                $where['class_id'] = $class;
            }
          
            $catalog = Content::leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->select(
                            'contents.*', 'contents.image_cover as main_content_image', 'authors.*', 'contents.content_id as encrypted_content_id'
                    )
                    ->where($where)->where(['is_deleted' => 0])
                    ->paginate($this->maxResults);
            $record = $catalog;
            $pagination = array(
                'current_page' => $catalog->currentPage(),
                'total' => $catalog->total(),
                'lastPage' => $catalog->lastPage(),
                'per_page' => $catalog->perPage(),
                'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? null : $catalog->lastPage(),
                'path' => $catalog->path(),
            );

            foreach ($record as $key => $value) :
                array_push(
                        $data, array(
                    "content_id" => $value->content_id,
                    'encrypted_content_id' => $value->encrypted_content_id,
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
                    "main_content_image" => $value->main_content_image,
                    "tags" => $value->tags,
                    "status" => $value->status,
                        )
                );
            endforeach;

            return $this->apiResponse(200, 'successfully fetch', ["catalog" => $data, "pagination" => $pagination]);
        } catch (\Exception $ex) {
            Log::Info('content filter exceptions'.$ex->getMessage());
            return $this->apiResponse(201, 'content filter exceptions');
        }
    }

}
