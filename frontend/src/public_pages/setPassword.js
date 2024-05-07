import React from 'react';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();

class SetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.setToken = this.setToken.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            user_token:"",
            password:"",
            cpassword:"",
            isPasswordShown: false,
            isPasswordShown1: false,
            isconfirmPasswordShown: false,
        }
    }
    componentDidUpdate() {
        // funcObj.custom_alert_message(this.state.isPasswordShown);
        if (this.state.isPasswordShown != false) {
            setTimeout(this.togglePasswordVisiblity, 10000);
            // this.setState({isPasswordShown:false});
        }
        else { }
        if (this.state.isPasswordShown1 != false) {
            setTimeout(this.togglePasswordVisiblity1, 10000);
            // this.setState({isPasswordShown:false});
        }
        else { }
        if (this.state.isconfirmPasswordShown != false) {
            setTimeout(this.togglecPasswordVisiblity, 10000);
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
    componentDidMount(){
        this.setToken();
    }
    setToken(){
        const user_token =  funcObj.get_query_string('user_token');
        this.setState({user_token:user_token});
    }

    handleChange(event){
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name] : event.target.value
        }) 
    }

    handleSubmit() {
        if(this.state.password == "" || this.state.cpassword == ""){
            funcObj.custom_alert_message("Please fill both password!");
            return false;
        }

        if (this.state.password !==  this.state.cpassword) {
            funcObj.custom_alert_message("Passwords don't match!");
            return false;
        }

        let postBodyData = {
            'password': this.state.password,
            'cpassword': this.state.cpassword,
            'user_token':this.state.user_token
        };
        let endPoint = 'set-password';
        
      
            funcObj.preAuthApiCall(postBodyData, endPoint).then(data => {
                console.log('data response', data)
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
   
    render() {
        const { isPasswordShown,isconfirmPasswordShown, isPasswordShown1 } = this.state;
       
        return (
            <React.Fragment>
                <div className="login-container position-relative">
                    <div className="container w-100 p-0">
                        <img src={funcObj.assets_path("/images/ellipse-min.png")} className="left-bottom-img" alt="ellipse" />
                        <div className="login-form ">
                            <div className="row py-4 align-items-center justify-content-center">
                                <div className="col-lg-6 position-relative">
                                    <h1>Set Password</h1>

                                <input type="hidden" name="user_token" value={this.state.user_token} defaultValue={this.state.user_token} />

                                            <form id="loginFrm" onSubmit={this.handleSubmit} method="POST" >
                                                <div className="text-center">
                                                    <span className="error d-none" id="common_error"></span>
                                                </div>

                                                <div className="form-group">
                                                    <span className="error d-none" id="password_error" >Password</span>
                                                    <input  type={isPasswordShown1 ? "text" : "password"} className="input-field form-control" defaultValue={this.state.password} onChange={this.handleChange}  placeholder="Password" name="password" id="password"
                                                    
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
                                                    <span className="error d-none" id="cpassword_error" >Confirm Password</span>
                                                    <input  type={isconfirmPasswordShown ? "text" : "password"} className="input-field form-control" defaultValue={this.state.cpassword} onChange={this.handleChange}  placeholder="Confirm Password" name="cpassword" id="cpassword"
                                                    
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
                                                </div>
                                                <div className="form-group">
                                                    <button data-callback='onSubmit' type="button" onClick={this.handleSubmit} className="btn signinBtn sign_in_btn" >Submit</button>
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
export default SetPassword;
