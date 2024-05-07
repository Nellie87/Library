import React from 'react';
import { Link } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class AddFaq extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            content: "",
            module_key:(funcObj.get_query_string('module'))?funcObj.get_query_string('module'):""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(content, editor) {
        this.setState({ content });
    }
    
    handleSubmit(event) {
        // alert("Text was submitted: " + this.state.content);
        event.preventDefault();
        this.addModule();
    }

    componentDidMount(){
        this.getModule();
    }

    getModule = () => {
        console.log('getModule')
        let endPoint = 'get-module';
        let postBodyData = {
            module_key:this.state.module_key
        }
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

            if (response.code == 200) {
            
                this.setState({
                    content: response.data.module_description,
                });

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }

        })

        
    }

    addModule() {
        
        let postBodyData = {
            "module_key":this.state.module_key,
            "module_description":this.state.content
        };
        let endPoint = 'add-module';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

            if (response.code == 200) {
                Swal.fire({
                    title: 'Success',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'success',
                    showConfirmButton: false,
                });
                this.setState({
                    content: "",
                });
                return funcObj.redirectPage(this.state.module_key);

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }

        })

     
    }

    render() {
        return (
            <React.Fragment>
                <form id="feedbackFrm"  onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Add {this.state.module_key}</h3>
                             
                            </div>
                            <div className="row">
                                <div className="col-md-12"> 
                                    <div className="form-group">
                                        <Editor
                                            apiKey="ekxwqjtecb4bjz56b9981hle5canz62j9j62pzyyprr1num6"
                                            value={this.state.content}
                                            init={{
                                                height: 200,
                                                menubar: false
                                            }}
                                            onEditorChange={this.handleChange}
                                        />
                                    </div> 
                                    
                                </div>
                            </div>
                            <div className="text-right">
                                <Link to={`/` + this.state.module_key } type="button" class="btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120">Go Back</Link>
                                <button type="submit" class="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
}
