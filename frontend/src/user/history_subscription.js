import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import Checkout from '../public_pages/checkout';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class HistorySubscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           history:[],
           total_records: 0,
            current_page: 1,
            number_of_records:10
        }
    }
    componentDidMount(){
        this.gethistory();
    }
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.gethistory();
    }
    handleOnchangeSource(event){
        this.setState({
            total_amount:event.target.value,
            [event.target.name]:event.target.value
        });
    }

   
    gethistory(){
        
        let number_of_records = document.getElementById('number_of_records').value;
        let postBodyData = {
            per_page_limit: number_of_records,
            current_page:this.state.current_page         
        };
        let endPoint = 'subscription-history';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            
            if (data.code == 200) {
                this.setState({
                    history:data.data.data,
                    total_records:  data.data.total,
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
    handleOnchangeSourceRecords(event) {
        this.setState({
            number_of_records: event.target.value
        });
        this.gethistory();
    }
    render() {
        
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Subscription History</h3>
                            <div className="pull-right">
                                <div className="form-group">
                                    <select className="input-field form-control" defaultValue={this.state.number_of_records} name="number_of_records" id="number_of_records" onChange={(e) => this.handleOnchangeSourceRecords(e)} >
                                    
                                    {
                                        Object.keys(funcObj.recordsPerPageOptions()).map(function (key){
                                            return <option key={key} value={key}>{funcObj.recordsPerPageOptions()[key]}</option>
                                        })
                                    }
                                    
                                    </select>
                                </div>
                            </div>
                        </div>
                   
                        <div className="table-responsive">
                            <table class="table">
                                <thead>

                                    <tr>
                                        
                                        <th scope="col">Content</th>    
                                        <th scope="col">Title</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Class</th>
                                        
                                        <th scope="col">Subscription start </th>
                                        <th scope="col">Subscription end</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.history && Object.keys(this.state.history).length > 0 ?
                                            this.state.history.map((history, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                        <Link to={`/private-bookdetail?book_id=` + history.encrypted_content_id}>
                                                            <img src={history.main_content_image} width="100" className="mr-1" alt="" />
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <div className="edit-feild position-relative">
                                                            <Link to={`/private-bookdetail?book_id=` + history.encrypted_content_id}>
                                                            {history.title}
                                                            </Link>
                                                                
                                                            </div>
                                                        </td>
                                                        <td>
                                                        {funcObj.showContentTypeTitle(history.content_type)}
                                                           
                                                        </td>
                                                        <td>
                                                        {history.class_title_s}
                                                        </td>
                                                  
                                                        <td> {history.subscriptionon}</td>
                                                        <td>{history.subscriptionend}</td>
                                                        <td>
                                                                                    <Link className="btn darkBtn" to={`/private-bookdetail?book_id=` + history.encrypted_content_id + `&backlink=my-books`}>
                                                                                        Subscribe
                                                                                    </Link>

                                                                                </td>
                                                    </tr>
                                                );
                                            })
                                            : null
                                    }


                                </tbody>
                            </table>
                            <div className="table-bottom-content">
                                {/* <button type="button" className="btn lightBtn">Delete Selected</button> */}
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
                                    Showing  {Object.keys(this.state.history).length} of {this.state.total_records}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
