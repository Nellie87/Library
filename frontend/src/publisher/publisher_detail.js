import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
// import RatingReviews from './rating_reviews';
// import DetailSection from './detail_section';
import { withRouter } from 'react-router-dom';

import Swal from 'sweetalert2';
const funcObj = new Functions();
class PublisherDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            book_detail: {},
            similar_books: {}
        };
    }

    getBookDetail(){
        let publisher_id = funcObj.get_query_string('publisher_id');
        let postBodyData = {
            'content_id': publisher_id
        };
        let endPoint = 'content-detail';
        
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log(endPoint + ' response', data)
            if (data.code == 200) {
                this.setState({
                    book_detail: data.data,
                    similar_books: {}
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
       this.getBookDetail();
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
                        <div className="search_container">
                            <div className="banner text-center">
                                <div className="container">
                                    <span className="page_title">{content.title}</span>
                                </div>
                            </div>
                            <div className="container">
                                <div className="search_wrap clearfix ">
                                    <div className=" float-left p-3 p-lg-4">
                                        <div className="clearfix top-head mb-4">
                                            <h6 className="mb-0 mt-3 float-md-left">
                                                <div className="breadcrumbs py-1">
                                                    {
                                                        backlink != "" && backlink != null ?
                                                            <div>
                                                                <Link className='btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120' to={`/` + backlink}>
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

                                        </div>


                                        {/* <DetailSection getBookDetail={this.getBookDetail} book_detail={content} />
                                        <RatingReviews book_detail={content} /> */}

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

export default withRouter(PublisherDetail);
