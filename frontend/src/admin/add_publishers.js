import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class AddPublishers extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Add Content providers</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> Content providers details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3"> name <span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter  name" name="name" />
                                    </div>
                                    <div className="form-group">
                                <label className="pl-3">Content Sources</label>
                                <select  className="input-field form-control">
                              {funcObj.getContentSourcesDropdown()}
                              </select>
                            </div>
                                    <div className="form-group">
                                        <label className="pl-3">Registration Number<span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Mobile Number" name="reg_no" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Office address<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="plot/landmark/city/state" name="address" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Office Telephone<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="Enter phone Number" name="phone" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Allow Types<span>*</span></label>
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="types[]" id="EBooks" checked value="E-Books" />
                                                        <label htmlFor="EBooks">E-Books</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="types[]" id="AudioBooks" value="Audio-Books" />
                                                        <label htmlFor="AudioBooks">Audio-Books</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="types[]" id="VideoBooks" value="Video-Books" />
                                                        <label htmlFor="VideoBooks">E-Books</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="types[]" id="Sliders" value="Sliders" />
                                                        <label htmlFor="Sliders">Sliders</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Allow Categories<span>*</span></label>
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="categories[]" id="Sports" checked value="Sports" />
                                                        <label htmlFor="Sports">Sports</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="categories[]" id="Entertainment" value="Entertainment" />
                                                        <label htmlFor="Entertainment">Entertainment</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="categories[]" id="Musics" value="Musics" />
                                                        <label htmlFor="Musics">Musics</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name="categories[]" id="Politics" value="Politics" />
                                                        <label htmlFor="Politics">Politics</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> Owner Details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">Owner name <span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Owner name" name="owner_name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Owner Contact Number<span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Mobile Number" name="owner_mobile" />
                                    </div>

                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> Contact Person Details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">Contact Person name <span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Owner name" name="contact_name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Contact Person phone<span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Mobile Number" name="contact_mobile" />
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
                            <Link to="/publishers-list" type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                            <button type="button" class="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
