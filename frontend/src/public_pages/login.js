import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
import NewsLetter from './newsLetter';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createnewpassword = this.createnewpassword.bind(this);
        this.verifyOtp = this.verifyOtp.bind(this);
        this.loaderView = this.loaderView.bind(this);


        this.state = {
            authentication: false,
            login_success: false,
            loading: false, // Add this state
            user: {},
            dontask: '',
            password:"",
            cpassword:"",
            isPasswordShown: false,
            isPasswordShown1: false,
            isconfirmPasswordShown: false,
            mobile: '89******234',
            user_id:""
        }

    }
    componentDidUpdate() {
        // funcObj.custom_alert_message(this.state.isPasswordShown);
        if (this.state.isPasswordShown != false) {
            setTimeout(this.togglePasswordVisiblity, 100000000);
            // this.setState({isPasswordShown:false});
        }
        else { }
        if (this.state.isPasswordShown1 != false) {
            setTimeout(this.togglePasswordVisiblity1, 100000000);
            // this.setState({isPasswordShown:false});
        }
        else { }
        if (this.state.isconfirmPasswordShown != false) {
            setTimeout(this.togglecPasswordVisiblity, 100000000);
            // this.setState({isPasswordShown:false});
        } else { }
    }
    togglePasswordVisiblity1 = () => {
        const { isPasswordShown1 } = this.state;
        this.setState({ isPasswordShown1: !isPasswordShown1 });
    };
    togglePasswordVisiblity = () => {
        const { isPasswordShown } = this.state;
        this.setState({ isPasswordShown: !isPasswordShown });
    };
    togglecPasswordVisiblity = () => {
        const { isconfirmPasswordShown } = this.state;
        this.setState({ isconfirmPasswordShown: !isconfirmPasswordShown });
    }
    captchaOnChange(value) {
        if (value != "" && value != null) {
            document.getElementById('captchaVal').value = value;
            document.getElementById('captcha_error').classList.add('d-none');
        }
    }
    loaderView(action = "") {
        if (document.getElementById("customeloader") != null) {
            if (action === "show") {
                document.getElementById("customeloader").style.visibility = "visible";
            }

            if (action === "hide") {
                document.getElementById("customeloader").style.visibility = "hidden";
            }
        }
    }
    handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission
    
        // Show the loader
        this.loaderView("show"); 
    
        // Validate email and password
        var email = document.getElementById('email');
        var password = document.getElementById('password');
    
        if (email.value.trim() === "") {
            document.getElementById('email_error').classList.remove('d-none');
            this.setState({ loading: false });
            return false;
        } else {
            document.getElementById('email_error').classList.add('d-none');
        }
    
        if (password.value.trim() === "") {
            document.getElementById('password_error').classList.remove('d-none');
            this.setState({ loading: false });
            return false;
        } else {
            document.getElementById('password_error').classList.add('d-none');
        }
    
        this.setState({
            authentication: false,
            login_success: false
        });
    
        let postBodyData = {
            'email': email.value,
            'password': password.value        
        };
        let endPoint = 'login';
        const AUTH_USER = funcObj.getAuthUser();
        if (AUTH_USER == null) {
    
            funcObj.preAuthApiCall2(postBodyData, endPoint).then(data => {
                console.log('data response', data);
    
                // Hide the loader
                this.loaderView("hide");
    
                if (data.code === 200) {
                    document.getElementById('password').value = "";
                    if (data.data.dontask === true) {
                        let user = {
                            'is_logged_in': true,
                            'user': data.data.token_info.original.data,
                            'email': data.data.token_info.original.data.email,
                            'account_type': data.data.token_info.original.data.user_type,
                            'token': data.data.token_info.original.token
                        };
                        user = JSON.stringify(user);
                        funcObj.setLocalStorage('user', user);
                        return funcObj.redirectAuthenticatedUser();
                    } else {
                        let mobile = data.data.token_info.original.data.mobile;
                        let hidemobile = funcObj.hideMobileNumber(mobile);
                        this.setState({
                            authentication: true,
                            login_success: true,
                            user: data.data,
                            mobile: hidemobile
                        });
                        document.getElementById('otp').focus();
                    }
                } else if (data.code === 201) {
                    funcObj.custom_alert_message(data.message, 'error');
                } else if (data.code === 202) {
                    console.log('data response after login', data);
                    this.setState({
                        expired: true,
                        user_id: data.data.user_id,
                        npassword: '',
                        cpassword: ''
                    });
                    funcObj.custom_alert_message(data.message, 'error');
                } else if (data.code === 203) {
                    Swal.fire({
                        title: '',
                        text: data.message,
                        padding: '5px',
                        width: 500,
                        showCancelButton: true,
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            funcObj.redirectPage('forget-password');
                        }
                    });
                }
            }).catch(error => {
                // Hide the loader on error
                this.loaderView("hide");
                console.error('Error during login:', error);
            });
        } else {
            // Handle the case when AUTH_USER is not null
        }
    }
    

    validatePasswordRule(event){
        event.preventDefault();
        let postBodyData = {
            'password':event.target.value
        };
        let endPoint = 'check-valid-password';
      
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 201) {
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
    createnewpassword(e) {
        e.preventDefault();
        var npassword = document.getElementById('npassword').value;
        var user_id = document.getElementById('user_id').value;
        var password = document.getElementById('password').value;
        var cpassword = document.getElementById('cpassword').value;
        // alert('new'+npassword+' cpass'+cpassword);
        console.log('createnewpassword1 data response',this.state.user_id)
        if(npassword == "" || cpassword == ""){
            funcObj.custom_alert_message("Please fill both password!");
            return false;
        }

        if (npassword !==  cpassword) {
            funcObj.custom_alert_message("Passwords don't match!");
            return false;
        }
        
        let postBodyData = {
            'oldpassword': password,
            'newpassword': npassword,
            'user_id': user_id
        };
        let endPoint = 'change-password';
        //console.log('createnewpassword2',postBodyData)
      
            funcObj.preAuthApiCall2(postBodyData, endPoint).then(data => {
                console.log('createnewpassword3 response', data)
                if (data.code == 200) {
                    Swal.fire({
                        title: '',
                        text: data.message,
                        icon: 'success',
                        showConfirmButton: false,
                    })
                  window.location = funcObj.getSitePath('login');


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
    resend(e) {
        e.preventDefault();
        let postBodyData = {
            user_id: this.state.user.token_info.original.data.id,
        };
        let endPoint = 'otp-resend';
        funcObj.preAuthApiCall2(postBodyData, endPoint).then(data => {
           // console.log('data response', data)

            if (data.code == 200) {

                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })

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
    verifyOtp(e) {
        console.log('verifyOtp......')
        e.preventDefault();
        var otp = document.getElementById('otp');
        var dontask = (!document.getElementById('dontask').checked) ? 'off' : 'on';
        if (this.state.login_success == true) {
            let user_type = this.state.user.token_info.original.data.user_type;
            let email = this.state.user.token_info.original.data.email;
            let token = this.state.user.token_info.original.token;

            // if ( process &&  process.env.NODE_ENV == 'development') {
            // funcObj.custom_alert_message(dontask.value);
            let postBodyData = {
                user_id: this.state.user.token_info.original.data.id,
                otp: otp.value,
                dontask: dontask
            };
            let endPoint = 'otp-verify';
            funcObj.preAuthApiCall2(postBodyData, endPoint).then(data => {
                console.log('data response', data)

                if (data.code == 200) {

                    let user = {
                        'is_logged_in': true,
                        'user': this.state.user.token_info.original.data,
                        'email': email,
                        'account_type': user_type,
                        'token': token
                    };
                    user = JSON.stringify(user);
                    funcObj.setLocalStorage('user', user);
                    return funcObj.redirectAuthenticatedUser();
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



            // } else {
            //     document.getElementById('common_error').innerHTML = 'Please enter valid OTP';
            //     document.getElementById('common_error').classList.remove('d-none');
            //     return false;
            // }
        } else {
            document.getElementById('common_error').innerHTML = 'Invalid credentials!';
            document.getElementById('common_error').classList.remove('d-none');
            return false;
        }
    }

 handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
       // console.log('handleChange......', this.state)
    }

    render() {
        if (AUTH_USER != null) {
            return funcObj.redirectAuthenticatedUser();
        }
        let password = '';
        if (!funcObj.checkProcessEnvVar('production')) {
            password = 123456;
        }
        const { isPasswordShown,isconfirmPasswordShown, isPasswordShown1, loading } = this.state;
        return (
            <React.Fragment>
                <div className="login-container position-relative">
                    <div className="container w-100 p-0">
                        <img src={funcObj.assets_path("/images/ellipse-min.png")} className="left-bottom-img" alt="ellipse" />
                        <div className="login-form ">
                            <div className="row py-4 align-items-center justify-content-center">
                                <div className="col-lg-6 position-relative">
                                    {/* <h1>Welcome to <br></br> Kenya National Library Services</h1> */}
                                    {
                                        this.state.expired == true && this.state.user_id != '' ?
                                            <form id="loginFrm" method="POST" >
                                            <input type="hidden" id="user_id" value={this.state.user_id} />
                                                <div className="text-center">
                                                    <span className="error d-none" id="common_error"></span>
                                                </div>
                                                <div className="form-group">
                                                    <span className="error d-none" id="password_error">Password is required!</span>
                                                    <input type={isPasswordShown ? "text" : "password"} className="input-field form-control" placeholder="Old Password" name="password" id="password"  />
                                                    <i
                                                        className={isPasswordShown ? "fa fa-eye password-icon fa-2x" : "fa fa-eye-slash password-icon fa-2x"}
                                                        onClick={this.togglePasswordVisiblity}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                <input type={isPasswordShown1 ? "text" : "password"} className="input-field form-control" placeholder="Password" name="npassword" id="npassword"  onBlur={(e) =>  this.validatePasswordRule(e)}
                                                
                                                onPaste={(e)=>{
                                                                e.preventDefault()
                                                                return false;
                                                                }} onCopy={(e)=>{
                                                                e.preventDefault()
                                                                return false;
                                                                }}
                                                 />
                                                    <i
                                                        className={isPasswordShown1 ? "fa fa-eye password-icon fa-2x" : "fa fa-eye-slash password-icon fa-2x"}
                                                        onClick={this.togglePasswordVisiblity1}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                <input type={isconfirmPasswordShown ? "text" : "password"} className="input-field form-control" placeholder="Confirm Password" name="cpassword" id="cpassword" 
                                                
                                                                        onPaste={(e)=>{
                                                                    e.preventDefault()
                                                                    return false;
                                                                    }} onCopy={(e)=>{
                                                                    e.preventDefault()
                                                                    return false;
                                                                    }}
                                                 />
                                                    <i
                                                        className={isconfirmPasswordShown ? "fa fa-eye-slash password-icon fa-2x" : "fa fa-eye password-icon fa-2x"}
                                                        onClick={this.togglecPasswordVisiblity}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <button type="button" onClick={(e) => this.createnewpassword(e)} className="btn signinBtn sign_in_btn" >Submit</button>
                                                </div>

                                            </form> 
                                            :
                                        this.state.authentication == true ?
                                            <form id="loginFrm" method="POST" onSubmit={(e) => this.verifyOtp(e)}>
                                                <div className="form-title">Authenticate Your Account</div>
                                                <div className="text-center">
                                                    <span className="error d-none" id="common_error"></span>
                                                </div>
                                                <p>Protecting your account is our top priority. Please confirm your account by entering the authentication code sent to <strong> {this.state.mobile} </strong></p>
                                                <div className="form-group">
                                                    <div className="border__line">
                                                        <span></span><span></span><span></span><span></span><span></span><span></span>
                                                    </div>
                                                    <input type="text" className="input-field form-control" id="otp" maxLength="6" name="otp" />
                                                </div>
                                                <div className="form-group otp-field">

                                                    <input type="checkbox" id="dontask" name="dontask" /><span>&nbsp;&nbsp;Don't ask otp</span>
                                                </div>
                                                <div className="form-group mt-4">
                                                    <button type="button" onClick={(e) => this.verifyOtp(e)} className="btn signinBtn">Submit</button>
                                                </div>
                                                <div className="light-text">
                                                    It may take a minute to receive your code. Haven’t received code? <span> <Link to="#" onClick={(e) => this.resend(e)}>Resend a new code</Link></span>
                                                </div>
                                            </form>
                                            :
                                            <form id="loginFrm" onSubmit={this.handleSubmit}>
                                            <div className="text-center">
                                                <span className="error d-none" id="common_error"></span>
                                            </div>
                                
                                            <div className="form-group">
                                                <span className="error d-none" id="email_error">Please enter your email to login</span>
                                                <input type="email" className="input-field form-control" placeholder="Email" name="email" id="email" />
                                            </div>
                                
                                            <div className="form-group">
                                                <span className="error d-none" id="password_error">Please enter your password to login</span>
                                                <input
                                                    type={isPasswordShown ? "text" : "password"}
                                                    className="input-field form-control"
                                                    placeholder="Password"
                                                    name="password"
                                                    id="password"
                                                    onPaste={(e) => { e.preventDefault(); return false; }}
                                                    onCopy={(e) => { e.preventDefault(); return false; }}
                                                />
                                                <i
                                                    className={isPasswordShown ? "fa fa-eye password-icon fa-2x" : "fa fa-eye-slash password-icon fa-2x"}
                                                    onClick={this.togglePasswordVisiblity}
                                                />
                                            </div>
                                
                                            <div className="form-group">
                                                <span className="error d-none" id="captcha_error">Captcha is required!</span>
                                            </div>
                                
                                            <div className="form-group">
                                                <div className="custom-checkbox">
                                                    <input type="checkbox" name="terms_condition" id="terms_condition" />
                                                    <label htmlFor="terms_condition">Remember Password</label>
                                                </div>
                                            </div>
                                
                                            <div className="form-group">
                                                <button type="submit" className="btn signinBtn sign_in_btn" disabled={loading}>
                                                    {loading ? (
                                                        <span>
                                                            <i className="fas fa-spinner fa-spin"></i> Logging in...
                                                        </span>
                                                    ) : (
                                                        'Login'
                                                    )}
                                                </button>
                                            </div>
                                
                                            <div className="light-text">
                                                Forgot Password <span><Link to="" onClick={(e) => funcObj.loadUrl("forget-password")}>Click here</Link></span>
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
}
export default Login;
