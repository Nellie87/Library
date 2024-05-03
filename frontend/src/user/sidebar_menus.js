import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
class UserSidebarMenus extends React.Component {
    constructor(props){
        super(props);
        const  pathname =funcObj.get_pathname(); 
        
        this.state ={
            pathname : pathname,
            activeclass :"wave-effect sidebar-menu active",
            normalclass : "wave-effect sidebar-menu",
            submenu : "submenu"
        }

    }
    componentDidMount() {
       
    }
    render() {
        const {pathname,activeclass,normalclass,submenu }=this.state;
        return (
            <React.Fragment>
                <li>
                    <div className="sidebar-search">
                        <input type="text" placeholder="Search content title, isbn, author, publisher" className="search-box" />
                        
                    </div>
                </li>
                <li>
                    <Link className={ (pathname =='reader-dashboard' || pathname == '') ? activeclass : normalclass } to="/reader-dashboard"><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" />Dashboard</Link>
                </li>

                <li>
                    <Link className={ (pathname =='my-books') ? activeclass : normalclass } to="/my-books"><img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="My Books" />My Library</Link>
                </li>

                <li>
                    <Link className={ (pathname =='library-catalog') ? activeclass : normalclass } to="/library-catalog?backto=reader-dashboard"><img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="My Books" />Library Catalog</Link>
                </li>

                

              <li>
                            <Link className={ (pathname =='reader-profile') ? activeclass : normalclass } to="/reader-profile"><img src={funcObj.assets_path("/images/icons/profile.svg")} width="24" className="mr-1" />My Profile</Link>
                        </li>
                        <li>
                            <Link className={ (pathname =='membership-subscription') ? activeclass : normalclass } to="/membership-subscription"><img src={funcObj.assets_path("/images/icons/membership.svg")} width="24" className="mr-1" />Membership plans</Link>
                        </li>
                        {/* <li>
                            <Link className={ (pathname =='history-subscription') ? activeclass : normalclass } to="/history-subscription"><img src={funcObj.assets_path("/images/icons/history.svg")} width="24" className="mr-1" />Subscription history</Link>
                        </li> */}
                        <li>
                            <Link className={ (pathname =='preferance') ? activeclass : normalclass } to="/preferance"><img src={funcObj.assets_path("/images/icons/preferences.svg")} width="24" className="mr-1" />My Preferences</Link>
                        </li>
                        {/*<li>*/}
                        {/*    <Link className={ (pathname =='change-password') ? activeclass : normalclass } to="/change-password"><img src={funcObj.assets_path("/images/icons/password.svg")} width="24" className="mr-1" />Change Password</Link>*/}
                        {/*</li>*/}

                   
                <li>
                    <a href="#help_support" className={ (pathname =='feedback-list'||pathname =='discussions'
                                    ||pathname =='request-list'||pathname =='faq'||pathname =='manual'
                                    ||pathname =='sitemap') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass } 
                                    data-toggle="collapse" aria-expanded="false">
                        <img src={funcObj.assets_path("/images/icons/help.svg")} width="24" className="mr-1" alt="User Management" />
                        Help & Support
                    </a>
                    <ul className="collapse list-unstyled" id="help_support" data-parent="#accordion">

                        <li>
                            <Link to="/feedback-list" className={ (pathname =='feedback-list') ? activeclass : submenu }> Feedback</Link>
                        </li>
                        {/* <li>
                            <Link to="/discussions" className={ (pathname =='discussions') ? activeclass : submenu }> Discussion</Link>
                        </li> */}
                        <li>
                            <Link to="/request-list" className={ (pathname =='request-list') ? activeclass : submenu }> Request for Help</Link>
                        </li>

                        {/* <li>
                            <Link to="/chat" className="submenu">Chat</Link>
                        </li> */}
                        
                        <li>
                            <Link to="/faq" className={ (pathname =='faq') ? activeclass : submenu }>FAQ</Link>
                        </li>
                        <li>
                            <Link to="/manual" className={ (pathname =='manual') ? activeclass : submenu }>Manual</Link>
                        </li>
                        <li>
                            <Link to="/sitemap" className={ (pathname =='sitemap') ? activeclass : submenu }>Sitemap</Link>
                        </li>  
                    </ul>
                </li>




            </React.Fragment>
        );
    }

}
export default UserSidebarMenus;
