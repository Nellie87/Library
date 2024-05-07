import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class AddContent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Content</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 after_line_h100">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3"> Book  Details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">Book Title  </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Book Title" name="Title" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Book Subtitle </label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Book Subtitle" name="Subtitle" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Description</label>
                                        <textarea type="text" className="input-field form-control mb-0" placeholder="Enter Book Description" name="Description" ></textarea>
                                        <small className="text-right d-block">0 out of 300 words</small>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-12 col-md-6">
                                            <div className="form-group">
                                                <label className="pl-3">Choose Publisher</label>
                                                <select data-style="rounded-pill" className="selectpicker form-control icon-arrow">
                                                    <option selected >Select Publisher</option>
                                                    <option>Publisher</option>
                                                    <option>Publisher</option>
                                                    <option>Publisher</option>
                                                    <option>Publisher</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-6">
                                            <div className="form-group">
                                                <label className="pl-3">Choose Author</label>
                                                <select data-style="rounded-pill" className="selectpicker form-control icon-arrow">
                                                    <option selected>Select Author</option>
                                                    <option>Author</option>
                                                    <option>Author</option>
                                                    <option>Author</option>
                                                    <option>Author</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Tags</label>
                                        <input type="text" className="input-field form-control" placeholder="Add tags" name="Addtags" />
                                    </div>
                                    <div className="form-head mb-3 clearfix">
                                        <span className="bg-white d-inline-block px-3">Allow to Sale <small>(If not enabled, Book will be Marked Free)</small> </span>
                                        <span className="bg-white d-inline-block pl-3 float-right">
                                            <label className="switch">
                                                <input type="checkbox" id="price" />
                                                <span className="slider round"></span>
                                            </label>
                                        </span>
                                    </div>
                                    <div className="price-container  w-100">
                                        <div className="price-wrap w-100">
                                            <label className="pl-3">Price</label>
                                            <div className="form-group">
                                                <select data-style="rounded-pill" className="selectpicker form-control">
                                                    <option selected>USD</option>
                                                    <option>INR</option>
                                                    <option>EUR</option>
                                                    <option>AFN</option>
                                                    <option>AUD</option>
                                                </select>
                                                <input type="text" className="input-field form-control" placeholder="Enter Price" name="Price" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-head mb-3  clearfix">
                                            <span className="bg-white d-inline-block px-3">Content Preferences</span>
                                        </div>
                                        <label className="pl-3">Select Content Classes <small>(You can Select only one class)</small> </label>
                                        <div className="custom-radio text-center">
                                            <input type="radio" name="radio1" id="ebooks" />
                                            <label For="ebooks">E-Books</label>
                                            <input type="radio" name="radio1" id="audio" />
                                            <label For="audio">Audio Books</label>
                                            <input type="radio" name="radio1" id="video" />
                                            <label For="video">Video Books</label>
                                            <input type="radio" name="radio1" id="slides" />
                                            <label For="slides">Slides</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Select Content Categories <small>(You can Select multiple categories)</small> </label>
                                        <select multiple data-style="rounded-pill" className="selectpicker form-control icon-arrow">
                                            <option>Categories</option>
                                            <option>Categories</option>
                                            <option>Categories</option>
                                            <option>Categories</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6 ">
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
                                    </div>
                                   
                                    <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Index Image</span>
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
                                    </div>
                                    <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Other Images</span>
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
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <Link to="/content-list" type="button" className="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                                <button type="button" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
