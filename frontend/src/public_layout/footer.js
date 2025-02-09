import React from 'react';
import { Link } from "react-router-dom";
import Functions from "../helpers/functions";
const funcObj = new Functions();
export default class PublicFooter extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            classes:{}            
        };
      this.setClasses = this.setClasses.bind(this);
    }

    componentDidMount(){
        this.setClasses();
    }
    callSearch(e,classes){
        e.preventDefault();
        funcObj.callSearch(classes);
    }
    setClasses(){        
        const endPoint = 'get-contents-classes-public';
        let postBodyData = {};

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data && data.code == 200 && data.data) {
                this.setState({ classes: data.data });
            }

        });
    }

    render(){
        const myStyle = {
            "border-top": "1px solid #bbb","padding-top": "20px"
          };
        return (
            <React.Fragment>
                <br />  <br />
                <div className="public-footer pt-4">
                    <div className="container" style={myStyle}>
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-3">
                                <img  className="main_logo" src={funcObj.get_logo()} alt="knls logo" />
                               
                             
                            </div>
                            <div className="col-xl-9 col-lg-9 col-md-9">
                                <div className="row">
                                <div className="col-sm-3">
                                        <div className="list-head mb-4">
                                           Contact us
                                        </div>
                                     <div className='contact_us'>
                                     <div className='address'>
                                <p>Kenya National Library Services</p>
                        <p><i class="fa fa-map-marker" aria-hidden="true"></i> Maktaba Kuu Building, Upper Hill Area</p>
                        <p>P.O BOX 30573-0100</p>
                        <p>Nairobi</p>
                                </div>
                                <p>
                                <i class="fa fa-phone" aria-hidden="true"></i> +254 722 860 567
                                </p>
                                     </div>

                                    </div>
                                    <div className="col-sm-3">
                                        <div className="list-head mb-4">
                                            Explore
                                        </div>
                                        <ul className="list-unstyled">

                                        {
                                                        this.state.classes && Object.keys(this.state.classes).length > 0 ?
                                                            this.state.classes.map((classd, index) => {
                                                                if (classd.class_name_key == "journal/periodical" || classd.class_name_key == "manuscripts" || classd.class_name_key == "music") {
                                                                                return false; // skip
                                                                            }
                                                                return (

                                                        <li key={index}>
                                                        <Link  to="" onClick={(e)=>this.callSearch(e,classd.class_id)}>{classd.class_name}</Link>
                                                    </li>
                                                                    
                                                                
                                                                )
                                                            })
                                                            : null}
                                          
                                        </ul>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="list-head mb-4">
                                            Quick Links
                                        </div>
                                        <ul className="list-unstyled">
                                            <li>
                                                <Link  onClick={(e) => funcObj.loadAnotherUrl(e,"https://www.knls.ac.ke/",'_blank')} to=""  className=''>
                                                Library Website
                                                </Link>
                                            </li>
                                            <li>
                                                <Link  to="public-faq"   className=''>
                                                FAQ's
                                                </Link>
                                            </li>
                                            {/*<li>*/}
                                            {/*    <Link to="registration"   className=''>*/}
                                            {/*    Register Now*/}
                                            {/*    </Link>*/}
                                            {/*</li>*/}
                                            <li>
                                                <Link onClick={ (e) => window.location = funcObj.api_request_url(e) + "sso/oauth/authorize"} to="" className=''>
                                                Login Here
                                                </Link>
                                            </li>
                                            <li>
                                                <Link  onClick={(e) => funcObj.loadAnotherUrl(e,"https://knls.ac.ke/",'_blank')} to=""   className=''>
                                                    History
                                                </Link>
                                            </li>
                                         
                                        </ul>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="list-head mb-4">
                                        Social Connects
                                        </div>
                                        <ul className="list-unstyled">
                                            <li>
                                                <Link onClick={(e) => funcObj.loadAnotherUrl(e,"https://www.facebook.com/KenyaNationalLibraryService/?show_switched_toast=1&show_invite_to_follow=0&show_switched_tooltip=0&show_podcast_settings=0&show_community_transition=0&show_community_review_changes=0",'_blank')} to=""  className=''>
                                                    Facebook
                                                </Link>
                                            </li>
                                            <li>
                                                <Link onClick={(e) => funcObj.loadAnotherUrl(e,"https://twitter.com/knlsmedia",'_blank')} to="" className=''>
                                                    Twitter
                                                </Link>
                                            </li>
                                            <li>
                                                <Link onClick={(e) => funcObj.loadAnotherUrl(e,"https://www.instagram.com/knlsmedia/?hl=en",'_blank')} to=""  className=''>
                                                    Instagram
                                                </Link>
                                            </li>
                                            <li>
                                                <Link  onClick={(e) => funcObj.loadAnotherUrl(e,"https://www.linkedin.com/company/kenya-national-library-service/mycompany/?viewAsMember=true",'_blank')} to=""  className=''>
                                                    Linkedin
                                                </Link>
                                            </li>
                                            <li>
                                                <Link  onClick={(e) => funcObj.loadAnotherUrl(e,"https://www.youtube.com/channel/UCTF2MOj4AfkfeXomdBXV4YQ",'_blank')} to=""  className=''>
                                                    YouTube
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                        <div className="copyright-wrap mt-3 text-center py-4 px-3 bg-color_primary">
                            Copyright © 2021 KNLS. All Rights Reserved | Powered by <strong>Craft Silicon</strong><br />
                            <Link to="privacy-policy" style={{color:'#ffffff',fontSize:'10px'}}>Privacy-Policy</Link> | 
                            <Link to="terms-conditions"  style={{color:'#ffffff',fontSize:'10px'}}>Terms Conditions</Link>

                        </div>
                    </div>
                </div>
          
            </React.Fragment>
        );
    }

}