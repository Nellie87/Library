import React from 'react';
import Slider from "react-slick";
import Functions from '../../helpers/functions';
import Pagination from "react-js-pagination";
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { Button, Modal } from 'react-bootstrap';
const funcObj = new Functions();
class Audits extends React.Component {
    constructor(props) {
     
        super(props)
        
        this.state = {
            audit: [],
            per_page_limit: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            module:"",
            from_date: '',
            to_date: '',
            activity: '',
            show: false,
            audit_detail: [],
            number_of_records:10,
            user_detail:{},
            module_detail:{}
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    componentDidMount() {
        this.getaudit();
    }
   
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;

        this.getaudit();
    }
    handleOnchangeSource(event) {
        this.getaudit();
    }
    handleOnchangeSourceRecords(event) {

        this.setState({
            number_of_records: event.target.value
        });

        // document.getElementById('extra_sort_by').value = "";
        this.getaudit();
       
    }
    getaudit() {
        const from_date = document.getElementById('from_date').value;
        const to_date = document.getElementById('to_date').value;
        const activity = document.getElementById('activity').value;
        const module = document.getElementById('module').value;
        const number_of_records = document.getElementById('number_of_records').value ;
        let postBodyData = {
            page: this.state.current_page,
            per_page_limit: number_of_records,
            from_date: from_date,
            to_date: to_date,
            activity:activity,
            module:module
        };
        
        let endPoint = 'get-audit';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            if (data.code == 200) {
             
                this.setState({
                    audit: data.data.data,
                    current_page: this.state.current_page,
                    per_page_limit: this.state.number_of_records,
                    total_records: data.data.total,
                    activity:activity,
                    module:module
                });
            } else if (data.code == 201) {
            }
        });
    }
    handleModal(e,list) {
    
        if(typeof list != 'undefined'){
        if(list.activity == "create" && list.module == "User"){
                window.location = funcObj.getSitePath('edit-users?user_id='+list.module_id);
            }else if(list.activity == "create" && list.module == "Content" && list.module_detail){
                window.location = funcObj.getSitePath('private-bookdetail?book_id='+list.module_detail.encrypted_content_id);
            }else{
                this.setState({
                show: !this.state.show,
                audit_detail: list.detail,
                module:list.module,
                activity:list.activity,
                module_title:list.module_title,
                user_detail:list.user_detail,
                module_detail:list.module_detail
            });
        }

        }else{

            this.setState({
                show: !this.state.show
            });
        }
        

    }
    handlecloseModal() {
        // alert(data);
      
        this.setState({
            show: !this.state.show,
                  
        });
       
    }
    render() {
     console.log('module detail',this.state.module_detail)
        let { audit } = this.state;
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Audit</h3>

                        </div>
                        <div className="row">
                          
                            <div className="col-md-3">
                                <div className="form-group">
                                    <input type="date" id="from_date" defaultValue={this.state.from_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="From date" name="from_date" />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <input type="date" id="to_date" defaultValue={this.state.from_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="To date" name="to_date" />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <select name="module" id="module" defaultValue={this.state.module} onChange={(e) => this.handleOnchangeSource(e)} className="input-field form-control">
                                    {funcObj.getModuleDropdown()}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select name="activity" id="activity" defaultValue={this.state.activity} onChange={(e) => this.handleOnchangeSource(e)} className="input-field form-control">
                                    {funcObj.getActivityDropdown()}
                                </select>
                            </div>
                            <div className="col-md-2">
                            <select className="input-field form-control" defaultValue={this.state.number_of_records} name="number_of_records" id="number_of_records" onChange={(e) => this.handleOnchangeSourceRecords(e)} >
                                  
                            {
                                        Object.keys(funcObj.recordsPerPageOptions()).map(function (key){
                                            return <option key={key} value={key}>{funcObj.recordsPerPageOptions()[key]}</option>
                                        })
                                    }
                                </select>
                                </div>
                            {/* <div className="col-md-2">
                                <div className="form-group">
                                    <button type="button" className="btn darkBtn filter_search_btn">Search</button>
                                </div>
                            </div> */}
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        {/* <th scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox0" />
                                                <label for="checkbox0"></label>
                                            </div>
                                        </th>
                                        <th></th> */}
                                        <th scope="col" >User</th>
                                        {/* <th scope="col" >User Type</th> */}
                                        <th scope="col" >platform</th>
                                        <th scope="col"> Entity</th>
                                        <th scope="col"> Module</th>
                                        <th scope="col"> Activity</th>
                                        <th scope="col"> detail</th>
                                       
                                        <th scope="col"> Created on</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        audit.map((list, index) => {
                                          
                                            return (
                                                <tr>
                                                    {/* <td scope="col" width="100">
                                                        <div class="custom-checkbox">
                                                            <input type="checkbox" id="checkbox1" />
                                                            <label for="checkbox1"></label>

                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="img-wrap profile__img">
                                                            <img src={funcObj.assets_path("/images/user.png")} width="30" alt="books" />
                                                        </span>
                                                    </td> */}
                                                    <td>{list.user_detail.username}</td>
                                                    {/* <td>{list.user_detail.user_type}</td> */}
                                                    <td>{list.platform}</td>
                                                    <td>

                                                    {list.module_title && list.module_title != "" ?
                                                             
                                                    <React.Fragment>{list.module_title}</React.Fragment> 
                                                           
                                                                    :null
                                                        }
                                                   
                                                  
                                                  
                                                   
                                                    </td>
                                                    <td>{list.module}</td>
                                                    <td>{list.activity}</td>
                                                    <td>
                                                        <a href="#" onClick={(e) => this.handleModal(e,list)} >
                                                        
                                                        {
                                                            list.activity == 'create' ?
                                                            <span>View {list.module}</span>
                                                            :
                                                            <span>View Log</span>
                                                        }
                                                        
                                                        </a>
                                                        {/* {
                                                            list.detail.column.split(',').map((column, index) => {
                                                                index++
                                                                return (
                                                                    <div>{column.replaceAll("_", " ")}</div>
                                                                );
                                                            })
                                                        } */}
                                                    </td>
                                                   
                                                    <td>{list.created_on}</td>
                                                </tr>
                                            );
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                        <div className="table-bottom-content">
                            <nav aria-label="Page navigation ">
                                <Pagination
                                    activePage={this.state.current_page}
                                    itemsCountPerPage={this.state.number_of_records}
                                    totalItemsCount={this.state.total_records}
                                    onChange={this.handlePageChange.bind(this)}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </nav>
                            <div className="table__data float-right">
                                Showing  {Object.keys(audit).length} of {this.state.total_records}
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.show} onHide={() => this.handlecloseModal()}>
                    <Modal.Header closeButton>{this.state.module} - {this.state.activity} - {this.state.module_title}</Modal.Header>
                    <Modal.Body>
                        {
                           this.state.module == "Transaction" ?

                            <div>
                                    <p>
                                        User <strong>{this.state.user_detail.username}</strong>
                                    </p>
                                    {
                                        this.state.module_detail && Object.keys(this.state.module_detail).length>0 ?
                                    <>
                                    <p>
                                        Mobile <strong>{this.state.module_detail.mobile}</strong>
                                    </p>
                                    <p>
                                        Payment method <strong>{this.state.module_detail.payment_title}</strong>
                                    </p>
                                    <p>
                                        Payment for <strong>{this.state.module_detail.payment_for}</strong>
                                    </p>
                                    <p>
                                        Total amount <strong>{this.state.module_detail.total_amount}</strong>
                                    </p>
                                    <p>
                                        Status <strong>{this.state.module_detail.callback_status == 1?'Success':'Not done'}</strong>
                                    </p>
                                    </>
                                    :null}
                            </div>
                        :
                    <table class="table">
                                <thead>
                                    <tr>
                                      
                                        <th scope="col"> Column</th>
                                        <th scope="col"> Old </th>
                                        <th scope="col"> New </th>
                                    </tr>
                                </thead>
                                <tbody>
                        {
                        (this.state.audit_detail) ?
                        this.state.audit_detail.map((data) => {
                            return (
                                <tr>
                                    <td>{data.table_column}</td>
                                    <td>{data.old_value}</td>
                                    <td>{data.new_value}</td>
                                </tr>
                            );
                        })
                        : null
                        }
                    
                       </tbody>
                       </table>
                   
                        }
                    </Modal.Body>
                    <Modal.Footer>

                        <Button onClick={() => this.handleModal()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}
export default Audits;
