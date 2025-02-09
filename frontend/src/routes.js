import React from 'react';
import { Route, BrowserRouter, Link,Redirect } from 'react-router-dom';
import BarGraph from "./graphs/bar";
import LineGraph from './graphs/line';
import PieGraph from './graphs/pie';
import CategorList from './admin/category_list';
import planList from './admin/plan_list';

import UsersList from './admin/users/users_list';
import AddUsers from './admin/add_users';
import PublishersList from './admin/publishers_list';
import AddPublishers from './admin/add_publishers';
import AuthorsList from './admin/authors_list';
import AddAuthors from './admin/add_authors';
import StaffList from './staff_users/staff_list';
import AddStaff from './staff_users/add_staff';
import ClassesList from './admin/classes_list';
import ContentList from './admin/content_list';
import PblisherList from './admin/pblisher_list';
import AuthorList from './admin/author_list';
import VendorManagement from './admin/vendor/list';
import AddVendor from './admin/vendor/add';
import budget from './admin/budget/list';
import Addbudget from './admin/budget/add';
import Layout from './layout';
import AdminDashboard from "./admin";
import PublicLayout from "./public_layout";

//admin reports
import UsersReport from './admin/UsersReport';
import PublishersReport from './admin/PublishersReport';
import SubscriptionsReport from './admin/SubscriptionsReport';
import SalesReport from './admin/SalesReport';
import EbooksReport from './admin/EbooksReport';
import AudioBooksReport from './admin/AudioBooksReport';
import VideoBooksReport from './admin/VideoBooksReport';
import SlidersReport from './admin/SlidersReport';
import LoggedInUsersReport from './admin/LoggedInUsersReport';
import ViewsOnContentReport from './admin/ViewsOnContentReport';
import SearchesReport from './admin/SearchesReport';
import loggedinhistory from './admin/loggedinhistory';


// user panel imports
import UserDashboard from './user';
import Home from './public_pages/home';
import Login from './public_pages/login';
import forget from './public_pages/forget';
import Registration from './public_pages/registration';
import Functions from './helpers/functions';
import ChangePassword from './change_password';
import ReaderProfile from './user/profile';
import Chat from './user/chat';
import Authentication from './public_pages/authentication';
import ChangePasswords from './public_pages/changepassword';
import ForgotPassword from './public_pages/forgot_password';
import Category from './category/category';
import LandingPage from './landingPage/landing_page';
import Sitemap from './public_pages/sitemap';
import HistorySubscription from './user/history_subscription';

import FeedbackList from './user/feedbackList';
import AddFeedback from './user/add_feedback';

import ReaderManual from './user/reader_manual';
import FieldsConfiguration from './admin/search/fields_configuration';
import ThemeConfiguration from './admin/search/theme_configuration';
import SearchReport from './admin/search/search_report';
import RequestForHelpList from './user/request_for_help_list';
import AddRequestForHelp from './user/add_request_for_help';
import ReadersRequest from './admin/readers_request';
import MyBooks from './user/myBooks';
import MyCart from './user/myCart';
import ReadersReply from './admin/readers_reply';

import StaffDashboard from './staff';
import AddFaq from './faq/add_faq';
import Discussions from './discussion/discussions';
import AddDiscussion from './discussion/add_discussion';
import LibraryUsersList from './staff/library_users';
import preferance from './user/preferance';

// publisher pages
import PublisherDashboard from './publisher';
import AllAuthors from './publisher/authors_list';
import AddAuthor from './publisher/add_authors';
import MyPublications from './content/content_list';
import AddNewContent from './content/add_content';
import BatchContent from './content/batch';
import Followerlist from './publisher/follower_list';

import PublisherFeedbackList from './publisher/feedbackList';
import AddPublisherFeedback from './publisher/add_feedback';
import PublisherDiscussions from './publisher/discussions';
import AddPublisherDiscussion from './publisher/add_discussion';
import PublisherRequestForHelpList from './publisher/request_for_help_list';
import AddPublisherRequestForHelp from './publisher/add_request_for_help';
import PublisherChat from './publisher/chat';
import PublisherManual from './publisher/publisher_manual';
import PublisherFaq from './publisher/faq';
import ContentSales from './publisher/ContentSales';
import ListOfBooks from './publisher/listOfBooks';
import PublishedEbooks from './publisher/PublishedEbooks';
import PublishedAudioBooks from './publisher/PublishedAudioBooks';
import PublishedVideoBooks from './publisher/PublishedVideoBooks';

import ViewsOnPublisherContent from './publisher/ViewsOnPublisherContent';
import CommonProfile from './publisher/profile';
import ViewsOnSingleUserPublisherContent from './publisher/ViewsOnSingleUserPublisherContent'

//public pages
import PublisherSitemap from './public_pages/sitemap';
import Search from './search/search';
import eBooks from './search/eBooks';
import AudioBooks from './search/AudioBooks';
import VideoBooks from './search/VideoBooks';
import Slides from './search/Slides';
import ShoppingCart from './public_pages/ShoppingCart';
import Bookdetail from './book_detail/bookdetail';



import BookDetails from './public_pages/bookDetails';
import PdfPlayer from './public_pages/pdfPlayer';
import VideoPlayer from './public_pages/videoPlayer';
import AudioPlayer from './public_pages/audioPlayer';
import PrivateSearch from './search/private_search';
import PPTViewer from './public_pages/pptViewer';
import ReportingStatistics from './admin/reporting_statistics';
import DRMRights from './admin/drm_rights';
import AdminSettings from './admin/settings';
import RolesPermissions from './admin/roles_permissions';
import RejectReason from './content/reject_reason';
import removeReason from './content/remove_reason';
import BulkUpload from './content/bulk_upload';
import PrivateBookdetail from './book_detail/private_bookdetail';
import Publisherdetail from './publisher/publisher_detail';
import Booklists from './search/book_lists';
import PublicBooklist from './search/public_book_list';
import GA from './public_pages/ga';
import DRMTransactionsStatics from './drm/transactions_statics';
import Audits from './admin/search/audits';

import PublishedContents from './publisher/PublishedContents';
import TermsConditions from './public_pages/terms_conditions';
import PrivacyPolicy from './public_pages/privacy_policy';
import MembershipSubscription from './user/membership_subscription';


import SearchReportNew from './admin/search/search_report_new';


import Manual from './public_pages/manual';
import Faqs from './public_pages/faq';
import addPlan from './admin/addPlan';
import addSubcategory from './admin/add_sub_category';
import ResetPassword from './public_pages/resetPassword';
import SetPassword from './public_pages/setPassword';
import ViewPlayContent from './book_detail/viewPlayContent';
import PublicFaq from './public_pages/publicFaq';
import CybersourceResponse from './user/cybersource_response';
import CybersourceCheckoutProcess from './user/cybersource_checkoutprocess';
import SsologinButton from './public_pages/ssoLogin';
import SsoRedirect from "./public_pages/ssoRedirect";
import SSORedirect from "./public_pages/ssoRedirect";
import PaymentCallbackComponent from "./public_pages/paymentcallback";
import completeRegistration from "./public_pages/completeRegistration";
//import UserManualPdf from './public_pages/usermanualpdf';


const funcObj = new Functions;
let base_name = funcObj.getBasename();
// let pathname = window.location.pathname;
const AUTH_USER = funcObj.getAuthUser();
// console.log('pathname',pathname);
// console.log('base_name',base_name);
// console.log('AUTH_USER',AUTH_USER);
class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           permission:[],
           addContentPermission: true,
           feedbackPermission: true,
           readerfeedbackPermission:true,
           readerRequestPermission:true,
           requestPermission:true,
           editPermission:true,
           addUserPermission:true,
           contentReviewPermission:true,
           viewTransactionPermission:true,
           reportPermission:true
        }

    }

    componentDidMount(){
      //  appendScript("/path/to/resource.js");
    }
   

    getPermission() {
        let permissiondetail = AUTH_USER.user.permission;
        if(AUTH_USER != null && permissiondetail && permissiondetail.length &&  permissiondetail.length>0){
            for(let i=0; i< permissiondetail.length; i++){
                console.log(permissiondetail[i].permission)
                if((permissiondetail[i].role_name== "senior_librarian" ||permissiondetail[i].role_name== "librarian" || permissiondetail[i].role_name== "publisher") && permissiondetail[i].permission=="create" && permissiondetail[i].is_permission==0){
                    this.setState({
                        addContentPermission: false,
                    });
                }else if((permissiondetail[i].role_name== "attendant" || permissiondetail[i].role_name== "senior_librarian" 
                        ||permissiondetail[i].role_name== "librarian" || permissiondetail[i].role_name== "publisher") && 
                        permissiondetail[i].permission=="feedback" && permissiondetail[i].is_permission==0){
                    this.setState({
                        feedbackPermission: false,
                    });
                }else if((permissiondetail[i].role_name== "senior_librarian" ||permissiondetail[i].role_name== "librarian" || permissiondetail[i].role_name== "publisher") && permissiondetail[i].permission=="update" && permissiondetail[i].is_permission==0){
                    this.setState({
                        editPermission: false,
                    });
                }else if((permissiondetail[i].role_name== "attendant" || permissiondetail[i].role_name== "senior_librarian" 
                    ||permissiondetail[i].role_name== "librarian") 
                    && permissiondetail[i].permission=="request" && permissiondetail[i].is_permission==0){
                    this.setState({
                        requestPermission: false,
                    });
                }else if((permissiondetail[i].role_name== "senior_librarian" ||permissiondetail[i].role_name== "librarian") && permissiondetail[i].permission=="review" && permissiondetail[i].is_permission==0){
                    this.setState({
                        contentReviewPermission: false,
                    });
                }else if((permissiondetail[i].role_name== "senior_librarian" ) && permissiondetail[i].permission=="add_user" && permissiondetail[i].is_permission==0){
                    this.setState({
                        addUserPermission: false,
                    });
                }else if(permissiondetail[i].role_name== "reader" && permissiondetail[i].permission=="add_request" && permissiondetail[i].is_permission==0){
                    this.setState({
                        readerRequestPermission: false,
                    });
                }else if(permissiondetail[i].role_name== "reader" &&permissiondetail[i].permission=="add_feedback" && permissiondetail[i].is_permission==0){
                    this.setState({
                        readerfeedbackPermission: false,
                    });
                }else if(permissiondetail[i].role_name== "finance" &&permissiondetail[i].permission=="view_transactions" && permissiondetail[i].is_permission==0){
                    this.setState({
                        viewTransactionPermission: false,
                    });
                }else if(permissiondetail[i].role_name== "finance" &&permissiondetail[i].permission=="report" && permissiondetail[i].is_permission==0){
                    this.setState({
                        reportPermission: false,
                    });
                }
            }
        }
       
    }

    render() {
        let redirect_exists = funcObj.getLocalStorage('redirect_exists');
       
        console.log('redirect_exists',redirect_exists)
        if (base_name == "") {
            base_name = "/";
        }else{
            base_name = "/"+base_name;            
        }
        let target_dashboard = AdminDashboard;
        if(AUTH_USER != null){
           
            if(AUTH_USER.account_type == 'admin'){
                target_dashboard = AdminDashboard;
              }else if(AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader'){
                target_dashboard = UserDashboard;
              }else if(AUTH_USER.account_type == 'attendant'){
                target_dashboard = StaffDashboard;
              }else if(AUTH_USER.account_type == 'publisher'){
                target_dashboard = PublisherDashboard;
              }else if(AUTH_USER.account_type == 'librarian'){
                target_dashboard = AdminDashboard;
              }else if(AUTH_USER.account_type == 'senior_librarian'){
                target_dashboard = AdminDashboard;
              }else if(AUTH_USER.account_type == 'finance'){
                target_dashboard = CommonProfile;
              }else if(AUTH_USER.account_type == 'analytic_user'){
                target_dashboard = CommonProfile;
              }
        }
        
        return (
            <BrowserRouter basename={base_name}>
                 <React.Fragment>
                                {/* <Route exact path="/" render={(props) => <PublicLayout maincontent={Login} {...props} />} /> */}
                                <Route exact path="/home" render={(props) => <PublicLayout maincontent={Home} {...props} />} />
                                <Route exact path="/callback/oauth/authorize" render={(props) => <PublicLayout maincontent={SSORedirect} {...props} />} />

                                <Route exact path="/terms-conditions" render={(props) => <PublicLayout maincontent={TermsConditions} {...props} />} />
                                <Route exact path="/privacy-policy" render={(props) => <PublicLayout maincontent={PrivacyPolicy} {...props} />} />
                                <Route exact path="/login" render={(props) => <PublicLayout maincontent={Login} {...props} />} />

                                <Route exact path="/forget-password" render={(props) => <PublicLayout maincontent={forget} {...props} />} />
                                <Route exact path="/reset-password" render={(props) => <PublicLayout maincontent={ResetPassword} {...props} />} />
                                <Route exact path="/set-password" render={(props) => <PublicLayout maincontent={SetPassword} {...props} />} />
                                <Route exact path="/registration" render={(props) => <PublicLayout maincontent={Registration} {...props} />} />
                                <Route exact path="/complete-profile" render={(props) => <PublicLayout maincontent={completeRegistration} {...props} />} />
                                <Route exact path="/authentication" render={(props) => <PublicLayout maincontent={Authentication} {...props} />} />
                                <Route exact path="/changepassword" render={(props) => <PublicLayout maincontent={ChangePasswords} {...props} />} />
                                <Route exact path="/forgot-password" render={(props) => <PublicLayout maincontent={ForgotPassword} {...props}/>} />
                                <Route exact path="/search" render={(props) => <PublicLayout maincontent={Search} {...props}/>} />
                                <Route exact path="/dbooks/:book_category?" render={(props) => <PublicLayout maincontent={Booklists} {...props}/>} />
                                <Route exact path="/e-books" render={(props) => <PublicLayout maincontent={eBooks} {...props}/>} />
                                <Route exact path="/audio-books" render={(props) => <PublicLayout maincontent={AudioBooks} {...props}/>} />
                                <Route exact path="/video-books" render={(props) => <PublicLayout maincontent={VideoBooks} {...props}/>} />
                                <Route exact path="/slides" render={(props) => <PublicLayout maincontent={Slides} {...props}/>} />
                                <Route exact path="/shopping-cart" render={(props) => <PublicLayout maincontent={ShoppingCart} {...props}/>} />
                                <Route exact path="/category" render={(props) => <PublicLayout maincontent={Category} {...props}/>} />
                                <Route exact path="/landing-page" render={(props) => <PublicLayout maincontent={LandingPage} {...props}/>} />
                                <Route exact path="/bookdetail/:book_id?/:tab_type?" render={(props) => <PublicLayout maincontent={Bookdetail} {...props}/>} />
                                <Route exact path="/public-faq"  render={(props) => <PublicLayout maincontent={PublicFaq} {...props} />} />
                                
                                <Route exact path="/pdf"  render={(props) => <PublicLayout maincontent={PdfPlayer} {...props} />} />
                                <Route exact path="/video"  render={(props) => <PublicLayout maincontent={VideoPlayer} {...props} />} />
                                <Route exact path="/audio"  render={(props) => <PublicLayout maincontent={AudioPlayer} {...props} />} />
                                <Route exact path="/ppt"  render={(props) => <PublicLayout maincontent={PPTViewer} {...props} />} />
                                <Route exact path="/publisher-detail"  render={(props) => <PublicLayout maincontent={Publisherdetail} {...props} />} />
                               {/** <Route exact path="/manual" render={(props) => <PublicLayout maincontent={UserManualPdf} {...props} />} /> */} 
                                      

                    {
                        AUTH_USER == null ?
                            <React.Fragment>
                            <Route exact path="/" render={(props) => <PublicLayout maincontent={Home} {...props} />} />
                            </React.Fragment>

                            :

                            <React.Fragment>
                      
            { redirect_exists ?
              <Redirect to={redirect_exists} />
              :null
            }
                            <Route exact path="/" render={(props) => <Layout maincontent={target_dashboard} {...props} />} />

                            <Route exact path="/common-profile"  render={(props) => <Layout maincontent={CommonProfile} {...props} />} />

                                <React.Fragment>
                                    {
                                        AUTH_USER.account_type == 'admin' ?
                                            <React.Fragment>
                                            
                                                <Route exact path="/admin-dashboard" render={(props) => <Layout maincontent={AdminDashboard} {...props} />} />
                                                <Route exact path="/category-list" render={(props) => <Layout maincontent={CategorList} {...props} />} />
                                                <Route exact path="/plan-list" render={(props) => <Layout maincontent={planList} {...props} />} />
                                                <Route exact path="/add-plan" render={(props) => <Layout maincontent={addPlan} {...props} />} />
                                                <Route exact path="/add-sub-category" render={(props) => <Layout maincontent={addSubcategory} {...props} />} />

                                                <Route exact path="/publishers-list" render={(props) => <Layout maincontent={PublishersList} {...props} />} />
                                                <Route exact path="/add-publishers" render={(props) => <Layout maincontent={AddPublishers} {...props} />} />
                                                <Route exact path="/authors-list" render={(props) => <Layout maincontent={AuthorsList} {...props} />} />
                                                <Route exact path="/add-authors" render={(props) => <Layout maincontent={AddAuthors} {...props} />} />
                                              
                                                <Route exact path="/classes-list" render={(props) => <Layout maincontent={ClassesList} {...props} />} />
                                                <Route exact path="/content-list" render={(props) => <Layout maincontent={ContentList} {...props} />} />
                                                <Route exact path="/pblisher-list" render={(props) => <Layout maincontent={PblisherList} {...props} />} />
                                                <Route exact path="/author-list" render={(props) => <Layout maincontent={AuthorList} {...props} />} />
                                                <Route exact path="/add-content" render={(props) => <Layout maincontent={AddNewContent} {...props} />} />
                                                <Route exact path="/batch-content" render={(props) => <Layout maincontent={BatchContent} {...props} />} />

                                                <Route exact path="/search-fields-configuration" render={(props) => <Layout maincontent={FieldsConfiguration} {...props} />} />
                                                <Route exact path="/search-theme-configuration" render={(props) => <Layout maincontent={ThemeConfiguration} {...props} />} />
                                                
                                               
                                                <Route exact path="/readers-request" render={(props) => <Layout maincontent={ReadersRequest} {...props} />} />
                                                
                                                <Route exact path="/reject-reason/:content_id?" render={(props) => <Layout maincontent={RejectReason} {...props} />} />
                                                <Route exact path="/remove-reason/:content_id?" render={(props) => <Layout maincontent={removeReason} {...props} />} />
                                                <Route exact path="/reporting-statistics" render={(props) => <Layout maincontent={ReportingStatistics} {...props} />} />
                                                <Route exact path="/content-sales" render={(props) => <Layout maincontent={ContentSales} {...props} />} />
                                                <Route exact path="/users-reports" render={(props) => <Layout maincontent={UsersReport} {...props} />} />
                                                <Route exact path="/subscriptions-reports" render={(props) => <Layout maincontent={SubscriptionsReport} {...props} />} />
                                                <Route exact path="/publishers-reports" render={(props) => <Layout maincontent={PublishersReport} {...props} />} />
                                                <Route exact path="/sales-reports" render={(props) => <Layout maincontent={SalesReport} {...props} />} />
                                                <Route exact path="/e-books-reports" render={(props) => <Layout maincontent={EbooksReport} {...props} />} />
                                                <Route exact path="/audio-books-reports" render={(props) => <Layout maincontent={AudioBooksReport} {...props} />} />
                                                <Route exact path="/video-books-reports" render={(props) => <Layout maincontent={VideoBooksReport} {...props} />} />
                                                <Route exact path="/sliders-reports" render={(props) => <Layout maincontent={SlidersReport} {...props} />} />
                                               

                                                <Route exact path="/admin-settings" render={(props) => <Layout maincontent={AdminSettings} {...props} />} />

                                                <Route exact path="/roles-permissions" render={(props) => <Layout maincontent={RolesPermissions} {...props} />} />
                                                <Route exact path="/vendor-management" render={(props) => <Layout maincontent={VendorManagement} {...props} />} />
                                                <Route exact path="/vendor-add" render={(props) => <Layout maincontent={AddVendor} {...props} />} />
                                                <Route exact path="/vendor-edit/:vendor_id?" render={(props) => <Layout maincontent={AddVendor} {...props} />} />
                                                <Route exact path="/budget" render={(props) => <Layout maincontent={budget} {...props} />} />
                                                <Route exact path="/budget-add" render={(props) => <Layout maincontent={Addbudget} {...props} />} />
                                                <Route exact path="/budget-edit/:budget_id?" render={(props) => <Layout maincontent={Addbudget} {...props} />} />
                                            </React.Fragment>
                                            : null
                                    }
                                </React.Fragment>

                                <React.Fragment>
                                    {
                                        AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader' ?
                                            <React.Fragment>
                                            <Route exact path="/reader-dashboard" render={(props) => <Layout maincontent={UserDashboard} {...props} />} />
                                            <Route exact path="/my-books" render={(props) => <Layout maincontent={MyBooks} {...props} />} />
                                            <Route exact path="/payment-response-cs" render={(props) => <Layout maincontent={CybersourceResponse} {...props} />} />
                                            <Route exact path="/payment-response-cop" render={(props) => <Layout maincontent={CybersourceCheckoutProcess} {...props} />} />
                                            <Route exact path="/my-cart" render={(props) => <Layout maincontent={MyCart} {...props} />} />
                                            <Route exact path="/checkout-page" render={(props) => <Layout maincontent={MyCart} {...props} />} />
                                            <Route exact path="/reader-profile"  render={(props) => <Layout maincontent={ReaderProfile} {...props} />} />

                                            <Route exact path="/pesaflow/callback" render={(props) => <Layout maincontent={PaymentCallbackComponent} {...props} />} />
                                            <Route exact path="/discussions"  render={(props) => <Layout maincontent={Discussions} {...props} />} />
                                            <Route exact path="/add-discussion"  render={(props) => <Layout maincontent={AddDiscussion} {...props} />} />
                                            
                                            <Route exact path="/feedback-list"  render={(props) => <Layout maincontent={FeedbackList} {...props} />} />
                                           
                                            <Route exact path="/add-feedback"  render={(props) => <Layout maincontent={AddFeedback} {...props} />} />
                                           
                                            <Route exact path="/request-list"  render={(props) => <Layout maincontent={RequestForHelpList} {...props} />} />
                                          
                                            <Route exact path="/add-request"  render={(props) => <Layout maincontent={AddRequestForHelp} {...props} />} />
                                            
                                         
                                            <Route exact path="/reader-manual"  render={(props) => <Layout maincontent={ReaderManual} {...props} />} />
                                          
                                            <Route exact path="/chat"  render={(props) => <Layout maincontent={Chat} {...props} />} /> 
                                            <Route exact path="/preferance"  render={(props) => <Layout maincontent={preferance} {...props} />} />
                                            <Route exact path="/membership-subscription"  render={(props) => <Layout maincontent={MembershipSubscription} {...props} />} />
                                            <Route exact path="/history-subscription"  render={(props) => <Layout maincontent={HistorySubscription} {...props} />} />
                                            </React.Fragment>
                                            : null
                                    }

                                </React.Fragment>


                                <React.Fragment>
                                    {
                                        AUTH_USER.account_type == 'attendant' ?
                                            <React.Fragment>
                                                {/* <Route exact path="/staff-dashboard"  render={(props) => <Layout maincontent={StaffDashboard} {...props} />} /> */}
                                            </React.Fragment>
                                            : null
                                    }

                                </React.Fragment>

                                <React.Fragment>
                                    {
                                        AUTH_USER.account_type == 'publisher' ?
                                            <React.Fragment>
                                            <Route exact path="/publisher-dashboard" render={(props) => <Layout maincontent={PublisherDashboard} {...props} />} />
                                            <Route exact path="/all-authors" render={(props) => <Layout maincontent={AllAuthors} {...props} />} />
                                            <Route exact path="/add-author" render={(props) => <Layout maincontent={AddAuthor} {...props} />} />
                                            
                                           
                                            
                                            <Route exact path="/publisher-discussions"  render={(props) => <Layout maincontent={PublisherDiscussions} {...props} />} />
                                            <Route exact path="/add-publisher-discussion"  render={(props) => <Layout maincontent={AddPublisherDiscussion} {...props} />} />
                                            {(this.state.feedbackPermission)?
                                            <Route exact path="/publisher-feedback-list"  render={(props) => <Layout maincontent={PublisherFeedbackList} {...props} />} />:null}
                                            <Route exact path="/add-publisher-feedback"  render={(props) => <Layout maincontent={AddPublisherFeedback} {...props} />} />
                                           
                                            <Route exact path="/publisher-request-list"  render={(props) => <Layout maincontent={PublisherRequestForHelpList} {...props} />} />
                                            <Route exact path="/add-publisher-request"  render={(props) => <Layout maincontent={AddPublisherRequestForHelp} {...props} />} />
                                            
                                         
                                            <Route exact path="/publisher-manual"  render={(props) => <Layout maincontent={PublisherManual} {...props} />} />
                                            <Route exact path="/publisher-sitemap"  render={(props) => <Layout maincontent={PublisherSitemap} {...props} />} />
                                            <Route exact path="/publisher-chat"  render={(props) => <Layout maincontent={PublisherChat} {...props} />} />
                                            <Route exact path="/publisher-faq"  render={(props) => <Layout maincontent={PublisherFaq} {...props} />} />

                                            <Route exact path="/content-sales" render={(props) => <Layout maincontent={ContentSales} {...props} />} />
                                            <Route exact path="/list-of-books" render={(props) => <Layout maincontent={ListOfBooks} {...props} />} />
                                            <Route exact path="/published-e-books" render={(props) => <Layout maincontent={PublishedEbooks} {...props} />} />
                                            <Route exact path="/published-audio-books" render={(props) => <Layout maincontent={PublishedAudioBooks} {...props} />} />
                                            <Route exact path="/published-video-books" render={(props) => <Layout maincontent={PublishedVideoBooks} {...props} />} />
                                            <Route exact path="/published-contents" render={(props) => <Layout maincontent={PublishedContents} {...props} />} />
                                            <Route exact path="/follower-list" render={(props) => <Layout maincontent={Followerlist} {...props} />} />
                                            </React.Fragment>
                                            : null
                                    }

                                </React.Fragment>
                                <Route exact path="/views-on-publisher-content" render={(props) => <Layout maincontent={ViewsOnPublisherContent} {...props} />} />
                                <Route exact path="/library-catalog" render={(props) => <Layout maincontent={Booklists} {...props} />} />
                                <Route exact path="/drm-report" render={(props) => <Layout maincontent={DRMTransactionsStatics} {...props} />} />
                                <Route exact path="/drm-rights" render={(props) => <Layout maincontent={DRMRights} {...props} />} />
                                <Route exact path="/drm-transactions" render={(props) => <Layout maincontent={DRMTransactionsStatics} {...props} />} />

                                <Route exact path="/private-search/:picked_value?" render={(props) => <Layout maincontent={PrivateSearch} {...props} />} />
                                  
                                <Route exact path="/my-publications" render={(props) => <Layout maincontent={MyPublications} {...props} />} />
                              
                                <Route exact path="/add-publication:book_id?" render={(props) => <Layout maincontent={AddNewContent} {...props} />} />
                              
                                <Route exact path="/edit-publication:book_id?" render={(props) => <Layout maincontent={AddNewContent} {...props} />} />
                                <Route exact path="/staff-list" render={(props) => <Layout maincontent={StaffList} {...props} />} />
                                <Route exact path="/add-staff" render={(props) => <Layout maincontent={AddStaff} {...props} />} />

                                <Route exact path="/book-details"  render={(props) => <Layout maincontent={BookDetails} {...props} />} />
                                <Route exact path="/pdf-player"  render={(props) => <Layout maincontent={PdfPlayer} {...props} />} />
                                <Route exact path="/video-player"  render={(props) => <Layout maincontent={VideoPlayer} {...props} />} />
                                <Route exact path="/audio-player"  render={(props) => <Layout maincontent={AudioPlayer} {...props} />} />
                                <Route exact path="/ppt-viewer"  render={(props) => <Layout maincontent={PPTViewer} {...props} />} />


                                {/* <Route exact path="/faq"  render={(props) => <Layout maincontent={Faq} {...props} />} /> */}
                                <Route exact path="/add-module"  render={(props) => <Layout maincontent={AddFaq} {...props} />} />
                               
                                {/*<Route exact path="/change-password"  render={(props) => <Layout maincontent={ChangePassword} {...props} />} />*/}
                                <Route exact path="/bar-graph" render={(props) => <BarGraph {...props} />} />
                                <Route exact path="/pie-chart" render={(props) => <PieGraph {...props} />} />
                                <Route exact path="/line-chart" render={(props) => <LineGraph {...props} />} />

                                <Route exact path="/bulk-upload" render={(props) => <Layout maincontent={BulkUpload} {...props} />} />
                                {/* <Route exact path="/private-bookdetail/:book_type?" render={(props) => <Layout maincontent={PrivateBookdetail} {...props} />} /> */}
                                <Route exact path="/private-bookdetail/:book_id?/:tab_type?" render={(props) => <Layout maincontent={PrivateBookdetail} {...props}/>} />
                                <Route exact path="/view-on-single-content/:content_id?/:tab_type?" render={(props) => <Layout maincontent={ViewsOnSingleUserPublisherContent} {...props}/>} />
                                <Route exact path="/view-play-content/:book_id?" render={(props) => <Layout maincontent={ViewPlayContent} {...props}/>} />
                               
                                <Route exact path="/feedback-lists"  render={(props) => <Layout maincontent={PublisherFeedbackList} {...props} />} />
                                
                                <Route exact path="/request-lists"  render={(props) => <Layout maincontent={PublisherRequestForHelpList} {...props} />} />  
                                <Route exact path="/users-list" render={(props) => <Layout maincontent={UsersList} {...props} />} />
                                <Route exact path="/dashboard" render={(props) => <Layout maincontent={AdminDashboard} {...props} />} />
                                <Route exact path="/audits" render={(props) => <Layout maincontent={Audits} {...props} />} />
                                <Route exact path="/search-report" render={(props) => <Layout maincontent={SearchReport} {...props} />} />
                                <Route exact path="/search-report-new" render={(props) => <Layout maincontent={SearchReportNew} {...props} />} />
                                <Route exact path="/logged-in-users-reports" render={(props) => <Layout maincontent={LoggedInUsersReport} {...props} />} />
                                <Route exact path="/searches-reports" render={(props) => <Layout maincontent={SearchesReport} {...props} />} />
                                <Route exact path="/logged-in-history" render={(props) => <Layout maincontent={loggedinhistory} {...props} />} />
                                <Route exact path="/views-on-content-reports" render={(props) => <Layout maincontent={ViewsOnContentReport} {...props} />} />
                                <Route exact path="/ga"  render={(props) => <Layout maincontent={GA} {...props} />} />
                                
                                <Route exact path="/add-users/:user_id?" render={(props) => <Layout maincontent={AddUsers} {...props} />} />
                                <Route exact path="/edit-users/:user_id?" render={(props) => <Layout maincontent={AddUsers} {...props} />} />
                                <Route exact path="/staff-dashboard"  render={(props) => <Layout maincontent={StaffDashboard} {...props} />} />
                                <Route exact path="/readers-reply" render={(props) => <Layout maincontent={ReadersReply} {...props} />} />

                                <Route exact path="/manual"  render={(props) => <Layout maincontent={Manual} {...props} />} />
                                <Route exact path="/sitemap"  render={(props) => <Layout maincontent={Sitemap} {...props} />} />
                                <Route exact path="/faq"  render={(props) => <Layout maincontent={Faqs} {...props} />} />
                            </React.Fragment>
                                    
                    }
                </React.Fragment>


            </BrowserRouter>
        );
    }
}
export default Routes;
