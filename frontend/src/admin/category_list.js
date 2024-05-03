import React from 'react';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
const funcObj = new Functions();

class CategorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            default_categories: [],
            per_page_limit: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            category: '',
            category_id: '',
            sub_category_id: '',
            sub_category_name: '',
            category_name: '',
            category_image: '',
            subcategory: '',
            show_confirm: false,
            showmoredetail: false,
            subctyshow: false,
            categoryIcon:null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubcategorySubmit = this.handleSubcategorySubmit.bind(this);

    }
    componentDidMount() {
        this.getCategories();
    }
    MoreDetailConfirm() {
        this.setState({ showmoredetail: !this.state.showmoredetail });
    }
    subcategoryModal() {
        this.setState({ subctyshow: !this.state.subctyshow });
    }
    handleCategory(category) {
        this.setState({
            "category_id": category.category_id,
            "category_name": category.category_name,
            "category_image": category.category_image,
        });
        console.log('category image  ' +this.state.category_image)
        this.MoreDetailConfirm();
    }
    handleSubcategory(category, id) {
        this.setState({
            "category_id": id,
            "sub_category_name": category.sub_category_name,
            "sub_category_id": category.sub_category_id
        });
        this.subcategoryModal();
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.category_name == "" || this.state.category_name == undefined) {
            funcObj.custom_alert_message('Please enter category!');
            return false;
        } else {
            if (this.state.categoryIcon && this.state.categoryIcon!=null) {
                let filesize = this.state.categoryIcon;
                if(filesize.size != 0){
                const calculated_size = filesize.size /1024;
                console.log('calculated_size',calculated_size)
                if ( calculated_size >= 100) {
                    funcObj.custom_alert_message('File size should be greater than 100kb');
                  
                    return false;
                }
             }
            }
            if (this.state.category_id) {
                this.editCategory();
            }else {
                this.addCategory();
            }
        }


    }
    addCategory = () => {
        let postBodyData = {
            "category_name": this.state.category_name,
            "category_title_s": this.state.category_name,
            "category_title_p": this.state.category_name,
            "image_cover":this.state.categoryIcon
        };

       
        
        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'add-category';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                console.log(data)
                // Swal.fire({
                //     title: 'Success',
                //     text: data.message,
                //     icon: 'success',
                //     showConfirmButton: false,
                // });
                // this.setState({
                //     category_name: '',
                //     category_title_s: '',
                //     category_title_p: ''
                // });
                return funcObj.redirectPage("category-list");
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    editCategory = () => {
        let postBodyData = {
            "category_id": this.state.category_id,
            "category_title_s": this.state.category_name,
            "image_cover":this.state.categoryIcon
        };

        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'edit-category';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                console.log(data)
                // Swal.fire({
                //     title: 'Success',
                //     text: data.message,
                //     icon: 'success',
                //     showConfirmButton: false,
                // });
                // this.setState({
                //     category_name: '',
                //     category_title_s: '',
                //     category_title_p: ''
                // });
                return funcObj.redirectPage("category-list");
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    handleChange(event) {
        // funcObj.custom_alert_message(event.target.value);
        if (event.target.name == 'myFile' || event.target.name == 'categoryIcon'
            || event.target.name == 'indexImage' || event.target.name == 'otherImage') {
            // console.log(event.target.files[0])
            if (event.target.files[0]) {
                const imageFile = event.target.files[0];
                if (event.target.name == 'categoryIcon'
                    || event.target.name == 'indexImage' || event.target.name == 'otherImage') {
                    if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
                        funcObj.custom_alert_message('Please select valid image.');
                        event.target.value = null;
                        return false;
                    }
                }

                if (event.target.name == 'myFile') {
                    if (!imageFile.name.match(/\.(pdf|webm|mp4|mpeg|epub|ogv|mp3|jpg|png|docx|PDF|WEBM|MP4|MPEG|EPUB|OGV|MP3|JPG|PNG|DOCX)$/)) {
                        funcObj.custom_alert_message('Please select valid file.');
                        event.target.value = null;
                        return false;
                    }
                }
                if (event.target.name == 'categoryIcon') {
                    this.getBase64(imageFile)
                        .then(result => {
                            imageFile["base64"] = result;
                            this.setState({
                                coverimgSrc: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else if (event.target.name == 'indexImage') {
                    this.getBase64(imageFile)
                        .then(result => {
                            imageFile["base64"] = result;
                            this.setState({
                                indeximgSrc: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });

                } else if (event.target.name == 'otherImage') {
                    this.getBase64(imageFile)
                        .then(result => {
                            imageFile["base64"] = result;
                            this.setState({
                                otherimgSrc: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }

                this.setState({
                    [event.target.name]: event.target.files[0]
                })
            } else {
                if (event.target.name == 'categoryIcon') {
                    this.setState({ coverimgSrc: '' });
                } else if (event.target.name == 'indexImage') {
                    this.setState({ indeximgSrc: '' });
                } else if (event.target.name == 'otherImage') {
                    this.setState({ otherimgSrc: '' });
                }
                this.setState({
                    [event.target.name]: null
                })
            }

        } else {
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name]: event.target.value
            })
        }
    }
    getBase64 = (file) => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object
                // console.log("Called", reader);
                baseURL = reader.result;
                // console.log(baseURL);
                resolve(baseURL);
            };
            //   console.log(fileInfo);
        });
    };
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getCategories();
    }
    handleSubcategorySubmit(event) {
        event.preventDefault();

        if (this.state.sub_category_name == "" || this.state.sub_category_name == undefined) {
            funcObj.custom_alert_message('Please enter subcategory!');
            return false;
        }

        if (this.state.sub_category_id) {
            this.editsubCategory();
        }
        else {
            this.addsubCategory();
        }
    }
    addsubCategory = () => {


        let postBodyData = {
            "category_id": this.state.category_id,
            "sub_category_name": this.state.sub_category_name,
            "sub_category_title_s": this.state.sub_category_name,
            "sub_category_title_p": this.state.sub_category_name,
        };

        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'add-sub-category';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                console.log(data)
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                });
                this.setState({
                    category_name: '',
                    category_title_s: '',
                    category_title_p: ''
                });
                return funcObj.redirectPage("category-list");
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    editsubCategory = () => {

        let postBodyData = {
            "sub_category_id": this.state.sub_category_id,
            "category_id": this.state.category_id,
            "sub_category_title_s": this.state.sub_category_name,

        };

        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'edit-sub-category';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                console.log(data)
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                });
                this.setState({
                    category_name: '',
                    category_title_s: '',
                    category_title_p: ''
                });
                return funcObj.redirectPage("category-list");
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    default_categories: data.data,
                    // total_records:  data.data.categories.total,
                });

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Content Categories</h3>
                            <div className="float-right">
                                <div className="add-btn-wrap" >
                                <span className="add-icon">+</span>
                                    <button onClick={(e) => this.handleCategory('')} className="btn darkBtn">Add New Category</button>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <ul className='col-md-12 ul-li'>
                                {
                                    this.state.default_categories && Object.keys(this.state.default_categories).length > 0 ?
                                        this.state.default_categories.map((category, index) => {
                                            const value = this.state.category + category.category_id ? this.state.category + category.category_id : category.category_name;
                                            let subcty = '';
                                            return (
                                                <React.Fragment>
                                                    <li>
                                                        <div className="">
                                                            <button type="button" class="btn btn-xs btn-custom" onClick={(e) => this.handleCategory(category)}><i class="fa fa-2x fa-edit"></i></button>
                                                            <label className='curptr' title='Manage subcategories' data-toggle="collapse" data-target={`#category` + category.category_id} htmlFor={`#category` + category.category_id} aria-controls="collapseOne">
                                                                {category.category_name}
                                                            </label>

                                                        </div>


                                                        <ul className={"collapse"} id={`category` + category.category_id} data-parent="#accordion">
                                                            <li className='row'>
                                                                {
                                                                    category.subcategories.map((subcty, index) => {
                                                                        return (
                                                                            <div class="col-sm-4">
                                                                                <span>
                                                                                    <button type="button" class="btn btn-xs btn-custom" onClick={(e) => this.handleSubcategory(subcty, category.category_id)}><i class="fa fa-2x fa-edit"  ></i></button>
                                                                                    {subcty.sub_category_name}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                                <div class="col-sm-4">
                                                                    
                                                                    <div className="add-btn-wrap" >
                                <span className="add-icon">+</span>
                                    <button  onClick={(e) => this.handleSubcategory(subcty, category.category_id)} className="btn darkBtn">Add New Subcategory</button>
                                </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </React.Fragment>
                                            );
                                        })
                                        : null
                                }
                            </ul>
                            <Modal show={this.state.showmoredetail} onHide={() => this.MoreDetailConfirm()}>
                                <Modal.Header closeButton>Category</Modal.Header>
                                <Modal.Body>
                                    <form id="geniusform">
                                        <div className="row">
                                            <div className="col-offset-lg-3 col-lg-6">
                                                <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Category</span></div>
                                                <div className="form-group">
                                                    <label className="pl-3"> Category Title </label>

                                                    <input type="hidden" className="input-field form-control" value={this.state.category_id} onChange={this.handleChange} placeholder="Enter Category title" name="category_id" />
                                                    <input type="text" className="input-field form-control" value={this.state.category_name} onChange={this.handleChange} placeholder="Enter Category title" name="category_name" />
                                                    <div className="form-group">
                                                        <div className="drop-zone-wrap p-2">
                                                            <div className="drop-zone">
                                                              
                                                                <img style={{ marginRight: 20, width: 100, height: 100 }} src={this.state.category_image} />
                                                                {(this.state.coverimgSrc) ? <img style={{ marginRight: 20, width: 100, height: 100 }} src={this.state.coverimgSrc} />
                                                                    : null}
                                                                <input type="file" onChange={this.handleChange} name="categoryIcon" className="drop-zone__input1" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group clearfix">
                                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png</small>
                                                            <small className="d-block float-right">Single Images Only</small>
                                                        </div>
                                                        {/* <button type="button" className="btn darkBtn roundedBtn w-100">Upload</button> */}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <button type="button" onClick={(e) => this.handleSubmit(e)} className="btn addCart py-1 px-3 mr-1">Save</button>
                                        </div>


                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={() => this.MoreDetailConfirm()}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal show={this.state.subctyshow} onHide={() => this.subcategoryModal()}>
                                <Modal.Header closeButton>Sub Category</Modal.Header>
                                <Modal.Body>
                                    <form id="geniusform" onSubmit={this.handleSubcategorySubmit}>
                                        <div className="row">
                                            <div className="col-offset-lg-3 col-lg-6">
                                                <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Sub Category</span></div>
                                                <div className="form-group">
                                                    <label className="pl-3"> Category </label>
                                                    <select value={this.state.category_id} onChange={this.handleChange} name="category_id" data-style="rounded-pill" className=" form-control icon-arrow" >
                                                        {

                                                            this.state.default_categories && Object.keys(this.state.default_categories).length > 0 ?

                                                                this.state.default_categories.map((category, index) => {
                                                                    let selected = (category.category_id == this.state.category_id) ? "selected" : '';
                                                                    return (
                                                                        <option value={category.category_id} {...category.category_id == this.state.category_id ? "selected" : ''}>{category.category_name}</option>
                                                                    );
                                                                })
                                                                : null
                                                        }
                                                    </select>
                                                    <label className="pl-3"> Sub Category Title </label>
                                                    <input type="hidden" className="input-field form-control" value={this.state.sub_category_id} onChange={this.handleChange} placeholder="Enter Category title" name="sub_category_id" />
                                                    <input type="text" className="input-field form-control" value={this.state.sub_category_name} onChange={this.handleChange} placeholder="Enter Category title" name="sub_category_name" />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                                        </div>


                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={() => this.subcategoryModal()}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                            <div className="table-bottom-content">
                                {/* <button type="button" className="btn lightBtn">Delete Selected</button> */}
                                {/* <nav aria-label="Page navigation">
                                    <Pagination
                                        activePage={this.state.current_page}
                                        itemsCountPerPage={this.state.per_page_limit}
                                        totalItemsCount={this.state.total_records}
                                        onChange={this.handlePageChange.bind(this)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                    />
                                </nav>
                                <div className="table__data">
                                    Showing  {Object.keys(this.state.default_categories).length} of {this.state.total_records}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default CategorList;