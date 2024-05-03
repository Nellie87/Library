import React from 'react';
import { Link } from 'react-router-dom';
import DRMSettings from '../drm/settings';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class AddContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category_id: '',
            category_name: '',
            category_title_s: '',
            category_title_p: '',
            default_categories: []
        };
        // console.log(this.state.setMaxDate)
        this.onChangeClassValue = this.onChangeClassValue.bind(this);
        this.onChangeCategoriesValue = this.onChangeCategoriesValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getCategories();
        this.getcategory();

    }

    componentDidUpdate() {
        let book_id = funcObj.get_query_string('book_id');
        if (this.state.urlParam != book_id) {
            this.setState({
                class_id: '',
                categories: {},
                Title: '',
                Subtitle: '',
            })
            this.getClasses();
            this.getCategories();
        }
    }

    onChangeClassValue(event) {
        this.setState({ class_id: event.target.value });
    }
    onChangeCategoriesValue(event) {

        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.categories[value] = value; 
            this.state.categories.push(value);

        } else {
            var index = this.state.categories.indexOf(event.target.value)
            if (index !== -1) {
                this.state.categories.splice(index, 1);

            }
        }

    }

    // Method causes to store all the values of the 
    // input field in react state single method handle 
    // input changes of all the input field using ES6 

    // javascript feature computed property names
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value
        });


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

    handleOnchangeSource(e) {
        const opt_val = e.target.value;
        const source_childs = document.getElementsByClassName('source_childs');
        for (var i = 0; i < source_childs.length; i++) {
            source_childs[i].classList.add('d-none');

        }
        document.getElementById(opt_val).classList.remove('d-none');
    }

    handleSubmit(event) {
        event.preventDefault();
        let category_id = funcObj.get_query_string('category_id');
        if (category_id) {
            this.editContent();
        } else {
            this.addContent();
        }

    }
    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    default_categories: data.data
                });

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

    addContent = () => {


        let postBodyData = {
            "category_id": this.state.category_id,
            "sub_category_name": this.state.category_title_s,
            "sub_category_title_s": this.state.category_title_s,
            "sub_category_title_p": this.state.category_title_s,
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
                return funcObj.redirectPage("sub-category-list");
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

    editContent = () => {
        let sub_category_id = funcObj.get_query_string('category_id');
        let postBodyData = {
            "sub_category_id": sub_category_id,
            "category_id": this.state.category_id,
            "sub_category_name": this.state.category_title_s,
            "sub_category_title_s": this.state.category_title_s,
            "sub_category_title_p": this.state.category_title_s,
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
                return funcObj.redirectPage("sub-category-list");
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

    getcategory = () => {
        let sub_category_id = funcObj.get_query_string('category_id');
        let postBodyData = {
            'sub_category_id': sub_category_id
        };
        let endPoint = 'get-sub-category';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // console.log(endPoint + ' response', data)
            if (data.code == 200) {

                console.log("detail", data.data.sub_category_title_s);
                this.setState({
                    category_id: data.data.category_id,
                    category_title_s: data.data.sub_category_title_s,
                })
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

    render() {
        console.log('sub category title', this.state.category_title_s)
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                {/* <h3 className="dashboard-title title-margin my-2 float-left">Content</h3> */}
                            </div>
                            <div className="row">
                                <div className="col-lg-offset-3 col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Add Sub Category</span></div>
                                    <label className="pl-3"> Category</label>
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
                                    {/* <div className="form-group">
                                        <label className="pl-3">Sub Category Name  </label>
                                        <input type="text" className="input-field form-control" value={this.setState.category_name} onChange={this.handleChange} placeholder="Enter Content Title" name="category_name" />
                                    </div> */}
                                    <div className="form-group">
                                        <label className="pl-3">Sub Category Title </label>
                                        <input type="text" className="input-field form-control" value={this.state.category_title_s} onChange={this.handleChange} placeholder="Enter Sub Category title" name="category_title_s" />
                                    </div>
                                    {/* <div className="form-group">
                                        <label className="pl-3">Sub Category Title p </label>
                                        <input type="text" className="input-field form-control" value={this.setState.category_title_p} onChange={this.handleChange} placeholder="Enter Content Edition" name="category_title_p" />
                                    </div> */}
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
