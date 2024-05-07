import React from 'react';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.setToken = this.setToken.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            forget_token:"",
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
    componentDidMount(){
        this.setToken();
    }
    setToken(){
        const forget_token =  funcObj.get_query_string('token');
        this.setState({forget_token:forget_token});
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
            'forget_token':this.state.forget_token
        };
        let endPoint = 'forget-reset';
        
      
            funcObj.preAuthApiCall2(postBodyData, endPoint).then(data => {
                console.log('data response', data)
                if (data.code == 200) {
                  funcObj.custom_alert_message(data.message,'success',"login")

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
        let forget_token =  funcObj.get_query_string('book_id');
        return (
            <React.Fragment>
                <div className="login-container position-relative">
                    <div className="container w-100 p-0">
                        <img src={funcObj.assets_path("/images/ellipse-min.png")} className="left-bottom-img" alt="ellipse" />
                        <div className="login-form ">
                            <div className="row py-4 align-items-center justify-content-center">
                                <div className="col-lg-6 position-relative">
                                    <h1>Reset Password</h1>

                                <input type="hidden" name="forget_token" value={this.state.forget_token} defaultValue={this.state.forget_token} />

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
                              
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default ResetPassword;
