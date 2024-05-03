import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class AddStaff extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Add Staff</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> Staff Details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">Full Name <span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Full Name" name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Mobile<span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Mobile Number" name="mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Address<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Complete Address" name="address" />
                                    </div>
                                    

                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> Login Details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">Email<span>*</span></label>
                                        <input type="email" className="input-field form-control" placeholder="Enter Email Address" name="email" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Password<span>*</span></label>
                                        <input type="password" className="input-field form-control" placeholder="Enter Password" name="password" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Confirm Password<span>*</span></label>
                                        <input type="password" className="input-field form-control" placeholder="Re-enter Password" name="confirm_password" />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Cover Image</span>
                                    </div>
                                    <div className="form-group">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                                <span className="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" className="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse files
                                                    </div>
                                                    <small>Single Images Only</small>
                                                </span>
                                                <input type="file" name="myFile" className="drop-zone__input" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png, .pdf</small>
                                            <small className="d-block float-right">Single Images Only</small>
                                        </div>
                                        <button type="button" className="btn darkBtn roundedBtn w-100">Upload</button>

                                      <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Permission Details</span></div>

                                    <div className="form-group">
                                        <label className="pl-3">Designation <span>*</span></label>
                                        <select title="Select feedback for" className="input-field form-control">

                                            <option>Librarian</option>
                                        {
                                            AUTH_USER.account_type == 'admin' ?
                                            <option>Senior Librarian</option>
                                            :null
                                        }
                                            
                                            
                                        </select>
                                    </div>

                                    <div className="form-head mb-3">
                                <span className="bg-white d-inline-block px-3">Authorize duties</span>
                                </div>
                             
                                <div className="form-group">
                                    <label>Digital Rights Management</label>
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="drm_assign" />
                                        <label for="drm_assign" className="">Assign</label>
                                    </div>
                                
                                    
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="drm_view" />
                                        <label for="drm_view">View</label>
                                    </div>
                                   
                                </div>
                                <div className="form-group">
                                    <label>Contents</label>
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="content_add" />
                                        <label for="content_add" className="">Add</label>
                                    </div>
                                
                                    
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="content_edit" />
                                        <label for="content_edit">Edit</label>
                                    </div>
                                   
                                    
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="content_suspend" />
                                        <label for="content_suspend">Suspend</label>
                                    </div> 
                                    
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="content_view" />
                                        <label for="content_view">View</label>
                                    </div>
                                </div>

                                
                                <div className="form-group">
                                    <label>Readers</label>
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="readers_add" />
                                        <label for="readers_add" className="">Create</label>
                                    </div>
                                
                                    
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="readers_invite" />
                                        <label for="readers_invite">Invite</label>
                                    </div>
                                    
                                    
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="readers_remove" />
                                        <label for="readers_remove">Remove</label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Allowed Reports</label>
                                    <div className="custom-checkbox">
                                        <input type="checkbox" id="reports_view" />
                                        <label for="reports_view" className="">View</label>
                                    </div>
                                    </div>
                                


                                
                                   
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                            <Link to="/staff-list" type="button" className="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                            <button type="button" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
