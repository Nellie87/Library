import React from 'react';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Faq extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            content: "",
            module_key:"faq"
        };
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
                <form id="feedbackFrm" method="POST">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">FAQ</h3>
                                {AUTH_USER != null && AUTH_USER.account_type == 'admin' ?
                            
                                <div className="float-right">
                                    <div className="add-btn-wrap">
                                        <span className="add-icon">+</span>
                                        <Link to="/add-module?module=faq"  className="btn darkBtn">Add FAQ</Link>
                                    </div>
                                </div>
                                :null }

                            </div>
                            <div className="row">
                               <div className="col-md-12">
                                    <div dangerouslySetInnerHTML={{__html:  this.state.content}}></div>
                               </div>
                            </div>
                            
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }
   
}
