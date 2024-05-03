import React from 'react';
import Functions from '../helpers/functions';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class FinanceSidebarMenus extends React.Component{

    constructor(props) {
        super(props);
        const  pathname =funcObj.get_pathname(); 
        this.state = {
           permission:[],
           transactionPermission: true,
           reportPermission: true,
           reportUserHistoryPermission:true,
           reportCurrentUserPermission:true,
           reportViewContentPermission:true,
           googleAnalyticsPermission:true,
           feedbackPermission:true,
           requestPermission:true,
           dashboardPermission:true, 
           pathname : pathname,
           activeclass :"wave-effect sidebar-menu active",
           normalclass : "wave-effect sidebar-menu",
           submenu : "submenu"
        }

    }

    componentDidMount() {
        this.getPermission()
    }

    getPermission() {
        
        let postBodyData = {
        };
        let endPoint = 'get-permission';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    for(let i=0; i< response.data.length; i++){
                        console.log(response.data[i].permission)
                        if(response.data[i].permission=="view_transactions" && response.data[i].is_permission==0){
                            this.setState({
                                transactionPermission: false,
                            });
                        }else if(response.data[i].permission=="transaction" && response.data[i].is_permission==0){
                            this.setState({
                                transactionPermission: false,
                            });
                        }else if(response.data[i].permission=="report" && response.data[i].is_permission==0){
                            this.setState({
                                reportPermission: false,
                            });
                        }else if(response.data[i].permission=="report_search" && response.data[i].is_permission==0){
                            this.setState({
                                reportPermission: false,
                            });
                        }else if(response.data[i].permission=="report_view_content" && response.data[i].is_permission==0){
                            this.setState({
                                reportViewContentPermission: false,
                            });
                        }else if(response.data[i].permission=="report_user_history" && response.data[i].is_permission==0){
                            this.setState({
                                reportUserHistoryPermission: false,
                            });
                        }else if(response.data[i].permission=="report_current_user" && response.data[i].is_permission==0){
                            this.setState({
                                reportCurrentUserPermission: false,
                            });
                        }else if(response.data[i].permission=="google_analytics" && response.data[i].is_permission==0){
                            this.setState({
                                googleAnalyticsPermission: false,
                            });
                        }else if(response.data[i].permission=="feedback" && response.data[i].is_permission==0){
                            this.setState({
                                feedbackPermission: false,
                            });
                        }else if(response.data[i].permission=="request" && response.data[i].is_permission==0){
                            this.setState({
                                requestPermission: false,
                            });
                        }else if(response.data[i].permission=="dashboard" && response.data[i].is_permission==0){
                            this.setState({
                                dashboardPermission: false,
                            });
                        }

                    }

                } else if (response.code == 201) {
                    Swal.fire({
                        title: '',
                        text: response.message,
                        icon: 'error',
                        showConfirmButton: false,
                    })
                }

            })

        });
    }

    render(){
        const {pathname,activeclass,normalclass,submenu }=this.state;
        return (
            <React.Fragment>
                      {/* <li>
                            <div className="sidebar-search">
                                <input type="text" placeholder="Search content title, isbn, author, publisher" className="search-box" />
                        </div>
                    </li> */}
                           
                            {(this.state.dashboardPermission)?
                            <li>
                                <Link to="/dashboard" className={ (pathname =='dashboard') ? activeclass : normalclass }><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" /> Dashboard</Link>
                            </li>:null}
                            <li>
                                <Link  to="/library-catalog?backto=common-profile" className={ (pathname =='library-catalog') ? activeclass : normalclass }><img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="My Books" />Library Catalog</Link>
                            </li>
                            {(this.state.transactionPermission)?
                            <li>
                                <a href="#audit" className={ (pathname =='audits') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass }
                                     data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/audit.svg")} width="24" className="mr-1" alt="Design and Layout" />
                                    Audit
                                </a>
                                <ul className="collapse list-unstyled" id="audit" data-parent="#accordion">
                                    {/* <li>
                                        <Link to="/audits?module=content" className="wave-effect sidebar-menu ">Content log</Link>
                                    </li>
                                    <li>
                                        <Link to="/audits?module=drm-settings" className="wave-effect sidebar-menu ">Drm log</Link>
                                    </li>
                                    <li>
                                        <Link to="/audits?module=user" className="wave-effect sidebar-menu ">User log</Link>
                                    </li> */}
                                    {(this.state.transactionPermission)?
                                    <li>
                                        <Link to="/audits?module=transaction" className={ (pathname =='audits') ? activeclass : submenu }>Transaction log</Link>
                                    </li>:null}
                                </ul>

                            </li>:null}
                            {(this.state.reportPermission || this.state.reportCurrentUserPermission ||
                                this.state.reportUserHistoryPermission || this.state.reportViewContentPermission)?
                            <li>
                                <a href="#reports"className={ (pathname =='search-report'||pathname =='searches-reports'
                                    ||pathname =='logged-in-users-reports'||pathname =='views-on-publisher-content') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass }
                                     data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/report.svg")} width="24" className="mr-1" alt="Publishing" /> Reporting & Statistics</a>
                                <ul className="collapse list-unstyled" id="reports" data-parent="#accordion">
                                    {(this.state.reportPermission)?
                                    <li>
                                        <Link to="/search-report" className={ (pathname =='search-report') ? activeclass : submenu }> Searh Keywords</Link>
                                    </li>:null}
                                    <></>
                                    {(AUTH_USER.account_type == 'analytic_user'&& this.state.reportCurrentUserPermission)?
                                    <li>
                                        <Link to="/logged-in-users-reports" className={ (pathname =='logged-in-users-reports') ? activeclass : submenu }> Logged In Users</Link>
                                    </li>:null}
                                    {(AUTH_USER.account_type == 'analytic_user'&& this.state.reportUserHistoryPermission)?
                                    <li>
                                        <Link to="/searches-reports" className={ (pathname =='searches-reports') ? activeclass : submenu }> Searches History</Link>
                                    </li>:null}
                                    {(AUTH_USER.account_type == 'analytic_user'&& this.state.reportViewContentPermission)?
                                    <li>
                                        <Link to="/views-on-publisher-content" className={ (pathname =='views-on-publisher-content') ? activeclass : submenu }> Views On contents</Link>
                                    </li>:null}
                                </ul>
                            </li>:null}
                       <li>
                                <Link className={ (pathname =='common-profile' || pathname == '') ? activeclass : normalclass } to="/common-profile"><img src={funcObj.assets_path("/images/icons/profile.svg")} width="24" className="mr-1" />My Profile</Link>
                            </li>
                                    {/*<li>*/}
                                    {/*    <Link className={ (pathname =='change-password') ? activeclass : normalclass } to="/change-password"><img src={funcObj.assets_path("/images/icons/password.svg")} width="24" className="mr-1" />Change Password</Link>*/}
                                    {/*</li>*/}

                            
                            {((AUTH_USER.account_type == 'analytic_user') && (this.state.feedbackPermission || this.state.requestPermission))?
                            <li>
                                <a href="#help_support" className={ (pathname =='feedback-lists'||pathname =='request-lists') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass }
                                     data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/help.svg")} width="24" className="mr-1" alt="User Management" />
                                        Help & Support
                                </a>
                                <ul className="collapse list-unstyled" id="help_support" data-parent="#accordion">
                                    {(this.state.feedbackPermission)?
                                    <li>
                                        <Link to="/feedback-lists" className={ (pathname =='feedback-lists') ? activeclass : submenu }> Feedback</Link>
                                    </li>:null}
                                    {(this.state.requestPermission)?
                                    <li>
                                        <Link to="/request-lists" className={ (pathname =='request-lists') ? activeclass : submenu }> Request for Help</Link>
                                    </li>:null}
                                    {/* <li>
                                        <Link to="/publisher-faq" className="submenu"> FAQ</Link>
                                    </li>
                                    <li>
                                        <Link to="/publisher-manual" className="submenu"> Publisher Manual</Link>
                                    </li>
                                    <li>
                                        <Link to="/publisher-sitemap" className="submenu">Sitemap</Link>
                                    </li>              */}
                                </ul>
                            </li>:null}
                            
            </React.Fragment>
        );
    }

}
export default FinanceSidebarMenus;
