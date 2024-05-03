import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
export default class StaffSidebarMenus extends React.Component {

    constructor(props) {
        super(props);
        const  pathname =funcObj.get_pathname(); 
        
        this.state = {
           permission:[],
           feedbackPermission: true,
           requestPermission:true,
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
                        if(response.data[i].permission=="feedback" && response.data[i].is_permission==0){
                            this.setState({
                                feedbackPermission: false,
                            });
                        }else if(response.data[i].permission=="request" && response.data[i].is_permission==0){
                            this.setState({
                                requestPermission: false,
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
    render() {
        const {pathname,activeclass,normalclass,submenu }=this.state;
        return (
            <React.Fragment>
                {/* <li>
                    <div className="sidebar-search">
                        <input type="text" placeholder="Search content title, isbn, author, publisher" className="search-box" />
                    </div>
                </li> */}
                <li>
                    <Link className={ (pathname =='staff-dashboard' || pathname == '') ? activeclass : normalclass } to="/staff-dashboard"><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" /> Dashboard</Link>
                </li>
                <li>
                    <Link  to="/library-catalog?backto=staff-dashboard"  className={ (pathname =='library-catalog') ? activeclass : normalclass }><img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="My Books" />Library Catalog</Link>
                </li>

               <li>
                            <Link className={ (pathname =='common-profile') ? activeclass : normalclass } to="/common-profile"><img src={funcObj.assets_path("/images/icons/profile.svg")} width="24" className="mr-1" />My Profile</Link>
                        </li>
                        {/*<li>*/}
                        {/*    <Link className={ (pathname =='change-password') ? activeclass : normalclass } to="/change-password"><img src={funcObj.assets_path("/images/icons/password.svg")} width="24" className="mr-1" />Change Password</Link>*/}
                        {/*</li>*/}

               
                {(this.state.feedbackPermission || this.state.requestPermission)?
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
                </li>: null}

            </React.Fragment>
        );
    }

}
