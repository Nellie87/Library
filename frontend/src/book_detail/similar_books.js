import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import RatingReviews from './rating_reviews';
import DetailSection from './detail_section';
import { withRouter } from 'react-router-dom';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class SimilarBooks extends React.Component {

    
    constructor(props){
        super(props);
        this.state ={
            similar_books:{}
        };
    }
    openBookDetail(e,book){
        if(AUTH_USER != null){
            window.location = funcObj.getSitePath('private-bookdetail?book_id='+book.id+'&type='+book.type);
        }else{
            window.location = funcObj.getSitePath('bookdetail?book_id='+book.id+'&type='+book.type);
        }
        
    }
render(){
    const similar_books = this.props.similar_books;
    return (
        <React.Fragment>
             <div className="left__bar float-left py-3 pr-4 pl-4 pl-md-0" >
                                <div className="form-group mt-0 mt-md-4">
                                    <h3 class="dashboard-title title-margin m-0 text-center">Recommended for you</h3>
                                </div>
                                <div className="top_books mt-4 pb-4">
                                    {similar_books.map((value, index) => {

                                        
                                        return (
                                    <div className="book-card-wrap ">
                                        <div className="book-card  clearfix curspoint" onClick={(e) => this.openBookDetail(e,value)}>
                                            <div className="img-wrap float-left">
                                                <img src={value.picture} alt="books" />
                                            </div>
                                            
                                            <div className="book-details mt-5 float-left pb-0">
                                                {
                                                    value.type == 'audio' ?
                                                    <img src={funcObj.assets_path("/images/icons/audio-tag.svg")} className="tag-icon" width="75" alt="" />
                                                    :null
                                                }
                                                {
                                                    value.type == 'video' ?
                                                    <img src={funcObj.assets_path("/images/icons/video-tag.svg")} className="tag-icon" width="75" alt="" />
                                                    :null
                                                }
                                                {
                                                    value.type == 'presentations' ?
                                                    <img src={funcObj.assets_path("/images/icons/slides-tag.svg")} className="tag-icon" width="75" alt="" />
                                                    :null
                                                }
                                                {
                                                    value.type == 'ebooks' ?
                                                    <img src={funcObj.assets_path("/images/icons/book-tag.svg")} className="tag-icon" width="75" alt="" />
                                                    :null
                                                }
                                                

                                                <div className="book-name">
                                                {value.title}
                                                </div>
                                                <p>
                                                {value.subtitle}
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                                <div class="price">
                                                    {/* <span class="old-price">250</span> */}
                                                    <span class="new-price"> {value.price} {funcObj.getCurrency()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )})}
                                </div>
                            
                            </div>

        </React.Fragment>
    );
}
}

export default withRouter(SimilarBooks);