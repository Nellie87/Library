import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class AddAuthors extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Add Authors</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> Authors Details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">Full name <span>*</span> </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Author name" name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Phone Number<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="Enter phone Number" name="phone" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Address<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="plot/landmark/city/state" name="address" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Hieghest Qualification<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="M.tech CSE" name="qualification" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Experience<span>*</span></label>
                                        <input type="text" className="input-field form-control" placeholder="3 years" name="experience" />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="pl-3">Allow Publication Types<span>*</span></label>
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
                                        <label className="pl-3">Allow Publication Categories<span>*</span></label>
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
                            <Link to="/users-list" type="button" class="btn lightBtn go_back_btn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                            <button type="button" class="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
