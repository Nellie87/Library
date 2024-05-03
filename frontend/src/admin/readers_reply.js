import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class ReadersReply extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            request_id:funcObj.get_query_string('request_id'),
            reply_message:"",
            name:(funcObj.get_query_string('name'))?funcObj.get_query_string('name'):"Administrator"
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
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
        this.addReply();
    } 


    addReply=()=>{
        if (this.state.request_id=="") {
            funcObj.custom_alert_message('Request id missing!');
            return false;
        }
        if (this.state.reply_message=="") {
            funcObj.custom_alert_message('Please add a message!');
            return false;
        }
       
        let postBodyData = {
            "request_id" : this.state.request_id,
            "reply_message" : this.state.reply_message
        };

        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'reply-request';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            if (data.code == 200) {
                console.log(data)
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                });
                
                if(AUTH_USER.account_type == 'admin'){
                    return funcObj.redirectPage("readers-request");
                }else if(AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader'){
                    return funcObj.redirectPage("request-list");
                }else if(AUTH_USER.account_type == 'publisher'){
                    return funcObj.redirectPage("publisher-request-list");
                }else{
                    return funcObj.redirectPage("request-lists");
                }
                
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
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Reply</h3>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                  
                                    <div className="form-group">
                                        <label className="pl-3">Description</label>
                                        <textarea  className="input-field form-control" name="reply_message" value={this.state.reply_message} onChange={this.handleChange} placeholder="Enter description"></textarea>
                                    </div>
                                </div>
                          
                            </div>
                            <div className="text-right">
                                {(AUTH_USER.account_type == 'admin')?
                                    <Link to="/readers-request" type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>:
                                 (AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader')?
                                    <Link to="/request-list" type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>: 
                                 (AUTH_USER.account_type == 'publisher')?  
                                    <Link to="/publisher-request-list" type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>: 
                                <Link to="/request-lists" type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link> }    
                                <button type="submit" class="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
