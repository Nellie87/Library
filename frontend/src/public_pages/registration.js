import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import ReCAPTCHA from "react-google-recaptcha";

import Swal from 'sweetalert2';
import NewsLetter from './newsLetter';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_type: "reader",
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            identification_number: "",
            address: "",
            city: "",
            mobile: "",
            email: "",
            password: "",
            cpassword: "",
            dob: "",
            gender: "",
            countryId: '',
            authentication: false,
            year: 1900,
            month: 1,
            date: 1,
            city_list: [],
            country_list: [],
            state_list: [],
            isPasswordShown: false,
            isconfirmPasswordShown: false,
            identification_type:'',
            start_year:1900,
            end_year:funcObj.get_adult_dob_end_year(),
            registration_message:"",
            errors: {},
            input_errors:{}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validatePasswordRule = this.validatePasswordRule.bind(this);
        this.validateIdentification = this.validateIdentification.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.checkMobileExistence = this.checkMobileExistence.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
    }
    componentDidMount() {
        this.getCountry();
       
    }
    componentDidUpdate(){
        // funcObj.custom_alert_message(this.state.isPasswordShown);
        if(this.state.isPasswordShown!=false){
            setTimeout(this.password, 100000000);
        }
        
        if(this.state.isconfirmPasswordShown!=false){
            setTimeout(this.confirmpassword, 100000000);
          
        }
    }
    password =()=>{
        this.setState({
            isPasswordShown:false 
        })
    }
    confirmpassword =()=>{
        this.setState({
            isconfirmPasswordShown:false 
        })
    }
    togglePasswordVisiblity = () => {
        const { isPasswordShown } = this.state;
        this.setState({ isPasswordShown: !isPasswordShown });
    }
    togglecPasswordVisiblity = () => {
        const { isconfirmPasswordShown } = this.state;
        this.setState({ isconfirmPasswordShown: !isconfirmPasswordShown });
    }
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
        }else {
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name]: event.target.value
            })
        }
        this.setState({
            dob: this.state.year + '/' + this.state.month + '/' + this.state.date
        })
        console.log('data', this.state.year);

    }

    handleRadio(event){
        let start_year =1900;
        let end_year = this.state.end_year;
        if(event.target.value == 'junior_reader'){
            start_year =funcObj.get_junior_dob_start_year();
            end_year = new Date().getFullYear();
        }else{
            end_year = funcObj.get_adult_dob_end_year();
        }
     
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value,
            start_year:start_year,
            end_year:end_year
        })
    }

    validateIdentification(event){
        event.preventDefault();
        // alert(this.state.identification_number);
        if(isNaN(this.state.identification_number) && this.state.identification_type==1){
            return this.returnError('identification_number',"Identification number should be numeric");
        }
        else if(!isNaN(this.state.identification_number) && this.state.identification_type==2){
            return this.returnError('identification_number',"please check passport number");
        }else{
            this.returnNoError('identification_number');
        }
      
        
    }
    validatePasswordRule(event){
        event.preventDefault();
        let postBodyData = {
            'password':event.target.value
        };
        let endPoint = 'check-valid-password';
      
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                this.setState({
                    [event.target.name]: event.target.value
                })
                this.returnNoError('password');
            } else if (data.code == 201) {
                return this.returnError('password',data.message);
            }
        });
    }

    
    validateEmail(event){
        event.preventDefault();
        let postBodyData = {
            'email':event.target.value
        };
        let endPoint = 'check-valid-email';
      
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                this.setState({
                    [event.target.name]: event.target.value
                })
                this.returnNoError('email');
            } else if (data.code == 201) {
                return this.returnError('email',data.message);
            }
        });
    }

    
    checkMobileExistence(event){
        event.preventDefault();
        if(this.state.user_type == 'junior_reader'){
            this.setState({
                [event.target.name]: event.target.value
            })
        }else{        
        let postBodyData = {
            mobile:event.target.value
        };
        let endPoint = 'check-mobile-existence';
      
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                this.setState({
                    [event.target.name]: event.target.value
                })
                this.returnNoError('mobile');
            } else if (data.code == 201) {
                return this.returnError('mobile',data.message);
            }
        });
    }
    }

    checkDobValidation(e){
        e.preventDefault();
        funcObj.checkDobValidation(this.state.year,this.state.month,this.state.date)
    }
    checkValidMobile(event){
        var val =  event.target.value
        if (isNaN(val)) {
            return this.returnError('mobile',"Mobile should be only numeric!");
        }
        else if(/^\d{10}$/.test(val) == false) {            
            return this.returnError('mobile',"Please enter a valid phone number.");
        }
        
        this.checkMobileExistence(event);
        
    }

    checkUserType(event){
        event.preventDefault();
        const user_types_selected = this.getUserTypesSelected();
        const user_types = document.getElementsByName('user_type');
        if(user_types_selected == 0){
            return this.returnError('reader',"Please selct user type!");
          }
    }
    getUserTypesSelected(){
        const user_types = document.getElementsByName('user_type');
        let user_types_selected = 0;
        for (var i = 0, length = user_types.length; i < length; i++) {
        
            if (user_types[i].checked) {
                user_types_selected = 1;
                
              break;
            }
          }
          return user_types_selected;
    }

   returnError(field_id,error_message){
        let errors = {};
        let input_errors = {};
        errors[field_id]=funcObj.errorWarning(error_message);
        input_errors[field_id]='is-invalid';
        if(document.getElementById(field_id)){
            document.getElementById(field_id).focus();
        }
    
        this.setState({ 
            errors: errors,
            input_errors: input_errors
         });
        return false;
   }
  

   returnNoError(field_id){
    let errors = {};
    let input_errors = {};
    errors[field_id]='';
    input_errors[field_id]='';
    this.setState({ 
        errors: errors,
        input_errors: input_errors
     });
    return 1;

   }

    handleSubmit(event) {

        event.preventDefault();
        let birthdate =new Date(this.state.year + ',' + this.state.month + ',' + this.state.date);
        var age = new Date() - birthdate;
        let today = new Date();
        today.setHours(0,0,0);
    
        const user_types_selected = this.getUserTypesSelected();
        const user_types = document.getElementsByName('user_type');
        var mobile =  this.state.mobile;
        let formIsValid = true;
       
        if (this.state.first_name == "") {
          return this.returnError('first_name',"Enter your First name to register");
        }
        else if (this.state.email == "") {
            return this.returnError('email',"Enter your email to register");
        }
        else if (this.state.first_name.length <3) {
            return this.returnError('first_name',"First name should be minimum 3 characters");
        }
        else if(birthdate >= today){
            return this.returnError('year',"Your date of birth cannot be a future date.");
        }
        else if (this.state.identification_type == "") {
            return this.returnError('identification_type',"Please select Identification Type");
        }
        else if (this.state.identification_number == "") {
            return this.returnError('identification_number',"Enter your Identification number");
        }
        else if (this.state.identification_number.length<7) {
            return this.returnError('identification_number',"Identification number length should be minimum 7 characters ");
        }
        else if (this.state.password == "") {
            return this.returnError('password',"Please enter password");
        }
        else if (this.state.cpassword == "") {
            return this.returnError('cpassword',"Please confirm your password");
        }
        else if (this.state.password != this.state.cpassword) {
            return this.returnError('cpassword',"Password and confirm password do not match");
        }
        else if (this.state.country == "") {
            return this.returnError('country',"Please select your country of residence");
        }
        else if (this.state.state == "") {
            return this.returnError('state',"Please select your state of residence");
        }
        else if (this.state.city == "") {
            return this.returnError('city',"Please select your city of residence");
        }
        else if (this.state.address.length <3) {
            return this.returnError('address',"Address should be minimum 3 characters");
        }
        else if (this.state.address.length <3) {
            return this.returnError('address',"Address should be minimum 3 characters");
        }
        else if (!document.getElementById("terms_condition").checked) {
            return this.returnError('terms_condition',"Please agree to the terms and conditions");
        }
        else if (user_types_selected == 0) {
            return this.returnError('reader',"Please select user type!");
        }
        else if (isNaN(mobile)) {
            return this.returnError('mobile',"Mobile should be only numeric!");
        }
        else if(/^\d{10}$/.test(mobile) == false) {    
            return this.returnError('mobile',"Invalid mobile; must be ten digits");
        }
     
       
        
        

        let postBodyData = this.state;
        let endPoint = 'registration';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                funcObj.custom_alert_message(data.data.message,'success','login')

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
    resend(e) {
        e.preventDefault();
        let postBodyData = {
            user_id: this.state.user_id,    
        };
        console.log('resend postBodyData', postBodyData)
        let endPoint = 'otp-resend';
        funcObj.preAuthApiCall(postBodyData, endPoint).then(data => {
            console.log('data response', data)

            if (data.code == 200) {

                Swal.fire({
                    title: '',
                    text: data.message,
                    showCloseButton: true,
                    icon: 'success',
                    showConfirmButton: false,
                })

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    showCloseButton: true,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    verifyOtp(e) {
        console.log('verifyOtp......')
        e.preventDefault();
        var otp = document.getElementById('otp');
             let postBodyData = {
                    user_id: this.state.user_id,
                    otp: otp.value,
                };
                let endPoint = 'otp-verify';
                funcObj.preAuthApiCall(postBodyData, endPoint).then(data => {
                    console.log('data response', data)

                    if (data.code == 200) {
                        funcObj.custom_alert_message(this.state.registration_message,'success',"login")
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
    getCountry() {
        let postBodyData = "";
        let endPoint = 'common/country';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            // console.log('get-contents response',response)

            if (response.code == 200) {
                let countryId;
                if (this.state.country) {
                    countryId = response.data.find(data => data.name == this.state.country);
                    if(countryId != undefined && countryId.id != undefined){
                    countryId = countryId.id;
                    // this.getCity(countryId);
                    this.getState(countryId);
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
                    // console.log(stateId);
                    stateId = stateId.id;
                    this.getCity(stateId);
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
    // handleChange(event) {
    //     this.setState({
    //         [event.target.name]: event.target.value
    //     })
    //     console.log('handleChange......', this.state)
    // }
    render() {
      console.log('user_type',this.state.user_type)
        const { isPasswordShown, isconfirmPasswordShown } = this.state;
        if (AUTH_USER != null) {
            return funcObj.redirectAuthenticatedUser();
        }
        const itypes = funcObj.getIdentificationType();
        return (
            <React.Fragment>
                <div className="login-container position-relative signup-form">
                    <div className="container ">
                        <img src={funcObj.assets_path("/images/ellipse-min.png")} className="left-bottom-img" alt="ellipse" />
                        <div className="login-form ">
                            <div className="row py-4 align-items-center justify-content-center">
                                <div className="col-lg-12 position-relative pad00">
                                    {/* <h1>Welcome to <br></br> Kenya National Library Services</h1> */}
                                    {
                                        this.state.authentication == true ?
                                            <form id="loginFrm" method="POST" onSubmit={(e) => this.verifyOtp(e)}>
                                                <div className="form-title">Authenticate Your Account</div>
                                                <div className="text-center">
                                                    <span className="error d-none" id="common_error"></span>
                                                </div>
                                                <p>Protecting your account is our top priority. Please confirm your account by entering the authentication code sent to <strong> {this.state.hided_mobile} </strong></p>
                                                <div className="form-group otp-field">
                                                    <div className="border__line">
                                                        <span></span><span></span><span></span><span></span><span></span><span></span>
                                                    </div>
                                                    <input type="text" className={`input-field form-control  `} id="otp" maxLength="6" name="otp" />
                                                </div>
                                                <div className="form-group mt-4">
                                                    <button type="button" onClick={(e) => this.verifyOtp(e)} className="btn signinBtn">Submit</button>
                                                </div>
                                                <div className="light-text">
                                                    It may take a minute to receive your code. Haven’t received code? <span>  <Link to="#" onClick={(e) =>this.resend(e)}>Resend a new code</Link></span>
                                                </div>
                                            </form>
                                            :
                                            <form id="loginFrm" method="POST" >
                                                {/* <div className="form-title">Register</div> */}
                                                <div className="form-group w-100">
                                                    {/* <select onChange={this.handleChange}  name="user_type" className={`input-field form-control  `}>
                                                        <option value="reader">Reader</option>
                                                        <option value="junior_reader">Junior Reader</option>
                                                        <option value="publisher">Publisher</option>
                                                    </select> */}
                                                    {/* <div className="row"></div> */}
                                                    <div className='custom-radio fuldiv'>
                                                    
                                                        <input type="radio" value="reader" onChange={this.handleRadio} checked={this.state.user_type == 'reader' ?true:false} name="user_type" id="reader" /><label htmlFor="reader" >&nbsp;Reader</label>
                                                    </div>
                                                    <div className='custom-radio fuldiv'>
                                                        <input type="radio" value="junior_reader" onChange={this.handleRadio} checked={this.state.user_type == 'junior_reader' ?true:false}   name="user_type" id="junior_reader" /><label htmlFor="junior_reader" > &nbsp;Junior Reader</label>
                                                    </div>
                                                    <div className='custom-radio fuldiv'>
                                                        <input type="radio" value="publisher" onChange={this.handleRadio} checked={this.state.user_type == 'publisher' ?true:false}   name="user_type" id="publisher" /><label htmlFor="publisher" > &nbsp;Publisher</label>
                                                    </div>
                                                    <span className="error_text">{this.state.errors["reader"]}</span>
                                                </div>

                                              {/*<div className="form-group w-50"></div>*/}
                                                <div className="form-group w-33">
                                                    <input type="text" className={`input-field form-control ${this.state.input_errors["first_name"]} `} placeholder="First name" name="first_name" id="first_name" onChange={this.handleChange} defaultValue={this.state.first_name} onBlur={(e) => this.checkUserType(e)} />
                                                    <span className="error_text">{this.state.errors["first_name"]}</span>
                                                </div>
                                                <div className="form-group w-33">
                                                    <input type="text" className={`input-field form-control  `} placeholder="Middle name" name="middle_name" onChange={this.handleChange} defaultValue={this.state.middle_name} />
                                                    
                                                </div>
                                                <div className="form-group w-33">
                                                    <input type="text" className={`input-field form-control  `} placeholder="Last name" name="last_name" id="last_name" onChange={this.handleChange} defaultValue={this.state.last_name} />
                                                    <span className="error_text"></span>
                                                </div>
                                                <div className="form-group w-33 w10mob">
                                                    <div className='w-50 mob-w'>
                                                        <select name="year" id="year" className={`input-field form-control  ${this.state.input_errors["year"]} `} onChange={this.handleChange} >
                                                            <option>Year of Birth</option>
                                                            {funcObj.year(this.state.start_year,this.state.end_year)}
                                                        </select>
                                                    </div>
                                                    <div className='w-25 mob-w'>
                                                        <select name="month" className={`input-field form-control  `} onChange={this.handleChange}>
                                                            <option>Month</option>
                                                            {funcObj.month()}
                                                        </select>
                                                    </div>
                                                    <div className='w-25 mob-w'>
                                                        <select name="date" className={`input-field form-control  `} onChange={this.handleChange} onBlur={(e) => this.checkDobValidation(e)}>
                                                            <option>Date</option>
                                                            {funcObj.date()}
                                                        </select>
                                                    </div>
                                                    <span className="error_text">{this.state.errors["year"]}</span>
                                                </div>
                                                <div className="form-group w-33">
                                                    <select name="gender" className={`input-field form-control  `} onChange={this.handleChange} defaultValue={this.state.gender} >
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                    </select>
                                                </div>
                                                <div className="form-group w-33">
                                                    <input type="text" className={`input-field form-control  ${this.state.input_errors["email"]}  `} placeholder="Email address" name="email" id="email" onChange={this.handleChange}  onBlur={(e) =>  this.validateEmail(e)} defaultValue={this.state.email} />
                                                    <span className="error_text">{this.state.errors["email"]}</span>
                                                </div>


                                                <div className="form-group w-33">
                                                    <input type="text" className={`input-field form-control ${this.state.input_errors["mobile"]} `} placeholder="Mobile/telephone number" name="mobile" id="mobile" onChange={this.handleChange}  defaultValue={this.state.mobile} onBlur={(e) => this.checkValidMobile(e)} />
                                                    <span className="error_text">{this.state.errors["mobile"]}</span>
                                                </div>
                                                <div className="form-group w-33 ww-50">
                                                <select name="identification_type"  id="identification_type" className={`input-field form-control ${this.state.input_errors["identification_type"]} `} onChange={this.handleChange} defaultValue={this.state.identification_type} >
                                                        <option value="">Select Identification type</option>
                                                        {
                                                            Object.keys(itypes).map((key,index) =>{
                                                                return (
                                                                    <option value={key} key={index}>{itypes[key]}</option>
                                                                )
                                                            })
                                                        }
                                                        
                                                    </select>
                                                    <span className="error_text">{this.state.errors["identification_type"]}</span>
                                                </div>
                                                <div className="form-group w-33 ww-50">
                                                    <input type="text" className={`input-field form-control  ${this.state.input_errors["identification_number"]}  `} placeholder="Identification Number" name="identification_number" id="identification_number" onChange={this.handleChange} defaultValue={this.state.identification_number} onBlur={(e) =>  this.validateIdentification(e)} />
                                                    <span className="error_text">{this.state.errors["identification_number"]}</span>
                                                </div>
                                                <div className="form-group w-33 w10mob">
                                                    <input type="text" className={`input-field form-control  ${this.state.input_errors["address"]}  `} placeholder="Address" name="address" id="address" onChange={this.handleChange} defaultValue={this.state.address} />
                                                    <span className="error_text">{this.state.errors["address"]}</span>
                                                </div>
                                                {/* <div className="form-group ww-50">
                                                    <input type="text" className={`input-field form-control  `} placeholder="Town/City" name="city" onChange={this.handleChange} defaultValue={this.state.city} />
                                                </div> */}
                                                <div className="form-group  w-33">
                                                    {/* <input type="text" className={`input-field form-control  `} value={this.state.country} onChange={this.handleChange} placeholder="Enter Country" name="country" /> */}
                                                    <select title="Country" value={this.state.countryId} onChange={this.handleChange} className={`input-field form-control  ${this.state.input_errors["country"]}  `} name="country" id="country">
                                                        <option value="" >Select Country</option>
                                                        {this.state.country_list.length > 0
                                                            && this.state.country_list.map((item, i) => {
                                                                return (

                                                                    (item.id == 113) ? <option key={i} value={item.id}>{item.name}</option> : null
                                                                )
                                                            }, this)
                                                        }
                                                    </select>
                                                    <span className="error_text">{this.state.errors["country"]}</span>
                                                </div>
                                                <div className="form-group w-33">
                                                    {/* <input type="text" className={`input-field form-control  `} value={this.state.state} onChange={this.handleChange} placeholder="Enter State" name="state" /> */}
                                                    <select title="State" value={this.state.stateId} onChange={this.handleChange} className={`input-field form-control  ${this.state.input_errors["state"]}  `} name="state" id="state">
                                                        <option value="" >Select State</option>
                                                        {this.state.state_list.length > 0
                                                            && this.state.state_list.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.id}>{item.name}</option>
                                                                )
                                                            }, this)
                                                        }
                                                    </select>
                                                    <span className="error_text">{this.state.errors["state"]}</span>
                                                </div>
                                                <div className="form-group w-33">
                                                    {/* <input type="text" className={`input-field form-control  `} value={this.state.city} onChange={this.handleChange} placeholder="Enter City" name="city" /> */}
                                                    <select title="City/Town" value={this.state.city} onChange={this.handleChange} className={`input-field form-control  ${this.state.input_errors["city"]}  `} name="city" id="city">
                                                        <option value="" >Select City</option>
                                                        {this.state.city_list.length > 0
                                                            && this.state.city_list.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.name}>{item.name}</option>
                                                                )
                                                            }, this)
                                                        }
                                                    </select>
                                                    <span className="error_text">{this.state.errors["city"]}</span>
                                                </div>

                                                <div className="form-group w-33 ww-50">
                                                
                                                    <input id="password" type={isPasswordShown ? "text" : "password"} className={`input-field form-control  ${this.state.input_errors["password"]}  `} placeholder="Password" name="password" onChange={this.handleChange} onBlur={(e) =>  this.validatePasswordRule(e)} defaultValue={this.state.password}
                                                    
                                                    
                                                onPaste={(e)=>{
      e.preventDefault()
      return false;
    }} onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}
        
                                                     />

                                                    <i
                                                        className={isPasswordShown ? "fa fa-eye password-icon fa-2x" : "fa fa-eye-slash password-icon fa-2x"}
                                                        onClick={this.togglePasswordVisiblity}
                                                    />
                                                  <label for="password" className='password_guide'>Min 6 characters</label>  
                                                  <span className="error_text">{this.state.errors["password"]}</span>
                                                </div>
                                                <div className="form-group w-33 ww-50">
                                                    <input type={isconfirmPasswordShown ? "text" : "password"} className={`input-field form-control  ${this.state.input_errors["cpassword"]}  `} placeholder="Confirm Password" name="cpassword" id="cpassword" onChange={this.handleChange} defaultValue={this.state.cpassword}
                                                    
                                                    
                                                onPaste={(e)=>{
      e.preventDefault()
      return false;
    }} onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}
        
                                                     />
                                                    <i
                                                        className={isconfirmPasswordShown ? "fa fa-eye password-icon fa-2x" : "fa fa-eye-slash password-icon fa-2x"}
                                                        onClick={this.togglecPasswordVisiblity}
                                                    />
                                                    <span className="error_text">{this.state.errors["cpassword"]}</span>
                                                </div>

                                                <div className="form-group">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" className={` ${this.state.input_errors["terms_condition"]} `} name="terms_condition" id="terms_condition" />
                                                        <label htmlFor="terms_condition">By signing up, you agree to v.tabu's <a href={funcObj.getSitePath("terms-conditions")} target="_blank"> terms and conditions</a></label>
                                                    </div>
                                                    <span className="error_text">{this.state.errors["terms_condition"]}</span>
                                                </div>

                                                <div className="form-group">
                                                    <button onClick={(e) =>this.handleSubmit(e)} data-sitekey="6Lc1jIUbAAAAAEOuOTPyRMVHSLQL50rGxRGU295F" data-callback='onSubmit' type="button" className=" g-recaptcha btn signinBtn">Register</button>
                                                </div>
                                                <div className="light-text">
                                                    Already have an account <span> <Link to="" onClick={(e) => funcObj.loadUrl("login")}>Login here</Link>!</span>
                                                </div>
                                                <div className="light-text">
                                                <NewsLetter />
                                                </div>
                                            </form>
                                    }
                                </div>
                                {/* <div className="col-lg-6 col-8 col-sm-6  mx-auto position-md-absolute loing-banner">
                                    <img src={funcObj.assets_path("/images/ellipse.png")} className="right-top-img" alt="ellipse" />
                                    <img src={funcObj.assets_path("/images/login-img.png")} className="image-fluid" alt="Login Banner" />
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
    captchaOnChange(value) {
        console.log("Captcha value:", value);
    }
}
