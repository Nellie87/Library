import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class RatingReviews extends React.Component {

    render(){
        return (
            <React.Fragment>
               
                    {
                        this.props.book_detail &&  this.props.book_detail.comments && Object.keys(this.props.book_detail.comments).length > 0 ?
                      
                        <React.Fragment>
                        <div className="form-group">
                        <h3 className="dashboard-title title-margin">Reviews and Ratings</h3>
                    </div>
                    {
                        this.props.book_detail.comments.map((comment, index) => {

                            return (
                        <div className="clientReviews-list mb-3 p-3">
                                    <div className="clientInfo_top d-block d-sm-flex justify-content-between align-items-center">
                                        <div className="clientInfo clearfix">
                                            {/* <div className="img-wrap float-left mr-3">
                                                <img src={funcObj.assets_path("/images/user.png")} alt="user" />
                                            </div> */}
                                            <div className="clientName-wrap float-left">
                                                <div className="name">
                                                    {
                                                        comment.commenter && comment.commenter.username ?
                                                        <span>{comment.commenter.username}</span>
                                                        : 
                                                        null 
                                                    }
                                                </div>
                                                <div className="clientType">
                                                {comment.commenter.user_type}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-rating">
                                        {funcObj.generateStarRating(comment.rating)}
                                            <span>{comment.rating}/5</span>
                                        </div>
                                    </div>
                                    <div className="description_text my-2 my-lg-4">
                                    {comment.comment}
                                    </div>
                                    <div className="clientInfo_bottom d-block d-sm-flex justify-content-between align-items-center">
                                        <div className="date">
                                            {comment.created_on}
                                        </div>
                                        {/* <ul className="list-inline">
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/like.svg")} width="20" alt="user" />  Like
                                            </li>
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/comment.svg")} width="20" alt="user" />  Comment
                                            </li>
                                        </ul> */}
                                    </div>
                                </div>
                            )
                        })
                    }
                        </React.Fragment>
                        :null
                    }
                  
                              
                              
            </React.Fragment>
        );
    }

}