import React from 'react';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();

class CategorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            default_categories: [],
            per_page_limit: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
        };
        this.onChangeToggle = this.onChangeToggle.bind(this);
    }
    componentDidMount() {
        this.getplan();
    }
    
    onChangeToggle(event){
        
        let target = event.target;
        let value = target.value;
        
        if(target.checked){
            this.enablePlan(value, 1)
        }else{
            this.enablePlan(value, 0)
        }
    }
    enablePlan = (plan_id,is_enabled) => {
        let endPoint = 'enable-plan';
        let postBodyData = {
            plan_id:plan_id,
            is_enabled:is_enabled
        }
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            funcObj.custom_alert_message(data.message)
        });
    }
    deletePlan = (plan_id) => {
        

        Swal.fire({
            title: '',
            html: 'Are you sure want to delete?',
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes'
            
          }).then((result) => {
            if (result.isConfirmed) {
                let endPoint = 'delete-plan';
                let postBodyData = {
                    plan_id:plan_id
                }
                funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
                    funcObj.custom_alert_message(data.message)
                    this.getplan();
                });
           } 
         })
    }
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getplan();
    }
    getplan = () => {
        let endPoint = 'get-plan';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    default_categories: data.data,
                    // total_records:  data.data.categories.total,
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
    render() {
        console.log('default plan', this.state.default_categories);
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Subscription List</h3>
                            <div className="float-right">
                                <div className="">
                                    <Link to='/add-plan' className="btn darkBtn">Add Plan</Link>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                                <thead>

                                    <tr>
                                        {/* <th scope="col">Service</th> */}
                                        <th scope="col">Title</th>
                                        <th scope="col">Number of days</th>
                                        <th scope="col">Charges</th>
                                        <th scope="col">Enabled</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Remove</th>
                                      </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.default_categories && Object.keys(this.state.default_categories).length > 0 ?
                                            this.state.default_categories.map((plan, index) => {
                                                let checked= (plan.is_enabled==1)?true:false;
                                                return (
                                                    <tr>
                                                        
                                                        <td>
                                                            <div className="edit-feild position-relative">
                                                                {plan.duration}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="edit-feild position-relative">
                                                                {plan.no_of_days}
                                                            </div>
                                                        </td>
                                                        <td> {plan.charges}</td>
                                                        <td >
                                                        <label className="switch"  for={`block_swith`+plan.plan_id}>
                                                            <input id={`block_swith`+plan.plan_id} defaultChecked={checked} value={plan.plan_id} onChange={this.onChangeToggle} type="checkbox"/>
                                                            <span className="slider round"></span>
                                                        </label>
                                                    </td>
                                                        <td>
                                                        
                                                        <Link to={`add-plan?plan_id=`+plan.plan_id}><i class="fas fa-edit"></i></Link>
                                                        </td>
                                                        <td>
                                                        <Link to="#" onClick={(e)=>this.deletePlan(plan.plan_id)}><i className="fa fa-trash action-btn-size"></i></Link>
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
                                    {/* <Pagination
                                        activePage={this.state.current_page}
                                        itemsCountPerPage={this.state.per_page_limit}
                                        totalItemsCount={this.state.total_records}
                                        onChange={this.handlePageChange.bind(this)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                    /> */}
                                </nav>
                                <div className="table__data">
                                    {/* Showing  {Object.keys(this.state.default_categories).length} of {this.state.total_records} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default CategorList;