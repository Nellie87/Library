import React from 'react';
import { Link } from 'react-router-dom';
// import DRMSettings from '../drm/settings';
import Swal from "sweetalert2";
import Functions from '../../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class AddVendor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            mobile: '',
            address: '',
            vendor_id: ''
        };
        // console.log(this.state.setMaxDate)
        this.onChangeClassValue = this.onChangeClassValue.bind(this);
        this.onChangeCategoriesValue = this.onChangeCategoriesValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let vendor_id = funcObj.get_query_string('vendor_id');
        if (vendor_id) {
            
            this.getvendor();
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
        let vendor_id = funcObj.get_query_string('vendor_id');
        if (vendor_id) {
            this.editvendor();
        } else {
            this.AddVendor();
        }

    }


    AddVendor = () => {


        let postBodyData = {
            "name": this.state.name,
            "email": this.state.email,
            "mobile": this.state.mobile,
            "address": this.state.address,
        };

        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'create-vendor';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                console.log(data)
              
                funcObj.custom_alert_message(data.message,'success',"vendor-management")
                this.setState({
                    name: '',
                    email: '',
                    mobile: '',
                    address: '',
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

    editvendor = () => {
        let vendor_id = funcObj.get_query_string('vendor_id');
        let postBodyData = {
            'vendor_id': vendor_id,
            "name": this.state.name,
            "email": this.state.email,
            "mobile": this.state.mobile,
            "address": this.state.address,
        };

        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'edit-vendor';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                console.log(data)
                funcObj.custom_alert_message(data.message,'success',"vendor-management")
                 
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

    getvendor = () => {
        let vendor_id = funcObj.get_query_string('vendor_id');
        let postBodyData = {
            'vendor_id': vendor_id
        };
        let endPoint = 'vendor-detail';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // let listdata = JSON.stringify(data);
            console.log(endPoint + ' response', data.data.name)

            if (data.code == 200) {

                this.setState({
                    vendor_id: data.data.vendors_id,
                    name: data.data.name,
                    email: data.data.email,
                    mobile: data.data.phone,
                    address: data.data.address,
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
        console.log('name' + this.state.name);
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                {/* <h3 className="dashboard-title title-margin my-2 float-left">Content</h3> */}
                            </div>
                            <div className="row">
                                <div className="col-sm-offset-3 col-sm-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Add Vendor</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">Name  </label>
                                        <input type="text" className="input-field form-control" value={this.state.name} onChange={this.handleChange} placeholder="Enter Vendor Name" name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Email</label>
                                        <input type="text" className="input-field form-control" value={this.state.email} onChange={this.handleChange} placeholder="Enter Vendor Email" name="email" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Mobile</label>
                                        <input type="number" className="input-field form-control" value={this.state.mobile} onChange={this.handleChange} placeholder="Enter Vendor Mobile" name="mobile" maxLength={12}/>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Address</label>
                                        <input type="text" className="input-field form-control" value={this.state.address} onChange={this.handleChange} placeholder="Enter Vendor Address" name="address" />
                                    </div>
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
