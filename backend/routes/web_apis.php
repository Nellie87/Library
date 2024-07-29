<?php

use App\Http\Controllers\SSOController;
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
$router->get('/', function () use ($router) {
    return $router->app->version();

});

$router->post('/pesaflow/payment', 'SSOController@payment');
$router->get('/pesaflow/callback', 'SSOController@paymentcallback');
$router->post('/pesaflow/notify', 'SSOController@paymentnotify');
$router->post('/membership-update', 'SSOController@membershipUpdate');
$router->get('/sso/oauth/authorize', 'SSOController@getLogin');
$router->get('/callback/oauth/authorize', 'SSOController@getCallback');
$router->get('/callback/oauth/authorize', 'SSOController@getCallback');


//$router->get('/', function () use ($router) {
//    return $router->app->version();
//});

$router->get('/temp-key', function () {
    return \Illuminate\Support\Str::random(32);
});
$router->post('/audit-test', 'AuditController@index');
$router->get('/upload-mrc', 'ContentController@contentUploadMrc');
$router->get('/testing', 'PGController@testing');
$router->post('/auth/login', 'ExampleController@postLogin');
$router->get('/test-move', 'ContentController@testMove');
$router->get('/viewpdf', 'UserController@viewPdf');
$router->get('/webviewerpdf', 'UserController@webViewerPdf');
$router->post('cs-payment-response', "PGController@cybersourcePaymentResponse");
$router->group(['prefix' => 'wapi'], function () use ($router) {

    /**
     * Public routes
     */
    $router->post('callback-api-token', 'UserController@callbackAuthenticate');
    $router->get('get-top-selling', "DashboardController@homepage");
    $router->post('login', 'UserController@authenticate');
    $router->post('login/oauth/authorise', 'SSOController@getUser');
    $router->post('registration', 'UserController@registration');
    $router->post('check-valid-password', 'UserController@checkValidPassword');
    $router->post('check-valid-email', 'UserController@checkValidEmail');
    $router->post('check-mobile-existence', 'UserController@checkMobileExistence');
    $router->post('otp-verify', 'UserController@otpverify');
    $router->post('otp-resend', 'UserController@otpresend');
    $router->post('get-public-faq', "ManagementController@getModule");
    $router->post('de-active', 'UserController@deactive');
    $router->post('forget', 'UserController@forget');
    $router->post('forget-reset', 'UserController@forgetSetPassword');
    $router->post('set-password', 'UserController@setPassword');
    $router->post('logout', 'UserController@logout');
    $router->post('book', 'BookController@index');
    $router->post('change-password', 'UserController@changepassword');
    $router->put('change-password', 'UserController@changepassword');
    //public site routes
    $router->post('get-contents-categorywise', "ContentController@getContentsCategoryWise");
    $router->post('get-contents-categorywise-home', "ContentController@getContentsCategoryWiseHome");
    $router->post('content-detail-public', "ContentController@contentDetail");
    $router->post('get-contents-public', "ContentController@getContentsPublic");
    $router->post('get-theme-config', "CommonController@getthemeconfig");
    $router->post('subscribe-email', "ManagementController@contentSubscribedEndEmailNotification");
    $router->post('get-public-library', "ContentController@getLibraryContents");
    $router->post('get-contents-classes-public', "CommonController@classes");
    $router->post('get-content-title-suggestions-list', "ContentController@getContentTitlesSuggestionList");
});
/**
 * Common Controller
 */
$router->group(['prefix' => 'wapi/common'], function () use ($router) {
    $router->get('classes', 'CommonController@classes');
    $router->get('categories', 'CommonController@categories');
    $router->get('filter', 'CommonController@filter');
    $router->post('filter-web', 'CommonController@filter');
    $router->get('country', 'CommonController@country');
    $router->get('city', 'CommonController@city');
    $router->get('city-new', 'CommonController@city_new');
    $router->get('state', 'CommonController@state');

});

$router->group(['prefix' => 'wapi', 'middleware' => 'auth:api'], function ($router) {

    /**
     * Common apis
     */


    $router->group(['middleware' => 'UserRole:apiuser'], function ($router) {
        $router->post('callback', "PGController@mpesaResponse");
    });
    $router->group(['middleware' => 'UserRole:publisher'], function ($router) {
        $router->get('dashboard/{id}', "DashboardController@dashboard");
        $router->post('content-catalog', "BookController@content_catalog");
        $router->post('reports-list-of-books', "BookController@reportsListOfBooks");
        /**
         * Group Controller
         */
        $router->post('add-discussion', "GroupController@add");
        $router->get('get-discussion/{id}', "GroupController@show");
    });


    /**
     * --------------------------User- Reader-----------------------------------
     */
    $router->group(['middleware' => 'UserRole:reader#junior_reader'], function ($router) {
        $router->post('get-user-active-plan', 'UserController@getUserActivePlan');
        $router->post('add-bookmark', 'CommonController@addbookmark');
        $router->post('get-bookmark', 'CommonController@getbookmark');
        $router->post('cybersource-card-pay-sign', "PGController@cybersourceCardPaySign");
        $router->post('transaction-pay', "PGController@transactionPay");

        /**
         * Module - Contents
         * Books Controller Routing
         */

        $router->get('book-catalog', "BookController@catalog");
        $router->post('my-book/{id}', "ContentController@myBook");
        $router->get('get-book-detail/{id}', "BookController@detail");

        $router->get('trending', "BookController@trending");
        $router->post('book-catalog-filter', "BookController@catalogFilter");

        /**
         * Reader Controller
         */
        $router->get('my-account/{id}', "ReaderController@myaccount");
        $router->put('my-account/{id}', "ReaderController@update");
        $router->post('preference', "ReaderController@preferences");
        $router->get('preference/{id}', "ReaderController@preferencesShow");
        $router->post('follow', "FollowerController@follow");
        /**
         * Module - Contents
         * Books Controller Routing
         */
        $router->post('library-catalog', "BookController@catalog");
        $router->post('recommended-contents', "ContentController@recommendedContents");
        $router->get('my-book/{id}', "BookController@myBook");

        $router->post('quick-read', "ContentController@quickread");
        $router->put('quick-read', "ContentController@editquickread");
        $router->get('quick-read/{reader_id}', "ContentController@getquickread");
        $router->post('recently-added', "ContentController@recentlyAdded");
        $router->post('subscription-history', "ContentController@subscriptionHistory");

        $router->get('get-book-detail/{id}', "BookController@detail");
        $router->post('library-catalog-search', "BookController@catalogFilter");
        $router->get('trending', "BookController@trending");
        $router->post('download', "BookController@download");
        $router->get('download/{id}', "BookController@downloadshow");

        $router->post('comment', "CommentController@add");
        $router->get('comment/{id}', "CommentController@get");
        $router->post('add-feedback', "FeedbackController@addFeedback");

        $router->post('membership-subscription-post', 'UserController@membershipSubscriptionPost');

    });


    $router->group(['middleware' => 'UserRole:admin'], function ($router) {
        $router->get('role/{user_type}', "ManagementController@roles");
        $router->post('role', "ManagementController@add_permission");
        $router->post('role-permission', "ManagementController@role_and_permission");
        $router->post('get-role-permission', "ManagementController@get_role_and_permission");
        $router->post('delete-request', "RequestController@deleteRequest");
        $router->post('get-drm-reports', "ContentController@getDrmReports");
        $router->post('add-module', "ManagementController@addModule");
    });


    // validate payment response api
    $router->post('validate-intasend-response', "PGController@validateIntasendResponse");

    $router->post('update-contents-status', "ContentController@updateStatus");
    $router->post('approve-content', "ContentController@updateStatus");
    $router->post('reject-content', "ContentController@updateStatus");
    /**
     * Publisher & Reader & admin common routes
     */
    $router->post('single-views-contents', "ContentController@usersViewsOnContents");
    $router->post('circle-graph', "ContentController@circle_graph");
    $router->post('get-feedback', "FeedbackController@getFeedback");
    $router->post('add-request', "RequestController@addRequest");
    $router->post('get-request', "RequestController@getRequest");
    $router->get('user-myprofile', "UserController@userMyProfile");
    $router->post('user-myprofile-update', "UserController@userMyProfileUpdate");
    $router->post('user-preferance', "UserController@userpreferance");
    $router->get('get-categories', "ContentController@categorywithsubcategory");

    $router->get('get-classes', "ContentController@getClasses");
    $router->post('add-rating-review', "CommentController@postContentComment");
    $router->get('get-rating-review/{content_id}', "CommentController@getContentComments");

    $router->post('get-contents', "ContentController@getContents");
    $router->post('my-publications', "ContentController@myPublications");
    $router->post('get-temp-contents', "ContentController@gettempcontent");
    $router->post('get-library-contents', "ContentController@getLibraryContents");

    $router->post('content-bulk-upload', "ContentController@contentBulkUpload");
    $router->post('content-mrc-upload', "ContentController@contentUploadMrc");
    $router->post('add-content', "ContentController@addContent");
    $router->post('get-max-upload-size', "ContentController@get_max_upload_size");
    $router->post('edit-content', "ContentController@addContent");
    $router->post('unlink-file', "ContentController@unlinkFile");
    $router->post('batch-content', "ContentController@batchmodify");
    $router->post('remove-content', "ContentController@removeContent");
    $router->post('views-on-contents', "ContentController@viewsOnContents");
    $router->post('published-contents', "ContentController@publishedContents");
    $router->post('sales-statistics', "ContentController@salesStatistics");
    $router->post('content-delete', "ContentController@deleteContent");
    $router->post('content-multiple-delete', "ContentController@deleteMultipleContent");
    $router->post('content-detail', "ContentController@contentDetail");

    $router->post('update-drm-settings', "ContentController@updateDRMSettings");
    $router->post('get-feedback-content_list', "FeedbackController@getFeedbackContentList");

    $router->post('borrow-content', "ContentController@borrow");

    $router->post('field-configuration', "CommonController@fieldconfig");
    $router->get('get-field-configuration', "CommonController@getfieldconfig");
    $router->post('get-theme-configuration', "CommonController@getthemeconfig");
    $router->post('theme-configuration', "CommonController@themeconfig");
    $router->post('content-views', "CommonController@contentview");

    $router->post('get-audit', "AuditController@get");
    $router->post('get-search-keyword', "AuditController@search_keyword");
    $router->post('search-content-report', "AuditController@searchContentReport");
    $router->post('get-permission', "ManagementController@get_permission");

    $router->post('get-follower-list', "FollowerController@getfollower");

    /**
     * Submit Views
     */
    $router->post('submit-views', 'CommonController@views');
    $router->post('likes', 'CommonController@like');
    $router->post('views', 'CommonController@views');
    $router->post('payment-methods', 'PGController@getPaymentMethods');
    $router->post('update-payment-methods', 'PGController@updatePaymentMethods');

    $router->post('get-user-list', "ManagementController@getuserlist");
    $router->post('delete-user', "ManagementController@deleteUser");
    $router->post('add-user', "ManagementController@adduser");
    $router->post('get-user-detail', "ManagementController@getuserdetail");
    $router->post('update-user-detail', "ManagementController@userdetailupdate");
    $router->post('update-user-detail-admin', "ManagementController@updateUserByAdmin");
    $router->post('admin-dashboard', "DashboardController@admin_dashboard");
    $router->post('get-user-loggedin', "ManagementController@loggedinuser");
    $router->post('get-loggedin-history', "ManagementController@loggedInHistory");
    $router->post('block-user', "ManagementController@blockUser");
    $router->post('reply-request', "RequestController@addRequestReply");
    $router->post('reply-comments', "RequestController@viewReplyComments");
    $router->get('get-publisher', "ManagementController@get_publisher_name");
    $router->post('get-module', "ManagementController@getModule");
    $router->post('subscribed-end', "ManagementController@contentSubscribedEnd");


    /**
     * Category
     */
    $router->post('add-category', "CommonController@addcategory");
    $router->post('add-sub-category', "CommonController@addsubcategory");
    $router->get('get-sub-categories', "CommonController@subcategories");
    $router->post('get-sub-category', "CommonController@getsubcategory");
    $router->post('edit-sub-category', "CommonController@editsubcategory");

    $router->post('get-category', "CommonController@getcategory");
    $router->post('edit-category', "CommonController@editcategory");

    $router->get('get-category', "CommonController@categories");
    $router->post('get-plan', "CommonController@getplan");
    $router->post('get-active-plans', "CommonController@getActiveplans");
    $router->post('edit-plan', "CommonController@editplan");
    $router->post('enable-plan', "CommonController@enablePlan");
    $router->post('delete-plan', "CommonController@deletePlan");
    $router->post('add-plan', "CommonController@addplan");
    $router->post('financials-filter', "CommonController@financialsFilter");


    /**
     * Vendor Controller
     */
    $router->post('vendor-list', 'VendorController@index');
    $router->post('create-vendor', 'VendorController@add');
    $router->post('edit-vendor', 'VendorController@edit');
    $router->post('vendor-detail', 'VendorController@detail');
    $router->post('delete-vendor', 'VendorController@deletevendor');

    $router->post('budget-list', 'VendorController@budget');
    $router->post('create-budget', 'VendorController@addbudget');
    $router->post('edit-budget', 'VendorController@editbudget');
    $router->post('budget-detail', 'VendorController@budgetdetail');
});
