import React from 'react';
import Functions from '../helpers/functions';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
const funcObj = new Functions();
class PublisherSidebarMenus extends React.Component{

    constructor(props) {
        super(props);
        const  pathname =funcObj.get_pathname();
        this.state = {
           permission:[],
           addContentPermission: true,
           feedbackPermission: true,
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
                      <li>
                            <div className="sidebar-search">
                                <input type="text" placeholder="Search content" id="searchInp1" name="searchInp1" className="search-box" />
                                <span onClick={(e) => funcObj.quickSearch(e,"searchInp1")} className="top_search_btn fa fa-search"></span>
                        </div>
                    </li>
                            <li>
                                <Link to="/publisher-dashboard" className={ (pathname =='publisher-dashboard' || pathname == '') ? activeclass : normalclass } ><img src={funcObj.assets_path("/images/icons/dashboard.svg")} width="24" className="mr-1" alt="Home" />Dashboard</Link>
                            </li>
                            {/* <li>
                                <a href="#authors" className="accordion-toggle  wave-effect sidebar-menu" data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/staff.png")} width="24" className="mr-1" alt="User Management" />
                                        Authors
                                </a>
                                <ul className="collapse list-unstyled" id="authors" data-parent="#accordion">
                                    <li>
                                        <Link to="/add-author" className="submenu"> Add Authors</Link>
                                    </li>
                                    <li>
                                        <Link to="/all-authors" className="submenu"> My Authors</Link>
                                    </li>            
                                </ul>
                            </li> */}
                            <li>
                                <a href="#contents" className={ (pathname =='add-publication'||pathname =='my-publications'||pathname =='bulk-upload') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass }  data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/content_review.svg")} width="24" className="mr-1" alt="User Management" />
                                        Contents
                                </a>
                                <ul className="collapse list-unstyled" id="contents" data-parent="#accordion">
                                    {(this.state.addContentPermission)?
                                    <li>
                                        <Link to="/add-publication?book_id=" className={ (pathname =='add-publication') ? activeclass : submenu }> Add Content</Link>
                                    </li>:null}
                                    <li>
                                        <Link to="/my-publications" className={ (pathname =='my-publications') ? activeclass : submenu }> My Library</Link>
                                    </li> 
                                    {(this.state.addContentPermission)?  
                                    <li>
                                        <Link to="/bulk-upload" className={ (pathname =='bulk-upload') ? activeclass : submenu }> Bulk Upload</Link>
                                    </li>:null}    

                                     <li>
                                    <Link to="/follower-list" className={ (pathname =='follower-list') ? activeclass : normalclass } >Followers</Link>
                                </li>     
                                </ul>
                            </li>
                            <li>
                                <Link  to="/library-catalog?backto=publisher-dashboard" className={ (pathname =='library-catalog') ? activeclass : normalclass }><img src={funcObj.assets_path("/images/icons/library.svg")} width="24" className="mr-1" alt="My Books" />Library Catalog</Link>
                            </li>
                            <li>
                                <a href="#reports" className={ (pathname =='content-sales'||pathname =='list-of-books'||pathname =='published-contents'||pathname =='views-on-publisher-content') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass }
                                     data-toggle="collapse" aria-expanded="false">
                                <img src={funcObj.assets_path("/images/icons/report.svg")} width="24" className="mr-1" alt="Publishing" /> Reporting & Statistics</a>      
                                <ul className="collapse list-unstyled" id="reports" data-parent="#accordion"> 
                                    <li>
                                        <Link to="/content-sales" className={ (pathname =='content-sales') ? activeclass : submenu }> Sales Statistics</Link>
                                    </li> 
                                    <li>
                                        <Link to="/list-of-books" className={ (pathname =='list-of-books') ? activeclass : submenu }> List of Books</Link>
                                    </li>   
                                  
                                    <li>
                                        <Link to="/published-contents" className={ (pathname =='published-contents') ? activeclass : submenu }> Published Contents</Link>
                                    </li>  
                                    <li>
                                        <Link to="/views-on-publisher-content" className={ (pathname =='views-on-publisher-content') ? activeclass : submenu }> Views On contents</Link>
                                    </li>             
                                </ul>
                            </li>
                           <li>
                                        <Link className={ (pathname =='common-profile') ? activeclass : normalclass } to="/common-profile"><img src={funcObj.assets_path("/images/icons/profile.svg")} width="24" className="mr-1" />My Profile</Link>
                                    </li>
                                    {/*<li>*/}
                                    {/*    <Link className={ (pathname =='change-password') ? activeclass : normalclass } to="/change-password"><img src={funcObj.assets_path("/images/icons/password.svg")} width="24" className="mr-1" />Change Password</Link>*/}
                                    {/*</li>*/}

                               
                            <li>
                                <a href="#help_support" className={ (pathname =='publisher-feedback-list'||pathname =='publisher-discussions'
                                    ||pathname =='publisher-request-list'||pathname =='faq'||pathname =='manual'||pathname =='sitemap') ? "accordion-toggle "+activeclass : "accordion-toggle "+normalclass } 
                                    data-toggle="collapse" aria-expanded="false">
                                    <img src={funcObj.assets_path("/images/icons/help.svg")} width="24" className="mr-1" alt="User Management" />
                                        Help & Support
                                </a>
                                <ul className="collapse list-unstyled" id="help_support" data-parent="#accordion">
                                    {(this.state.feedbackPermission)?
                                    <li>
                                        <Link to="/publisher-feedback-list" className={ (pathname =='publisher-feedback-list') ? activeclass : submenu }> Feedback</Link>
                                    </li>:null}
                                    {/* <li>
                                        <Link to="/publisher-discussions" className={ (pathname =='publisher-discussions') ? activeclass : submenu }> Discussion</Link>
                                    </li> */}
                                    <li>
                                        <Link to="/publisher-request-list" className={ (pathname =='publisher-request-list') ? activeclass : submenu }> Request for Help</Link>
                                    </li>
                                    {/* <li>
                                        <Link to="/publisher-chat" className="submenu">Chat</Link>
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
export default PublisherSidebarMenus;
