import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.verifyOtp = this.verifyOtp.bind(this);


        this.state = {
            authentication: false,
            login_success: false,
            user: {}
        }
    }
    captchaOnChange(value) {
        if (value != "" && value != null) {
            document.getElementById('captchaVal').value = value;
            document.getElementById('captcha_error').classList.add('d-none');
        }
    }
    handleSubmit(token) {
        //    const captchaVal = document.getElementById('captchaVal').value;
        //      console.log("The captcha ",grecaptcha.getResponse().length);


        //     if(captchaVal == "" || captchaVal == null){
        //         document.getElementById('captcha_error').classList.remove('d-none');
        //         return false;
        //    }else{
        //         document.getElementById('captcha_error').classList.add('d-none');
        //    }

        var email = document.getElementById('email');
       

        if (email.value == "" || email.value == " ") {
            document.getElementById('email_error').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('email_error').classList.add('d-none');
        }

     
        this.setState({
            authentication: false,
            login_success: false
        });



        let postBodyData = {
            'email': email.value,
        };
        let endPoint = 'forget';
        const AUTH_USER = funcObj.getAuthUser();
        if (AUTH_USER == null) {

            funcObj.preAuthApiCall2(postBodyData, endPoint).then(data => {
                console.log('data response', data)
                document.getElementById('email').value="";
                if (data.code == 200) {
                    funcObj.custom_alert_message(data.message,'success')

                } else if (data.code == 201) {
                    Swal.fire({
                        title: '',
                        text: data.message,
                        icon: 'error',
                        showConfirmButton: false,
                    })
                }
            });

        } else {

        }
    }
    verifyOtp(e) {
        console.log('verifyOtp......')
        e.preventDefault();
        var otp = document.getElementById('otp');
        if (this.state.login_success == true) {
            let user_type = this.state.user.token_info.original.data.user_type;
            let email = this.state.user.token_info.original.data.email;
            let token = this.state.user.token_info.original.token;
            if (otp.value == '123456') {
                let user = {
                    'is_logged_in': true,
                    'user': this.state.user.token_info.original.data,
                    'email': email,
                    'account_type': user_type,
                    'token': token
                };
                user = JSON.stringify(user);
                funcObj.setEncStorage('user', user);

                return funcObj.redirectAuthenticatedUser();
            } else {
                document.getElementById('common_error').innerHTML = 'Please enter valid OTP';
                document.getElementById('common_error').classList.remove('d-none');
                return false;
            }
        } else {
            document.getElementById('common_error').innerHTML = 'Invalid credentials!';
            document.getElementById('common_error').classList.remove('d-none');
            return false;
        }
    }



    render() {

        if (AUTH_USER != null) {
            return funcObj.redirectAuthenticatedUser();
        }
        let password = '';
        if (!funcObj.checkProcessEnvVar('production')) {
            password = 123456;
        }

        return (
            <React.Fragment>
                <div className="login-container position-relative">
                    <div className="container w-100 p-0">
                        <img src={funcObj.assets_path("/images/ellipse-min.png")} className="left-bottom-img" alt="ellipse" />
                        <div className="login-form ">
                            <div className="row py-4 align-items-center justify-content-center">
                                <div className="col-lg-6 position-relative">
                                    <h1>Forgot Password</h1>

                                                                            
                                            <form id="loginFrm" onSubmit={this.handleSubmit} method="POST" >
                                                <div className="text-center">
                                                    <span className="error d-none" id="common_error"></span>
                                                </div>

                                                <div className="form-group">
                                                    <span className="error d-none" id="email_error" >Email is required!</span>
                                                    <input type="email" className="input-field form-control" placeholder="Email" name="email" id="email" />
                                                </div>
                                                <div className="form-group">
                                                    <button data-callback='onSubmit' type="button" onClick={this.handleSubmit} className="btn signinBtn sign_in_btn" >Send</button>
                                                </div>

                                            </form>
                                    


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
