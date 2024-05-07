import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import Checkout from '../public_pages/checkout';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Wishlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           wishlist_data:[],
           total_records: 0,
            current_page: 1,
            number_of_records:10
        }
    }
    componentDidMount(){
        this.getwishlist();
    }
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getwishlist();
    }
    handleOnchangeSource(event){
        this.setState({
            total_amount:event.target.value,
            [event.target.name]:event.target.value
        });
    }

   
    getwishlist(){
        
        let number_of_records = document.getElementById('number_of_records').value;
        let postBodyData = {
            per_page_limit: number_of_records,
            current_page:this.state.current_page         
        };
        let endPoint = 'get-bookmark';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            
            if (data.code == 200) {
                this.setState({
                    wishlist_data:data.data.data,
                    total_records:  data.data.pagination.total,

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
        this.getwishlist();
    }
    render() {
        
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">My wishlist</h3>
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
                                      
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.wishlist_data && Object.keys(this.state.wishlist_data).length > 0 ?
                                            this.state.wishlist_data.map((wishlist, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                        <Link to={`/private-bookdetail?book_id=` + wishlist.encrypted_content_id}>

                                                            <img src={wishlist.main_content_image} width="100" className="mr-1" alt="" />
                                                           </Link>
                                                        </td>
                                                        <td>
                                                            <div className="edit-feild position-relative">
                                                            <Link to={`/private-bookdetail?book_id=` + wishlist.encrypted_content_id}>
                                                            {wishlist.title}
                                                            </Link>
                                                                
                                                            </div>
                                                        </td>
                                                        <td>
                                                        {funcObj.showContentTypeTitle(wishlist.content_type)}
                                                           
                                                        </td>
                                                        <td>
                                                        {wishlist.class_title_s}
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
                                    Showing  {Object.keys(this.state.wishlist_data).length} of {this.state.total_records}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
