import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class AddFeedback extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Feedback</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Fill Details</span></div>

                                    <div className="form-group">
                                        <label className="pl-3">Feedback for</label>
                                        <select title="Select feedback for" className="input-field form-control">

                                            <option>Content</option>
                                            <option>Publisher</option>
                                            <option>Author</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <span class="fa fa-star starchecked"></span>
                                        <span class="fa fa-star starchecked"></span>
                                        <span class="fa fa-star starchecked"></span>
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span>
                                    </div>

                                    <div className="form-group">
                                        <label className="pl-3">Name <span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Full Name" name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Mobile<span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Mobile Number" name="mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Subject<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Complete Address" name="address" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Description</label>
                                        <textarea  className="input-field form-control" name="feedback_desc" placeholder="Enter description"></textarea>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Attachment file ?</span>
                                    </div>
                                    <div className="form-group">
                                        <div className="drop-zone-wrap p-2">
                                            <div class="drop-zone">
                                                <span class="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" class="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse files
                                                    </div>
                                                    <small>Single Images Only</small>
                                                </span>
                                                <input type="file" name="myFile" class="drop-zone__input" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png, .pdf</small>
                                            <small className="d-block float-right">Single Images Only</small>
                                        </div>
                                        <button type="button" class="btn darkBtn roundedBtn w-100">Upload</button>
                                    </div>
                                   
                                </div>
                            </div>
                            <div className="text-right">
                            <Link to="/feedback-list" type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                            <button type="button" class="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
