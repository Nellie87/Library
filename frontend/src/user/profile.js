import React from 'react';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
export default class ReaderProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            dob: "",
            in: "",
            address: "",
            city: "",
            mobile: "",
            email: "",
            affiliation: "",
            image: "",
            base64URL: "",
            intrest: {},
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
            imgSrc: '',
            state: '',
            country: '',
            post_code: '',
            city_list: [],
            country_list: [],
            state_list: [],
            countryId: "",
            stateId: "",
            year: 1900,
            month: 1,
            date: 1
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);

    }

    componentDidMount() {
        this.getMyProfile();
    }

    getMyProfile() {
        let postBodyData = "";
        let endPoint = 'user-myprofile';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
                console.log(response.data);
                this.getCountry();
                let dob = response.data.dob.split('-');
                this.setState({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    dob: (response.data.dob == "null") ? '' : response.data.dob,
                    year: parseInt(dob[0]),
                    month: parseInt(dob[1]),
                    date: parseInt(dob[2]),
                    in: (response.data.identification_number == "null") ? '' : response.data.identification_number,
                    address: (response.data.address == "null") ? '' : response.data.address,
                    city: (response.data.city == "null") ? '' : response.data.city,
                    mobile: (response.data.mobile == "null") ? '' : response.data.mobile,
                    email: response.data.email,
                    affiliation: (response.data.affiliation == "null") ? '' : response.data.affiliation,
                    image: response.data.profile_image,
                    state: (response.data.state == "null") ? '' : response.data.state,
                    country: (response.data.country == "null") ? '' : response.data.country,
                    post_code: (response.data.post_code == "null") ? '' : response.data.post_code,
                    imgSrc: response.data.profile_image
                })
                //    this.state.dob.split("/");
                console.log('year ', dob[1]);
            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getCity(cityId) {
        let postBodyData = "";
        let endPoint = 'common/city-new?state_id=' + cityId;
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
                console.log(response.data);
                this.setState({
                    city_list: (response.data) ? response.data : []
                })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getCountry() {
        let postBodyData = "";
        let endPoint = 'common/country';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
                let countryId;
                if (this.state.country) {
                    countryId = response.data.find(data => data.name == this.state.country);
                    if (countryId) {
                        if(countryId != undefined && countryId.id != undefined){
                        countryId = countryId.id;
                        // this.getCity(countryId);
                        this.getState(countryId);
                        }
                    }

                } else {
                    countryId = ""
                }

                this.setState({
                    country_list: (response.data) ? response.data : [],
                    countryId: countryId
                })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getState(stateId) {
        let postBodyData = "";
        let endPoint = 'common/state?country_id=' + stateId;
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
                console.log(response.data);
                let stateId;
                if (this.state.state) {
                    stateId = response.data.find(data => data.name == this.state.state);
                    if (stateId) {
                        stateId = stateId.id;
                        this.getCity(stateId);
                    }

                } else {
                    stateId = ""
                }
                this.setState({
                    state_list: (response.data) ? response.data : [],
                    stateId: stateId
                })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    onChangeCategoriesValue(event) {
        var category_id = event.target.value;
        funcObj.custom_alert_message(category_id)
        //     var intrest = {...this.state.intrest}
        //     if (event.target.checked) {
        //         intrest[category_id] = 1;
        //     } else {
        //         delete intrest.[category_id];
        //     }
        //   this.setState({ intrest });

    }
    handleSubmit(event) {
        event.preventDefault();
        let phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        let emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (this.state.first_name == "") {
            funcObj.custom_alert_message("Please enter first name!");
            return false;
        }
        if (this.state.last_name == "") {
            funcObj.custom_alert_message("Please enter last name!");
            return false;
        }
     
        if (this.state.dob == '' || this.state.dob == null || this.state.dob == 'null') {
            funcObj.custom_alert_message("Please select dob date!");
            return false;
        }
        if (new Date(this.state.dob).getTime() >= new Date().getTime()) {
            funcObj.custom_alert_message("Birthdate should be less than or equal to current date!");
            return false;
        }
      
        console.log(this.state.intrest);
        let postBodyData = {
            "first_name": this.state.first_name,
            "middle_name": "",
            "last_name": this.state.last_name,
            "gender": "",
            "dob":  this.state.year+"/"+this.state.month+"/"+this.state.date,
            "address": this.state.address,
            "city": this.state.city,
            "identification_number": this.state.in,
            "country_code": "",
            "affiliation": this.state.affiliation,
            "area_of_interest": this.state.intrest,
            "user_image": this.state.base64URL,
            "state": this.state.state,
            "country": this.state.country,
            "post_code": this.state.post_code
        };
        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'user-myprofile-update';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {

                Swal.fire({
                    title: 'Success',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })
                this.setState({
                    first_name: data.data.first_name,
                    last_name: data.data.last_name,
                    dob: (data.data.dob == "null") ? '' : data.data.dob,
                    in: (data.data.identification_number == "null") ? '' : data.data.identification_number,
                    address: (data.data.address == "null") ? '' : data.data.address,
                    city: (data.data.city == "null") ? '' : data.data.city,
                    mobile: (data.data.mobile == "null") ? '' : data.data.mobile,
                    email: (data.data.email == "null") ? '' : data.data.email,
                    affiliation: (data.data.affiliation == "null") ? '' : data.data.affiliation,
                    image: data.data.profile_image,
                    imgSrc: "",
                    state: (data.data.state == "null") ? '' : data.data.state,
                    country: (data.data.country == "null") ? '' : data.data.country,
                    post_code: (data.data.post_code == "null") ? '' : data.data.post_code,
                })


                funcObj.updateAuthUser('profile_image', data.data.profile_image);
                funcObj.updateAuthUser('first_name', data.data.first_name);
                funcObj.updateAuthUser('last_name', data.data.last_name);
                funcObj.updateAuthUser('username', data.data.first_name + " " + data.data.last_name);
                if(document.getElementById('user_name')){
                    document.getElementById('user_name').value = data.data.first_name + " " + data.data.last_name;
                }
                if(document.getElementById("user_img")){
                    document.getElementById("user_img").src = data.data.profile_image;
                }
                if(document.getElementById("tempProfileImg")){
                    document.getElementById("tempProfileImg").src = data.data.profile_image;
                }
                // window.location.reload();

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

    handleChange(event) {

        if (event.target.name == 'image') {
            if (event.target.files[0]) {
                const imageFile = event.target.files[0];
                if (event.target.name == 'image') {
                    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
                        funcObj.custom_alert_message('Please select valid image.');
                        event.target.value = null;
                        this.setState({
                            base64URL: "",
                        });
                        return false;
                    }
                }
                let file = event.target.files[0];
                this.getBase64(file)
                    .then(result => {
                        file["base64"] = result;
                        // console.log("File Is", file);
                        const strImage = result.replace(/^data:image\/[a-z]+;base64,/, "");
                        this.setState({
                            base64URL: strImage,
                            imgSrc: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                // this.setState({
                //     [event.target.name]: event.target.files[0]
                // })
            } else {
                this.setState({
                    base64URL: "",
                    imgSrc: ""
                })
            }

            // console.log(this.state.base64URL);

        } else if (event.target.name == "country") {
            console.log("event.target.value", event.target.value)
            if (event.target.value) {
                this.getCity(event.target.value);
                this.getState(event.target.value);
                let countryname = this.state.country_list.find(data => data.id == event.target.value);
                // console.log("countryname", countryname)
                this.setState({ country: countryname.name, countryId: event.target.value })
            } else {
                this.setState({ country: "", countryId: "", city_list: "", state_list: "", city: "", state: "" })
            }

        } else if (event.target.name == "state") {
            if (event.target.value) {
                this.getCity(event.target.value);
                let statename = this.state.state_list.find(data => data.id == event.target.value);
                // console.log("countryname", countryname)
                this.setState({ state: statename.name, stateId: event.target.value })
            } else {
                this.setState({ state: "", stateId: "", city_list: "", state_list: "", city: "" })
            }
        } else {
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name]: event.target.value
            })
        }

    }

    close = (event) => {
    }

    handleDeleteSubmit(event) {
        event.preventDefault();
        this.deleteUser()
    }

    deleteUser = () => {
        let endPoint = 'delete-user';
        let AUTH_USER = funcObj.getAuthUser();
        let postBodyData = {
            "user_id": [AUTH_USER.user.id]
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                funcObj.removeLocalStorage('user');
                window.location.href = funcObj.getSitePath("");
                // Swal.fire({
                //     title: 'Success',
                //     text: data.message,
                //     icon: 'success',
                //     showConfirmButton: false,
                // })

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
        console.log('Dob -', this.state.year);
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <h3 className="dashboard-title title-margin my-2 float-left">My Profile</h3>
                                    </div>
                                    <div className="col-lg-6" align="right">
                                        <button type="button" data-toggle="modal" data-target="#deleteModal" className="btn addCart py-1 px-3 mr-1 " >Delete Account</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Personal Details</span></div>
                                    <div className="form-group">
                                        <label className="pl-3">First Name  </label>
                                        <input type="text" className="input-field form-control" value={this.state.first_name} onChange={this.handleChange} placeholder="Enter Full Name" name="first_name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Last Name  </label>
                                        <input type="text" className="input-field form-control" value={this.state.last_name} onChange={this.handleChange} placeholder="Enter Full Name" name="last_name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Date of Birth </label>
                                        <div class="row">
                                            <div class="col-md-4">
                                            <select name="year" className="input-field form-control" value={this.state.year} onChange={this.handleChange} >
                                                <option>Year</option>
                                                {funcObj.year()}
                                            </select>
                                            </div>
                                            <div class="col-md-4">
                                            <select name="month" className="input-field form-control" value={this.state.month} onChange={this.handleChange}>
                                                <option>Month</option>
                                                {funcObj.month()}
                                            </select>
                                            </div>
                                            <div class="col-md-4">
                                            <select name="date" className="input-field form-control" value={this.state.date} onChange={this.handleChange}>
                                                <option>Date</option>
                                                {funcObj.date()}
                                            </select>
                                            </div>
                                        </div>
                                        
                                      

                                        {/* <input type="date" max={this.state.setMaxDate} className="input-field form-control" value={this.state.dob} onChange={this.handleChange} placeholder="Enter Date of Birth" name="dob" /> */}
                                    </div>

                                    <div className="form-group">
                                        <label className="pl-3">Identification Number</label>
                                        <input type="text" className="input-field form-control" value={this.state.in} onChange={this.handleChange} placeholder="Enter Identification Number" name="in" disabled />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Address</label>
                                        <input type="text" className="input-field form-control" value={this.state.address} onChange={this.handleChange} placeholder="Enter Address" name="address" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Country</label>
                                        {/* <input type="text" className="input-field form-control" value={this.state.country} onChange={this.handleChange} placeholder="Enter Country" name="country" /> */}
                                        <select title="Country" value={this.state.countryId} onChange={this.handleChange} className="input-field form-control" name="country">
                                            <option value="" >Select Country</option>
                                            {this.state.country_list.length > 0
                                                && this.state.country_list.map((item, i) => {
                                                    return (

                                                        (item.id == 113) ? <option key={i} value={item.id}>{item.name}</option> : null
                                                    )
                                                }, this)
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">State</label>
                                        {/* <input type="text" className="input-field form-control" value={this.state.state} onChange={this.handleChange} placeholder="Enter State" name="state" /> */}
                                        <select title="State" value={this.state.stateId} onChange={this.handleChange} className="input-field form-control" name="state">
                                            <option value="" >Select State</option>
                                            {this.state.state_list.length > 0
                                                && this.state.state_list.map((item, i) => {
                                                    return (
                                                        <option key={i} value={item.id}>{item.name}</option>
                                                    )
                                                }, this)
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">City/Town</label>
                                        {/* <input type="text" className="input-field form-control" value={this.state.city} onChange={this.handleChange} placeholder="Enter City" name="city" /> */}
                                        <select title="City/Town" value={this.state.city} onChange={this.handleChange} className="input-field form-control" name="city">
                                            <option value="" >Select City</option>
                                            {this.state.city_list.length > 0
                                                && this.state.city_list.map((item, i) => {
                                                    return (
                                                        <option key={i} value={item.name}>{item.name}</option>
                                                    )
                                                }, this)
                                            }
                                        </select>
                                    </div>


                                    <div className="form-group">
                                        <label className="pl-3">Post Code</label>
                                        <input type="text" className="input-field form-control" value={this.state.post_code} onChange={this.handleChange} placeholder="Enter Post Code" name="post_code" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Mobile </label>
                                        <input type="text" disabled className="input-field form-control" value={this.state.mobile} onChange={this.handleChange} placeholder="Enter Mobile Number" name="mobile" />
                                    </div>
                                    {/* <div className="form-group">
                                        <label className="pl-3">Address</label>
                                        <input type="text" className="input-field form-control" placeholder="Enter Complete Address" name="address" />
                                    </div> */}
                                    <div className="form-group">
                                        <label className="pl-3">Email</label>
                                        <input type="email" disabled className="input-field form-control" value={this.state.email} onChange={this.handleChange} placeholder="Enter Email Address" name="email" disabled />
                                    </div>

                                </div>
                                <div className="col-lg-6">
                                    <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Profile Image</span>
                                    </div>
                                    <div className="form-group">
                                        <div className="drop-zone-wrap p-2">
                                            <div className="drop-zone">
                                                {/* <span className="drop-zone__prompt mt-3">
                                                    <img src={funcObj.assets_path("/images/icons/photo-icon.svg")} width="50" className="mr-1" alt="Home" /><br></br>
                                                    Drag and Drop
                                                    <div>or</div>
                                                    <div className="color_blue">
                                                        Browse file
                                                    </div>
                                                    <small>Single image only</small>
                                                </span> */}
                                                <img  id="tempProfileImg" style={{ marginRight: 20, width: 100, height: 100 }} src={this.state.imgSrc} /> 
                                                <input type="file" onChange={this.handleChange} name="image" className="drop-zone__input1" />
                                            </div>
                                        </div>
                                        <div className="form-group clearfix">
                                            <small className="d-block float-left">Accepted Type : .jpg, .jpeg, .png</small>
                                            <small className="d-block float-right">Single image only</small>
                                        </div>
                                        {/* <button type="button" className="btn darkBtn roundedBtn w-100">Upload</button> */}
                                    </div>


                                    {/* <div className="form-head mb-3  clearfix">
                                        <span className="bg-white d-inline-block px-3">Other details</span>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Loans</label>
                                       
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Overdue</label>
                                        
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Borrowing</label>
                                        
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Reading</label>
                                        
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">History</label>  
                                    </div> */}

                                </div>
                            </div>
                            <div className="text-right">

                                <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog delete-modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Delete Account</h5>
                                <button type="button" onClick={this.close} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure want to delete account!
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.close} className="btn closedelete" data-dismiss="modal">Close</button>
                                <button type="button" onClick={this.handleDeleteSubmit} data-dismiss="modal" className="btn delete mr-2">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}
