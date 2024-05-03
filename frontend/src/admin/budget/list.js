import React from 'react';
import { Link } from 'react-router-dom';

import Swal from "sweetalert2";
import Functions from '../../helpers/functions';
import Pagination from 'react-js-pagination';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class budget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vendor: {},
            area_of_intrest: {},
            from_date: '',
            to_date: '',
            search_text: '',
            per_page_limit: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
            user_id: [],
            allCheck: false,
            deleteButtonColor: '#999999',
            btnDisable: true,
            addUserPermission: true,
            number_of_records: 10,
            budget_id: '',
            previous_year: '',
            current_year: '',
            next_financial_year: '',
            amount:0
        }
    }


    componentDidMount() {
        this.getvendorList();
    }
    getvendorList() {
        // const from_date = document.getElementById('from_date').value;
        // const to_date = document.getElementById('to_date').value;
        // const user_type = document.getElementById('user_type') ? document.getElementById('user_type').value : "";
        // const area_of_intrest = document.getElementById('area_of_intrest').value;
        // const search_text = document.getElementById('search_text').value;
        // const number_of_records = document.getElementById('number_of_records').value;
        let postBodyData = {
            // "user_type": user_type,
            // "from_date": from_date,
            // "to_date": to_date,
            // "area_of_intrest": area_of_intrest,
            // "search_text": search_text,
            // "current_page": this.state.current_page,
            "per_page_limit": this.state.number_of_records,
        };
        let endPoint = 'budget-list';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

            if (response.code == 200) {
                this.setState({
                    budget: response.data.data,
                    total_records: response.data.total,
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


    handleOnchangeSource(event) {
        this.setState({ users: {} })
        this.getUserList();
    }


    handleOnchangeSourceRecords(event) {

        this.setState({
            number_of_records: event.target.value
        });

        // document.getElementById('extra_sort_by').value = "";
        this.getUserList();

    }
    render() {
        const elements = this.state.budget;
        console.log('element data',elements);
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Budget</h3>

                            <div className="float-right">
                                {(this.state.addUserPermission) ?
                                    <div className="add-btn-wrap">
                                        <span className="add-icon">+</span>
                                        <Link to="/budget-add" className="btn darkBtn">Add New Budget</Link>
                                    </div> : null}
                            </div>
                        </div>

                        <div className="table-responsive users_list">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {/* <th>
                                            <div className="custom-checkbox">
                                                <label for="all_users_check"></label>
                                            </div>
                                        </th> */}
                                        <th scope="col" >Financial year</th>
                                        <th scope="col" >Budget</th>
                                        {/* <th scope="col" > Edit</th> */}

                                    </tr>
                                </thead>
                                <tbody>
                                    {elements && Object.keys(elements).length > 0 ?
                                        elements.map((value, index) => {
                                            let checked = (value.is_blocked == 1) ? true : false;
                                            return (

                                                <tr key={index} >
                                                    {/* <td>
                                                        <div className="custom-checkbox">
                                                            <input type="checkbox" id={`checkbox0` + value.budget_id} value={value.budget_id} onChange={this.onChangeValue} checked={(value?.checked) ? true : false} />
                                                            <label for={`checkbox0` + value.budget_id}></label>
                                                        </div>
                                                    </td> */}
                                              
                                                    <td >{value.financial_year}</td>
                                                    <td >{value.amount}</td>
                                                    <td >
                                                        <Link to={`/budget-edit?budget_id=` + value.budget_id} ><i className="fas fa-edit"></i></Link>
                                                        </td>
                                                </tr>
                                            )
                                        }) : null}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-bottom-content">
                            <nav aria-label="Page navigation ">


                            </nav>
                            <div className="table__data float-right">

                            </div>
                        </div>
                    </div>
                </div>


            </React.Fragment>
        );
    }
}