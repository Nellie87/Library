import React from 'react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import { Button,Modal} from 'react-bootstrap';  
const funcObj = new Functions();
export default  class RequestForHelpList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            requestData:[],
            per_page_limit:10,
            total_records:0,
            current_page:1,
            show:false,
            title:"",
            subject:"",
            description:"",
            discriptionHeight:{},
            requestPermission:true,
            replyShow: false,
            replyData:[]
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    componentDidMount(){
        this.getRequest();
        this.getPermission();
    }

    handleModal(data){  
        this.setState({
            show:!this.state.show,
            title:data.title,
            subject:data.subject_class,
            description:data.description,
            discriptionHeight: (data.description.length>100)?{height:300}:{}
        })  
    }
    handleModalClose(){
        this.setState({
            show:!this.state.show,
            title:"",
            subject:"",
            description:"",
            discriptionHeight:{}
        })  
    }  

    handleReplayModal(data){
        this.getReply(data.request_id);  
        this.setState({
            replyShow:!this.state.replyShow,
        })  
    }
    handleReplayModalClose(){
        this.setState({
            replyShow:!this.state.replyShow,
        })  
    } 

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getRequest(pageNumber);    
    }

    getRequest = () =>{
        let endPoint = 'get-request';
        let postBodyData = {
            "current_page": this.state.current_page,
            "per_page_limit": this.state.per_page_limit,
        }
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    requestData:(data.data.data)?data.data.data:[],
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
                         if(response.data[i].permission=="add_request" && response.data[i].is_permission==0){
                            this.setState({
                                requestPermission: false,
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

    getReply = (req_id) =>{
        let endPoint = 'reply-comments';
        let postBodyData = {
            "request_id":req_id
        }
        
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    replyData:(data.data)?data.data:[],
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

    render() {

        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Request for Help</h3>
                            <div className="float-right">
                                {(this.state.requestPermission)?
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-request" className="btn darkBtn">Add Request</Link>
                                </div>:null}
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                            <thead>
                                <tr>
                                    {/* <th scope="col">
                                        <div className="custom-checkbox">
                                            <input type="checkbox" id="checkbox0" />
                                            <label htmlFor="checkbox0"></label>
                                        </div>
                                    </th> */}
                                    {/* <th></th> */}
                                    <th scope="col" >Title<i style={{display:'none'}} className="sort-icon"></i></th>
                                    <th scope="col"> Description <i style={{display:'none'}} className="sort-icon"></i></th>
                                    <th scope="col"> Subject <i style={{display:'none'}} className="sort-icon"></i></th>
                                    <th scope="col">Action</th>
                                    <th scope="col">View Reply</th>
                                </tr>
                            </thead>
                            <tbody>

                            {
                              this.state.requestData && Object.keys(this.state.requestData).length > 0 ?  
                              this.state.requestData.map((value, index) => { 
                                return (
                                    <tr>
                                        {/* <td scope="col"  width="100">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox1" />
                                                <label htmlFor="checkbox1"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td> */}
                                        {/* <td>
                                            <span className="img-wrap profile__img">
                                                <img src={funcObj.assets_path("/images/user.png")} width="30" alt="books" />
                                            </span>
                                        </td> */}
                                        <td  onClick={()=>this.handleModal(value)}>{value.title}</td>
                                    
                                        <td  onClick={()=>this.handleModal(value)}>
                                            <span className="dec request-discription" >
                                                {value.description}
                                            </span>
                                        </td>
                                        <td  onClick={()=>this.handleModal(value)}>{value.subject_class}</td>
                                        <td><Link to={`/readers-reply?request_id=`+value.request_id} className="" ><i className="fa fa-reply drm-btn-size" aria-hidden="true"></i></Link></td>
                                        {(value.total_reply>0)?<td onClick={()=>this.handleReplayModal(value)}><Link className="" ><i className="fa fa-eye drm-btn-size" aria-hidden="true"></i></Link></td>:null}
                                    </tr>

                                )}):null} 
                               
                            </tbody>
                        </table>
                        </div>
                        <div className="table-bottom-content">
                            {/* <button type="button" className="btn lightBtn">Delete Selected</button> */}
                            <nav aria-label="Page navigation ">
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
                              Showing  {Object.keys(this.state.requestData).length} of {this.state.total_records}
                            </div>
                        </div>
                    </div>   
                </div>
            
                <Modal size='sm' className="" centered show={this.state.show} onHide={()=>this.handleModalClose()}>  
                    <Modal.Header className="requestHead" closeButton>Request Detail</Modal.Header>  
                    <Modal.Body className="request-modal-body"  style={this.state.discriptionHeight}>
                        <h4>Title</h4>
                        <p className="requestText">{this.state.title}</p>
                        <h4>Subject</h4>
                        <p className="requestText">{this.state.subject}</p>
                        <h4>Description</h4>
                        <p className="requestText">{this.state.description}</p>

                    </Modal.Body>  
                    <Modal.Footer>  
                        <Button className='delete' onClick={()=>this.handleModalClose()}>Close</Button>
                    </Modal.Footer>  
                </Modal>  

                <Modal size='sm' className="" centered show={this.state.replyShow} onHide={()=>this.handleReplayModalClose()}>  
                    <Modal.Header className="requestHead" closeButton>Reply Comments</Modal.Header>  
                    <Modal.Body className="request-modal-body"  style={this.state.discriptionHeight}>
                        {this.state.replyData && Object.keys(this.state.replyData).length > 0 ?  
                            this.state.replyData.map((value, index) => { 
                                return (
                                    <div>
                                        <b>{value.name.first_name} {value.name.last_name}</b>
                                        <p>{value.reply_message}</p>
                                    </div>
                                   
                                )}
                            ):null
                        } 
                    </Modal.Body>  
                    <Modal.Footer>  
                        <Button className='delete' onClick={()=>this.handleReplayModalClose()}>Close</Button>
                    </Modal.Footer>  
                </Modal>  
            </React.Fragment >
        );
    }
}