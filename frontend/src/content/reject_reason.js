import React from 'react';
import { Link,withRouter,Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

import Functions from '../helpers/functions';

const funcObj = new Functions();
class RejectReason extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            content_id:funcObj.get_query_string('content_id'),
            reject_reason:"",
            content_detail:{}
        }
        this.onChangeValue = this.onChangeValue.bind(this);
        this.getContent = this.getContent.bind(this);
        this.handleRejectSubmit = this.handleRejectSubmit.bind(this);
      
            
    }
    componentDidMount(){
        this.getContent();
    }

    onChangeValue(event){
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    getContent(){
        let endPoint = 'content-detail';
        const content_id = funcObj.get_query_string('content_id');
        let postBodyData = {
            "content_id": content_id,
        }
        
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
             if (data.code == 200) {
              this.setState({content_detail:data.data});

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
          
        });
    }

    handleRejectSubmit(event){
        event.preventDefault();
        let endPoint = 'reject-content';
        let postBodyData = {
            "content_id": this.state.content_id,
            "reject_reason": this.state.reject_reason,
            "status":"rejected"
            
        }
        
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
             if (data.code == 200) {
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
            const current_page = funcObj.get_query_string('current_page');
            const backlink = funcObj.get_query_string('backlink');
            const url = backlink+'?current_page='+current_page;
            window.location = funcObj.getSitePath(url);
        });
    }
 
    render() {
        let backlink = funcObj.get_query_string('backlink');
        let current_page = funcObj.get_query_string('current_page');
       
        return (
            <React.Fragment>

                {
                    this.state.content_detail &&  Object.keys(this.state.content_detail).length > 0?
             
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                        <div className="breadcrumbs py-1">
                            {
                                backlink != "" && backlink != null ?
                                <div>
                                        <Link className='btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120' to={`/`+backlink+`?current_page=`+current_page}>
                                                   Go Back
                                             </Link>
                                             </div>
                                :
                          <React.Fragment>
                                            <span>
                                                <Link to="/home">
                                                    Home
                                                </Link>
                                            </span>
                                            </React.Fragment>      
                            }
                            </div>
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Reject Reason for - <b>{this.state.content_detail.title}</b></h3>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                            
                                    <div className="form-group">
                                        <label className="pl-3">Reason description</label>
                                        <textarea onChange={this.onChangeValue} defaultValue={this.state.reject_reason} className="input-field form-control" name="reject_reason" placeholder="Enter Reason description"></textarea>
                                    </div>
                                </div>
                          
                            </div>
                            <div className="text-right">
                            <button type="button" class="btn addCart py-1 px-3 mr-1" onClick={this.handleRejectSubmit}>Save</button>
                            </div>
                        </div>
                    </div>

                </form>
                :null}
            </React.Fragment>
        );
    }
}

export default withRouter(RejectReason);
