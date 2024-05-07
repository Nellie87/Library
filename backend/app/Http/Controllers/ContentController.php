<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Content;
use Validator;
use ZipArchive;
use Illuminate\Support\Facades\DB;
use App\User;
use App\Models\ContentViews;
use App\Models\ContentClass;
use App\Models\Categories;
use App\Models\Rating;
use App\Models\Comment;
use App\Models\ContentDrmSettings;
use App\Models\Transaction;
use phpDocumentor\Reflection\Types\Null_;
use App\Models\Contentlikes;
use App\Models\Readercontents;
use App\Models\UserDevices;
use Exception;
use Illuminate\Support\Facades\Mail;
use PDF;
use App\Models\Subcategories;
// use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;
use setasign\Fpdi\Fpdi;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Reader\Csv;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Scriptotek\Marc\Collection;
use CURLFile;

class ContentController extends Controller {

    private $url;
    private $contentUrl;
    private $profileUrl;
    private $maxResults;

    function __construct() {
           
        // $this->middleware('auth:api');
        $this->url = url() . '/image';
        $this->contentUrl = get_content_files_path();
        $this->profileUrl = get_profile_path();
        $this->maxResults = maxresult();
    }

    public function index(Request $request) {
        // try {
        $the_file = $request->file('uploaded_file');
        $spreadsheet = IOFactory::load($the_file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $row_limit = $sheet->getHighestDataRow();
        $column_limit = $sheet->getHighestDataColumn();
        $row_range = range(2, $row_limit);
        $column_range = range('F', $column_limit);
        $startcount = 2;
        $data = array();
        $zipfilename = $request->file('zip_file');
        foreach ($row_range as $row) {
            // create array for check check upload content and image
            $title = $sheet->getCell('A' . $row)->getValue();
            $content_type = $sheet->getCell('D' . $row)->getValue();
            $class_name = $sheet->getCell('E' . $row)->getValue();
            $category_name = $sheet->getCell('F' . $row)->getValue();
            $image_cover = $sheet->getCell('L' . $row)->getValue();
            $upload_content = $sheet->getCell('M' . $row)->getValue();
            $publishing_year = $sheet->getCell('N' . $row)->getValue();
            $author_name = $sheet->getCell('P' . $row)->getValue();
            $edition = $sheet->getCell('J' . $row)->getValue();
            $copy_paste = $sheet->getCell('X' . $row)->getValue();
            $printing = $sheet->getCell('Y' . $row)->getValue();
            $download = $sheet->getCell('Z' . $row)->getValue();
            $number_of_devices = $sheet->getCell('U' . $row)->getValue();

            $array = array();
            if ($zipfilename) {
                $zip1 = zip_open($zipfilename);
                if ($zip1) {
                    while ($zip_entry = zip_read($zip1)) {
                        $current_file = zip_entry_name($zip_entry);
                        $current_file = explode("/", $current_file);

                        if (!empty($current_file[1])) {
                            $current_file = $current_file[1];
                        }
                        array_push($array, $current_file);
                    }

                    zip_close($zip1);
                }
            }
            // return api_response(201, $array,$upload_content);
            //validation for files
            if ($upload_content) {
                if (!in_array($upload_content, $array)) {
                    return api_response(201, 'This content file is not available inside zip for the content: [' . $title . '] - ' . $upload_content);
                }
            }

            if ($image_cover) {
                if (!in_array($image_cover, $array)) {
                    return api_response(201, 'The Image cover is not available inside zip for the content: [' . $title . ']  - ' . $image_cover);
                }
            }


            if (empty($publishing_year)) {
                return api_response(201, 'Please fill publishing year for the content: [' . $title . ']  -' . $publishing_year);
            }


            // special fields start
            if (empty($content_type)) {
                return api_response(201, 'Please fill Content Type for the content: [' . $title . ']  -' . $publishing_year);
            }

            if (!empty($content_type) && !in_array($content_type, ['free', 'paid', 'membership'])) {
                return api_response(201, 'Please correct Content Type for the content: [' . $title . ']  -' . $content_type . ' It should be (free, paid, membership)');
            }

            $classes = get_classes_keys();
            if (empty($class_name)) {
                return api_response(201, 'Please fill Class Name for the content: [' . $title . ']  -' . $class_name);
            }

            if (!empty($class_name) && !in_array(strtolower($class_name), $classes)) {
                return api_response(201, 'Please correct Class Name for the content: [' . $title . ']  -' . $class_name . ' It should be (' . implode(',', array_map('strtoupper', $classes)) . ')');
            }

            // special fields end


            $ext = pathinfo($upload_content, PATHINFO_EXTENSION);
            // print_r ($array);
            if ($upload_content) {
                if ($class_name == "ebook") {
                    if ($ext == "pdf" || $ext == "epub") {
                        
                    } else {
                        return api_response(201, 'Please select correct file format for the content [' . $title . '], It should be (pdf,epub)');
                    }
                } elseif ($class_name == "slide") {
                    if ($ext == "ppt" || $ext == "pptx") {
                        
                    } else {
                        return api_response(201, 'Please select correct file format for the content [' . $title . '], It should be (ppt,pptx)');
                    }
                } elseif ($class_name == "audio" || $class_name == "video") {
                    if ($ext == "webm" || $ext == "mp4" || $ext == "mpeg" || $ext == "mp3" || $ext == ".ogv") {
                        
                    } else {
                        return api_response(201, 'Please select correct file format for the content [' . $title . '], It should be (webm,mp4,mpeg,mp3,ogv)');
                    }
                }
            }
            // handle class name with title
            // match category name with title
            //Copy paste	Printing	Downloads Number of devices

            $contentClassId = '';
            if ($class_name) {
                $contentClassId = ContentClass::select('class_id')
                        ->where('class_name', $class_name)
                        ->first();
            }

            $contentCategoryId = '';
            if ($category_name) {
                $explode = explode(",", $category_name);

                $cats = Categories::where('category_name', '!=', "")
                        ->whereIn('category_name', array_values($explode))
                        ->pluck('category_id')
                        ->all();
                if (is_array($cats) && count($cats) > 0) {
                    $contentCategoryId = implode(',', $cats);
                    ;
                }
            }
            $data[] = array(
                "title" => $sheet->getCell('A' . $row)->getValue(),
                "description" => $sheet->getCell('B' . $row)->getValue(),
                "genre" => $sheet->getCell('C' . $row)->getValue(),
                "publisher_id" => Auth::id(),
                "content_type" => $sheet->getCell('D' . $row)->getValue(),
                "content_price" => $sheet->getCell('R' . $row)->getValue(),
                "class_id" => $contentClassId,
                "category_id" => $contentCategoryId,
                "isbn_content" => $sheet->getCell('G' . $row)->getValue(),
                "class_number" => $sheet->getCell('H' . $row)->getValue(),
                "content_subject" => $sheet->getCell('I' . $row)->getValue(),
                "subtitle" => $sheet->getCell('K' . $row)->getValue(),
                "image_cover" => $sheet->getCell('L' . $row)->getValue(),
                "upload_content" => $sheet->getCell('M' . $row)->getValue(),
                "tags" => $sheet->getCell('AB' . $row)->getValue(),
                "edition" => $sheet->getCell('J' . $row)->getValue(),
                "editor" => $sheet->getCell('Q' . $row)->getValue(),
                "publishing_year" => $sheet->getCell('N' . $row)->getValue(),
                "content_reader" => $sheet->getCell('AC' . $row)->getValue(),
                "language" => $sheet->getCell('O' . $row)->getValue(),
                "discounted_price" => $sheet->getCell('S' . $row)->getValue(),
                "currency" => $sheet->getCell('T' . $row)->getValue(),
                "no_of_copies" => $sheet->getCell('U' . $row)->getValue(),
                "display_upto" => ($sheet->getCell('W' . $row)->getValue() == TRUE || strtolower($sheet->getCell('W' . $row)->getValue()) == 'yes') ? -1 : $sheet->getCell('V' . $row)->getValue(),
            );
            $startcount++;


            if (Auth::user()->user_type == 'admin') {
                $data['status'] = 'published';
            } else {
                $data['status'] = 'pending';
            }

            if (!empty($author_name)) {
                $data['author_id'] = $this->create_author($author_name);
            }

            $count = Content::where(['title' => $title, 'edition' => $edition])->count();
            $contents = [];
            if ($count == 0) {
                $bulkUpload = Content::create($data);
                if ($bulkUpload) {
                    $content_id = $bulkUpload->id;
                    $this->sendReviewEmail($content_id);
                    $audit_data = array(
                        "user_id" => Auth::id(),
                        "module_id" => $content_id,
                        "module" => "Content",
                        "activity" => "create",
                    );
                    audit($audit_data);
                    $contentDrmSettings_array = array(
                        'content_id' => $content_id,
                        'copy_paste' => ($copy_paste == TRUE || strtolower($copy_paste) == 'yes') ? 1 : 0,
                        'printing' => ($printing == TRUE || strtolower($printing) == 'yes') ? 1 : 0,
                        'Downloads' => ($download == TRUE || strtolower($download) == 'yes') ? 1 : 0,
                        'number_of_devices' => !empty($number_of_devices) ? $number_of_devices : 1,
                    );
                    $drmResult = ContentDrmSettings::create($contentDrmSettings_array);
                    //Read zip file data
                    if ($zipfilename) {
                        $zip1 = zip_open($zipfilename);
                        if ($zip1) {
                            while ($zip_entry = zip_read($zip1)) {
                                //   echo "<p>Name: " . zip_entry_name($zip_entry) . "<br>";
                                $img_cover_ext = pathinfo($image_cover, PATHINFO_EXTENSION);
                                $this->zip_file_index($content_id, $zipfilename, $zip_entry, $row, "Image Cover", "image_cover", "", $img_cover_ext);
                                $this->zip_file_index($content_id, $zipfilename, $zip_entry, $row, "Upload Content", "upload_content", strtolower($class_name), $ext);
                            }
                            zip_close($zip1);
                        }
                    } else {
                        Log::Info('No Zip');
                    }
                }
            } else {

                array_push($contents, $title);
                Log::Info('Content is already exists ' . $title);
            }
        }
        //    echo api_response(200,$data);
        return api_response(200, "file", $data);
        // } catch (\Exception $ex) {
        //     return api_response(200, $ex->getMessage());
        // }
    }

    public function getContentsCategoryWise(Request $request) {

        DB::enableQueryLog();
        $categories = Categories::get();
        $categories->each(function ($query) {
            if (!empty($query->category_image)) {
                $query->category_image = url() . '/files/contents/category_icons/' . $query->category_image;
            }
        });
        $categories->each(function ($category) {
            $category->contents = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->leftjoin('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                    ->whereRaw('FIND_IN_SET(' . $category->category_id . ',category_id)')
                    ->select(
                            'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'description', 'publishing_house', 'publisher_id', 'genre', 'authors.author_name', 'author_id', 'publishing_date', 'language', 'content_type', 'status', 'image_index', 'image_cover as main_content_image', 'reject_reason', 'cds.setting_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices', 'class_id', 'discounted_price', 'content_price', 'reader_contents.subscription_remove', 'reader_contents.subscription_on', 'reader_contents.is_reading', 'reader_contents.is_reading'
                    )
                    ->where("is_deleted", '!=', 1)
                    ->where('contents.status', 'published')
                    ->get();
        });
        if ($categories) {
            return api_response(200, 'get contents category wise', $categories);
        } else {
            return api_response(201, 'get contents category wise error');
        }
    }

    public function getContentsCategoryWiseHome(Request $request) {

        DB::enableQueryLog();
        $categories = Categories::get();
        $categories->each(function ($query) {
            if (!empty($query->category_image)) {
                $query->category_image = url() . '/files/contents/category_icons/' . $query->category_image;
            }
        });
        $categories->each(function ($category) use($request) {
            $records = 12;
            if(!empty($request->show_single_row)){
                $records=4;
            }
            $category->contents = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->whereRaw('FIND_IN_SET(' . $category->category_id . ',category_id)')
                    ->select(
                            'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'description', 'publishing_house', 'publisher_id', 'genre', 'authors.author_name', 'author_id', 'publishing_date', 'language', 'content_type', 'status', 'image_index', 'image_cover as main_content_image', 'reject_reason', 'cds.setting_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices', 'class_id', 'discounted_price', 'content_price'
                    )
                    ->where("is_deleted", '!=', 1)
                    ->where('contents.status', 'published')
                    ->paginate($records, ['*'], 'page', 1);
        });
        if ($categories) {
            return api_response(200, 'get contents category wise', $categories);
        } else {
            return api_response(201, 'get contents category wise error');
        }
    }

    public function getContentsPublic(Request $request) {

        try {

            if (!empty($request->contents_ids)) {
                $main_query = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                        ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                        ->leftjoin('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                        ->select(
                                'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'description', 'publishing_house', 'publisher_id', 'genre', 'authors.author_name', 'author_id', 'publishing_year as publishing_date', 'language', 'content_type', 'status', 'image_index', 'image_cover as main_content_image', 'reject_reason', 'cds.setting_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices', 'class_id', 'discounted_price', 'content_price', 'reader_contents.subscription_on', 'reader_contents.is_reading', 'reader_contents.is_reading'
                        )
                        ->where("is_deleted", '!=', 1)
                        ->where('contents.status', 'published')
                        ->where(function ($query) use ($request) {
                    if (!empty($request->contents_ids)) {
                        $contents_ids = array();
                        foreach ($request->contents_ids as $content_id => $qty) {
                            //                            $content_id = custom_encryption('decrypt',$content_id);
                            array_push($contents_ids, $content_id);
                        }
                        $query->whereIn('contents.content_id', array_values($contents_ids));
                    }
                });
                $main_query->orderby('contents.created_at', 'desc');
                $contents = $main_query->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);


                if ($contents) {
                    return api_response(200, 'get content public.', $contents);
                } else {
                    return api_response(201, 'get content public error');
                }
            } else {
                return api_response(201, 'get content public error');
            }
        } catch (\Exception $ex) {
            Log::Info('get content public exception' . $ex->getMessage());
            return api_response(201, 'get content public exception');
        }
    }
    
    function recommendedCondition($query,$data_key,$key){
        if (Auth::check()) {
             $query->orWhere(function ($query) use($data_key,$key){
                $interests =Auth::user()->getUserDetail->$data_key;
                if(!empty($interests)){
                $interests = explode(",", $interests);
                
                if(is_array($interests) && count($interests)>0){
                  foreach ($interests as $interest) {
                         $query->orWhereRaw('FIND_IN_SET('.$interest.', '.$key.')');
                    }
                }else{
                 $query->whereRaw('FIND_IN_SET('.$interests.', '.$key.')');
                }
                }
            });
        }
    }

     public function recommendedContents() {
        try {
           DB::enableQueryLog();
       $catalog = Content::where('status', 'published')
               ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
               ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'authors.author_name')
                        ->where(function ($query) {
                                $this->recommendedCondition($query,'interest_categories','category_id');
                                $this->recommendedCondition($query,'interest_sub_categories','sub_category_id');
                            })
                                ->where(['contents.is_deleted' => 0])
                                ->paginate($this->maxResults);
                             
           if($catalog){
            $record = $catalog;
            $pagination = array(
                'current_page' => $catalog->currentPage(),
                'total' => $catalog->total(),
                'lastPage' => $catalog->lastPage(),
                'per_page' => $catalog->perPage(),
                'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? null : $catalog->lastPage(),
                'path' => $catalog->path(),
            );
            $data =[];
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
           
            return $this->apiResponse(200, 'Recommended contents successfully fetched', ["catalog" => $data, "pagination" => $pagination]);
         }else{
              return $this->apiResponse(201, 'No recommended contents');
         }
        } catch (\Exception $ex) {
            Log::Info('Recommended contents' . $ex->getMessage());
            return $this->apiResponse(201, 'Recommended contents exception');
        }
    }


    public function getContents(Request $request) {
      

        try {
         

            //Audit save
            if (!empty($request) && Auth::check()) {
                if (!empty($request->classes) || !empty($request->search_text) || !empty($request->categories) || !empty($request->author) || !empty($request->publisher)) {
                    $audit_data = array(
                        "user_id" => Auth::id(),
                        "module" => "Content",
                        "activity" => "search"
                    );
                    $old = array();
                    $new = [
                        'classes' => $request->classes,
                        'search_text' => $request->search_text,
                        'categories' => $request->categories,
                        'sub_categories' => $request->sub_categories,
                        'author' => $request->author,
                        'publisher' => $request->publisher
                    ];
                    $return = audit($audit_data, $old, $new);
                }
            }
            $main_query = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    // ->leftjoin('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                    ->select(
                            'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'description', 'publishing_house', 'publisher_id', 'genre', 'authors.author_name', 'author_id', 'publishing_year as publishing_date', 'language', 'content_type', 'status', 'temp_record', 'image_index', 'image_cover as main_content_image', 'reject_reason', 'cds.setting_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices', 'class_id', 'discounted_price', 'content_price'
                            // 'reader_contents.subscription_remove',
                            // 'reader_contents.subscription_on',
                            // 'reader_contents.is_reading',
                    )
                    ->where("is_deleted", '!=', 1)
                    ->where(function ($query) use ($request) {
                if (!empty($request->contents_ids)) {
                    $contents_ids = array();
                    foreach ($request->contents_ids as $content_id => $qty) {
                        //                            $content_id = custom_encryption('decrypt',$content_id);
                        array_push($contents_ids, $content_id);
                    }
                    $query->whereIn('contents.content_id', array_values($contents_ids));
                }


                if (!empty($request->class_id)) {

                    $query->where('contents.class_id', $request->class_id);
                }
                if (!empty($request->search_text)) {

                    $query->where(function ($query) use ($request) {
                        if(!empty($request->search_for) && $request->search_for == 'title'){
                             $query->where('contents.title', 'like', "%$request->search_text%")
                                   ->orWhere('contents.subtitle', 'like', "%$request->search_text%");
                        }elseif(!empty($request->search_for) && $request->search_for == 'author'){
                             $query->where('authors.author_name', 'like', "%$request->search_text%");
                        }elseif(!empty($request->search_for) && $request->search_for == 'publishing_house'){
                             $query->where('contents.publishing_house', 'like', "%$request->search_text%");
                        }else{
                             $query->where('contents.title', 'like', "%$request->search_text%")
                          ->orWhere('contents.subtitle', 'like', "%$request->search_text%")
                          ->orWhere('contents.content_subject', 'like', "%$request->search_text%")
                          ->orWhere('contents.genre', 'like', "%$request->search_text%")
                        ->orWhere('authors.author_name', 'like', "%$request->search_text%")
                        ->orWhere('contents.publishing_house', 'like', "%$request->search_text%")
                        ->orWhere('contents.isbn_content', 'like', "%$request->search_text%");
                        }
                    });
                }


                if (Auth::check()) {
                    if (Auth::user()->user_type == 'publisher') {
                        $query->where('publisher_id', Auth::id());
                        if (empty($request->my_contents)) {
                            $query->orWhere('status', 'published');
                        }
                    } elseif (Auth::user()->user_type == 'reader' || Auth::user()->user_type == 'junior_reader') {
                        $query->where('status', 'published');
                        if (Auth::user()->user_type == 'junior_reader') {
                            $query->whereIn('content_reader', ['junior', 'both']);
                        }
                    } elseif (Auth::user()->user_type == 'staff') {
                        $query->where("temp_record", '!=', 1);
                    } elseif (Auth::user()->user_type == 'admin') {
                        $query->where("temp_record", '!=', 1)
                        ->where('publisher_id', '!=', Auth::id());
                        $query->orWhere(function ($query) {
                            $query->where("temp_record", 1)
                            ->where('publisher_id', Auth::id());
                        });
                    }
                } else {
                    // For public site
                    $query->where('status', 'published');
                }

                if (!empty($request->categories)) {

                    $categories = explode(',', $request->categories);

                    $query->where(function ($query) use ($categories) {
                        foreach ($categories as $category_id) {
                            $query->orWhere(function ($query) use ($category_id) {
                                $query->whereRaw('FIND_IN_SET(' . $category_id . ',category_id)');
                            });
                        }
                    });
                }
                if (!empty($request->sub_categories)) {

                    $categories = explode(',', $request->sub_categories);

                    $query->where(function ($query) use ($categories) {
                        foreach ($categories as $category_id) {
                            $query->orWhere(function ($query) use ($category_id) {
                                $query->whereRaw('FIND_IN_SET(' . $category_id . ',sub_category_id)');
                            });
                        }
                    });
                }
                if (!empty($request->classes)) {
                    $classes = explode(',', $request->classes);
                    $classes = implode(',', $classes);
                    $query->whereRaw('FIND_IN_SET(class_id,"' . $classes . '")');
                }


                if (!empty($request->publisher)) {
                    $publishers = explode(',', $request->publisher);
                    $query->whereIn('publisher_id', array_values($publishers));
                }


                if (!empty($request->author)) {
                    $authors = explode(',', $request->author);
                    $query->whereIn('author_id', array_values($authors));
                }

                if (!empty($request->publishing_year)) {
                    $query->where('publishing_year', $request->publishing_year);
                }

                if (!empty($request->content_type)) {
                    $content_type = explode(',', $request->content_type);

                    if (in_array('paid', array_values($content_type))) {
                        if ($request->price_range_min && $request->price_range_max) {
                            $query->whereBetween('content_price', [$request->price_range_min, $request->price_range_max]);
                            $query->where('content_type', 'paid');
                            if (count($content_type) > 1) {
                                $query->orWhere(function ($query) use ($content_type) {
                                    if (($key = array_search('paid', $content_type)) !== false) {
                                        unset($content_type[$key]);
                                    }
                                    $query->whereIn('content_type', array_values($content_type));
                                });
                            }
                        } else {
                            $query->whereIn('content_type', array_values($content_type));
                        }
                    } else {
                        $query->whereIn('content_type', array_values($content_type));
                    }
                }
            });

            if (!empty($request->sort_by)) {
                $main_query->orderby('contents.created_at', $request->sort_by);
            } else {
                $main_query->orderby('contents.created_at', 'desc');
            }

            $contents = $main_query->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);
            $contents->each(function ($content) {
                $content->content_actual_price = (int) $content->content_price;
                $content->discounted_price = (int) $content->discounted_price;
                if($content->discounted_price<$content->content_price){
                    $content->content_price = (int) $content->discounted_price;
                }
                if ($content->temp_record == 1) {
                    $content->status = "temp";
                } else {
                    $content->status = $content->status;
                }
                $class_detail = get_class_detail($content->class_id);
                $content->class_title_s = $class_detail->class_title_s;
                $content->class_name = $class_detail->class_name;
                $content->rating = $this->rating($content->content_id);
                $readercontent = Readercontents::select(
                                'subscription_remove', 'subscription_on', 'is_reading'
                        )->where(['content_id' => $content->content_id, 'reader_id' => Auth::id()])->first();

                $content->subscription_remove = (!empty($readercontent->subscription_on)) ? $readercontent->subscription_remove : null;
                $content->subscription_on = (!empty($readercontent->subscription_on)) ? $readercontent->subscription_on : null;
                $content->is_reading = (!empty($readercontent->is_reading)) ? $readercontent->is_reading : null;
            });
       
            if ($contents) {
                return api_response(200, 'get content.', $contents);
            } else {
                return api_response(201, 'get content error');
            }
        } catch (\Exception $ex) {
            Log::Info('get content exception' . $ex->getMessage());
            return api_response(201, 'get content exception');
        }
    }

    public function getLibraryContents(Request $request) {
    

        try {
            DB::enableQueryLog();

            //Audit save
            if (!empty($request) && Auth::check()) {
                if (!empty($request->classes) || !empty($request->search_text) || !empty($request->categories) || !empty($request->author) || !empty($request->publisher)) {
                    $audit_data = array(
                        "user_id" => Auth::id(),
                        "module" => "Content",
                        "activity" => "search"
                    );
                    $old = array();
                    $new = $request->all();
                    foreach ($new as $ky => $vl) {
                        if (empty($vl)) {
                            unset($new[$ky]);
                        }
                        if ($ky == 'content_type' && strpos($vl, 'paid') == false) {
                            unset($new['price_range_min']);
                            unset($new['price_range_max']);
                        }
                    }
                    unset($new['current_page']);
                    unset($new['per_page_limit']);

                
                    $return = audit($audit_data, $old, $new);
                }
            }
            $main_query = $this->querySearchAll($request)
                    ->select(
                            'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'description', 'publishing_house', 'publisher_id', 'genre', 'authors.author_name', 'author_id', 'publishing_year as publishing_date', 'language', 'content_type', 'status', 'temp_record', 'image_index', 'image_cover as main_content_image', 'reject_reason', 'cds.setting_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices', 'class_id', 'discounted_price', 'content_price'
                    )
                   
                    ->where(function ($query) use ($request) {
                if (!empty($request->class_id)) {
                    $query->where('contents.class_id', $request->class_id);
                }
             
                if (!empty($request->categories)) {
                    $categories = explode(',', $request->categories);
                    $query->where(function ($query) use ($categories) {
                        foreach ($categories as $category_id) {
                            $query->orWhere(function ($query) use ($category_id) {
                                $query->whereRaw('FIND_IN_SET(' . $category_id . ',category_id)');
                            });
                        }
                    });
                }
                if (!empty($request->sub_categories)) {
                    $categories = explode(',', $request->sub_categories);
                    $query->where(function ($query) use ($categories) {
                        foreach ($categories as $category_id) {
                            $query->orWhere(function ($query) use ($category_id) {
                                $query->whereRaw('FIND_IN_SET(' . $category_id . ',sub_category_id)');
                            });
                        }
                    });
                }
                if (!empty($request->classes)) {
                    $classes = explode(',', $request->classes);
                    $classes = implode(',', $classes);
                    $query->whereRaw('FIND_IN_SET(class_id,"' . $classes . '")');
                }


                if (!empty($request->publisher)) {
                    $publishers = explode(',', $request->publisher);
                    $query->whereIn('publisher_id', array_values($publishers));
                }


                if (!empty($request->author)) {
                    $authors = explode(',', $request->author);
                    $query->whereIn('author_id', array_values($authors));
                }

                if (!empty($request->publishing_year)) {
                    $query->where('publishing_year', $request->publishing_year);
                }

                if (!empty($request->content_type)) {
                    $content_type = explode(',', $request->content_type);


                    if (in_array('paid', array_values($content_type))) {
                        if ($request->price_range_min && $request->price_range_max) {
                            $query->whereBetween('content_price', [$request->price_range_min, $request->price_range_max]);
                            $query->where('content_type', 'paid');

                            if (count($content_type) > 1) {
                                $query->orWhere(function ($query) use ($content_type) {
                                    if (($key = array_search('paid', $content_type)) !== false) {
                                        unset($content_type[$key]);
                                    }
                                    $query->whereIn('content_type', array_values($content_type));
                                });
                            }
                        } else {
                            $query->whereIn('content_type', array_values($content_type));
                        }
                    } else {
                        $query->whereIn('content_type', array_values($content_type));
                    }
                }
            });

            if (!empty($request->sort_by)) {
                $main_query->orderby('contents.created_at', $request->sort_by);
            } else {
                $main_query->orderby('contents.created_at', 'desc');
            }

            $contents = $main_query->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);
          
            $contents->each(function ($content) {
                if ($content->temp_record == 1) {
                    $content->status = "temp";
                } else {
                    $content->status = $content->status;
                }
                $class_detail = get_class_detail($content->class_id);
                $content->class_title_s = $class_detail->class_title_s;
                $content->class_name = $class_detail->class_name;
                $content->rating = $this->rating($content->content_id);
                if(Auth::check()){
                    $readercontent = Readercontents::select(
                                    'subscription_remove', 'subscription_on', 'is_reading'
                            )->where(['content_id' => $content->content_id, 'reader_id' => Auth::id()])
                            ->where(DB::raw('DATE_FORMAT(subscription_end,"%Y-%m-%d")'), '>', \Carbon\Carbon::now()->format('Y-m-d'))
                            ->first();
                    if ($readercontent) {
                        $content->is_subscribed = 1;
                        $content->subscription_remove = (!empty($readercontent->subscription_on)) ? $readercontent->subscription_remove : null;
                        $content->subscription_on = (!empty($readercontent->subscription_on)) ? $readercontent->subscription_on : null;
                        $content->is_reading = (!empty($readercontent->is_reading)) ? $readercontent->is_reading : null;
                    } else {
                        $content->is_subscribed = 0;
                    }
                }

            });
            // Log::Info('getContents');
            //// Log::Info(print_r($contents,true));
            if ($contents) {
                return api_response(200, 'get content.', $contents);
            } else {
                return api_response(201, 'get library contents error');
            }
        } catch (\Exception $ex) {
            Log::Info('get content exception' . $ex->getMessage());
            return api_response(201, 'get  library contents exception');
        }
    }

    public function getContentTitlesSuggestionList(Request $request) {

        try {
            DB::enableQueryLog();
            $contents = $this->querySearchAll($request)->pluck('title')->all();
  
            if ($contents) {
                return api_response(200, 'suggestion list found', $contents);
            } else {
                return api_response(201, 'No suggestion list found');
            }
        } catch (\Exception $ex) {
            Log::Info('get content exception' . $ex->getMessage());
            return api_response(201, 'get content exception');
        }
    }

    function querySearchAll($request){
         return Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                     ->where("contents.is_deleted",0)
                    ->where(function ($query) use ($request){
                         if (!empty($request->search_text)) {

                      $query->where(function ($query) use ($request) {
                        if(!empty($request->search_for) && $request->search_for == 'title'){
                             $query->where('contents.title', 'like', "%$request->search_text%")
                                   ->orWhere('contents.subtitle', 'like', "%$request->search_text%");
                        }elseif(!empty($request->search_for) && $request->search_for == 'author'){
                             $query->where('authors.author_name', 'like', "%$request->search_text%");
                        }elseif(!empty($request->search_for) && $request->search_for == 'publishing_house'){
                             $query->where('contents.publishing_house', 'like', "%$request->search_text%");
                        }else{

                             $query->where('contents.title', 'like', "%$request->search_text%")
                            ->orWhere('contents.subtitle', 'like', "%$request->search_text%")
                            ->orWhere('contents.content_subject', 'like', "%$request->search_text%")
                            ->orWhere('contents.tags', 'like', "%$request->search_text%")
                            ->orWhere('contents.genre', 'like', "%$request->search_text%")
                            ->orWhere('authors.author_name', 'like', "%$request->search_text%")
                            ->orWhere('contents.publishing_house', 'like', "%$request->search_text%")
                            ->orWhere('contents.isbn_content', 'like', "%$request->search_text%");
                        
                          $category_ids = DB::table('categories')->where('category_name', 'like', "%$request->search_text%")->pluck('category_id')->all();
                            if(count($category_ids)>0){
                             $query->orWhereIn('contents.category_id',$category_ids);   
                            }
                       
                         $sub_category_ids = DB::table('sub_categories')->where('sub_category_name', 'like', "%$request->search_text%")->pluck('sub_category_id')->all();
                            if(count($sub_category_ids)>0){
                             $query->orWhereIn('contents.sub_category_id',$sub_category_ids);   
                            }

                        }

                            });
                        }
                        if(Auth::check() && Auth::user()->user_type == 'junior_reader'){
                                $query->whereIn('content_reader', ['junior', 'both']);
                         }

                        $query->where('status', 'published');
                    });
          
    }

    public function myPublications(Request $request) {
    

        try {
            DB::enableQueryLog();

            $main_query = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    // ->leftjoin('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                    ->select(
                            'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'description', 'publishing_house', 'publisher_id', 'genre', 'authors.author_name', 'author_id', 'publishing_year as publishing_date', 'language', 'content_type', 'status', 'temp_record', 'image_index', 'image_cover as main_content_image', 'reject_reason', 'cds.setting_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices', 'class_id', 'discounted_price', 'content_price'
                    )
                    ->where("is_deleted", '!=', 1)
                    ->where(function ($query) use ($request) {
                if (!empty($request->class_id)) {
                    $query->where('contents.class_id', $request->class_id);
                }
                if (!empty($request->search_text)) {
                    $query->where(function ($query) use ($request) {
                        $query->where('contents.title', 'like', "%$request->search_text%")
                        ->orWhere('contents.description', 'like', "%$request->search_text%")
                        ->orWhere('authors.author_name', 'like', "%$request->search_text%")
                        ->orWhere('contents.publishing_house', 'like', "%$request->search_text%")
                        ->orWhere('contents.isbn_content', 'like', "%$request->search_text%");
                    });
                }
                if (Auth::user()->user_type == 'publisher') {
                    $query->where('publisher_id', Auth::id());
                }


                if (!empty($request->categories)) {
                    $categories = explode(',', $request->categories);
                    $query->where(function ($query) use ($categories) {
                        foreach ($categories as $category_id) {
                            $query->orWhere(function ($query) use ($category_id) {
                                $query->whereRaw('FIND_IN_SET(' . $category_id . ',category_id)');
                            });
                        }
                    });
                }
                if (!empty($request->sub_categories)) {
                    $categories = explode(',', $request->sub_categories);
                    $query->where(function ($query) use ($categories) {
                        foreach ($categories as $category_id) {
                            $query->orWhere(function ($query) use ($category_id) {
                                $query->whereRaw('FIND_IN_SET(' . $category_id . ',sub_category_id)');
                            });
                        }
                    });
                }
            });

            if (!empty($request->content_status)) {
                $main_query->where('contents.status', $request->content_status);
            } 

            if (!empty($request->extra_sort_by) && !empty($request->extra_sort_by_order)) {
                if ($request->extra_sort_by == 'author') {
                    $main_query->orderby('authors.author_name', $request->extra_sort_by_order);
                } else {
                    $main_query->orderby('contents.' . $request->extra_sort_by, $request->extra_sort_by_order);
                }
            }
            if (!empty($request->sort_by)) {
                $main_query->orderby('contents.created_at', $request->sort_by);
            } else {
                $main_query->orderby('contents.created_at', 'desc');
            }
        

            $contents = $main_query->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);

            $contents->each(function ($content) {
                $class_detail = get_class_detail($content->class_id);
                $content->class_name = $class_detail->class_name;
                $content->class_title_s = $class_detail->class_title_s;
            });

            if ($contents) {
                return api_response(200, 'my publications list', $contents);
            } else {
                return api_response(201, 'my publications not found');
            }
        } catch (\Exception $ex) {
            Log::Info('get content exception' . $ex->getMessage());
            return api_response(201, 'my publications list  exception');
        }
    }

    public function addContent(Request $request) {
        try {
            // return response()->json($request);
            // die;
            //            DB::enableQueryLog();
            Log::Info('addContent..........');
            Log::Info(print_r($request->all(), true));

            $new_audit = $request->all();
            $validator = Validator::make($request->all(), [
                        'category_id' => 'required',
                        'class_id' => 'required|numeric',
                        'publishing_year' => 'required|numeric|digits_between:4,4'
                            // 'upload_content' =>'file|max:51200',
                            // 'image_cover' => 'file|max:1000'
            ]);
            if ($validator->fails()) {
                $errors = $validator->errors()->all();
                if (is_array($errors)) {
                    $errors = implode(', ', $errors);
                }

                return api_response(201, $errors);
            }

            $categories = "";
            if (!empty($request->category_id)) {
                $category_id_arry = json_decode($request->category_id, true);
                if (is_array($category_id_arry) && count($category_id_arry) > 0) {
                    $categories = implode(',', $category_id_arry);
                } else {
                    return api_response(201, 'category is required!');
                }
            }

            $subcategories = "";
            if (!empty($request->category_id)) {
                $category_id_arry = json_decode($request->sub_category_id, true);
                if (is_array($category_id_arry) && count($category_id_arry) > 0) {
                    $subcategories = implode(',', $category_id_arry);
                } else {
                    // return api_response(201, 'subcategory is required!');
                }
            }
            // $for_junior_reader = 0;
            // if (!empty($request->for_junior_reader) && ($request->for_junior_reader == 'on' || $request->for_junior_reader == 1)) {
            //     $for_junior_reader = 1;
            // }
            $data_array = array(
                'title' => $request->title,
                'description' => $request->description,
                'other_sources_link' => $request->other_sources_link,
                'edited_by' => Auth::id(),
                'class_id' => $request->class_id,
                'category_id' => $categories,
                'publisher_id' => Auth::id(),
                'sub_category_id' => $subcategories,
                // Allow to Sale (If not enabled, Content will be Marked Free)
                'content_type' => $request->content_type ? $request->content_type : 'paid',
                'content_price' => !empty($request->content_price) ? $request->content_price : 0,
                'discounted_price' => !empty($request->discounted_price) ? $request->discounted_price : 0,
                'currency' => 'KSH',
                'publishing_house' => $request->publishing_house,
                'is_subscriptional_type' => $request->is_subscriptional_type ? $request->is_subscriptional_type : 0,
                'class_number' => $request->class_number,
                'content_subject' => $request->content_subject,
                'subtitle' => $request->subtitle,
                'temp_record' => 0,
                'tags' => $request->tags,
                'genre' => $request->genre,
                'publishing_year' => $request->publishing_year ? $request->publishing_year : null,
                'language' => $request->language,
                'content_type' => $request->content_type,
                'bibliography' => $request->bibliography,
                'isbn_content' => $request->isbn_content,
                'no_of_copies' => $request->no_of_copies,
                'content_reader' => $request->content_reader,
                'display_upto' => $request->unlimited_access ? -1 : $request->display_upto,
                'edition' => !empty($request->edition) ? $request->edition : 0,
                "publication_details" => $request->publication_details,
                "series_statement" => $request->series_statement,
                "note" => $request->note,
                "issn" => $request->issn,
                "location_of_resource" => $request->location_of_resource,
                "editor" => $request->editor,
                    // "for_junior_reader" => $for_junior_reader
            );

            if (Auth::user()->user_type == 'admin') {
                $data_array['status'] = 'published';
            }
            if (!empty($request->title) && empty($request->content_id)) {
                $count = Content::where(['title' => $request->title, 'edition' => $request->edition])->count();
                if ($count > 0) {
                    return api_response(201, 'Content with this title already exists');
                }
            }
            if (!empty($request->author_name)) {
                $data_array['author_id'] = $this->create_author($request->author_name);
            }
            // $data_array['upload_content'] = $request->fileurl;
            $uploadFileArray = $this->chunkUpload($request);

            if (!empty($uploadFileArray)) {
                $new_audit['upload_content'] = 'Added new file';
                $data_array['total_length'] = $uploadFileArray['total_length'];
                $data_array['upload_content'] = $uploadFileArray['file_name'];
                $data_array['preview_file'] = $uploadFileArray['preview_file'];
                $data_array['file_extension'] = $uploadFileArray['file_extension'];
                $data_array['original_file_name'] = $uploadFileArray['original_file_name'];
                $data_array['original_file_extension'] = $uploadFileArray['original_file_extension'];
            } else {
                $new_audit['upload_content'] = 'No change';
            }
            // $result = 1/0;

            if ($request->content_id) {
                $content_id = $request->content_id;
                $data_array['publisher_id'] = $request->publisher_id;
                if ($request->hasFile("image_cover")) {
                    $new_audit['image_cover'] = 'Added new file';
                    $data_array['image_cover'] = $this->uploadImage($request, "image_cover");
                } else {
                    $new_audit['image_cover'] = 'No change';
                }


                $content_detail = Content::where(array(
                            'content_id' => $request->content_id
                        ))->first();
                $update_content = Content::where(array(
                            'content_id' => $request->content_id
                        ))->update($data_array);

                $contentDrmSettings_array = array(
                    'copy_paste' => $request->copy_paste,
                    'printing' => $request->printing,
                    'downloads' => $request->downloads,
                    'number_of_devices' => $request->number_of_devices,
                );

                $audit_data = array(
                    "user_id" => Auth::id(),
                    "module" => "Content",
                    "activity" => "update"
                );
                $audit_data['module_id'] = $request->content_id;
                $old = $content_detail;

                $new_audit['edited_by'] = $data_array['edited_by'];

                audit($audit_data, $old, $new_audit);

                $drmResult = ContentDrmSettings::where(array(
                            'content_id' => $request->content_id
                        ))->update($contentDrmSettings_array);
                $smsg = 'Content has successfully been updated';
                $emsg = 'Unable to update Content!';
            } else {
                $data_array['publisher_id'] = Auth::id();
                if ($request->hasFile("image_cover")) {
                    $data_array['image_cover'] = $this->uploadImage($request, "image_cover");
                }

                $result = Content::create($data_array);
                $content_id = $result->id;
                $contentDrmSettings_array = array(
                    'copy_paste' => $request->copy_paste,
                    'printing' => $request->printing,
                    'downloads' => $request->downloads,
                    'number_of_devices' => $request->number_of_devices,
                    'content_id' => $content_id,
                );

                $drmResult = ContentDrmSettings::create($contentDrmSettings_array);
                // echo($drmResult);
                // die;
                $update_content = Content::where(array(
                            'content_id' => $content_id
                        ))->update(['drm_setting_id' => $drmResult->id]);


                $audit_data = array(
                    "user_id" => Auth::id(),
                    "module" => "Content",
                    "activity" => "create"
                );
                $audit_data['module_id'] = $content_id;
                $return = audit($audit_data);

                $this->sendReviewEmail($content_id);
                $smsg = 'Content has successfully been added';
                $emsg = 'Unable to add Content!';
            }

            // print_r(DB::getQueryLog());
            if ($update_content) {
                return api_response(200, $smsg, $update_content);
            } else {
                return api_response(201, $emsg);
            }
        } catch (\Exception $ex) {
            Log::Info('Add content exception' . $ex->getMessage());
            return api_response(201, 'Add content exception');
        }
    }

    function create_author($author_name) {
        $author_id = DB::table('authors')
                        ->where('author_name', $author_name)->pluck('authors_id')->first();
        if (empty($author_id) && !empty($author_name)) {
            $authors_id = DB::table('authors')->insertGetId([
                'author_name' => $author_name
            ]);
            if ($authors_id) {
                return $authors_id;
            }
        } else {
            return $author_id;
        }
    }

    function sendReviewEmail($content_id) {
        Log::Info('sendReviewEmail');
        if (Auth::check() && Auth::user()->user_type != 'admin') {
            $content = Content::select('contents.content_id as encrypted_content_id', 'contents.title', 'contents.description', 'contents.content_type', 'users.first_name', 'users.last_name')
                    ->join('users', 'users.id', '=', 'contents.publisher_id')
                    ->where('contents.content_id', $content_id)
                    ->where('contents.status', '!=', 'published')
                    ->first();
            if ($content) {
                $body = array(
                    'content_id' => $content->encrypted_content_id,
                    'title' => $content->title,
                    'description' => $content->description,
                    'content_type' => $content->content_type,
                    'publisher' => $content->first_name . ' ' . $content->last_name
                );
                $subject = "Review New content ";
                $emails = User::whereIn('user_type', ['admin', 'senior_librarian'])->pluck('email')->all();
                email('content', $body, $subject, $emails);
            } else {
                Log::Info('No content found with status (pending,reject) and content id' . $content_id);
            }
        }
    }

    public function removeContent(Request $request) {
        try {
            $contentId = custom_encryption('decrypt', $request->content_id);
            $value = Content::where('contents.content_id', $contentId)->delete();
            return api_response(200, 'Remove content successfully');
        } catch (\Exception $ex) {
            Log::Info('Remove content exception' . $ex->getMessage());
            return api_response(201, 'remove content exception');
        }
    }

    public function uploadImage($request, $imageData) {
        $file_input_name = $imageData;
        $image_cover_url = null;
        if ($request->hasFile($file_input_name)) {
            $class_name = $this->get_class_name($request->class_id);
            $destinationPath = destination_base_contents() . 'cover_images/';
            $image = $request->file($imageData);
            $name = 'image_cover_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $result = $image->move($destinationPath, $name);
            $image_cover_url = 'cover_images/' . $name;
        }

        return $image_cover_url;
    }

    function processAfterUploadFile($file_name, $file_extension, $destination_content_file, $class_name) {
        Log::Info('processAfterUploadFile ' . $file_extension);
        Log::Info('file_name ' . $file_name);
        $initialData['original_file_name']=$file_name;
        $initialData['original_file_extension']=$file_extension;
        $total_length = 0;
        
//epub to pdf conversion not required        
//        if ($file_extension == 'epub' || $file_extension == 'EPUB') {
//            $newfile_name = uniqid() . '_converted.pdf';
//            $cmd = '/opt/calibre/ebook-convert ' . $destination_content_file . '/' . $file_name . ' ' . $destination_content_file . '/' . $newfile_name;
//            $result = shell_exec($cmd);
//            Log::Info(print_r($result, true));
//            if ($result) {
//                $file_name = $newfile_name;
//                $file_extension = 'pdf';
//            } else {
//                Log::Info('unable to convert to pdf');
//            }
//        }
        $preview_file = $class_name . '/' . 'preview_' . $file_name;
        $resultpdfpreview = false;
        Log::Info('final file_extension' . $file_extension);
        if ($file_extension == "mp4" || $file_extension == "mp3" || $file_extension == "MP4" || $file_extension == "MP3") {
            Log::Info('converting video/audio preview');
            $resultpdfpreview = $this->createAudioVideoPreview($destination_content_file, $file_name);
        } else if (($file_extension == "pdf" || $file_extension == "PDF") && $class_name == 'ebook') {
            $total_length = countFilePages($destination_content_file . '/' . $file_name);
            log::info('filename preview - ' . $file_name . '  File Extension - ' . $file_extension);
            Log::Info('creating preview total_length ' . $total_length);
            if ($total_length > 3) {
                $resultpdfpreview = $this->createPdfPreview($destination_content_file, $file_name);
            }
        } else {
            $preview_file = "";
        }
  

        $data = array('file_name' => $class_name . '/' . $file_name, 'file_extension' => $file_extension);
        if ($resultpdfpreview) {
            $data['preview_file'] = $preview_file;
        } else {
            $data['preview_file'] = "";
        }
        if ($class_name == 'journal/periodical') {
            if ($file_extension == 'pdf' || $file_extension == 'PDF') {
                $file_name = $class_name . '/' . $file_name;
            } else {
                $domPdfPath = base_path('vendor/dompdf/dompdf');
                Settings::setPdfRendererPath($domPdfPath);
                Settings::setPdfRendererName('DomPDF');
                $filelocation = rtrim(app()->basePath('public/files/contents'));
                $path = $filelocation . '/' . $data['file_name'];
                //Load word file
                $Content = \PhpOffice\PhpWord\IOFactory::load($path);

                //Save it into PDF
                $PDFWriter = \PhpOffice\PhpWord\IOFactory::createWriter($Content, 'PDF');
                $file_name = uniqid() . '.pdf';
                $PDFWriter->save($filelocation . '/' . $file_name);
            }
            $preview_file = $class_name . '/' . 'preview_' . $file_name;
            $data = array('file_name' => $file_name, 'file_extension' => $file_extension);
            if ($resultpdfpreview) {
                $data['preview_file'] = $preview_file;
            } else {
                $data['preview_file'] = "";
            }
        }
        $data = array_merge($data,$initialData);
        $data['total_length'] = $total_length;

        return $data;
    }

    public function chunkUpload($request) {
        $image_cover_url = null;
        $upload_path = 'files/contents';
        if ($request->chunk_file != "") {
            $destinationPath = base_path() . '/public/' . $upload_path;
            $class_name = $this->get_class_name($request->class_id);
            $destination_content_file = rtrim(app()->basePath('public/' . $upload_path . '/' . $class_name));

            $file_extension = $request->file_extension;
            $file_extension = ($file_extension == 'PDF') ? 'pdf' : $file_extension;
            $file_name = $request->chunk_file;
            log::info('filename check - ' . $file_name);
            $data = $this->processAfterUploadFile($file_name, $file_extension, $destination_content_file, $class_name);
            return $data;
        }
    }

    public function uploadFile($request, $imageData) {
        $file_input_name = $imageData;
        $image_cover_url = null;
        $upload_path = 'files/contents';
        if ($request->hasFile($file_input_name)) {
            $destinationPath = base_path() . '/public/' . $upload_path;
            $class_name = $this->get_class_name($request->class_id);
            $destination_content_file = rtrim(app()->basePath('public/' . $upload_path . '/' . $class_name));

            $fileObj = $request->file($imageData);
            $file_extension = $fileObj->getClientOriginalExtension();
            $file_extension = ($file_extension == 'PDF') ? 'pdf' : $file_extension;
            $file_name = uniqid() . '.' . $file_extension;
            log::info('filename check - ' . $file_name);
            $result = $fileObj->move($destination_content_file, $file_name);
            log::info('move result');
            log::info(print_r($result, true));

            if ($result) {
                $data = $this->processAfterUploadFile($file_name, $file_extension, $destination_content_file, $class_name);
                return $data;
            }
        }
    }

    public function uploadcontentFile($request, $imageData) {
        $upload_path = 'files/contents';
        $file_location = base_path() . '/public/files/contents/' . $request->fileurl;
        $class_name = $this->get_class_name($request->class_id);
        $move_location = rtrim(app()->basePath('public/' . $upload_path . '/' . $class_name));
        echo copy($file_location, $move_location . "/" . $request->fileurl);
    }

    public function createAudioVideoPreview($location, $filename) {
        try {
            $filelocation = $location . '/' . $filename;
            $filedestination = $location . "/preview_" . $filename;
            if (env('APP_ENV') == 'local') {
                $cmd = "C:/ffmpeg/bin/ffmpeg -i " . $filelocation . " -ss 00:00:00 -t 00:00:03 " . $filedestination;
                $dur = shell_exec("C:/ffmpeg/bin/ffmpeg -i " . $filelocation . " 2>&1");
            } else {
                $cmd = "ffmpeg -i " . $filelocation . " -ss 00:00:00 -t 00:00:03 " . $filedestination;
                $dur = shell_exec("ffmpeg -i " . $filelocation . " 2>&1");
            }

            $result = shell_exec($cmd);
            preg_match("/Duration: (.{2}):(.{2}):(.{2})/", $dur, $duration);
            Log::Info('duration');
            Log::Info(print_r($duration, true));
            if (isset($duration[1]) && isset($duration[2]) && isset($duration[3])) {
                $hours = $duration[1];
                $minutes = $duration[2];
                $seconds = $duration[3];
                $total_length_in_seconds = $seconds + ($minutes * 60) + ($hours * 60 * 60);

                Log::Info('total_length_in_seconds ' . $total_length_in_seconds);
            }
            return true;
        } catch (\Exception $ex) {
            Log::Info('previewfile exception' . $ex->getMessage());
        }
    }

    public function contentUploadMrc(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                        'mrc_file' => 'required'
            ]);
            if ($validator->fails()) {
                return api_response(201, 'file field is required', $validator->errors());
            }
            $destination_content_file = rtrim(app()->basePath('public/uploads'));
            $marcdata = $this->fetchMarc($request->mrc_file);
            $total_contents = count($marcdata);
            $counter = 0;
            foreach ($marcdata as $record) {
                $count = Content::where('title', 'like', '%' . $record['title'] . '%')
                        ->where('is_deleted', 0)
                        ->count();
                if ($count == 0) {
                    if (!empty($record['author_name'])) {
                        $record['author_id'] = $this->create_author($record['author_name']);
                    }
                    unset($record['author_name']);
                    $record['edited_by'] = Auth::id();
                    $result = Content::create($record);
                    ContentDrmSettings::insert(['content_id' => $result->id]);
                    $counter++;
                } else {
                    Log::Info('content already exists:' . $record['title']);
                }
            }
            Log::Info('counter:' . $counter);
            if ($counter == $total_contents) {
                return api_response(200, 'All Contents of marc file Uploaded Successfully');
            } else if ($counter < $total_contents && $counter > 1) {
                return api_response(200, 'Some of the contents uploaded Successfully and some are already exists.');
            } else {
                return api_response(201, 'All of the marc file contents already exists');
            }
        } catch (\Exception $ex) {
            Log::Info('Marc file uploading exception' . $ex->getMessage());
            return api_response(201, 'Marc file uploading exception');
        }
    }

    function fetchMarc($filename) {
        $collection = Collection::fromFile($filename);
        $contents_array = [];
        if ($collection) {
            Log::Info('collection created');
            foreach ($collection as $record) {
                $content_array = [];

                $content_array['isbn_content'] = getMarRecord($record, 020, 'a');
                $content_array['temp_record'] = 1;
                $content_array['temp_user_id'] = Auth::id();
                $content_array['publisher_id'] = Auth::id();
                // $content_array['pub_year'] = getMarRecord($record,264, 'c');
                $content_array['publishing_house'] = getMarRecord($record, 264, 'b');
                $content_array['description'] = getMarRecord($record, 520, 'a');
                //   020 tag	 marks the International Standard Book Number (ISBN) 
                $content_array['author_name'] = getMarRecord($record, 245, 'a');
                // 245 tag	marks the title information (which includes the title, other title information, and the statement of responsibility)
                $content_array['title'] = getMarRecord($record, 245, 'a');
                //650 tag	 	marks a topical subject heading
                $content_array['content_subject'] = getMarRecord($record, 650, 'a');
                // $content_array['upload_content'] = getMarRecord($record, 859, 'u');
                $content_array['class_id'] = get_class_id_by_name('ebook');
                $content_array['content_type'] = 'free';
                array_push($contents_array, $content_array);
            }
        } else {
            Log::Info('unable to create collection from file!');
        }

        return $contents_array;
    }

    public function gettempcontent(Request $request) {
        try {
            $data = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                            ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                            // ->leftjoin('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                            ->select(
                                    'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'description', 'publishing_house', 'publisher_id', 'genre', 'authors.author_name', 'author_id', 'publishing_date', 'language', 'content_type', 'status', 'image_index', 'image_cover as main_content_image', 'reject_reason', 'cds.setting_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices', 'class_id', 'discounted_price', 'content_price'
                                    // 'reader_contents.subscription_remove',
                                    // 'reader_contents.subscription_on',
                                    // 'reader_contents.is_reading',
                            )->where(['temp_user_id' => Auth::id(), 'temp_record' => 1])->paginate($this->maxResults);
            return api_response(200, 'get temporary content record', $data);
        } catch (\Exception $ex) {
            Log::Info('get temporary record exception' . $ex->getMessage());
            return api_response(201, 'get temporary record exception');
        }
    }

    public function contentBulkUpload(Request $request) {
        Log::Info('contentBulkUpload....');
        Log::Info(print_r($request->all(), true));
        try {
            $validator = Validator::make(
                            $request->all(), [
                        'csv_file' => 'required',
                        'zip_file' => 'required'
                            ]
            );
            $message = $validator->errors()->getMessages();
            if ($validator->fails()) {
                //                Log::Info('validation failed');
                //                Log::Info(print_r($message,true));
                if ($message != null && !empty($message['zip_file']) && !empty($message['zip_file'][0])) {
                    return api_response(201, $message['zip_file'][0]);
                } else {
                    return api_response(201, $validator->errors());
                }
            }
            $file = $request->csv_file;
            $zipfilename = $request->zip_file;
            $csvData = file_get_contents($file);
            $the_file = $request->file('uploaded_file');
            $spreadsheet = IOFactory::load($file);
            $sheet = $spreadsheet->getActiveSheet();
            $row_limit = $sheet->getHighestDataRow();
            $column_limit = $sheet->getHighestDataColumn();
            $row_range = range(2, $row_limit);
            $column_range = range('F', $column_limit);
            $startcount = 2;
            $data = array();
            $zip_file_path = destination_base_contents() . 'zip/';
            $zip_location = $zip_file_path . $zipfilename;
            foreach ($row_range as $row) {
                // create array for check check upload content and image
                $title = $sheet->getCell('A' . $row)->getValue();
                $content_type = $sheet->getCell('D' . $row)->getValue();
                $class_name = $sheet->getCell('E' . $row)->getValue();
                $category_name = $sheet->getCell('F' . $row)->getValue();
                $image_cover = $sheet->getCell('L' . $row)->getValue();
                $upload_content = $sheet->getCell('M' . $row)->getValue();
                $publishing_year = $sheet->getCell('N' . $row)->getValue();
                $author_name = $sheet->getCell('P' . $row)->getValue();
                $edition = $sheet->getCell('J' . $row)->getValue();
                $copy_paste = $sheet->getCell('X' . $row)->getValue();
                $printing = $sheet->getCell('Y' . $row)->getValue();
                $download = $sheet->getCell('Z' . $row)->getValue();
                $number_of_devices = $sheet->getCell('U' . $row)->getValue();
                if(is_string($number_of_devices) || $number_of_devices == 'unlimited'){
                    $number_of_devices = -1;
                }
                if ($startcount > 2 && empty($title) && empty($content_type) && empty($image_cover) && empty($upload_content)) {
                    continue;
                }
                $array = array();
                if ($zip_location) {
                    $zip1 = zip_open($zip_location);
                    if ($zip1) {
                        while ($zip_entry = zip_read($zip1)) {
                            $current_file = zip_entry_name($zip_entry);
                            $current_file = explode("/", $current_file);

                            if (!empty($current_file[1])) {
                                $current_file = $current_file[1];
                            }
                            array_push($array, $current_file);
                        }

                        zip_close($zip1);
                    }
                }
                // return api_response(201, $array,$upload_content);
                //validation for files
                if ($upload_content) {
                    if (!in_array($upload_content, $array)) {
                        return api_response(201, 'This content file is not available inside zip for the content: [' . $title . '] - ' . $upload_content);
                    }
                }
                Log::Info('image_cover');
                Log::Info($image_cover);
                Log::Info('array');
                Log::Info(print_r($array, true));
                if ($image_cover) {
                    if (!in_array($image_cover, $array)) {
                        return api_response(201, 'The Image cover is not available inside zip for the content: [' . $title . ']  - ' . $image_cover);
                    }
                }


                if (empty($publishing_year)) {
                    return api_response(201, 'Please fill publishing year for the content: [' . $title . ']  -' . $publishing_year);
                }


                // special fields start
                if (empty($content_type)) {
                    return api_response(201, 'Please fill Content Type for the content: [' . $title . ']  -' . $publishing_year);
                }

                if (!empty($content_type) && !in_array($content_type, ['free', 'paid', 'membership'])) {
                    return api_response(201, 'Please correct Content Type for the content: [' . $title . ']  -' . $content_type . ' It should be (free, paid, membership)');
                }

                $classes = get_classes_keys();
                if (empty($class_name)) {
                    return api_response(201, 'Please fill Class Name for the content: [' . $title . ']  -' . $class_name);
                }

                if (!empty($class_name) && !in_array(strtolower($class_name), $classes)) {
                    return api_response(201, 'Please correct Class Name for the content: [' . $title . ']  -' . $class_name . ' It should be (' . implode(',', array_map('strtoupper', $classes)) . ')');
                }

                // special fields end


                $ext = pathinfo($upload_content, PATHINFO_EXTENSION);
                // print_r ($array);
                if ($upload_content) {
                    if ($class_name == "ebook") {
                        if ($ext == "pdf" || $ext == "epub") {
                            
                        } else {
                            return api_response(201, 'Please select correct file format for the content [' . $title . '], It should be (pdf,epub)');
                        }
                    } elseif ($class_name == "slide") {
                        if ($ext == "ppt" || $ext == "pptx") {
                            
                        } else {
                            return api_response(201, 'Please select correct file format for the content [' . $title . '], It should be (ppt,pptx)');
                        }
                    } elseif ($class_name == "audio" || $class_name == "video") {
                        if ($ext == "webm" || $ext == "mp4" || $ext == "mpeg" || $ext == "mp3" || $ext == ".ogv") {
                            
                        } else {
                            return api_response(201, 'Please select correct file format for the content [' . $title . '], It should be (webm,mp4,mpeg,mp3,ogv)');
                        }
                    }
                }
                // handle class name with title
                // match category name with title
                //Copy paste	Printing	Downloads Number of devices

                $contentClassId = '';
                if ($class_name) {
                    $contentClassId = ContentClass::select('class_id')
                            ->where('class_name', $class_name)
                            ->first();
                }

                $contentCategoryId = '';
                if ($category_name) {
                    $explode = explode(",", $category_name);

                    $cats = Categories::where('category_name', '!=', "")
                            ->whereIn('category_name', array_values($explode))
                            ->pluck('category_id')
                            ->all();
                    if (is_array($cats) && count($cats) > 0) {
                        $contentCategoryId = implode(',', $cats);
                        ;
                    }
                }
                $data = array(
                    "title" => $sheet->getCell('A' . $row)->getValue(),
                    "description" => $sheet->getCell('B' . $row)->getValue(),
                    "genre" => $sheet->getCell('C' . $row)->getValue(),
                    "publisher_id" => Auth::id(),
                    "content_type" => $sheet->getCell('D' . $row)->getValue(),
                    "content_price" => $sheet->getCell('R' . $row)->getValue(),
                    "class_id" => $contentClassId->class_id,
                    "edited_by" => Auth::id(),
                    "category_id" => $contentCategoryId,
                    "isbn_content" => $sheet->getCell('G' . $row)->getValue(),
                    "class_number" => $sheet->getCell('H' . $row)->getValue(),
                    "content_subject" => $sheet->getCell('I' . $row)->getValue(),
                    "subtitle" => $sheet->getCell('K' . $row)->getValue(),
                    "image_cover" => $sheet->getCell('L' . $row)->getValue(),
                    "upload_content" => $sheet->getCell('M' . $row)->getValue(),
                    "tags" => $sheet->getCell('AB' . $row)->getValue(),
                    "edition" => $sheet->getCell('J' . $row)->getValue(),
                    "editor" => $sheet->getCell('Q' . $row)->getValue(),
                    "publishing_year" => $sheet->getCell('N' . $row)->getValue(),
                    "content_reader" => $sheet->getCell('AC' . $row)->getValue(),
                    "language" => $sheet->getCell('O' . $row)->getValue(),
                    "discounted_price" => $sheet->getCell('S' . $row)->getValue(),
                    "currency" => 'KSH',
                    "no_of_copies" => $sheet->getCell('U' . $row)->getValue(),
                    "display_upto" => $sheet->getCell('V' . $row)->getValue(),
                );
                $startcount++;


                if (Auth::user()->user_type == 'admin') {
                    $data['status'] = 'published';
                } else {
                    $data['status'] = 'pending';
                }

                if (!empty($author_name)) {
                    $data['author_id'] = $this->create_author($author_name);
                }

                $count = Content::where(['title' => $title, 'edition' => $edition])
                         ->where('is_deleted',0)
                        ->count();
                $contents = [];
                if ($count == 0) {
                    $bulkUpload = Content::create($data);
                    if ($bulkUpload) {
                        $content_id = $bulkUpload->id;
                        $this->sendReviewEmail($content_id);
                        $audit_data = array(
                            "user_id" => Auth::id(),
                            "module_id" => $content_id,
                            "module" => "Content",
                            "activity" => "create",
                        );
                        audit($audit_data);
                        $contentDrmSettings_array = array(
                            'content_id' => $content_id,
                            'copy_paste' => ($copy_paste == TRUE || strtolower($copy_paste) == 'yes') ? 1 : 0,
                            'printing' => ($printing == TRUE || strtolower($printing) == 'yes') ? 1 : 0,
                            'Downloads' => ($download == TRUE || strtolower($download) == 'yes') ? 1 : 0,
                            'number_of_devices' => !empty($number_of_devices) ? $number_of_devices : 1,
                        );
                        $drmResult = ContentDrmSettings::create($contentDrmSettings_array);
                        //Read zip file data
                        if ($zip_location) {
                            $zip1 = zip_open($zip_location);
                            if ($zip1) {
                                while ($zip_entry = zip_read($zip1)) {
                                    //   echo "<p>Name: " . zip_entry_name($zip_entry) . "<br>";
                                    $img_cover_ext = pathinfo($image_cover, PATHINFO_EXTENSION);
                                    // $content_id = 695;
                                    $this->zip_file_index($content_id, $zip_location, $zip_entry, $data, $sheet->getCell('L' . $row)->getValue(), "image_cover", "", $img_cover_ext);
                                    $this->zip_file_index($content_id, $zip_location, $zip_entry, $data, $sheet->getCell('M' . $row)->getValue(), "upload_content", strtolower($class_name), $ext);
                                }
                                zip_close($zip1);
                            }
                        } else {
                            Log::Info('No Zip');
                        }
                    }
                } else {
                    array_push($contents, $title);
                    Log::Info('Content is already exists ' . $title);
                }
            }
            if (!empty($zip_location)) {
                delete_file($zip_location);
            }
            if (!empty($contents) && count($contents) > 0) {
                return api_response(200, 'Following content already exists - ' . implode(',', $contents) . '');
            } else {
                return api_response(200, 'Content Uploaded Successfully');
            }
        } catch (\Exception $ex) {
            if (!empty($zip_location)) {
                delete_file($zip_location);
            }
            Log::Info('Content Bulk Uploaded exception' . $ex->getMessage());
            return api_response(201, 'Content Bulk Uploaded exception');
        }
    }

    public function zip_file_index($content_id, $zipfilename, $zip_entry, $row, $file_name, $orignal_filename, $class_name, $file_extension) {

        Log::Info('zip_file_index zip entry: ### ' . json_encode($row));
        $current_file = zip_entry_name($zip_entry);
        $file_name_get = ($orignal_filename == 'image_cover') ? $row['image_cover'] : $row['upload_content'];
        if (!empty($file_name_get) && strpos($current_file, $file_name_get) !== false) {
            Log::Info('zip_file_index current file:' . $current_file);
            Log::Info('zip_file_index filename:' . $zipfilename);

            $file = $zipfilename;
            $zip = new ZipArchive();
            $res = $zip->open($file);
            // echo $name;
            if ($res === TRUE) {
                // echo 'ok';
                $destination = rtrim(app()->basePath('public/files/contents'), '/');

                //upload content file path
                $destination_content_file = rtrim(app()->basePath('public/files/contents/' . $class_name), '/');


                if ($orignal_filename == "upload_content") {
                    $destination_filename = uniqid() . '.' . $file_extension;
                } else if ($orignal_filename == "image_cover") {
                    $destination_filename = 'image_cover_' . uniqid() . '.' . $file_extension;
                }
                $temp_path = $destination . '/' . $content_id;
                if (!is_dir($temp_path)) {
                    mkdir($temp_path);
                }
                $resUpload = $zip->extractTo($temp_path, $current_file);
                if ($resUpload) {
                    if ($orignal_filename == "image_cover") {
                     $movefile = copy($temp_path . '/' . $current_file, $destination_content_file . '/cover_images/' . $destination_filename);
                    }else{
                     $movefile = copy($temp_path . '/' . $current_file, $destination_content_file . '/' . $destination_filename);
                    }
                     if ($movefile) {
                        Log::Info('destination_content_file:' . $destination_content_file);

                        $update_array = [];

                       

                        if ($orignal_filename == "upload_content") {

                            $data = $this->processAfterUploadFile($destination_filename, $file_extension, $destination_content_file, $class_name);
                            $update_array['upload_content'] = $data['file_name'];
                            $update_array['file_name'] = $data['file_name'];
                            $update_array['preview_file'] = $data['preview_file'];
                            $update_array['file_extension'] = $data['file_extension'];
                            $update_array['original_file_name'] = $data['original_file_name'];
                            $update_array['original_file_extension'] = $data['original_file_extension'];
                        }elseif ($orignal_filename == "image_cover") {
                            $update_array["image_cover"] = 'cover_images/'.$destination_filename;
                        }
                        Log::Info('update_array');
                        Log::Info(print_r($update_array, true));
                        $resultUpdate = Content::where('content_id', $content_id)
                                ->update(
                                $update_array
                        );
                        if ($resultUpdate) {
                            deleteDirectory($temp_path);
                        }
                    } else {
                        Log::Info('unable to move');
                    }
                }


                $zip->close();
                return;
            } else {
                echo 'failed, code:' . $res;
                return;
            }
        }
    }

    public function viewsOnContents(Request $request) {
        try {
  

            $fromDate = $request->from_date;
            $toDate = $request->to_date;

            DB::enableQueryLog();

            // echo($contentClasses);
            $contents = Content::select(
                            'contents.content_id', 'contents.content_id as encrypted_content_id', 'contents.title', 'contents.subtitle', 'contents.image_cover as main_content_image', 'contents.content_price', 'authors.author_name', 'contents.class_id', 'contents.content_type'
                    )
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->where('contents.status', 'published')
                    ->where("is_deleted", '!=', 1)
                    ->where(function ($query) use ($request) {
                        if (!empty($request->class_id)) {

                            $query->where('class_id', $request->class_id);
                        }

                        if (Auth::user()->user_type == 'publisher') {
                            $query->where('publisher_id', Auth::id());
                        }
                        if (!empty($request->from_date) && !empty($request->to_date)) {

                            $query->whereBetween('contents.created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                        }
                    })
                    ->orderby('contents.created_at', 'desc')
                    ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);

            $contents->each(function ($content) {
                $class_detail = get_class_detail($content->class_id);
                $content->class_name = $class_detail->class_name;
                $content->class_title_s = $class_detail->class_title_s;
                $content->content_views = ContentViews::where("content_id", $content->content_id)->sum('views');
            });

        
            if ($contents) {
                return api_response(200, 'Success', $contents);
            } else {
                return api_response(201, 'Get views content error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get views content exception' . $ex->getMessage());
            return api_response(201, 'Get views content exception');
        }
    }

    public function usersViewsOnContents(Request $request) {
        try {
     

            $contentId = $request->content_id;

            DB::enableQueryLog();

            // echo($contentClasses);
            $contents = ContentViews::join('users as reader', 'reader.id', '=', 'content_views.reader_id')
                    ->join('user_detail', 'user_detail.user_id', 'reader.id')
                    ->select(
                            'content_views.views', 'reader.first_name', 'reader.last_name', 'user_detail.user_image as profile_image_path', 'reader.created_at'
                    )
                    ->where('content_views.content_id', $contentId)
                    ->orderby('content_views.created_at', 'desc')
                    ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);

            $content_title = Content::select('contents.content_id', 'contents.title')
                    ->where("content_id", $contentId)
                    ->first();



            $data = [
                'content' => $contents,
                'content_title' => $content_title
            ];
         
        
            if ($data) {
                return api_response(200, 'Success', $data);
            } else {
                return api_response(201, 'views content error');
            }
        } catch (\Exception $ex) {
            Log::Info('Views content exception' . $ex->getMessage());
            return api_response(201, 'Views content exception');
        }
    }

    public function publishedContents(Request $request) {
        try {
            // DB::enableQueryLog();
            $contents = Content::select(
                            'contents.content_id', 'contents.title', 'contents.subtitle', 'contents.image_cover as main_content_image', 'contents.content_price', 'authors.author_name', 'contents.publishing_date', 'publisher.first_name', 'publisher.last_name', 'contents.class_id', 'contents.content_type', 'contents.content_id as encrypted_content_id'
                    )
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->leftjoin('users as publisher', 'publisher.id', '=', 'contents.publisher_id')
                    // ->where('contents.publisher_id', '=', Auth::id())
                    ->where('contents.status', 'published')
                    ->where("contents.is_deleted", '!=', 1)
                    ->where(function ($query) use ($request) {
                        if (!empty($request->class_id)) {

                            $query->where('class_id', $request->class_id);
                        }

                        if (!empty($request->category_id)) {

                            $query->where('category_id', 'like', '%' . $request->category_id . '%');
                        }

                        if (Auth::user()->user_type == 'publisher') {
                            $query->where('publisher_id', Auth::id());
                        }
                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $query->whereBetween('contents.created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                        }
                    })
                    ->orderby('contents.created_at', 'desc')
                    ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);


            $contents->each(function ($content) {
                $content->class_name = $this->get_class_name($content->class_id);
            });
          
            if ($contents) {
                return api_response(200, 'Published contents success.', $contents);
            } else {
                return api_response(201, 'Published contents error!');
            }
        } catch (\Exception $ex) {
            Log::Info('Published contents' . $ex->getMessage());
            return api_response(201, 'Published contents exception');
        }
    }

    public function salesStatistics(Request $request) {
        try {
            Log::Info('salesStatistics');
            DB::enableQueryLog();
            $transactions = Content::where('contents.content_type', 'paid')
                    ->where("contents.is_deleted", '!=', 1)
                    ->where(function ($query) use ($request) {
                        if (Auth::user()->user_type == 'publisher') {
                            $query->where('publisher_id', Auth::id());
                        }

                        if (!empty($request->content_title)) {
                            $query->where('contents.title', 'like', '%' . $request->content_title . '%');
                        }
                        if (!empty($request->class_id)) {
                            $query->where('contents.class_id', $request->class_id);
                        }
                        if (!empty($request->category_name)) {
                            $query->where('contents.category_id', 'like', '%' . $request->category_name . '%');
                        }
                        if (!empty($request->categories)) {
                            $query->where('contents.category_id', 'like', '%' . $request->categories . '%');
                        }
                        if (!empty($request->sub_categories)) {
                            $query->where('contents.sub_category_id', 'like', '%' . $request->sub_categories . '%');
                        }
                        if (!empty($request->publishing_house)) {
                            $query->where('contents.publishing_house', 'like', '%' . $request->publishing_house . '%');
                        }
                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $query->whereBetween(DB::raw('DATE_FORMAT(orders.created_at,"%Y-%m-%d")'), [$request->from_date, $request->to_date]);
                        }
                    })
                    ->join('orders', 'contents.content_id', '=', 'orders.order_for_id')
                    ->select(DB::raw('count(contents.content_id) as count, max(contents.class_id) as class_id, sum(orders.amount) as total_amount,max(contents.title) as title,max(contents.publishing_house) as publishing_house,max(contents.image_cover) as main_content_image,max(contents.content_id) as content_id'))
                    ->groupBy('orders.order_for_id')
                    ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);
    

            $graph_data = Content::where('contents.content_type', 'paid')
                    ->where("contents.is_deleted", '!=', 1)
                    ->where(function ($query) use ($request) {
                        if (Auth::user()->user_type == 'publisher') {
                            $query->where('publisher_id', Auth::id());
                        }

                        if (!empty($request->content_title)) {
                            $query->where('contents.title', 'like', '%' . $request->content_title . '%');
                        }
                        if (!empty($request->class_id)) {
                            $query->where('contents.class_id', $request->class_id);
                        }
                        if (!empty($request->category_name)) {
                            $query->where('contents.category_id', 'like', '%' . $request->category_name . '%');
                        }
                        if (!empty($request->categories)) {
                            $query->where('contents.category_id', 'like', '%' . $request->categories . '%');
                        }
                        if (!empty($request->sub_categories)) {
                            $query->where('contents.sub_category_id', 'like', '%' . $request->sub_categories . '%');
                        }
                        if (!empty($request->publishing_house)) {
                            $query->where('contents.publishing_house', 'like', '%' . $request->publishing_house . '%');
                        }
                        if (!empty($request->from_date) && !empty($request->to_date)) {
                            $query->whereBetween(DB::raw('DATE_FORMAT(co.created_at,"%Y-%m-%d")'), [$request->from_date, $request->to_date]);
                        }
                    })
                    ->join('orders', 'contents.content_id', '=', 'orders.order_for_id')
                    ->join('transactions', 'orders.transaction_id', '=', 'transactions.transaction_id')
                    ->where('transactions.callback_status',1)
                    ->select(DB::raw('count(contents.class_id) as count, contents.class_id, sum(transactions.total_amount) as total_amount'))
                    ->groupBy('contents.class_id')
                    ->get();

            $graph_data->each(function ($graph) {
                $get_class_detail = get_class_detail($graph->class_id);
                $graph->class_title_s = $get_class_detail->class_title_s;
            });
            $transactions->each(function ($transaction) {
                $get_class_detail = get_class_detail($transaction->class_id);
                $transaction->class_title_s = $get_class_detail->class_title_s;
                $transaction->class_name = $get_class_detail->class_name;
                $transaction->enc_content_id = custom_encryption('encrypt', $transaction->content_id);
            });
            $data = [
                'graph_data' => $graph_data,
                'transactions' => $transactions,
            ];


            if ($data) {
                return api_response(200, 'Get sales statistics Successfully', $data);
            } else {
                return api_response(201, 'Get sales statistics error');
            }
        } catch (\Exception $ex) {
            Log::Info('Get sales statistics exceptions' . $ex->getMessage());
            return api_response(201, 'Get sales statistics exceptions');
        }
    }

    public function transactionbyclass($class_id) {
        $last = \Carbon\Carbon::now()->subWeek()->format('Y-m-d');  // returns 2016-02-03
        $current = \Carbon\Carbon::now()->format('Y-m-d');  // returns 2016-02-10

        $tnx = Transaction::join('orders', 'orders.transaction_id', '=', 'transactions.transaction_id')
                        ->join('contents', 'contents.content_id', '=', 'orders.order_for_id')
                        ->select(DB::raw('SUM(transactions.total_amount) as sum'))
                        ->whereRaw('transactions.created_at BETWEEN "' . $last . '" and "' . $current . '" ')
                        ->where('contents.publisher_id', "=", Auth::id())
                        ->where('contents.class_id', "=", $class_id)->get();
        $thisweek = ($tnx[0]->sum != null) ? $tnx[0]->sum : 0;
        return $thisweek;
    }

    public function transaction(Request $request) {
        try {
            $last = \Carbon\Carbon::now()->subWeek()->format('Y-m-d');  // returns 2016-02-03
            $current = \Carbon\Carbon::now()->format('Y-m-d');  // returns 2016-02-10
            $transactionQuery = Transaction::join('orders', 'orders.transaction_id', '=', 'transactions.transaction_id')
                    ->join('contents', 'contents.content_id', '=', 'orders.order_for_id')
                    ->where('callback_status',1)
                    ->where(function ($query) use ($request) {
                if (Auth::user()->user_type == 'publisher') {
                    $query->where('contents.publisher_id', Auth::id());
                }
                if (!empty($request->class_id)) {

                    $query->where('contents.class_id', $request->class_id);
                }
                if (!empty($request->categories)) {
                    $query->where('contents.category_id', 'like', '%' . $request->categories . '%');
                }
                if (!empty($request->sub_categories)) {

                    $query->where('contents.sub_category_id', 'like', '%' . $request->sub_categories . '%');
                }
                if (!empty($request->publishing_house)) {
                    $query->where('contents.publishing_house', 'like', '%' . $request->publishing_house . '%');
                }
                if (!empty($request->from_date) && !empty($request->to_date)) {
                    $query->whereBetween('orders.created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                }
            });
            $tnx = $transactionQuery->select(DB::raw('SUM(transactions.total_amount) as sum'))
                    ->get();

            // $date = \Carbon\Carbon::today()->subDays(7);
            // $pdate = \Carbon\Carbon::today()->subDays(14);

            $previoustnx = $transactionQuery->select(DB::raw('SUM(transactions.total_amount) as sum'))
                    ->where(function ($query) use ($request) {
                        if (empty($request->from_date) || empty($request->to_date)) {
                            $date = \Carbon\Carbon::now()->subWeek()->format('Y-m-d');  // returns 2016-02-03
                            $pdate = \Carbon\Carbon::now()->format('Y-m-d');  // returns 2016-02-10
                            $query->whereRaw('transactions.created_at BETWEEN "' . $pdate . '" and "' . $date . '" ');
                        }
                    })
                    ->get();

            $prev = ($previoustnx[0]->sum != '') ? $previoustnx[0]->sum : 0;
            $thisweek = ($tnx[0]->sum != '') ? $tnx[0]->sum : 0;

            return array("thisWeek" => $thisweek, "previousWeek" => $prev);
        } catch (\Exception $ex) {
            Log::Info('Transaction exception' . $ex->getMessage());
            return api_response(201, 'Transaction exception');
        }
    }

    public function deleteContent(Request $request) {
        try {
            Log::Info('deleteContent');
            $contentId = custom_encryption('decrypt', $request->content_id);
            $data = array(
                "is_deleted" => 1,
                "reject_reason" => $request->reject_reason
            );
            $deleteContent = DB::table('contents')
                    ->where('content_id', $contentId)
                    ->update($data);
            if ($deleteContent) {
                $audit_data = array(
                    "user_id" => Auth::id(),
                    "module_id" => $contentId,
                    "module" => "Content",
                    "activity" => "Delete",
                );
                audit($audit_data, [], ['reason' => $request->reject_reason]);
                return api_response(200, 'Content deleted successfully.', $data);
            } else {
                return api_response(201, 'Delete content error');
            }
        } catch (\Exception $ex) {
            Log::Info('Delete content exception' . $ex->getMessage());
            return api_response(201, 'Delete content exception');
        }
    }

    public function deleteMultipleContent(Request $request) {
        try {
            Log::Info('deleteMultipleContent');

            $contentId = $request->content_id;

            Log::Info(print_r($contentId, true));
            $data = array(
                "is_deleted" => 1
            );
            //            DB::enableQueryLog();
            $deleteContent = DB::table('contents')
                    ->whereIn('content_id', $contentId)
                    ->update($data);
            if ($deleteContent) {
                foreach ($contentId as $id) {
                    if (!empty($id)) {
                        $audit_data = array(
                            "user_id" => Auth::id(),
                            "module_id" => $id,
                            "module" => "Content",
                            "activity" => "Delete",
                        );
                        audit($audit_data, [], ['reason' => 'multiple deletion']);
                    }
                }

                return api_response(200, 'Content deleted successfully.', $data);
            } else {
                return api_response(201, 'Delete content error');
            }
        } catch (\Exception $ex) {
            Log::Info('Delete content exception' . $ex->getMessage());
            return api_response(201, 'Delete content exception');
        }
    }

    public function contentDetail(Request $request) {
        try {
            // Log::Info('contentDetail');

            $contentId = custom_encryption('decrypt', $request->content_id);
            extract($request->all());
            $commentsObj = new CommentController();
            $value = Content::where('contents.content_id', $contentId)
                    ->join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                    ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'cds.copy_paste', 'cds.printing', 'cds.downloads', 'cds.number_of_devices')
                    ->first();
            $data = [];

            if ($value) {


                $file_name = '';
                if (!empty($value->file_name)) {
                    $file_name = get_content_files_path($value->file_name);
                }
                $publisher = get_user_detail($value->publisher_id);
                $last_uploader = get_user_detail($value->edited_by);
                $author = $this->author_name($value->author_id);
                $class_detail = get_class_detail($value->class_id);

                $download = Readercontents::where(['reader_id' => Auth::id(), 'content_id' => $contentId])->first();
                $is_reading = (!empty($download->is_reading)) ? $download->is_reading : 0;

                $subcat = !empty($value->sub_category_id) && is_array(explode(',', $value->sub_category_id)) ? get_sub_categories(explode(',', $value->sub_category_id)) : "";
                if (strpos($subcat, ',') === false) {
                    $subcat = rtrim($subcat, ',');
                }

                $cat = !empty($value->category_id) && is_array(explode(',', $value->category_id)) ? get_categories(explode(',', $value->category_id)) : "";
                if (strpos($cat, ',') === false) {
                    $cat = rtrim($cat, ',');
                }

                $data = array(
                    'content_id' => $value->content_id,
                    'title' => $value->title,
                    'description' => $value->description,
                    'other_sources_link' => $value->other_sources_link,
                    'publisher_id' => $value->publisher_id,
                    "content_type" => $value->content_type,
                    "content_price" => (int) $value->discounted_price,
                    "content_actual_price" => (int) $value->content_price,
                    "is_subscriptional_type" => $value->is_subscriptional_type,
                    "isbn_content" => $value->isbn_content,
                    "temp_record" => $value->temp_record,
                    "class_number" => $value->class_number,
                    "content_subject" => $value->content_subject,
                    "eshelve_code" => $value->eshelve_code,
                    'is_reading' => ($is_reading == 1) ? 1 : 0,
                    "drm_setting" => $value->drm_setting,
                    "subtitle" => $value->subtitle,
                    "for_sale" => $value->for_sale,
                    "book_genre_types" => $value->genre,
                    "editor" => $value->editor,
                    "class_id" => $value->class_id,
                    'isBookRead' => ($value->is_reading == 1) ? true : false,
                    "class_name" => $this->get_class_name($value->class_id),
                    "category" => $cat,
                    "sub_category" => $subcat,
                    "publisher_detail" => $publisher,
                    "publisher" => $publisher && $publisher->username ? $publisher->username : "",
                    "last_uploader" => $last_uploader && $last_uploader->username ? $last_uploader->username : "",
                    "author_name" => $author,
                    "rating" => $this->rating($value->content_id),
                    "total_ratings" => $this->total_ratings($value->content_id),
                    "views" => $this->getContentViews($value->content_id),
                    "main_content_image" => $value->main_content_image,
                    "tags" => $value->tags,
                    "status" => $value->status,
                    "content_type" => $value->content_type,
                    "created_at" => $value->created_at,
                    'created_date' => get_date_format($value->created_at),
                    'publishing_year' => $value->publishing_year,
                    'language' => !empty($value->language) ? $value->language : "",
                    "genre" => !empty($value->genre) ? $value->genre : "",
                    "type_of_resource" => $this->get_class_name($value->class_id),
                    "comments" => $commentsObj->getContentComments($value->content_id),
                    "file_name" => $file_name,
                    'total_likes' => $this->getContentLikes($value->content_id),
                    'like' => $this->like($value->content_id),
                    'no_of_copies' => $value->no_of_copies,
                    'no_of_copies_available' => $this->availablecopies($value->content_id, $value->no_of_copies),
                    'copy_paste' => $value->copy_paste,
                    'printing' => $value->printing,
                    'downloads' => $value->downloads,
                    'number_of_devices' => $value->number_of_devices,
                    'upload_content' => get_content_files_path($value->upload_content),
                    'preview_file' => get_content_files_path($value->preview_file),
                    'content_preview_file_exists' =>checkFileExists('files/contents/'.$value->preview_file),
                    'content_file_exists' =>checkFileExists('files/contents/'.$value->upload_content),
                    'file_extension' => $value->file_extension,
                    'class_title_s' => $class_detail->class_title_s,
                    'class_name' => $class_detail->class_name,
                    'encrypted_content_id' => $value->encrypted_content_id,
                    'publishing_house' => $value->publishing_house,
                    'content_reader' => $value->content_reader,
                    'discounted_price' => $value->discounted_price,
                    'currency' => 'KSH',
                    "display_upto" => $value->display_upto,
                    "image_index" => $value->main_content_image,
                    'publishing_date_format' => $value->publishing_year,
                    "category_array" => explode(',', $value->category_id),
                    "sub_category_array" => explode(',', $value->sub_category_id),
                    "drm_setting" => array(
                        'copy_paste' => $value->copy_paste,
                        'printing' => $value->printing,
                        'number_of_device' => (int) $value->number_of_devices,
                        'display_upto' => (int) $value->display_upto,
                        'no_of_copies' => ($value->no_of_copies) ? (int) $value->no_of_copies : 0,
                        'no_of_available' => $this->availablecopies($value->content_id, $value->no_of_copies),
                        'mob_no_of_available' => $this->mavailablecopies($value->content_id, $value->no_of_copies)
                    ),
                    "allow_downloadable" => $value->downloads > 0 ? TRUE : FALSE,
                    "author" => array(
                        "author_id" => $value->author_id,
                        "author_name" => $author,
                        'author_books' => $this->authorbooks($value->author_id, $value->content_id)
                    ),
                    "is_bookmarked" => $this->bookmark($value->content_id),
                    "edition" => $value->edition,
                    "publication_details" => $value->publication_details,
                    "series_statement" => !empty($value->series_statement) ? $value->series_statement : "",
                    "note" => !empty($value->note) ? $value->note : "",
                    "issn" => !empty($value->issn) ? $value->issn : "",
                    "for_junior_reader" => $value->for_junior_reader,
                    "suggestion_list" => $this->suggestion($value)
                );
                $data["total_length"] = $value->total_length;
                if (Auth::check() && (Auth::user()->user_type == 'reader' || Auth::user()->user_type == 'junior_reader')) {
                    $data["downloadstatus"] = $this->downloadstatus(Auth::id(), $value->content_id);
                    $data["is_follow"] = $this->follow(Auth::id(), $value->publisher_id);
                    DB::enableQueryLog();
                    $subscription = Readercontents::where('content_id', $value->content_id)
                            ->where('reader_id', Auth::id())
                            ->where(DB::raw('DATE_FORMAT(subscription_end,"%Y-%m-%d")'), '>', \Carbon\Carbon::now()->format('Y-m-d'))
                            ->select('subscription_on', 'subscription_end', 'read_duration')
                            ->first();

                    if ($subscription) {
                        $data['is_subscribed'] = 1;
                        $data['subscription_on'] = $subscription->subscription_on;
                        $data['subscription_end'] = $subscription->subscription_end;
                        $data["read_duration"] = $subscription->read_duration;
                    } else {
                        $data['is_subscribed'] = 0;
                    }
                }
            }

            return api_response(200, 'Get content detail', $data);
        } catch (\Exception $ex) {
            Log::Info('Get content detail exception' . $ex);
            return api_response(201, 'Get content detail exception');
        }
    }

    public function suggestion($content) {
        $class_id = $content->class_id;
        $category_id = $content->category_id;
        $sub_category_id = $content->sub_category_id;
        $content_id = $content->content_id;
        
        $main_query = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                // ->leftjoin('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                ->select(
                        'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'class_id', 'description', 'content_type', 'status', 'image_cover as main_content_image', 'class_id', 'discounted_price', 'content_price'
                )
                ->where('contents.content_id', '!=', $content_id)
                ->where("is_deleted", '!=', 1)
                ->where(function ($query) use ($class_id,$sub_category_id) {
            if (Auth::check() && Auth::user()->user_type == 'junior_reader'){
               $query->whereIn('content_reader', ['junior', 'both']);
            }
              $query->where('status', 'published');
             if (!empty($sub_category_id)) {
                    $subcategories = explode(',',$sub_category_id);
                    $query->where(function ($query) use ($subcategories) {
                        foreach ($subcategories as $sub_cat_id) {
                            $query->orWhere(function ($query) use ($sub_cat_id) {
                                  if(!empty($sub_cat_id)){
                                    $query->whereRaw('FIND_IN_SET(' . $sub_cat_id . ',sub_category_id)');
                                  }
                            });
                        }
                    })
                    ;
                }
        });
        $main_query->orderby('contents.created_at', 'desc');
        $contents = $main_query->offset(0)->take(10)->get();
        if($contents->isEmpty()){
            // Log::Info('f empty record'.$category_id);
            $main_query1 = Content::join('content_drm_settings as cds', 'cds.content_id', '=', 'contents.content_id')
                ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                // ->leftjoin('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                ->select(
                        'contents.content_id', 'contents.content_id as encrypted_content_id', 'title', 'class_id', 'description', 'content_type', 'status', 'image_cover as main_content_image', 'class_id', 'discounted_price', 'content_price'
                )
                ->where('contents.content_id', '!=', $content_id)
                ->where("is_deleted", '!=', 1)
                ->where(function ($query) use ($class_id,$category_id) {
            if (Auth::check() && Auth::user()->user_type == 'junior_reader'){
               $query->whereIn('content_reader', ['junior', 'both']);
            }
              $query->where('status', 'published');
             if (!empty($category_id)) {
                    $categories = explode(',',$category_id);
                     $query->where(function ($query) use ($categories) {
                        foreach ($categories as $cat_id) {
                            $query->orWhere(function ($query) use ($cat_id) {
                                  if(!empty($cat_id)){
                                    $query->whereRaw('FIND_IN_SET(' . $cat_id . ',category_id)');
                                  }
                            });
                        }
                    })
                    ;
                }
        });
        $main_query1->orderby('contents.created_at', 'desc');   
        $contents = $main_query1->offset(0)->take(10)->get();
        }
        $contents->each(function ($content) {
            $class_detail = get_class_detail($content->class_id);
            $content->class_title_s = $class_detail->class_title_s;
            $content->class_name = $class_detail->class_name;
        });

        return $contents;
    }

    public function bookmark($content_id) {
        $record = DB::table('bookmark')->where(['content_id' => $content_id, 'reader_id' => Auth::id()]);
        if ($record->count() > 0) {
            $data = $record->first();
            return ($data->is_bookmarked == 1) ? true : false;
        } else {
            return false;
        }
    }

    public function follow($reader_id, $publisher_id) {
        $query = DB::table('followers');
        $result = $query->where([
                    'user_id' => $reader_id,
                    'publisher_id' => $publisher_id,
                ])->first();
        return (!empty($result->user_id)) ? $result->is_follow : 0;
    }

    public function mavailablecopies($content_id, $copies) {
        $count = Readercontents::where('content_id', $content_id)->count();
        $available = (((int) $copies - $count) > 0) ? ((int) $copies - $count) : 0;
        return ($count) ? $available : (int) $copies;
    }

    public function availablecopies($content_id, $copies) {
        $count = Readercontents::where('content_id', $content_id)
                ->where(DB::raw('DATE_FORMAT(subscription_end,"%Y-%m-%d")'), '>', \Carbon\Carbon::now()->format('Y-m-d'))
                ->count();
        $copies_array = array(
            'available' => ($count) ? ((int) $copies - $count) : (int) $copies,
        );
        if (Auth::check()) {
            $readcontent_enable = Readercontents::where(
                                    ['content_id' => $content_id, 'reader_id' => Auth::id()]
                            )
                            ->where(DB::raw('DATE_FORMAT(subscription_end,"%Y-%m-%d")'), '>', \Carbon\Carbon::now()->format('Y-m-d'))
                            ->select('is_reading')->first();

            $copies_array['read_content'] = $readcontent_enable ? true : false;
            $copies_array['is_reading'] = ($readcontent_enable && $readcontent_enable->is_reading == 1) ? 1 : 0;
        }


        return $copies_array;
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

    public function category($id) {
        $return = DB::table('categories')->where('category_id', $id)->first();
        $name = null;
        if ($return) {
            $name = $return->category_name;
        }
        return $name;
    }

    public function rating($id) {
        $return = DB::table('comments')->where('content_id', $id)->avg('rating');

        return ($return) ? number_format(($return / 1), 1) : "0.0";
    }

    public function total_ratings($id) {
        $return = DB::table('comments')->where('content_id', $id)->count();
        return ($return) ? $return : 0;
    }

    public function getContentViews($id) {
        $return = DB::table('content_views')->where('content_id', $id)->pluck('views')->first();
        return ($return) ? $return : 0;
    }

    public function getContentLikes($id) {
        $return = DB::table('content_likes')->where('content_id', $id)->sum('likes');
        return ($return) ? $return : 0;
    }

    public function get_class_name($class_id) {
        $class_name = DB::table('classes')->where('class_id', $class_id)->pluck('class_name')->first();
        if (!empty($class_name)) {
            return $class_name;
        }
    }

    public function like($content_id) {
        $data = Contentlikes::where(["content_id" => $content_id, "user_id" => Auth::id()])->first();
        return ($data) ? $data->likes : 0;
    }

    public function getcategories($ids = []) {
        try {
            $categories = get_categories($ids);
            if ($categories) {
                return api_response(200, 'get categories success.', $categories);
            } else {
                return api_response(201, 'get categories success');
            }
        } catch (\Exception $ex) {
            Log::Info('get categories exception' . $ex->getMessage());
            return api_response(201, 'get categories exception');
        }
    }

    public function categorywithsubcategory($ids = []) {
        try {
            $categories = DB::table('categories')->select('category_id', 'category_name', 'category_image')
                    ->where(function ($query) use ($ids) {
                        if (!empty($ids) && is_array($ids)) {
                            $query->whereIn('category_id', $ids);
                        }
                    })
                    ->get();
            $categories->each(function ($query) {
                $query->category_image = url() . '/files/contents/category_icons/' . $query->category_image;
            });
            $categories->each(function ($query) {
                $query->subcategories = Subcategories::select('sub_category_id', 'sub_category_name')->where('category_id', $query->category_id)->get();
            });
            return api_response(200, 'get categories success.', $categories);
        } catch (\Exception $ex) {
            Log::Info('get categories exception' . $ex->getMessage());
            return api_response(201, 'get categories exception');
        }
    }

    public function getClasses() {
        try {
            $classes = DB::table('classes')->select('class_id', 'class_name', 'class_title_s')->get();
            if ($classes) {
                return api_response(200, 'get classes success.', $classes);
            } else {
                return api_response(201, 'get classes success');
            }
        } catch (\Exception $ex) {
            Log::Info('get classes exception' . $ex->getMessage());
            return api_response(201, 'get classes exception');
        }
    }

    public function updateStatus(Request $request) {

        try {
            $mesg = "";
            $content_id = $request->content_id;
            $content_id = custom_encryption('decrypt', $content_id);
            // Log::Info('updateStatus content_id' . $content_id);
            $comment_array = array(
                'status' => $request->status
            );
            if (!empty($request->reject_reason)) {
                $comment_array['reject_reason'] = $request->reject_reason;
            } else {
                $comment_array['reject_reason'] = "";
            }
            $contentdetail = Content::where('content_id', $content_id)->first();
            if ($contentdetail) {
                if (empty($contentdetail->title)) {
                    return api_response(201, 'Content title not exists!');
                } elseif (empty($contentdetail->upload_content)) {
                    return api_response(201, 'Content file not exists!');
                } elseif (empty($contentdetail->image_cover)) {
                    return api_response(201, 'Content cover image not exists!');
                }
                $result = Content::where('content_id', $content_id)
                        ->update($comment_array);
                if ($result) {

                    if (!empty($content_id)) {
                        $reason = '';
                        $emailRecord = Content::select('contents.content_id as encrypted_content_id', 'contents.publisher_id', 'contents.title', 'users.email', 'contents.description', 'contents.content_type', 'users.first_name', 'users.last_name')
                                ->join('users', 'users.id', '=', 'contents.publisher_id')
                                ->where('contents.content_id', $content_id)
                                ->first();

                        if (!empty($request->reject_reason)) {
                            $subject = "Content Rejected";
                            $reason = $request->reject_reason;
                            $mesg = "Content successfully rejected";
                        } else {
                            if('pending' == $request->status){
                                $subject = "Content status changed to Pending";
                                $reason = '';
                                $mesg = "Content status changed to pending";
                            }else{
                                $subject = "Content Approved";
                                $reason = '';
                                $mesg = "Content successfully approved";
                            }  
                        }
                        $body = array(
                            'content_id' => $emailRecord->encrypted_content_id,
                            'title' => $emailRecord->title,
                            'description' => $emailRecord->description,
                            'content_type' => $emailRecord->content_type,
                            'publisher' => $emailRecord->first_name . ' ' . $emailRecord->last_name,
                            'reason' => $reason,
                            'status' => 'reject'
                        );
                        // $user= User::select('email')->whereIn('user_type', ['admin','librarian'])->get();
                        $to = $emailRecord->email;
                        email('approve-reject', $body, $subject, $to);
                        if ($subject == "Content Approved") {
                            $result = DB::table('followers')
                                            ->join('users', 'users.id', '=', 'followers.user_id')
                                            ->select('followers.is_follow', 'users.first_name', 'users.last_name', 'users.email')
                                            ->where('publisher_id', $emailRecord->publisher_id)->paginate($this->maxResults);
                            $body = array(
                                'content_id' => $emailRecord->encrypted_content_id,
                                'title' => $emailRecord->title,
                                'description' => $emailRecord->description,
                                'content_type' => $emailRecord->content_type,
                                'publisher' => $emailRecord->first_name . ' ' . $emailRecord->last_name,
                                'reason' => '',
                                'status' => 'approved'
                            );

                            foreach ($result as $value) :
                                email('approve-reject', $body, $subject, $to);
                            endforeach;
                        }
                        return api_response(200, $mesg, $result);
                    } else {
                        return api_response(201, 'Unable to update content status!');
                    }
                } else {
                    return api_response(201, 'Unable to update content status!');
                }
            } else {
                return api_response(201, 'Content not found!');
            }
        } catch (\Exception $ex) {
            Log::Info('update content status exception' . $ex->getMessage());
            return api_response(201, 'update content status exception!');
        }
    }

    public function updateDRMSettings(Request $request) {
        // Log::Info(print_r($request->all(), true));
        $audit_data = array(
            "user_id" => Auth::id(),
            "module_id" => $request->setting_id,
            "module" => "DRM settings",
            "activity" => "update",
        );
        $old = ContentDrmSettings::where('setting_id', $request->setting_id)->first();
        $new = $request->all();
        $return = audit($audit_data, $old, $new);
        try {
            $result = ContentDrmSettings::where('setting_id', $request->setting_id)->update($request->all());
            if ($result) {
                return api_response(200, 'DRM setting updated successfully.', $result);
            } else {
                return api_response(201, 'Unable to update DRM setting!');
            }
        } catch (\Exception $ex) {
            Log::Info('update DRM setting Exception:' . $ex->getMessage());
            return api_response(201, 'DRM setting exception!');
        }
    }

    public function borrow(Request $request) {
        try {
            $contentId = custom_encryption('decrypt', $request->content_id);
            $readercontent = create_reader_content($contentId,Auth::id());
            $getdata = Readercontents::where(['reader_content_id' => $readercontent])->first();
            // return response()->json($readercontent);
            return api_response(200, 'Content borrowed successfully', $getdata);
        } catch (Exception $ex) {
            Log::Info('Content borrowed exception' . $ex->getMessage());
            return api_response(200, 'Content borrowed exception');
        }
    }

    public function myBook($id, Request $request) {
        try {
            $data = array();
    $query = Content::join('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->leftjoin('content_drm_settings', 'content_drm_settings.content_id', '=', 'contents.content_id')
                    ->select(
                            'contents.*', 'contents.image_cover as main_content_image', 'contents.content_id as encrypted_content_id', 'reader_contents.*', 'authors.*', 'content_drm_settings.*'
                    )
                    ->where('reader_contents.reader_id', $id)
                    ->where(DB::raw('DATE_FORMAT(reader_contents.subscription_end,"%Y-%m-%d")'), '>', \Carbon\Carbon::now()->format('Y-m-d'));
    
    
         
                 $content_count =  $query->count(); 
                       $mybook = $query->where(function ($query) use ($request) {
                        if (!empty($request->class_id)) {
                            $query->where('contents.class_id', $request->class_id);
                        }
                    })
                    ->paginate($this->maxResults);
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
                     $class_detail = get_class_detail($value->class_id);
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
                            "author_name" => $this->author_name($value->author_id),
                        ),
                        "class_id" => $value->class_id,
                        "class_name" =>$class_detail->class_name,
                        "class_title_s" =>$class_detail->class_title_s,
                        "content_type" => $value->content_type,
                        "content_price" => $value->content_price,
                        "main_content_image" => $cover,
                        "tags" => $value->tags,
                        "status" => $value->status,
                        "upload_content" => get_content_files_path($value->upload_content),
                        "reader_id" => $value->reader_id,
                        "is_reading" => ($value->is_reading == 1) ? 1 : 0,
                        "read_duration" => $value->read_duration,
                        "total_length" => $value->total_length,
                        "is_subscribed" => 1,
                        "isDownloaded" => $value->isDownloaded,
                        "downloaded_path" => $value->downloaded_path,
                        'isBookRead' => ($value->is_reading == 1) ? true : false,
                        "downloadstatus" => $this->downloadstatus($id, $value->content_id),
                        'allow_downloadable' => $value->downloads > 0 ? TRUE : FALSE,
                        'views' => $this->views($value->content_id),
                        'like' => $this->like($value->content_id),
                        "drm_setting" => array(
                            'copy_paste' => $value->copy_paste,
                            'printing' => $value->printing,
                            'number_of_device' => (int) $value->number_of_devices,
                            'no_of_copies' => ($value->no_of_copies) ? (int) $value->no_of_copies : 0,
                            'no_of_available' => $this->availablecopies($value->content_id, $value->no_of_copies)
                        )
                            )
                    );
                }
            }
            return api_response(200, 'successfully fetch', ["data" => $data, "pagination" => $pagination,'content_count'=>$content_count]);
        } catch (\Exception $ex) {
            Log::Info('My BOOK exception' . $ex->getMessage());
            return api_response(201, 'My BOOK exception');
        }
    }

    public function quickread(Request $request) {
        try {

            $req = $request->all();
            extract($req);
            if (Auth::check()) {
                $reader_id = Auth::id();
        
            $reader = Readercontents::where(['content_id' => $content_id, 'reader_id' => $reader_id])->first();
            if (!$reader) {
                // Log::Info('quickread insert');
                $reader = new Readercontents;
                $reader->content_id = $content_id;
                $reader->reader_id = $reader_id;
                $reader->is_reading = $is_reading == true ? 1 : 0;
                $reader->read_duration = $read_duration ? $read_duration : 0;
                $reader->save();
                $msg = "Quick Read Create";
            } else {
                Readercontents::where(['content_id' => $content_id, 'reader_id' => $reader_id])
                        ->update(
                        [
                            "is_reading" => $is_reading == true ? 1 : 0,
                            "read_duration" => $read_duration ? $read_duration : 0,
                        ]
                );

                $msg = "Quick Read Update";
            }
            
            $data = Readercontents::where(['content_id' => $content_id, 'reader_id' => $reader_id])
                    ->select("is_reading", "read_duration")->get();
            return api_response(200, $msg, $data);
         }
        } catch (\Exception $ex) {
            Log::Info($msg . ' exception ' . $ex->getMessage());
            api_response(201, $msg . ' exception');
        }
    }

    public function editquickread(Request $request) {
        try {
            $data = [];
            $req = $request->all();
            extract($req);

            $reader = Readercontents::where(['content_id' => $content_id, 'reader_id' => $reader_id]);
            $reader->update(
                    [

                        "is_reading" => $is_reading == true ? 1 : 0,
                        "total_duration" => $total_duration,
                        "read_duration" => $read_duration
                    ]
            );
            $catalog = Content::join('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')->Where(['reader_contents.content_id' => $content_id, 'reader_contents.reader_id' => $reader_id])
                    ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                    ->select(
                            'contents.*', 'contents.image_cover as main_content_image', 'authors.*', 'reader_contents.*'
                    )
                    ->get();

            foreach ($catalog as $key => $value) :
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
                    "reader_id" => $value->reader_id,
                    "is_reading" => ($value->is_reading == 1) ? 1 : 0,
                    "read_duration" => $value->read_duration,
                    "total_duration" => $value->total_duration,
                    "total_length" => $value->total_length,
                    "upload_content" => $this->files($value->class_id) . '/' . $value->upload_content,
                    "downloadstatus" => $this->downloadstatus($reader_id, $value->content_id),
                    "drm_setting" => null,
                    "loggedindevice" => $this->userdevice(),
                    'copy_paste' => $value->copy_paste,
                    'printing' => $value->printing,
                    'allow_downloadable' => $value->downloads > 0 ? true : false,
                    'views' => $this->views($value->content_id),
                    'like' => $this->like($value->content_id),
                        )
                );
            endforeach;

            return api_response(200, 'Quick Read Edit', $data);
        } catch (\Exception $ex) {
            Log::Info('Quick Read edit status' . $ex->getMessage());
            return api_response(201, 'Quick read edit exception');
        }
    }

    public function getquickread($reader_id) {
        
        $data = [];
        $catalog = Content::Where(['reader_contents.reader_id' => $reader_id])
                 ->join('reader_contents', function($join)
                {
                  $join->on('reader_contents.content_id', '=', 'contents.content_id');
                  $join->on('reader_contents.read_duration', '<', 'contents.total_length');
                })
                ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                ->leftjoin('content_drm_settings', 'content_drm_settings.content_id', '=', 'reader_contents.content_id')
                ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.image_cover as imagecover', 'contents.content_id as encrypted_content_id', 'reader_contents.*', 'content_drm_settings.copy_paste', 'content_drm_settings.printing')
                ->where(function ($query){
                    $query->where(DB::raw('DATE_FORMAT(reader_contents.subscription_end,"%Y-%m-%d")'), '>', \Carbon\Carbon::now()->format('Y-m-d'))
                            ->whereIn('contents.content_type',['free','paid'])
                            ->orWhere('contents.content_type','membership');
                })
                ->where('is_reading', 1)
                ->orderBy('reader_contents.updated_at', 'desc')
                ->get();
   
        foreach ($catalog as $key => $value) :
            $cover = ($value->imagecover == null || $value->imagecover == '') ? 'dummy-image.png' : $value->main_content_image;
            $class_detail = get_class_detail($value->class_id);

            array_push(
                    $data, array(
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
                "class_title_s" => $class_detail->class_title_s,
                "class_name" => $class_detail->class_name,
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
                "upload_content" => get_content_files_path($value->upload_content),
                "downloadstatus" => $this->downloadstatus($reader_id, $value->content_id),
                "drm_setting" => null,
                'copy_paste' => $value->copy_paste,
                'printing' => $value->printing,
                'allow_downloadable' => $value->downloads > 0 ? TRUE : FALSE,
                'views' => $this->views($value->content_id),
                'like' => $this->like($value->content_id),
                    )
            );
        endforeach;
        return api_response(200, 'successfully fetch', $data);
    }

     public function recentlyAdded() {        
        $data = [];
        $catalog = Content::where('status','published')
                ->select('contents.*', 'contents.image_cover as main_content_image', 'contents.image_cover as imagecover', 'contents.content_id as encrypted_content_id')
                ->orderBy('contents.updated_at', 'desc')
                ->paginate($this->maxResults);
        foreach ($catalog as $key => $value) :
            $cover = ($value->imagecover == null || $value->imagecover == '') ? 'dummy-image.png' : $value->main_content_image;
            $class_detail = get_class_detail($value->class_id);

            array_push(
                    $data, array(
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
                "class_title_s" => $class_detail->class_title_s,
                "class_name" => $class_detail->class_name,
                "content_type" => $value->content_type,
                "content_price" => $value->content_price,
                "main_content_image" => $cover,
                "tags" => $value->tags,
                "status" => $value->status,
                "reader_id" => $value->reader_id,
                    )
            );
        endforeach;
        return api_response(200, 'successfully fetch', $data);
    }

    public function download(Request $request) {
        try {
            $req = $request->all();
            $reader = new Readercontents;
            $count = $reader->where(['reader_id' => $req['reader_id'], 'content_id' => $req['content_id']])->count();
            if ($count > 0) {
                $record = Readercontents::where(['reader_id' => $req['reader_id'], 'content_id' => $req['content_id']]);
                $record->update([
                    // "is_reading" => $req['is_reading'],
                    "isDownloaded" => $req['isDownloaded'],
                    "downloaded_path" => $req['downloaded_path']
                ]);
                $reader = $record->get();
                $devicefind = DB::table('downloaddevice')->where(["reader_id" => $req['reader_id'], "content_id" => $req['content_id'], "device_id" => $req['device_id']])->count();
                if ($devicefind == 0) {
                    DB::table('downloaddevice')->insert(["reader_id" => $req['reader_id'], "content_id" => $req['content_id'], "device_id" => $req['device_id']]);
                }
                $msg = "successfully updated";
            } else {
                $reader->reader_id = $req['reader_id'];
                $reader->content_id = $req['content_id'];
                //  $reader->is_reading = $req['is_reading'];
                $reader->isDownloaded = $req['isDownloaded'];
                $reader->downloaded_path = $req['downloaded_path'];
                $reader->save();
                $msg = "successfully added";
                $devicefind = DB::table('downloaddevice')->where(["reader_id" => $req['reader_id'], "content_id" => $req['content_id'], "device_id" => $req['device_id']])->count();
                if ($devicefind == 0) {
                    DB::table('downloaddevice')->insert(["reader_id" => $req['reader_id'], "content_id" => $req['content_id'], "device_id" => $req['device_id']]);
                }
            }

            return api_response(200, $msg, $reader);
        } catch (\Exception $ex) {
            Log::Info($msg . ' exception' . $ex->getMessage());
            return api_response(200, $msg);
        }
    }

    public function downloadshow($id, Request $request) {
        try {
            $data = [];
            $req = $request->all();
            $pagination = null;
            $query = Content::join('reader_contents', 'reader_contents.content_id', '=', 'contents.content_id')
                            ->join('content_drm_settings', 'content_drm_settings.content_id', '=', 'contents.content_id')
                            ->select(
                                    'contents.*', 'contents.image_cover as main_content_image', 'authors.*', 'reader_contents.*', 'content_drm_settings.*', 'contents.content_id as encrypted_content_id'
                            )
                            ->leftjoin('authors', 'authors.authors_id', '=', 'contents.author_id')
                            ->Where(['reader_contents.reader_id' => $id])->where('is_reading', '!=', 1);
            if (!empty($req['record']) && $req['record'] == 'all') {
                $catalog = $query->get();
            } else {
                $catalog = $query->paginate($this->maxResults);

                $pagination = array(
                    'current_page' => $catalog->currentPage(),
                    'total' => $catalog->total(),
                    'lastPage' => $catalog->lastPage(),
                    'per_page' => $catalog->perPage(),
                    'next_page' => ($catalog->lastPage() < $catalog->currentPage() + 1) ? NULL : $catalog->lastPage(),
                    'path' => $catalog->path(),
                );
            }

            //     $quries = DB::getQueryLog();
            // dd($quries);
            $reader_id = Auth::id();
            foreach ($catalog as $key => $value) :
                $cover = ($value->main_content_image) ? $value->main_content_image : 'dummy-image.png';

                array_push(
                        $data, array(
                    "content_id" => $value->content_id,
                    'title' => $value->title,
                    'description' => $value->description,
                    'publisher_id' => $value->publisher_id,
                    "category_id" => get_categories(json_decode($value->category_id)),
                    "author" => array(
                        "author_id" => $value->author_id,
                        "author_name" => $this->author_name($value->author_id),
                    ),
                    "class_id" => $value->class_id,
                    "content_type" => $value->content_type,
                    "content_price" => $value->content_price,
                    "main_content_image" => $cover,
                    "tags" => $value->tags,
                    "status" => $value->status,
                    "file" => $this->files($value->class_id) . '/' . $value->upload_content,
                    "reader_id" => $value->reader_id,
                    "is_reading" => ($value->is_reading == 1) ? 1 : 0,
                    "total_length" => $value->total_length,
                    "read_duration" => $value->read_duration,
                    "isDownloaded" => $value->isDownloaded,
                    "downloaded_path" => $value->downloaded_path,
                    'isBookRead' => ($value->is_reading == 1) ? true : false,
                    "downloadstatus" => $this->downloadstatus($id, $value->content_id),
                    'allow_downloadable' => $value->downloads > 0 ? TRUE : FALSE,
                    'views' => $this->views($value->content_id),
                    'like' => $this->like($value->content_id),
                    "drm_setting" => array(
                        'copy_paste' => $value->copy_paste,
                        'printing' => $value->printing,
                        'number_of_device' => (int) $value->number_of_devices,
                        'no_of_copies' => ($value->no_of_copies) ? (int) $value->no_of_copies : 0,
                        'no_of_available' => $this->availablecopies($value->content_id, $value->no_of_copies)
                    )
                        )
                );
            endforeach;
            return api_response(200, 'successfully fetch', ["download" => $data, "pagination" => $pagination]);
        } catch (\Exception $ex) {
            Log::Info('Get Download list exception' . $ex->getMessage());
            return api_response(201, 'Get Download list exception');
        }
    }

    public function author($id) {
        $return = DB::table('users')->where('id', $id)->first();
        $name = null;
        if ($return) {
            $name = $return->first_name . ' ' . $return->middle_name . ' ' . $return->last_name;
        }
        return $name;
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

    public function views($content_id) {
        $data = ContentViews::where(["content_id" => $content_id])->sum('views');
        return ($data) ? (int) $data : 0;
    }

    public function userdevice() {
        $count = UserDevices::Where(['user_id' => Auth::id()])->count();
        return $count;
    }

    public function author_name($id) {
        $return = DB::table('authors')->where('authors_id', $id)->first();
        $name = null;
        if ($return) {
            $name = $return->author_name;
        }
        return $name;
    }

    public function getDrmReports(Request $request) {
        try {
            $drmquery = Content::select('content_id', 'content_id as encrypted_content_id', 'class_id', 'title', 'publishing_house', 'contents.image_cover as main_content_image')
                    ->where('contents.is_deleted', '!=', 1)
                    ->where(function ($query) use ($request) {
                if (!empty($request->publisher_id)) {

                    $query->where('contents.publisher_id', $request->publisher_id);
                }

                if (!empty($request->from_date) && !empty($request->to_date)) {

                    $query->whereBetween('contents.created_at', [$request->from_date . " 00:00:00", $request->to_date . " 23:59:59"]);
                }

                if (!empty($request->search_text)) {

                    $query->where(function ($query) use ($request) {
                        $query->where('contents.title', 'like', "%$request->search_text%")
                        ->orWhere('contents.publishing_house', 'like', "%$request->search_text%")
                        ->orWhere('contents.isbn_content', 'like', "%$request->search_text%");
                    });
                }
            });
            if (!empty($request->extra_sort_by) && !empty($request->extra_sort_by_order)) {
                $drmquery->orderby('contents.' . $request->extra_sort_by, $request->extra_sort_by_order);
            }
            if (!empty($request->sort_by)) {
                $drmquery->orderby('contents.created_at', $request->sort_by);
            } else {
                $drmquery->orderby('contents.created_at', 'desc');
            }
            $drm_data = $drmquery->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);

            if ($drm_data) {
                $drm_data->each(function ($drm) use ($request) {
                    $drm_settings = DB::table("content_drm_settings")
                                    ->where('content_id', $drm->content_id)->first();
                    if($drm_settings){
                             $drm->total_number_of_devices = !empty($drm_settings->number_of_devices) ? $drm_settings->number_of_devices : 0;
                    $drm->downloads = $drm_settings->downloads;
                    $drm->copy_paste = $drm_settings->copy_paste;
                    $drm->printing = $drm_settings->printing;
                    $drm->class_name = $this->get_class_name($drm->class_id);
                    }                                    
               
                });
            }

            return api_response(200, 'successfully fetch', $drm_data);
        } catch (\Exception $ex) {
            Log::Info('getDrmReports exception' . $ex->getMessage());
            return api_response(201, 'Get DrmReports exception');
        }
    }

    public function subscriptionHistory(Request $request) {
        try {
            //            Log::Info('subscriptionHistory');
            //            DB::enableQueryLog();
//               Log::Info(print_r($request->all(),true));
            $record = Readercontents::select(
                            'reader_contents.subscription_remove', DB::raw('DATE_FORMAT(reader_contents.subscription_on,"%Y-%m-%d") as subscriptionon'), DB::raw('DATE_FORMAT(reader_contents.subscription_end,"%Y-%m-%d") as subscriptionend'), 'reader_contents.subscription_remove', 'reader_contents.reader_id', 'contents.content_id', 'contents.image_cover as main_content_image', 'contents.content_type', 'contents.class_id', 'contents.title'
                    )
                    ->join('contents', 'contents.content_id', '=', 'reader_contents.content_id')
                    ->where(['reader_id' => Auth::id()])
                    ->where(DB::raw('DATE_FORMAT(reader_contents.subscription_end,"%Y-%m-%d")'), '<', \Carbon\Carbon::now()->format('Y-m-d'))
                    ->paginate($request->per_page_limit, ['*'], 'page', $request->current_page);
            $record->each(function ($query) {
                $query->encrypted_content_id = custom_encryption('encrypt', $query->content_id);
                $class_detail = get_class_detail( $query->class_id);
                $query->class_title_s = $class_detail->class_title_s;
                $query->class_name = $class_detail->class_name;
                $query->main_content_image = get_content_files_path($query->main_content_image);
                $query->encrypted_content_id = custom_encryption('encrypt', $query->content_id);
            });
            //            Log::Info(print_r(DB::getQueryLog(),true));
            return api_response(200, 'Successfully fetch subscription history', $record);
        } catch (\Exception $ex) {
            Log::Info('subscription history exception' . $ex->getMessage());
            return api_response(201, 'subscription history exception');
        }
    }

    public function createPdfPreview($filelocation, $filename) {
        log::info('file location - ' . $filelocation . '  filename- ' . $filename);
        try {
            $pdf = new FPDI;
            $file_name = array();
            // set the source file
            $path = $filelocation . '/' . $filename;
            $end_directory = $filelocation;
            $filename = $filename;
            for ($i = 1; $i <= 2; $i++) {
                $pdf = new FPDI;
                $pdf->AddPage();
                $pdf->setSourceFile($path);
                $pdf->useTemplate($pdf->importPage($i));


                $new_filename = $end_directory . '/' . str_replace('.pdf', '', $filename) . "-" . $i . ".pdf";
                $filelist[$i - 1] = $new_filename;
                $pdf->Output($new_filename, "F");
            }
            // print_r($file_name);
            $this->pdfmerge($filelist, $filename, $filelocation);
            return true;
        } catch (\Exception $ex) {
            Log::Info('createPdfPreview exception' . $ex->getMessage());
        }
    }

    public function pdfmerge($filelist, $filename, $filelocation) {
        try {
            $pdf = new FPDI;
            $pageCount = 0;
            $files = $filelist;
            foreach ($files as $file) {
                // get the page count
                $pageCount = $pdf->setSourceFile($file);
                // iterate through all pages
                for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                    // import a page
                    $templateId = $pdf->importPage($pageNo);
                    // get the size of the imported page
                    $size = $pdf->getTemplateSize($templateId);

                    // create a page (landscape or portrait depending on the imported page size)

                    $pdf->AddPage('P');

                    // use the imported page
                    $pdf->useTemplate($templateId);

                    // $pdf->SetFont('Helvetica');
                    // $pdf->SetXY(5, 5);
                    // $pdf->Write(8, 'Generated by FPDI');
                }
            }

            $savelocation = $filelocation . "/" . 'preview_' . $filename;
            $pdf->Output('F', $savelocation);
            foreach ($files as $file) {
                unlink($file);
            }
        } catch (\Exception $ex) {
            echo $ex->getMessage();
        }
    }

    public function convertfile() {
        $data = DB::table('contents')->where('file_extension', 'epub')->get();
        $upload_path = 'files/contents';
        $destination_content_file = rtrim(app()->basePath('public/' . $upload_path));
        $file_extension = 'pdf';
        foreach ($data as $key => $value) {
            $newfile_name = uniqid() . '_converted.' . $file_extension;
            $cmd = '/opt/calibre/ebook-convert ' . $destination_content_file . '/' . $value->upload_content . ' ' . $destination_content_file . '/' . $newfile_name;
            $result = shell_exec($cmd);
            if ($result) {
                // $file_name = $newfile_name;

                DB::table('contents')->where('content_id', $value->content_id)->update(['upload_content' => $newfile_name, 'file_extension' => $file_extension]);
            }
        }
    }

    public function batchmodify(Request $request) {
        try {
            // return response()->json($request);
            // die;
            //            DB::enableQueryLog();
            Log::Info('batchmodify..........');
            Log::Info(print_r($request->all(), true));

            $new_audit = $request->all();


            $categories = "";
            if (!empty($request->category_id)) {
                $category_id_arry = json_decode($request->category_id, true);
                if (is_array($category_id_arry) && count($category_id_arry) > 0) {
                    $categories = implode(',', $category_id_arry);
                } else {
                    // return api_response(201, 'category is required!');
                }
            }

            $subcategories = "";
            if (!empty($request->category_id)) {
                $category_id_arry = json_decode($request->sub_category_id, true);
                if (is_array($category_id_arry) && count($category_id_arry) > 0) {
                    $subcategories = implode(',', $category_id_arry);
                } else {
                    // return api_response(201, 'subcategory is required!');
                }
            }
            // $for_junior_reader = 0;
            // if (!empty($request->for_junior_reader) && ($request->for_junior_reader == 'on' || $request->for_junior_reader == 1)) {
            //     $for_junior_reader = 1;
            // }
            if (!empty($request->title)) {
                $data_array['title'] = $request->title;
            }
            if (!empty($request->description)) {
                $data_array['description'] = $request->description;
            }
            if (!empty($request->other_sources_link)) {
                $data_array['other_sources_link'] = $request->other_sources_link;
            }

            $data_array['edited_by'] = Auth::id();

            if (!empty($request->class_id)) {
                $data_array['class_id'] = $request->class_id;
            }
            if (!empty($categories)) {
                $data_array['category_id'] = $categories;
            }

            if (!empty($subcategories)) {
                $data_array['sub_category_id'] = $subcategories;
            }
            if (!empty($request->content_type)) {
                // Allow to Sale (If not enabled, Content will be Marked Free)
                $data_array['content_type'] = $request->content_type ? $request->content_type : 'paid';
            }
            if (!empty($request->content_price)) {
                $data_array['content_price'] = !empty($request->content_price) ? $request->content_price : 0;
            }
            if (!empty($request->discounted_price)) {
                $data_array['discounted_price'] = !empty($request->discounted_price) ? $request->discounted_price : 0;
            }
            if (!empty($request->currency)) {
                $data_array['currency'] = 'KSH';
            }
            if (!empty($request->publishing_house)) {
                $data_array['publishing_house'] = $request->publishing_house;
            }
            if (!empty($request->is_subscriptional_type)) {
                $data_array['is_subscriptional_type'] = $request->is_subscriptional_type ? $request->is_subscriptional_type : 0;
            }
            if (!empty($request->class_number)) {
                $data_array['class_number'] = $request->class_number;
            }
            if (!empty($request->content_subject)) {
                $data_array['content_subject'] = $request->content_subject;
            }
            if (!empty($request->subtitle)) {

                $data_array['subtitle'] = $request->subtitle;
            }
            if (!empty($request->tags)) {
                $data_array['tags'] = $request->tags;
            }
            if (!empty($request->genre)) {
                $data_array['genre'] = $request->genre;
            }
            if (!empty($request->publishing_year)) {
                $data_array['publishing_year'] = $request->publishing_year ? $request->publishing_year : null;
            }
            if (!empty($request->language)) {
                $data_array['language'] = $request->language;
            }
            if (!empty($request->content_type)) {
                $data_array['content_type'] = $request->content_type;
            }
            if (!empty($request->bibliography)) {
                $data_array['bibliography'] = $request->bibliography;
            }
            if (!empty($request->isbn_content)) {
                $data_array['isbn_content'] = $request->isbn_content;
            }
            if (!empty($request->no_of_copie)) {
                $data_array['no_of_copies'] = $request->no_of_copie;
            }
            if (!empty($request->content_reader)) {
                $data_array['content_reader'] = $request->content_reader;
            }
            if (!empty($request->display_upto)) {
                $data_array['display_upto'] = $request->unlimited_access ? -1 : $request->display_upto;
            }
            if (!empty($request->edition)) {
                $data_array['edition'] = !empty($request->edition) ? $request->edition : 0;
            }
            if (!empty($request->publication_details)) {
                $data_array["publication_details"] = $request->publication_details;
            }
            if (!empty($request->series_statement)) {
                $data_array["series_statement"] = $request->series_statement;
            }
            if (!empty($request->note)) {
                $data_array["note"] = $request->note;
            }
            if (!empty($request->issn)) {
                $data_array["issn"] = $request->issn;
            }

            if (!empty($request->editor)) {
                $data_array["editor"] = $request->editor;
            }

            if (Auth::user()->user_type == 'admin') {
                $data_array['status'] = 'published';
            }
            if (!empty($request->title) && empty($request->content_id)) {
                $count = Content::where(['title' => $request->title, 'edition' => $request->edition])->count();
                if ($count > 0) {
                    return api_response(201, 'Content already exist with this title name');
                }
            }
            if (!empty($request->author_name)) {
                $data_array['author_id'] = $this->create_author($request->author_name);
            }

            if (!empty($request->publisher_id)) {
                $data_array['publisher_id'] = $request->publisher_id;
            }
            $content_detail = Content::where(array(
                        'content_id' => $request->content_id
                    ))->first();
            $content_ids = explode(",", $request->content_id);

            $update_content = Content::whereIn('content_id', $content_ids)->update($data_array);

            $contentDrmSettings_array = array();
            if (!empty($request->copy_paste)) {
                $contentDrmSettings_array['copy_paste'] = $request->copy_paste;
            }
            if (!empty($request->printing)) {
                $contentDrmSettings_array['printing'] = $request->printing;
            }
            if (!empty($request->downloads)) {
                $contentDrmSettings_array['downloads'] = $request->downloads;
            }
            if (!empty($request->number_of_devices)) {
                $contentDrmSettings_array['number_of_devices'] = $request->number_of_devices;
            }
            if (!empty($contentDrmSettings_array) && count($contentDrmSettings_array) > 0) {
                $drmResult = ContentDrmSettings::whereIn('content_id', $content_ids)->update($contentDrmSettings_array);
            }

            $smsg = 'Content updated successfully.';
            $emsg = 'Unable to update Content!';


            // print_r(DB::getQueryLog());
            if ($update_content) {
                return api_response(200, $smsg, $update_content);
            } else {
                return api_response(201, $emsg);
            }
        } catch (\Exception $ex) {
            Log::Info('Add content exception' . $ex->getMessage());
            return api_response(201, 'Add content exception' . $ex->getMessage());
        }
    }

    public function chunks($path) {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://localhost/knls_web/chunk_upload/public/api/files-upload',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => array('file' => new CURLFILE($path)),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        echo $response;
    }

    public function unlinkFile(Request $request) {
        if (!empty($request->complete_file_path)) {
            return $this->removeFile($request->complete_file_path);
        }
    }

    function removeFile($file_path) {

        $file_complete_path = destination_base_public_path('files/') . $file_path;
        $result = delete_file($file_complete_path);
        if ($result) {
            return api_response(200, 'File unlink successfully');
        } else {
            return api_response(201, 'Unable to unlink file!');
        }
    }

    public function get_max_upload_size() {
        $upload_size = ini_get('upload_max_filesize');
        $upload_size = (int) str_replace('M', '', $upload_size);
        return api_response(200, 'size get successfully', ['upload_size_in_mb' => $upload_size]);
    }
    public function testMove(){
        Log::Info('testMove');
        $contents = DB::table('contents')->select('image_cover','content_id')
                ->where('image_cover','not like', "%cover_images/%")
                ->get();
        $destination_content_file = destination_base_contents();
        
        if(!is_dir($destination_content_file.'cover_images/')){ 
             mkdir($destination_content_file.'cover_images/');
//             echo 'created dir'; die;
        }
        foreach($contents as $content){
            Log::Info('content_id'.$content->content_id);
            Log::Info('image_cover'.$content->image_cover);
            if(!empty($content->image_cover)){
                $destination_filename = $content->image_cover;
                
                if(file_exists($destination_content_file.$destination_filename)){
                $copyFile = copy($destination_content_file.$destination_filename, $destination_content_file . 'cover_images/' . $destination_filename);
                if($copyFile){
                    $resultUpdate = DB::table('contents')->where('content_id',$content->content_id) 
                           ->update(['image_cover'=>'cover_images/' . $destination_filename]);
                    if($resultUpdate){
                        unlink($destination_content_file.$destination_filename);
                    }else{
                        Log::Info('unable to update');
                    }
                    
                   
                }else{
                       Log::Info('unable to copy');
                }
                }else{
                       Log::Info('file not exists!');
                         $resultUpdate = DB::table('contents')->where('content_id',$content->content_id) 
                           ->update(['image_cover'=>'']);
                }
            }
        }
      
    }
    
    public function updatePageNumber(Request $request){
        $reader_content = Readercontents::where(['reader_id' => $request->user_id,
            'content_id' => $request->content_id])->first();
        if($reader_content && $request->pageNumber > $reader_content->read_duration){
            Content::where('content_id',$request->content_id)->update(['total_length'=>$request->total_length]);
            Readercontents::where(['reader_id' => $request->user_id,
            'content_id' => $request->content_id])->update(['read_duration'=>$request->pageNumber]);
        }
        
    }

}
