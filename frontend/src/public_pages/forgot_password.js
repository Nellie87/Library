import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class ForgotPassword extends React.Component {

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
                                        <div className="form-title">Forgot Password</div>
                                        <div className="form-group">
                                            <input type="text" className="input-field form-control" placeholder="Email" name="Email" />
                                        </div>
                                        <div className="form-group">
                                            <button type="button" className="btn signinBtn">Submit</button>
                                        </div>
                                        <div className="light-text">
                                            Or <span> <Link to="/login">Login here</Link>!</span>
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