import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class Authentication extends React.Component {

    render() {
  
      
        return (
            
            <React.Fragment>
                <div className="login-container position-relative">
                    <div className="container ">
                        <img src={funcObj.assets_path("/images/ellipse-min.png")} className="left-bottom-img" alt="ellipse" />
                        <div className="login-form ">
                            <div className="row py-4 align-items-center justify-content-center">
                                <div className="col-lg-6 position-relative">
                                    <h1>Welcome to <br></br> Kenya National Library Services</h1>
                                    
                                    <form id="loginFrm" method="POST" >
                                        <div className="form-title">Authenticate Your Account</div>
                                        <p>Protecting your account is our top priority. Please confirm your account by entering the authentication code sent to <strong> +89******234 </strong></p>
                                        <div className="form-group otp-field">
                                            <input type="text" className="input-field form-control " maxLength="6"  name="otp" />
                                        </div>
                                        <div className="form-group">
                                            <button type="button" className="btn signinBtn">Submit</button>
                                        </div>
                                        <div className="light-text">
                                        It may take a minute to receive your code. Haven’t received code? <span> Resend a new code</span> 
                                        </div>
                                    </form>
                                    
                                </div>
                                <div className="col-lg-6 col-8 col-sm-6  mx-auto position-md-absolute loing-banner">
                                <img src={funcObj.assets_path("/images/ellipse.png")} className="right-top-img" alt="ellipse" />
                                    <img src={funcObj.assets_path("/images/login-img.png")} className="image-fluid" alt="Login Banner" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}