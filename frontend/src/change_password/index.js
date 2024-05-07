import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
export default class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password:"",
            confirm_password:"",
            new_password:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
            
    }

    handleChange(event){
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name] : event.target.value
        }) 
    }

    
    handleSubmit(event){
        event.preventDefault();
        if(this.state.password == "" || this.state.new_password == "" ||  this.state.confirm_password == ""){
            funcObj.custom_alert_message("Please fill the password");
            return false;
        }

        if (this.state.new_password !==  this.state.confirm_password) {
            funcObj.custom_alert_message("Passwords don't match");
            return false;
        }
        
         
        let postBodyData = {
            "oldpassword":this.state.password,
            "newpassword":this.state.new_password 
        };
        
        // return false
        let endPoint = 'change-password';
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'PUT').then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                console.log(data)
                Swal.fire({
                    title: 'Success',
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
            this.setState({
                password:"",
                confirm_password:"" ,
                new_password:""    
           })
        });
    }


    render() {
        return (
            <React.Fragment>
                <form id="changePassfrm" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Change password</h3>
                            </div>
                            <div className="row">
                               <div className="col-md-12">
                               <div className="form-group">
                                        <label className="pl-3">Old Password</label>
                                        <input type="password" className="input-field form-control" value={this.state.password} onChange={this.handleChange} placeholder="Enter Old Password" name="password"
                                            
                                            onPaste={(e)=>{
      e.preventDefault()
      return false;
    }} onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}
                                         />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">New Password</label>
                                        <input type="password" className="input-field form-control" value={this.state.new_password} onChange={this.handleChange} placeholder="Enter New Password" name="new_password"
                                            
                                            onPaste={(e)=>{
      e.preventDefault()
      return false;
    }} onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}
                                         />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Confirm Password</label>
                                        <input type="password" className="input-field form-control" value={this.state.confirm_password} onChange={this.handleChange} placeholder="Enter Confirm Password" name="confirm_password"
                                            
                                            onPaste={(e)=>{
      e.preventDefault()
      return false;
    }} onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}
                                         />
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
