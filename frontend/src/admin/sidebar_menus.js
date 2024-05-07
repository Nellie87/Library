import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
class AdminSidebarMenus extends React.Component {

    constructor(props) {
        super(props);
        const pathname = funcObj.get_pathname();

        this.state = {
            pathname: pathname,
            activeclass: "wave-effect sidebar-menu active",
            normalclass: "wave-effect sidebar-menu",
            submenu: "submenu"
        }
        console.log('pathname', pathname);

    }
    render() {
        const { pathname, activeclass, normalclass, submenu } = this.state;
        return (
            <React.Fragment>
                <li>
                    <div className="sidebar-search menu-search-box">
                    
                                            <input type="text" name="searchInp1" id="searchInp1" placeholder="Search Contents" className="search-box m-0" />
                                            <span onClick={(e) => funcObj.quickSearch(e,"searchInp1")} className="top_search_btn fa fa-search"></span>
                    
                    </div>
                </li>
                <li>
                    <Link to="/admin-dashboard" className={(pathname == 'admin-dashboard' || pathname == '') ? activeclass : normalclass}><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" /> Dashboard</Link>
                </li>
                <li>
                    <Link to="/my-publications" className={(pathname == 'my-publications') ? activeclass : normalclass}> <img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="Content Review & Publishing" />Content Review & Publishing</Link>
                </li>

                <li>
                    <Link to="/library-catalog?backto=admin-dashboard" className={(pathname == 'library-catalog') ? activeclass : normalclass}> <img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="Library Catalog" />Library Catalog</Link>
                </li>
                <li>
                    <a href="#search_portal" className={(pathname == 'search-fields-configuration') ? "accordion-toggle " + activeclass : "accordion-toggle " + normalclass} data-toggle="collapse" aria-expanded="false">
                        <img src={funcObj.assets_path("/images/icons/search_portal.svg")} width="24" className="mr-1" alt="Design and Layout" />
                        Search Portal(s) Design and Layout
                    </a>
                    <ul className="collapse list-unstyled" id="search_portal" data-parent="#accordion">
                        <li>
                            <Link to="/search-fields-configuration" className={(pathname == 'search-fields-configuration') ? activeclass : submenu}> Fields Configuration</Link>
                        </li>
                        {/* <li>
                            <Link to="/search-theme-configuration" className="submenu"> Theme Configuration</Link>
                        </li> */}



                    </ul>
                </li>
                {/* <li>
                            <a href="#Contents" className="accordion-toggle wave-effect sidebar-menu" data-toggle="collapse" aria-expanded="false"><img src={funcObj.assets_path("/images/icons/assesment-management.png")} width="24" className="mr-1" alt="assesment-management" /> Content Assesment & Management</a>   
                                                         <ul className="collapse list-unstyled" id="Contents" data-parent="#accordion">
                                    <li>
                                        <a href="#"> Discovery Services</a>
                                    </li>
                                    <li>
                                        <a href="#"> eBook from aggregators</a>
                                    </li>
                                    <li>
                                        <a href="#"> Independent authors</a>
                                    </li>
                                    <li>
                                        <a href="#"> Consotia Services</a>
                                    </li>
                                </ul>
                            </li> */}


                {/* <li>
                                <Link to="/reporting-statistics" className="wave-effect sidebar-menu"> <img src={funcObj.assets_path("/images/icons/reporting-stastics.png")} width="24" className="mr-1"  alt="Reporting  Stastics" /> Reporting & Statistics</Link>
                            </li> */}
                <li>
                    <a href="#reports" className={(pathname == 'search-report-new' || pathname == 'drm-report'
                        || pathname == 'logged-in-users-reports' || pathname == 'views-on-publisher-content') ? "accordion-toggle " + activeclass : "accordion-toggle " + normalclass}
                        data-toggle="collapse" aria-expanded="false">
                        <img src={funcObj.assets_path("/images/icons/report.svg")} width="24" className="mr-1" alt="Publishing" /> Reporting & Statistics</a>
                    <ul className="collapse list-unstyled" id="reports" data-parent="#accordion">

                        {/* <li>
                            <Link to="/search-report" className="submenu"> Search Content</Link>
                        </li> */}
                        <li>
                            <Link to="/content-sales" className={(pathname == 'content-sales') ? activeclass : submenu}> Sales Statistics</Link>
                        </li>
                        <li>
                            <Link to="/search-report-new" className={(pathname == 'search-report-new') ? activeclass : submenu}> Search Content</Link>
                        </li>
                        <li>
                            <Link to="/drm-report" className={(pathname == 'drm-report') ? activeclass : submenu}>DRM Report</Link>
                        </li>

                        <li>
                            <Link to="/logged-in-users-reports" className={(pathname == 'logged-in-users-reports') ? activeclass : submenu}> Logged In Users</Link>
                        </li>

                        <li>
                            <Link to="/views-on-publisher-content" className={(pathname == 'views-on-publisher-content') ? activeclass : submenu}> Views On contents</Link>
                        </li>
                    </ul>
                </li>


                <li>
                    <Link to="/audits" className={(pathname == 'audits') ? activeclass : normalclass}> <img src={funcObj.assets_path("/images/icons/audit.svg")} width="24" className="mr-1" alt="Content Review & Publishing" />Audit</Link>
                </li>

                {/* <li>
                    <Link to="/ga" className={(pathname == 'ga') ? activeclass : normalclass}><img src={funcObj.assets_path("/images/icons/publishing.png")} width="24" className="mr-1" alt="Audit" />Google Analytics</Link>
                </li> */}

                <li>
                    <a href="#user_management" className={(pathname == 'roles-permissions' || pathname == 'users-list') ? "accordion-toggle " + activeclass : "accordion-toggle " + normalclass}
                        data-toggle="collapse" aria-expanded="false"><img src={funcObj.assets_path("/images/icons/user_management.svg")} width="24" className="mr-1" alt="User Management" /> User Management</a>
                    <ul className="collapse list-unstyled" id="user_management" data-parent="#accordion">
                        <li>
                            <Link to="/roles-permissions" className={(pathname == 'roles-permissions') ? activeclass : submenu}>Manage users</Link>
                        </li>
                        <li>
                            <Link to="/users-list" className={(pathname == 'users-list') ? activeclass : submenu}>List</Link>
                        </li>

                    </ul>
                </li>


                <li>
                <a href="#setting" className={(pathname == 'admin-settings') || (pathname == 'faq') || (pathname == 'manual')
                        || (pathname == 'sitemap') ? "accordion-toggle " + activeclass : "accordion-toggle " + normalclass}
                        data-toggle="collapse" aria-expanded="false">
                        <img src={funcObj.assets_path("/images/icons/setting.svg")} width="24" className="mr-1" alt="Help" />Settings</a>
                    <ul className="collapse list-unstyled" id="setting" data-parent="#accordion">
                    <li>
                            <Link to="/admin-settings" className={(pathname == 'admin-settings') ? activeclass : normalclass}>Payment</Link>
                        </li>
                        <li>
                            <Link to="/category-list" className={(pathname == 'category-list') ? activeclass : normalclass}>Category</Link>
                        </li>
                        <li>
                            <Link to="/plan-list" className={(pathname == 'plan-list') ? activeclass : normalclass}>Subscription</Link>
                        </li>
                    </ul>
                </li>

                <li>
                    <a href="#help_support" className={(pathname == 'readers-request') || (pathname == 'faq') || (pathname == 'manual')
                        || (pathname == 'sitemap') ? "accordion-toggle " + activeclass : "accordion-toggle " + normalclass}
                        data-toggle="collapse" aria-expanded="false">
                        <img src={funcObj.assets_path("/images/icons/help.svg")} width="24" className="mr-1" alt="Help" />Help & Support</a>
                    <ul className="collapse list-unstyled" id="help_support" data-parent="#accordion">
                        <li>
                            <Link to="/readers-request" className={(pathname == 'readers-requesta') ? activeclass : submenu}>Readers Request</Link>
                        </li>
                        <li>
                            <Link to="/faq" className={(pathname == 'faq') ? activeclass : submenu}>FAQ</Link>
                        </li>
                        <li>
                            <Link to="/manual" className={(pathname == 'manual') ? activeclass : submenu}>Manual</Link>
                        </li>
                        <li>
                            <Link to="/sitemap" className={(pathname == 'sitemap') ? activeclass : submenu}>Sitemap</Link>
                        </li>

                    </ul>
                </li>
                <li>
                    <a href="#acquisition" className={(pathname == 'budget') || (pathname == 'vendor-management') ? "accordion-toggle " + activeclass : "accordion-toggle " + normalclass}
                        data-toggle="collapse" aria-expanded="false">
                        <img src={funcObj.assets_path("/images/icons/acquisition.svg")} width="24" className="mr-1" alt="Publishing" />Acquisition </a>
                    <ul className="collapse list-unstyled" id="acquisition" data-parent="#accordion">
                        <li>
                        <Link to="/budget" className={(pathname == 'budget') ? activeclass : submenu}>Add Budget</Link>
                        </li>
                        <li>
                        <Link to="/vendor-management" className={(pathname == 'vendor-management') ? activeclass : submenu}>Vendor Management</Link>
                        </li>
                        

                    </ul>
                </li>
               
                {/* <li>
                    <a href="#category" className={(pathname == 'category') ? "accordion-toggle " + activeclass : "accordion-toggle " + normalclass} data-toggle="collapse" aria-expanded="false">
                        <img src={funcObj.assets_path("/images/icons/design-layout.png")} width="24" className="mr-1" alt="Design and Layout" />
                        category
                    </a>
                    <ul className="collapse list-unstyled" id="category" data-parent="#accordion">
                        <li>
                            <Link to="/category-list" className={(pathname == 'category-list') ? activeclass : submenu}>Category List</Link>
                        </li>
                        <li>
                            <Link to="/sub-category-list" className={(pathname == 'sub-category-list') ? activeclass : submenu}>Sub Category List</Link>
                        </li>
                    </ul>
                </li> */}
            </React.Fragment>
        );
    }

}
export default AdminSidebarMenus;
