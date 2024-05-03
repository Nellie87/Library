import React from 'react';
import Functions from '../helpers/functions';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class LibrarianSidebarMenus extends React.Component{

    constructor(props) {
        super(props);
        const  pathname =funcObj.get_pathname(); 
        this.state = {
            permission:[],
            addContentPermission: true,
            feedbackPermission: true,
            requestPermission:true,
            contentReviewPermission:true,
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
                        if(response.data[i].permission=="create" && response.data[i].is_permission==0){
                            this.setState({
                                addContentPermission: false,
                            });
                        }else if(response.data[i].permission=="feedback" && response.data[i].is_permission==0){
                            this.setState({
                                feedbackPermission: false,
                            });
                        }else if(response.data[i].permission=="request" && response.data[i].is_permission==0){
                            this.setState({
                                requestPermission: false,
                            });
                        }else if(response.data[i].permission=="review" && response.data[i].is_permission==0){
                            this.setState({
                                contentReviewPermission: false,
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
                            <li>
                                <Link className={ (pathname =='dashboard' || pathname == '') ? activeclass : normalclass } to="/dashboard"><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" /> Dashboard</Link>
                            </li>
                          
                            {(this.state.addContentPermission)?
                            <li>
                                <a href="#contents" className={ (pathname =='add-publication'||pathname =='bulk-upload') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass }
                                     data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="User Management" />
                                        Contents
                                </a>
                                <ul className="collapse list-unstyled" id="contents" data-parent="#accordion">

                                <li>
                                <Link to="/my-publications" className={ (pathname =='my-publications') ? activeclass : normalclass }>List</Link>
                            </li>
                                    {(this.state.addContentPermission)?
                                    <li>
                                        <Link to="/add-publication?book_id=" className={ (pathname =='add-publication') ? activeclass : submenu }> Add Content</Link>
                                    </li>:null}
                                    {(this.state.addContentPermission)?  
                                    <li>
                                        <Link to="/bulk-upload" className={ (pathname =='bulk-upload') ? activeclass : submenu }> Bulk Upload</Link>
                                    </li>:null}   


                                </ul>
                            </li>
                            :
                            <li>
                                <Link to="/my-publications" className={ (pathname =='my-publications') ? activeclass : normalclass }> <img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="Content Review & Publishing" />Content Review & Publishing</Link>
                            </li>
                            }
                            <li>
                                <Link  to="/library-catalog?backto=dashboard" className={ (pathname =='library-catalog') ? activeclass : normalclass }><img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="My Books" />Library Catalog</Link>
                            </li>
                            {(AUTH_USER.account_type == 'senior_librarian')?
                                <li>
                                    <Link to="/users-list" className={ (pathname =='users-list') ? activeclass : normalclass }><img src={funcObj.assets_path("/images/icons/user_management.svg")} width="24" className="mr-1" alt="User Management" />List of users</Link>
                                </li>:null
                            }
                            
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
                                     */}
                                    <li>
                                        <Link to="/sitemap" className="submenu">Sitemap</Link>
                                    </li>             
                                </ul>
                            </li>:null}
            </React.Fragment>
        );
    }

}
export default LibrarianSidebarMenus;
