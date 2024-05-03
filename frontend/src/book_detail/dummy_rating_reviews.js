import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class DummyRatingReviews extends React.Component {

    render(){
        return (
            <React.Fragment>
                    <div className="form-group">
                        <h3 className="dashboard-title title-margin">Reviews and Ratings</h3>
                    </div>
                    <div className="clientReviews-list mb-3 p-3">
                                    <div className="clientInfo_top d-block d-sm-flex justify-content-between align-items-center">
                                        <div className="clientInfo clearfix">
                                            <div className="img-wrap float-left mr-3">
                                                <img src={funcObj.assets_path("/images/user.png")} alt="user" />
                                            </div>
                                            <div className="clientName-wrap float-left">
                                                <div className="name">
                                                    Jason Smith
                                                </div>
                                                <div className="clientType">
                                                    Reader
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-rating">
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                            <span>4.5/5</span>
                                        </div>
                                    </div>
                                    <div className="description_text my-2 my-lg-4">
                                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore m aliquyam erat, sed diam volus. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gub, sea taki sanctus est Lorem ipsum dolor.
                                    </div>
                                    <div className="clientInfo_bottom d-block d-sm-flex justify-content-between align-items-center">
                                        <div className="date">
                                            29-May-2021
                                        </div>
                                        <ul className="list-inline">
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/like.svg")} width="20" alt="user" />  Like
                                            </li>
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/comment.svg")} width="20" alt="user" />  Comment
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="clientReviews-list mb-3 p-3">
                                    <div className="clientInfo_top d-block d-sm-flex justify-content-between align-items-center">
                                        <div className="clientInfo clearfix">
                                            <div className="img-wrap float-left mr-3">
                                                <img src={funcObj.assets_path("/images/user.png")} alt="user" />
                                            </div>
                                            <div className="clientName-wrap float-left">
                                                <div className="name">
                                                    Jason Smith
                                                </div>
                                                <div className="clientType">
                                                    Reader
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-rating">
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                            <span>4.5/5</span>
                                        </div>
                                    </div>
                                    <div className="description_text my-4">
                                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore m aliquyam erat, sed diam volus. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gub, sea taki sanctus est Lorem ipsum dolor.
                                    </div>
                                    <div className="clientInfo_bottom d-block d-sm-flex justify-content-between align-items-center">
                                        <div className="date">
                                            29-May-2021
                                        </div>
                                        <ul className="list-inline">
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/like.svg")} width="20" alt="user" />  Like
                                            </li>
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/comment.svg")} width="20" alt="user" />  Comment
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="clientReviews-list mb-3 p-3">
                                    <div className="clientInfo_top d-block d-sm-flex  justify-content-between  align-items-center">
                                        <div className="clientInfo clearfix">
                                            <div className="img-wrap float-left mr-3">
                                                <img src={funcObj.assets_path("/images/user.png")} alt="user" />
                                            </div>
                                            <div className="clientName-wrap float-left">
                                                <div className="name">
                                                    Jason Smith
                                                </div>
                                                <div className="clientType">
                                                    Reader
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-rating">
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                            <span>4.5/5</span>
                                        </div>
                                    </div>
                                    <div className="description_text my-4">
                                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore m aliquyam erat, sed diam volus. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gub, sea taki sanctus est Lorem ipsum dolor.
                                    </div>
                                    <div className="clientInfo_bottom d-block d-sm-flex justify-content-between align-items-center">
                                        <div className="date">
                                            29-May-2021
                                        </div>
                                        <ul className="list-inline">
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/like.svg")} width="20" alt="user" />  Like
                                            </li>
                                            <li className="list-inline-item pl-0 pl-sm-3">
                                                <img src={funcObj.assets_path("/images/icons/comment.svg")} width="20" alt="user" />  Comment
                                            </li>
                                        </ul>
                                    </div>
                                </div>
            </React.Fragment>
        );
    }

}