import React from 'react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import { Button,Modal} from 'react-bootstrap';  
import Functions from '../helpers/functions';

const funcObj = new Functions();
export default  class ReadersRequest extends React.Component {

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
            request_id:[],
            allCheck: false,
            deleteButtonColor: '#999999',
            btnDisable: true,
            replyShow: false,
            replyData:[]
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeallValue = this.onChangeallValue.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    }

    componentDidMount(){
        this.getRequest();
    }

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getRequest(pageNumber);    
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
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    deleteRequest = () => {
        let endPoint = 'delete-request';
        let postBodyData = {
            "request_id": this.state.request_id
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                // console.log(data)
                this.getRequest();
                this.setState({ deleteButtonColor: '#999999', btnDisable: true, request_id: [], allCheck: false })
                funcObj.custom_alert_message(data.message,'success');

            } else if (data.code == 201) {
                funcObj.custom_alert_message(data.message);
            }
        });
    }

    onChangeallValue(event) {
        console.log('onChangeallValue')
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            this.setState({ deleteButtonColor: '#302f91', btnDisable: false })
            let request = this.state.requestData;
            this.setState({ allCheck: true });
            request.forEach(el => {
                this.state.request_id.push((el.request_id).toString());
                el.checked = true;
            })
            // console.log(this.state.content_id)
        } else {
            let request = this.state.requestData;
            this.setState({ deleteButtonColor: '#999999', btnDisable: true })
            request.forEach(el => {
                el.checked = false;
            })
            this.setState({
                requestData: request,
                request_id: [],
                allCheck: false
            })

             console.log(this.state.request_id)
        }
    }
    onChangeValue(event) {
        console.log('onChangeValue')
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.categories[value] = value; 
            this.state.request_id.push(value);
            this.setState({ deleteButtonColor: '#302f91', btnDisable: false })
            let request = this.state.requestData;
            request.forEach(el => {
                if (el.request_id == value) {
                    el.checked = true;
                }
            })
            this.setState({requestData:request})
        } else {
            var index = this.state.request_id.indexOf(event.target.value)
            if (index !== -1) {
                this.state.request_id.splice(index, 1);
                if (this.state.request_id.length < 1) {
                    this.setState({ deleteButtonColor: '#999999', btnDisable: true })
                }
            }
            let request = this.state.requestData;
            request.forEach(el => {
                if (el.request_id == value) {
                    el.checked = false;
                }
            })
            this.setState({requestData:request})
        }

        console.log(this.state.request_id)
    }

    handleDeleteSubmit(event) {
        event.preventDefault();
        this.deleteRequest();
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
                   funcObj.custom_alert_message(data.message);
            }
        });
    }

    render() {

        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Requests</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <div className="custom-checkbox">
                                            <input  type="checkbox" onChange={this.onChangeallValue} id="checkbox2" checked={(this.state.allCheck) ? true : false} />
                                            <label htmlFor="checkbox2"></label>
                                        </div>
                                    </th>
                                    <th>Username</th>
                                    <th scope="col" >Title</th>
                                    <th scope="col"> Description</th>
                                    <th scope="col"> Subject</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">View Reply</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.requestData && Object.keys(this.state.requestData).length > 0 ?  
                                this.state.requestData.map((value, index) => { 
                                    return (
                                        <tr key={index}> 
                                            <td scope="col"  width="100">
                                                <div className="custom-checkbox">
                                                    <input  type="checkbox" value={value.request_id} id={"checkbox_" + value.request_id} onChange={this.onChangeValue} checked={(value?.checked) ? true : false} />
                                                    <label htmlFor={"checkbox_" + value.request_id}></label>
                                                </div>
                                            </td>
                                            <td onClick={()=>this.handleModal(value)}>
                                                <span>{value.first_name} {value.last_name}</span>
                                            </td>
                                            <td onClick={()=>this.handleModal(value)}>{value.title}</td>
                                        
                                            <td onClick={()=>this.handleModal(value)}>
                                                <span className="dec request-discription" >
                                                    {value.description}
                                                </span>
                                            </td>
                                            <td onClick={()=>this.handleModal(value)}>{value.subject_class}</td>
                                            <td><Link to={`/readers-reply?request_id=`+value.request_id+`&name=`+value.first_name+" "+value.last_name } className="" ><i className="fa fa-reply drm-btn-size" aria-hidden="true"></i></Link></td>
                                            {(value.total_reply>0)?<td onClick={()=>this.handleReplayModal(value)}><i className="curptr fa fa-eye drm-btn-size" aria-hidden="true"></i></td>:null}
                                        </tr>

                                    )}):null} 
                               
                            
                            </tbody>
                        </table>
                        </div>
                        <div className="table-bottom-content">
                            <button type="button" data-toggle="modal" data-target="#deleteModal" disabled={this.state.btnDisable} style={{ backgroundColor: this.state.deleteButtonColor }} className="btn lightBtn">Delete Selected</button>
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
                      {/* request Detail     modal              */}
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

                        {/* delete request modal                 */}
                <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog delete-modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Delete Content</h5>
                                <button type="button" onClick={this.close} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure want to delete request!
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.close} className="btn closedelete" data-dismiss="modal">Close</button>
                                <button type="button" onClick={this.handleDeleteSubmit} data-dismiss="modal" className="btn delete mr-2">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            
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