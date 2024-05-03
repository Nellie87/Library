<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;
use Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UploadController extends Controller
{
    public $upload_size;

    function __construct()
    {
        $upload_size = ini_get('upload_max_filesize');
        $upload_size = (int)str_replace('M', '', $upload_size);
        $this->upload_size = $upload_size;
    }
    public function index()
    {
        //        echo phpinfo();

        return view('index', ['upload_size' => $this->upload_size]);
    }

    public function uploadLargeFiles(Request $request)
    {
         Log::Info('uploadLargeFiles');
        Log::Info(print_r($request->all(),true));
        $receiver = new FileReceiver('file', $request, HandlerFactory::classFromRequest($request));

        if (!$receiver->isUploaded()) {
            // file not uploaded
        }

        $fileReceived = $receiver->receive(); // receive file
        if ($fileReceived->isFinished()) { // file uploading is complete / all chunks are uploaded
            $file = $fileReceived->getFile(); // get file
            $extension = $file->getClientOriginalExtension();
            $fileName = 'content_' . md5(time()) . '.' . $extension; // a unique file name
            $content_dir = 'contents/'.$request->class_name;
            $disk = Storage::disk(config('filesystems.default'));
            $path = $disk->putFileAs($content_dir, $file, $fileName);

            // delete chunked file
            unlink($file->getPathname());
            return [
                'path' => $path,
                'filename' => $fileName,
                'file_extension' => $extension,
            ];
        }

        // otherwise return percentage information
        $handler = $fileReceived->handler();
        return [
            'done' => $handler->getPercentageDone(),
            'status' => true
        ];
    }
    
      public function singleUpload(Request $request)
    {
         Log::Info('uploadLargeFiles');
        Log::Info(print_r($request->all(),true));
        $receiver = new FileReceiver('file', $request, HandlerFactory::classFromRequest($request));

        if (!$receiver->isUploaded()) {
            // file not uploaded
        }

        $fileReceived = $receiver->receive(); // receive file
        if ($fileReceived->isFinished()) { // file uploading is complete / all chunks are uploaded
            $file = $fileReceived->getFile(); // get file
            $extension = $file->getClientOriginalExtension();
            $fileName = 'content_' . md5(time()) . '.' . $extension; // a unique file name
            $content_dir = 'contents/'.$request->class_name;
            $disk = Storage::disk(config('filesystems.default'));
            $path = $disk->putFileAs($content_dir, $file, $fileName);

            // delete chunked file
            unlink($file->getPathname());
            return [
                'path' => $path,
                'filename' => $fileName,
                'file_extension' => $extension,
            ];
        }

        // otherwise return percentage information
        $handler = $fileReceived->handler();
        return [
            'done' => $handler->getPercentageDone(),
            'status' => true
        ];
    }
    
       public function bulkUpload(Request $request)
    {
         Log::Info('uploadLargeFiles');
        Log::Info(print_r($request->all(),true));
        $receiver = new FileReceiver('file', $request, HandlerFactory::classFromRequest($request));

        if (!$receiver->isUploaded()) {
            // file not uploaded
        }

        $fileReceived = $receiver->receive(); // receive file
        if ($fileReceived->isFinished()) { // file uploading is complete / all chunks are uploaded
            $file = $fileReceived->getFile(); // get file
            $extension = $file->getClientOriginalExtension();
            $fileName = 'zip_' . md5(time()) . '.' . $extension; // a unique file name
            $content_dir = 'contents/zip';
            $disk = Storage::disk(config('filesystems.default'));
            $path = $disk->putFileAs($content_dir, $file, $fileName);

            // delete chunked file
            unlink($file->getPathname());
            return [
                'path' => $path,
                'filename' => $fileName,
                'file_extension' => $extension,
            ];
        }

        // otherwise return percentage information
        $handler = $fileReceived->handler();
        return [
            'done' => $handler->getPercentageDone(),
            'status' => true
        ];
    }
    
    public function unlinkFile(Request $request){
        if(!empty($request->complete_file_path)){
            unlink($request->complete_file_path);
        }
    }
    
    
}
