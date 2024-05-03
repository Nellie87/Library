import React from 'react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import { Button,Modal} from 'react-bootstrap';  
import Moment from 'react-moment';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default  class AuthorsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            feedbacktData:[],
            per_page_limit:10,
            total_records:0,
            current_page:1,
            show:false,
            name:"",
            subject:"",
            description:"",
            mobile:"",
            discriptionHeight:{},
            feedbackPermission:true,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentDidMount(){
        this.getFeedback();
        this.getPermission();
    }

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getFeedback(pageNumber);    
    }

    getFeedback = () =>{
        let endPoint = 'get-feedback';
        let postBodyData = {
            "current_page": this.state.current_page,
            "per_page_limit": this.state.per_page_limit,
        }
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    feedbacktData:(data.data.data)?data.data.data:[],
                    total_records:data.data.total 
                });

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

    handleModal(data){  
        this.setState({
            show:!this.state.show,
            name:data.name,
            subject:data.content_title,
            description:data.feedback,
            mobile:data.mobile,
            discriptionHeight: (data.feedback.length>100)?{height:300}:{}
        })  
    }
    handleModalClose(){
        this.setState({
            show:!this.state.show,
            name:"",
            subject:"",
            description:"",
            mobile:"",
            discriptionHeight:{}
        })  
    } 

    getPermission() {
        
        let postBodyData = {
        };
        let endPoint = 'get-permission';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    for(let i=0; i< response.data.length; i++){
                        console.log(response.data[i].permission)
                        if(response.data[i].permission=="add_feedback" && response.data[i].is_permission==0){
                            this.setState({
                                feedbackPermission: false,
                            });
                        }
                    }

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

        });
    }

    render() {

        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">My Feedbacks</h3>
                            {
                                        (AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader') ?
                            <div className="float-right">
                                {(this.state.feedbackPermission)?
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-feedback" className="btn darkBtn">Add New Feedback</Link>
                                </div>:null}
                            </div>
                            :null
                            }
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                            <thead>
                                <tr>
                                    
                                    <th scope="col"> Content <i style={{display:'none'}} className="sort-icon"></i> </th>
                                    <th scope="col"> Content Owner<i style={{display:'none'}} className="sort-icon"></i> </th>
                                    <th scope="col"> Message <i style={{display:'none'}} className="sort-icon"></i> </th>
                                    <th scope="col"> Attachment <i style={{display:'none'}} className="sort-icon"></i> </th>
                                    <th scope="col"> Created on <i style={{display:'none'}} className="sort-icon"></i> </th>
                                </tr>
                            </thead>
                            <tbody>
                             {
                              this.state.feedbacktData && Object.keys(this.state.feedbacktData).length > 0 ?   
                              this.state.feedbacktData.map((value, index) => { 
                                return (
                                    <tr className='feedback_row'>
                                    <td onClick={()=>this.handleModal(value)}>{value.content_title}</td>{/* <td onClick={()=>this.handleModal(value)}>{value.mobile}</td> */}
                                        <td onClick={()=>this.handleModal(value)}>{value.content_owner}</td>
                                        <td onClick={()=>this.handleModal(value)} className="request-discription">{value.feedback}</td>
                                        <td onClick={()=>this.handleModal(value)}>
                                            {(value.attachment_file)?
                                                  <a  className='btn darkBtn' href={value.attachment_path} download target="_blank">
                                                  View
                                              </a>:null
                                            }
                                         
                                        </td>
                                        <td>
                                        <Moment format={funcObj.getFullDateTime()}>{value.created_at}</Moment>
                                        </td>
                                    </tr>
                                )}):null} 
                            </tbody>
                        </table>
                        </div>
                        <div className="table-bottom-content">
                            
                            <nav aria-label="Page navigation">
                                <Pagination
                                    activePage={this.state.current_page}
                                    itemsCountPerPage={this.state.per_page_limit}
                                    totalItemsCount={this.state.total_records}
                                    onChange={this.handlePageChange.bind(this)}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </nav>
                            <div className="table__data">
                              Showing  {Object.keys(this.state.feedbacktData).length} of {this.state.total_records}
                            </div>
                        </div>
                    </div>   
                </div>

                <Modal size='sm' className="" centered show={this.state.show} onHide={()=>this.handleModalClose()}>  
                    <Modal.Header className="requestHead" closeButton>Feedback Detail</Modal.Header>  
                    <Modal.Body className="request-modal-body"  style={this.state.discriptionHeight}>
                      
                        <h4>Content</h4>
                        <p className="requestText">{this.state.subject}</p>
                        <h4>Description</h4>
                        <p className="requestText">{this.state.description}</p>

                    </Modal.Body>  
                    <Modal.Footer>  
                        <Button className='delete' onClick={()=>this.handleModalClose()}>Close</Button>
                    </Modal.Footer>  
                </Modal>  
            </React.Fragment>
        );
    }
}