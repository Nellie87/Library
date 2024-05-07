import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class ReaderManual extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            content: "",
            module_key:"manual"
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
                                <h3 className="dashboard-title title-margin my-2 float-left">Manual</h3>
                                {AUTH_USER.account_type == 'admin' ?
                            
                                <div className="float-right">
                                    <div className="add-btn-wrap">
                                        <span className="add-icon">+</span>
                                        <Link to="/add-module?module=manual"  className="btn darkBtn">Add Manual</Link>
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
