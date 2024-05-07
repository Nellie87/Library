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
use App\Models\Faq;

class DashboardController extends Controller
{

    private $url;
    function __construct()
    {
        // $this->middleware('auth:api');
        $this->url = url() . '/image';
       
    }
    public function show(){
        try{
            $faq = Faq::all();
            return $this->apiResponse('200','FAQ list',$faq);
        }
        catch(\Exception $ex){
            return response()->json(['error'=>$ex]);
        }
        

    }

}
