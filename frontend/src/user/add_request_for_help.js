import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
export default class AddRequestForHelp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            subject: '',
            feedback_title:'',
            feedback_desc:''   
        };

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
        if(this.state.subject == ''){
            funcObj.custom_alert_message('Please select subject');
            return false;
        }
        if(this.state.feedback_title == ''){
            funcObj.custom_alert_message('Please fill title');
            return false;
        }
        if(this.state.feedback_desc == ''){
            funcObj.custom_alert_message('Please fill discription');
            return false;
        }

        let postBodyData = {
            "title":this.state.feedback_title,
            "description":this.state.feedback_desc.toString(),
            "subject_class":this.state.subject
        };
        let endPoint = 'add-request';
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
            
                this.setState({
                    subject: '',
                    feedback_title:'',
                    feedback_desc:''   
                });
                funcObj.custom_alert_message(data.message,'success','request-list');
                // return funcObj.redirectPage("my-publications");
            } else if (data.code == 201) {
                funcObj.custom_alert_message(data.message,'error');
            }
        });
    }    
    render() {
      const requestSubjectOptions =  funcObj.requestSubjectOptions();
        return (
            <React.Fragment>
                <form id="feedbackFrm" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Add Request</h3>
                                <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon"></span>
                                    <Link to="/request-list"  className="btn darkBtn">All Requests</Link>
                                </div>
                            </div>
                            </div>
                            <div className="row">
                               <div className="col-md-12">
                               <div className="form-group">
                                        <label className="pl-3">Subject</label>
                                        <select title="Select feedback for" value={this.state.subject} onChange={this.handleChange} name="subject" className="input-field form-control">
                                            <option value="" >Select Subject</option>
                                          {
                                           Object.keys(requestSubjectOptions).map(function (subject_option){
                                                return (
                                                    <option value={subject_option} >{requestSubjectOptions[subject_option]}</option>
                                                )
                                            })
                                          }
                                          
                                        </select>
                                    </div>

                               
                               <div className="form-group">
                                        <label className="pl-3">Title</label>
                                        <input type="text" value={this.state.feedback_title} className="input-field form-control" placeholder="Enter title" onChange={this.handleChange} name="feedback_title" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Description</label>
                                        <textarea  className="input-field form-control" value={this.state.feedback_desc} onChange={this.handleChange} name="feedback_desc" placeholder="Enter description"></textarea>
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
