<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('verify/{id}', 'UserController@verify');
$router->get('/', function () use ($router) {
    return 'test';
});
$router->get('/pdf-test', function (Codedge\Fpdf\Fpdf\Fpdf $fpdf) {
    // $fpdf->AddPage();
    // $fpdf->SetFont('Courier', 'B', 18);
    // $fpdf->Cell(50, 25, 'Hello World!');
    // $fpdf->Output();
    // exit;
});
$router->post('marc-file', 'ContentController@index');
$router->post('/auth/login', 'ExampleController@postLogin');
$router->get('convertfile', 'ContentController@convertfile');
$router->post('update-page-number', 'ContentController@updatePageNumber');
$router->group(['prefix' => 'api'], function () use ($router) {
    /**
     * Public routes
     */
    $router->post('login', 'UserController@authenticate');
    $router->post('registration', 'UserController@registration');

    $router->post('otp-verify', 'UserController@otpverify');
    $router->post('otp-resend', 'UserController@otpresend');
    $router->post('forget', 'UserController@forget');
    $router->post('logout', 'UserController@logout');
    $router->get('book', 'BookController@index');
    $router->put('change-password', 'UserController@changepassword');
});
/**
 * Common Controller
 */
$router->group(['prefix' => 'api/common'], function () use ($router) {
    $router->get('classes', 'CommonController@classes');
    $router->get('categories', 'CommonController@categories');
    $router->get('filter', 'CommonController@filter');
    $router->get('country', 'CommonController@country');
    $router->get('city', 'CommonController@city');
    $router->get('city-new', 'CommonController@city_new');
    $router->get('state', 'CommonController@state');

});

$router->group(['prefix'=>'api','middleware' => 'auth:api'], function ($router) {

    /**
     * Common apis
     */



    /**
     * --------------------------User- Reader-----------------------------------
     */
    $router->group(['middleware' => 'UserRole:reader#junior_reader'], function ($router) {

        /**
         * Module - Contents
         * Books Controller Routing
         */

        $router->get('library-catalog', "BookController@catalog");
        $router->get('get-book-detail/{content_id}', "ContentController@contentDetail");
        // $router->get('get-book-detail/{id}', "BookController@detail"); --  old
        $router->post('library-catalog-search', "BookController@catalogFilter");
        $router->get('trending', "BookController@trending");
        $router->post('book-catalog-filter', "BookController@catalogFilter");

        /**
         * Reader Controller
         */
        $router->get('my-account', "UserController@userMyProfile");
        // $router->get('my-account/{id}', "ReaderController@myaccount");  -- old
        $router->put('my-account/{id}', "UserController@userMyProfileUpdate");  // Update my account
        // $router->put('my-account/{id}', "ReaderController@update"); -- old
        $router->post('preference', "ReaderController@preferences");
        $router->get('preference/{id}', "ReaderController@preferencesShow");

        /**
         * Module - Contents
         * Books Controller Routing
         */

        $router->get('my-book/{id}', "ContentController@myBook");
        $router->post('quick-read', "ContentController@quickread");
        $router->put('quick-read', "ContentController@editquickread");
        $router->get('quick-read/{reader_id}', "ContentController@getquickread");


        $router->get('trending', "BookController@trending");
        $router->post('download', "ContentController@download");
        $router->get('download/{id}', "ContentController@downloadshow");
        $router->post('comment', "CommentController@add");
        $router->get('comment/{id}', "CommentController@get");
        $router->post('add-feedback', "FeedbackController@addFeedback");
        $router->post('get-feedback-content_list', "FeedbackController@getFeedbackContentList");
        $router->post('get-module', "ManagementController@getModule");
    });
      /**
         * Publisher & Reader common routes
         */
        $router->post('get-feedback', "FeedbackController@getFeedback");
        $router->post('add-request', "RequestController@addRequest");
        $router->post('get-request', "RequestController@getRequest");
        $router->get('user-myprofile',"UserController@userMyProfile");
        $router->post('user-myprofile-update',"UserController@userMyProfileUpdate");
        $router->get('get-categories', "ContentController@getCategories");
        $router->post('add-rating-review', "CommentController@postContentComment");
        $router->get('get-rating-review/{content_id}', "CommentController@getComments");

        $router->post('likes', 'CommonController@like');
        $router->post('views', 'CommonController@views');
        $router->post('add-bookmark', 'CommonController@addbookmark');
        $router->post('get-bookmark', 'CommonController@getbookmark');

        $router->get('get-followed-publisher', "FollowerController@getfollowpublisher");
        $router->get('all-publisher', "FollowerController@allpublisher");
        $router->post('follow', "FollowerController@follow");

});
