<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('single-upload', [App\Http\Controllers\UploadController::class, 'singleUpload'])->name('single-upload');
Route::post('bulk-upload', [App\Http\Controllers\UploadController::class, 'bulkUpload'])->name('bulk-upload');
Route::get('unlink-file', [App\Http\Controllers\UploadController::class, 'unlinkFile'])->name('unlink-file');