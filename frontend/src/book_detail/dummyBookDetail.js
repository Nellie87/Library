import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import RatingReviews from './rating_reviews';

import { withRouter } from 'react-router-dom';
import Similarbooks from "./similar_books";
import DummyBookDetailSection from './dummy_book_detail_section';
import DummyRatingReviews from './dummy_rating_reviews';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class DummyBookdetail extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            book_detail:{},
            similar_books:{}
        };
    }

    componentDidMount(){
        let book_id = funcObj.get_query_string('book_id');
        let book_detail = funcObj.get_book_details(book_id);
        let similar_books = funcObj.get_type_books(book_detail.type);
        this.setState({
            book_detail:book_detail,
            similar_books:similar_books
        })

    }

    render() {
        let book_id = funcObj.get_query_string('book_id');
        console.log('book_id',book_id);
       
        const book = this.state.book_detail;
        const similar_books = this.state.similar_books;
        // console.log(book.title);
        let tab_type = "Any";
        if(funcObj.get_query_string('type')){
            tab_type = funcObj.get_query_string('type');
        }
        return (
            <React.Fragment>
            {
                book && Object.keys(book).length > 0 ?
                <div className="search_container">
                    <div className="banner text-center">
                        <div className="container">
                            <span className="page_title">{book.title}</span>
                        </div>
                    </div>
                    <div className="container">
                        <div className="search_wrap clearfix ">
                            <div className="right_bar float-left p-3 p-lg-4">
                                <div className="clearfix top-head mb-4">
                                    <h6 className="mb-0 mt-3 float-md-left">
                                        <div className="breadcrumbs py-1">
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
                                            {book.title}
                                            </span>
                                        </div>
                                    </h6>
                                    {/* <div className="float-right search__wrap">
                                        <div className="menu-search-box bookdetail position-relative clearfix d-block">
                                            <input type="text" placeholder="Search Books, Course" className="search-box w-100 m-0" />
                                            <span className="search-icon">  <img src={funcObj.assets_path("/images/icons/search.png")} width="22" alt="search" /> </span>
                                        </div>
                                    </div> */}
                                </div>
                                
                             {this.middlePart()}
                         
                            </div>

                           <Similarbooks similar_books={similar_books} />
                        </div>
                    </div>

                </div>
            
            :null
            
            }
            </React.Fragment>
        );
    }

    middlePart(){
        const book_detail = this.state.book_detail;
        return (<React.Fragment>
            
            <DummyBookDetailSection book_detail={book_detail} />
            <DummyRatingReviews />
                         
        </React.Fragment>);
    }
}

export default withRouter(DummyBookdetail);
