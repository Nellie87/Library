import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class AddDiscussion extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form id="feedbackFrm" method="POST">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Add Discussion group</h3>
                                <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/publisher-discussions"  className="btn darkBtn">All Discussions</Link>
                                </div>
                            </div>
                            </div>
                            <div className="row">
                               <div className="col-md-12">
                             

                                
                               <div className="form-group">
                                        <label className="pl-3">Topic</label>
                                        <input type="text" className="input-field form-control" placeholder="Enter title" name="feedback_title" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Description</label>
                                        <textarea  className="input-field form-control" name="feedback_desc" placeholder="Enter description"></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label className="pl-3">Users</label>
                                        <select style={{'min-height':'100px'}} title="Select feedback for" className="input-field form-control multiple" multiple>

                                            <option>Wangari Maathai</option>
                                            <option>Lupita Nyongo</option>
                                            <option>Jomo Kenyatta</option>
                                        </select>
                                    </div>
                                
                               </div>
                            </div>
                            <div className="text-right">
                            <Link to="/discussions" type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                               <button type="button" class="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
