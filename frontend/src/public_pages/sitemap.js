import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Sitemap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: "",
            module_key: "sitemap",
            activeclass: "wave-effect sidebar-menu active",
            normalclass: "wave-effect sidebar-menu",
            submenu: "submenu"
        }
    }

    componentDidMount() {
        this.getModule();
    }

    getModule = () => {
        console.log('getModule')
        let endPoint = 'get-module';
        let postBodyData = {
            module_key: this.state.module_key
        }
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

            if (response.code == 200) {

                this.setState({
                    content: response.data.module_description,
                });

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }

        })


    }
    render() {
        return (
            <React.Fragment>

                <form id="feedbackFrm" className='sitemap_page' method="POST">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Sitmap</h3>
                                {AUTH_USER.account_type == 'admin' ?

                                    <div className="float-right">
                                       

                                    </div>
                                    : null}
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                {
                                    AUTH_USER.account_type == 'admin' ?
                                    <ul className='float-left'>
                                        <li>
                                            <Link to="/admin-dashboard" className="wave-effect sidebar-menu"><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" /> Dashboard</Link>
                                        </li>
                                        <li>
                                            <a href="#user_management" className={"accordion-toggle wave-effect sidebar-menu"}
                                                data-toggle="collapse" aria-expanded="false"><img src={funcObj.assets_path("/images/icons/user_management.svg")} width="24" className="mr-1" alt="User Management" /> User Management</a>
                                            <ul data-parent="#accordion">
                                                <li>
                                                    <Link to="/roles-permissions" className="submenu">Manage users</Link>
                                                </li>
                                                <li>
                                                    <Link to="/users-list" className="submenu">List</Link>
                                                </li>
                                     
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#search_portal" data-toggle="collapse" aria-expanded="false">
                                                <img src={funcObj.assets_path("/images/icons/search_portal.svg")} width="24" className="mr-1" alt="Design and Layout" />
                                                Search Portal(s) Design and Layout
                                            </a>
                                            <ul data-parent="#accordion">
                                                <li>
                                                    <Link to="/search-fields-configuration" className="submenu"> Fields Configuration</Link>
                                                </li>
                           



                                            </ul>
                                        </li>



                                        <li>
                                            <Link to="/my-publications" className="wave-effect sidebar-menu"> <img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="Content Review & Publishing" />Content Review & Publishing</Link>
                                        </li>


                                        <li>
                                            <Link to="/library-catalog" className="wave-effect sidebar-menu"> <img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="Library Catalog" />Library Catalog</Link>
                                        </li>


                                        <li>
                                            <a href="#reports_sitemapa" className={"accordion-toggle wave-effect sidebar-menu"}
                                                data-toggle="collapse" aria-expanded="false">
                                                <img src={funcObj.assets_path("/images/icons/report.svg")} width="24" className="mr-1" alt="Publishing" /> reporting & statistics</a>
                                            <ul data-parent="#accordion" id="reports_sitemapa">

                                              
                                                <li>
                                                    <Link to="/search-report-new" className="submenu"> Search Content</Link>
                                                </li>
                                                <li>
                                                    <Link to="/drm-report" className="submenu">DRM Report</Link>
                                                </li>
                                         
                                                <li>
                                                    <Link to="/logged-in-users-reports" className="submenu"> Logged In Users</Link>
                                                </li>

                                                <li>
                                                    <Link to="/views-on-publisher-content" className="submenu"> Views On contents</Link>
                                                </li>
                                            </ul>
                                        </li>

                                        <li>
                                            <Link to="/audits" className="wave-effect sidebar-menu"> <img src={funcObj.assets_path("/images/icons/audit.svg")} width="24" className="mr-1" alt="Audit" />Audit</Link>
                                        </li>

                                        {/* <li>
                                            <Link to="/ga" className="wave-effect sidebar-menu"><img src={funcObj.assets_path("/images/icons/publishing.png")} width="24" className="mr-1" alt="Audit" />Google Analytics</Link>
                                        </li> */}
                                        <li>
                                            <Link to="/admin-settings" className="wave-effect sidebar-menu"><img src={funcObj.assets_path("/images/icons/setting.svg")} width="24" className="mr-1" alt="Settings" />Settings</Link>
                                        </li>

                                        <li>
                                            <a href="#help_support1" className="wave-effect sidebar-menu"
                                                data-toggle="collapse" aria-expanded="false">
                                                <img src={funcObj.assets_path("/images/icons/help.svg")} width="24" className="mr-1" alt="Help" />Help & Support</a>
                                            <ul id="help_support1" data-parent="#accordion">
                                                <li>
                                                    <Link to="/readers-request" className="submenu">Readers Request</Link>
                                                </li>
                                                <li>
                                                    <Link to="/faq" className="submenu">FAQ</Link>
                                                </li>
                                                <li>
                                                    <Link to="/manual" className="submenu">Manual</Link>
                                                </li>
                                                {/* <li>
                                                    <Link to="/sitemap" className="submenu">Sitemap</Link>
                                                </li> */}

                                            </ul>
                                        </li>
                                    </ul>
                             
                                :
                                <ul className='float-left'>
                                {
                                    AUTH_USER.account_type == 'reader' || AUTH_USER.account_type == 'junior_reader' ?
                            <React.Fragment>
                            <li>
                                <Link to="/reader-dashboard" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" />Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/my-books" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="Home" />My Library</Link>
                            </li>
                            <li>
                                <Link to="/library-catalog" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="Home" />Library Catalog</Link>
                            </li>
                            <li>
                                <Link to="/reader-profile" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/profile.svg")} width="24" className="mr-1" alt="Home" />My Profile</Link>
                            </li>
                            <li>
                                <Link to="/membership-subscription" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/membership.svg")} width="24" className="mr-1" alt="Home" />Membership plans</Link>
                            </li>
                            <li>
                                <Link to="/preferance" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/preferences.svg")} width="24" className="mr-1" alt="Home" />My Preferences</Link>
                            </li>
                            {/*<li>*/}
                            {/*    <Link to="/change-password" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/password.svg")} width="24" className="mr-1" alt="Home" />Change Password</Link>*/}
                            {/*</li>*/}
                            </React.Fragment>
                            :null 
                            }
                            {/* <li>
                                <Link to="/follower-list" className="wave-effect sidebar-menu" >follower</Link>
                            </li> */}

                            {
                                    AUTH_USER.account_type == 'publisher' || AUTH_USER.account_type == 'librarian' || AUTH_USER.account_type == 'senior_librarian'?

                             <React.Fragment>
                             <li>
                                <Link to="/publisher-dashboard" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" />Dashboard</Link>
                            </li>
                             
                            <li>
                                <a href="#contents" className="accordion-toggle "  data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="User Management" />
                                        Contents
                                </a>
                                <ul  id="contensts" data-parent="#">
                                 
                                    <li>
                                        <Link to="/add-publication?book_id=" className="submenu"> Add Content</Link>
                                    </li>
                                    <li>
                                        <Link to="/my-publications" className="submenu"> My Library</Link>
                                    </li> 
                                 
                                    <li>
                                        <Link to="/bulk-upload" className="submenu"> Bulk Upload</Link>
                                    </li>         
                                </ul>
                            </li>
                            <li>
                                <Link to="/library-catalog" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="Home" />Library Catalog</Link>
                            </li>
                            <li>
                                <a href="#reports_sitemap" className="accordion-toggle" data-toggle="collapse" aria-expanded="false">
                                <img src={funcObj.assets_path("/images/icons/report.svg")} width="24" className="mr-1" alt="Publishing" /> Reporting & Statistics</a>      
                                <ul className="collapse list-unstyled" id="reports_sitemap" data-parent="#accordion"> 
                                    <li>
                                        <Link to="/content-sales" className="submenu"> Sales Statistics</Link>
                                    </li> 
                                    <li>
                                        <Link to="/list-of-books" className="submenu"> List of Books</Link>
                                    </li>   
                                  
                                    <li>
                                        <Link to="/published-contents" className="submenu"> Published Contents</Link>
                                    </li>  
                                    <li>
                                        <Link to="/views-on-publisher-content" className="submenu"> Views On contents</Link>
                                    </li>             
                                </ul>
                            </li>
                            <li>
                                <Link to="/common-profile" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/profile.svg")} width="24" className="mr-1" alt="Home" />My Profile</Link>
                            </li>
                            {/*<li>*/}
                            {/*    <Link to="/change-password" className="wave-effect sidebar-menu" ><img src={funcObj.assets_path("/images/icons/password.svg")} width="24" className="mr-1" alt="Home" />Change Password</Link>*/}
                            {/*</li>*/}
                        </React.Fragment>       
                            :null}

                            {
                                    AUTH_USER.account_type == 'admin'?
                                    <React.Fragment>
                            <li>
                                <a href="#reports" className= "accordion-toggle "
                                     data-toggle="collapse" aria-expanded="false">
                                <img src={funcObj.assets_path("/images/icons/report.svg")} width="24" className="mr-1" alt="Publishing" /> reporting & statistics</a>      
                                <ul data-parent="#accordion"> 
                                    <li>
                                        <Link to="/content-sales" className="submenu"> Sales Stastics</Link>
                                    </li> 
                                    <li>
                                        <Link to="/list-of-books" className="submenu"> List of Books</Link>
                                    </li>   
                                   
                                    <li>
                                        <Link to="/published-contents" className="submenu"> Published Contents</Link>
                                    </li>  
                                    <li>
                                        <Link to="/views-on-publisher-content" className="submenu"> Views On contents</Link>
                                    </li>             
                                </ul>
                            </li>
                            
                     
                            <li>
                                <a href="#settings" className="accordion-toggle " 
                                    data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/setting.svg")} width="24" className="mr-1" alt="User Management" />
                                        Settings</a>
                                <ul data-parent="#accordion">
                                    <li>
                                        <Link className="submenu" to="/common-profile">My Profile</Link>
                                    </li>
                                    {/*<li>*/}
                                    {/*    <Link className="submenu" to="/change-password">Change Password</Link>*/}
                                    {/*</li>*/}

                                </ul>
                            </li>
                            </React.Fragment>
                            :null
                            }
                            <li>
                                <a href="#help_support_sitemap" className="accordion-toggle " 
                                    data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/help.svg")} width="24" className="mr-1" alt="User Management" />
                                        Help & Support
                                </a>
                                <ul id="help_support_sitemap" data-parent="#accordion">
                                    {(this.state.feedbackPermission)?
                                    <li>
                                        <Link to="/publisher-feedback-list" className="submenu"> Feedback</Link>
                                    </li>:null}
                                    {
                                    AUTH_USER.account_type == 'reader' || AUTH_USER.account_type == 'junior_reader'?
                                    <React.Fragment>
                                    <li>
                                        <Link to="/feedback-list" className="submenu"> Feedback</Link>
                                    </li>
                                    <li>
                                        <Link to="/request-list" className="submenu"> Request for Help</Link>
                                    </li>
                                    </React.Fragment>
                                    :
                                    <li>
                                        <Link to="/publisher-request-list" className="submenu"> Request for Help</Link>
                                    </li>

                                    }
                                    {/* <li>
                                        <Link to="/publisher-chat" className="submenu">Chat</Link>
                                    </li> */}

                                    <li>
                                        <Link to="/faq" className="submenu">FAQ</Link>
                                    </li>
                                    <li>
                                        <Link to="/manual" className="submenu">Manual</Link>
                                    </li>
                                    {/* <li>
                                        <Link to="/sitemap" className="submenu">Sitemap</Link>
                                    </li>              */}
                                </ul>
                            </li>
                           
                                </ul>
                                }
                                   </div>
                            </div>

                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
