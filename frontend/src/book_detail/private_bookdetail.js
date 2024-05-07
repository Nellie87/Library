import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import RatingReviews from './rating_reviews';
import DetailSection from './detail_section';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import SuggesstionSlider from './suggestionSlider';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
const endpoint = funcObj.api_request_url() + `membership-update`;
class PrivateBookdetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            book_detail: {},
            similar_books: {},
            is_reading: false,
            show: false,
            preview: false,
        };

        this.getBookDetail = this.getBookDetail.bind(this);
        this.handleModal = this.handleModal.bind(this);
      
    }

    getBookDetail() {
        console.log('getBookDetail......')
        let book_id = funcObj.get_query_string('book_id');
        let postBodyData = {
            'content_id': book_id
        };
        let endPoint = 'content-detail';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log(endPoint + ' response', data)
            if (data.code == 200) {
                this.setState({
                    book_detail: data.data,
                    similar_books: {},
                    is_reading: (data.data.no_of_copies_available && data.data.no_of_copies_available.is_reading && data.data.no_of_copies_available.is_reading == true) ? true : false,
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
    componentDidMount() {
        let redirect_exists = funcObj.getLocalStorage('redirect_exists');
        if (redirect_exists) {
            funcObj.removeLocalStorage('redirect_exists');
        }

        if (AUTH_USER != null) {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: AUTH_USER.token,
                    userId: AUTH_USER.user.id
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(resp => {
                    let currData = funcObj.getLocalStorage('user');
                    console.log('plan', currData.plan);
                    // Update the is_membership_user field
                    currData.user.is_membership_user = resp.data.is_membership_user;
                    currData.is_member = resp.data.is_member;
                    currData.plan = resp.data.plan;
                    console.log('plan resp', resp.data.plan);
                    // Save the updated data back to local storage
                    funcObj.setLocalStorage('user', JSON.stringify(currData));

                    // Call getBookDetail after updating local storage
                    this.getBookDetail();
                    window.scrollTo(0, 0);
                })
                .catch(error => {
                    this.setState({ error: error.message });
                });
        } else {
            window.location = funcObj.api_request_url() + "sso/oauth/authorize";
        }
    }

    handleModal(preview = false) {
        // alert(preview);
        this.setState({
            preview: preview
        });
        this.setState({ show: !this.state.show, is_reading: true });
      

    }
  
  

    render() {
        let book_id = funcObj.get_query_string('book_id');
        let backlink = funcObj.get_query_string('backlink');
        console.log('book_id', book_id);
        const similar_books = this.state.similar_books;
        const content = this.state.book_detail;
        let tab_type = "Any";
        if (funcObj.get_query_string('type')) {
            tab_type = funcObj.get_query_string('type');
        }
        return (
            <React.Fragment>

                {
                    content && Object.keys(content).length > 0 ?
                        funcObj.custom_styles(content)
                        : null
                }
                {
                    AUTH_USER != null ?
                        <div>

                            {
                                this.state.show ?

                                    <div className="row">

                                        <button className='btn go_back_btn  lightBtn py-1 px-3 mr-1 test' onClick={() => this.handleModal()}>
                                            Go Back
                                        </button>
                                        <div className="col-md-12 each_player" >
                                            {funcObj.playerAll(content, this.state.preview)}
                                        </div>
                                    </div>

                                    : null}
                        </div>
                        : null
                }
                {
                    content && Object.keys(content).length > 0 && this.state.show == false ?
                        <div className="search_container">
                            <div className="banner text-center">
                                <div className="container">
                                    <span className="page_title">{content.title}</span>
                                </div>
                            </div>
                            <div className="container">
                                <div className="search_wrap clearfix ">
                                    <div className="p-3 p-lg-4">
                                        {/* <div className="clearfix top-head mb-4">
                                            <h6 className="mb-0 mt-3 float-md-left">
                                                <div className="breadcrumbs py-1">
                                                    {
                                                        backlink != "" && backlink != null ?
                                                            <div>
                                                                <Link className='btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3' to={`/` + backlink}>
                                                                    Go Back
                                                                </Link>
                                                            </div>
                                                            :
                                                            <React.Fragment>
                                                                <span>
                                                                    <Link to="/home">
                                                                        Home
                                                                    </Link>
                                                                </span>
                                                                <span>
                                                                    <Link to={`/home#myTabContent`}>
                                                                        {tab_type}
                                                                    </Link>
                                                                </span>
                                                                <span>
                                                                    {content.title}
                                                                </span>
                                                            </React.Fragment>
                                                    }
                                                </div>
                                            </h6>

                                        </div> */}


                                        <DetailSection handleModal={this.handleModal} is_reading={this.state.is_reading} getBookDetail={this.getBookDetail} book_detail={content} />
                                        

                                    </div>
                                    <SuggesstionSlider content={content} backlink={backlink} />
                                    <div className="p-3 p-lg-4">
                                    <RatingReviews getBookDetail={this.getBookDetail} book_detail={content} />
                                    </div>
                                    {/* <Similarbooks similar_books={similar_books} /> */}
                                   
                                    
                                  
                                </div>
                               
                               
                            </div>

                        </div>

                        : null

                }
            </React.Fragment>
        );
    }


}

export default withRouter(PrivateBookdetail);
