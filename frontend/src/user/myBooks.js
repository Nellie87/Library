import React from 'react';
import Functions from '../helpers/functions';
import Slider from "react-slick";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import HistorySubscription from './history_subscription';
import Wishlist from './wishlist';
import ContinueReading from './continue_reading';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class MyBooks extends React.Component {
    constructor(props) {
        super(props);
        let active_tab = funcObj.get_query_string('active_tab');
        if(funcObj.customIsPropertyNotEmpty(this.props.subscribed_content)){
            active_tab = 'subscribed';
        }
        this.state = {
            books: {},
            history: [],
            total_records: 0,
            current_page: 1,
            active_tab:active_tab,
            contents: {},
            content_count: 0
        };
    
    }

    componentDidMount() {
        this.mybook();        
        this.getClasses();
        funcObj.validateIntaSendCardResponse();
  
        
    }

    

 
    getClasses = () => {
        let endPoint = 'get-classes';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    classes: data.data
                });

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
   

    handleOnchangeSource(event) {
        this.setState({
            total_amount: event.target.value,
            [event.target.name]: event.target.value
        });
    }
    mybook() {


        let user = funcObj.getLocalStorage('user');

        let postBodyData = {            
        };
        let endPoint = "my-book/" + user.user.id;
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            if (data.code == 200) {

                this.setState({
                    isLoaded: true,
                    contents: data.data.data,
                    content_count: data.data.content_count
                });

            } else if (data.code == 401) {

            }
        });

    }
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.plan == "") {
            alert("Please select a plan");
            return false;
        }
        let postBodyData = {
            // "plan": this.state.plan          
        };
        let endPoint = 'subscription-history?page=' + this.state.current_page;

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                funcObj.updateAuthUser('plan', this.state.plan);
                funcObj.updateAuthUser('is_member', 1);
                Swal.fire({
                    title: 'Success',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
  
    render() {
        const contents = this.state.contents;
        console.log('content_count', this.state.content_count)
        // const audiobooks = this.state.audiobooks;
        // const videobooks = this.state.videobooks;
        // const slides = this.state.slides;
        return (
            <React.Fragment>
                <div>
                    <div className="row-cards-one dashboard-box">


                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class={this.state.active_tab == null?"nav-link active":"nav-link"} data-toggle="tab" href="#wishlist"> My Wishlist</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#History">My History</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#Reading">Currently Reading</a>
                            </li>
                            <li class="nav-item">
                                <a class={this.state.active_tab == 'subscribed'?"nav-link active":"nav-link"} data-toggle="tab" href="#Contents">Subscribed</a>
                            </li>
                        </ul>

                        <div class="tab-content">

                        <div class="tab-pane container active" id="wishlist">
                                <Wishlist />
                        </div>
                         
                            <div class="tab-pane container fade" id="History">
                                    
                                <HistorySubscription />
                                    
                               

                            </div>

                            <div class="tab-pane container fade" id="Reading">
                                <div className="card mt-4">
                                    <div className="dashboard-box">
                                    <ContinueReading />
                                    </div>
                                </div>
                            </div>

                            <div class="tab-pane container fade" id="Contents">
                            <div className="card mt-4">
                                    <div className="dashboard-box">
                                {this.subscribedContents()}
                                </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    subscribedContents() {
        const bookSettings = {
            slidesToShow: (this.state.contents.length > 4) ? 4 : this.state.contents.length,
            slidesToScroll: 1,
            autoplay: false,
            infinite:false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1500,
                    settings: {
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        };
        let duration = 0;
        return (
            <div className="row-cards-one dashboard-box">
                {this.state.contents && Object.keys(this.state.contents).length > 0 ?
                <>
              
                

                <Slider className="top-books" {...bookSettings}>
                    {
                        this.state.contents && Object.keys(this.state.contents).length > 0 ?
                            this.state.contents.map((book, index) => {

                                return (
                                    <React.Fragment key={index}>
                                        {funcObj.catalogCardBoxLeftRightList(book, 'reader-dashboard')}
                                    </React.Fragment>
                                )
                            })
                            : null
                    }
                </Slider>
                </>
                    :null}
                    
            </div>
        );
    }
    noContents() {
        return (
            <div className="book-card-wrap">
                <div className="book-card ebook">
                    <span>No contents subscribed!</span>
                </div>
            </div>
        );
    }
}
export default MyBooks;