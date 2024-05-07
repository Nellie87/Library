import React from 'react';
import { Link } from 'react-router-dom';

import Swal from "sweetalert2";
import Functions from '../../helpers/functions';
import Pagination from 'react-js-pagination';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class list extends React.Component {
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
        let endPoint = 'vendor-list';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

            if (response.code == 200) {
                this.setState({
                    vendor: response.data.data,
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
    deletevendor = vendor_id => {
     

        Swal.fire({
            title: '',
            html: 'Are you sure want to delete?',
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes'
            
          }).then((result) => {
            if (result.isConfirmed) {
                let postBodyData = {
                    "vendor_id":vendor_id
                 };
                 let endPoint = 'delete-vendor';
                funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

                    if (response.code == 200) {
                       funcObj.redirectPage('vendor-management')
                    } else if (response.code == 201) {
                        funcObj.custom_alert_message(response.message)
                    }
        
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
        const elements = this.state.vendor;
        console.log('element data',elements);
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Vendor</h3>

                            <div className="float-right">
                                {(this.state.addUserPermission) ?
                                    <div className="add-btn-wrap">
                                        <span className="add-icon">+</span>
                                        <Link to="/vendor-add" className="btn darkBtn">Add New Vendor</Link>
                                    </div> : null}
                            </div>
                        </div>

                        <div className="table-responsive users_list">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col" > Name</th>
                                        <th scope="col"> Email</th>
                                        <th scope="col" > Mobile</th>
                                      
                                        <th scope="col" > Edit</th>
                                        <th>
                                            Remove
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {elements && Object.keys(elements).length > 0 ?
                                        elements.map((value, index) => {
                                            let checked = (value.is_blocked == 1) ? true : false;
                                            return (

                                                <tr key={index} >
                                                    
                                                    <td >
                                                        <span className="username">{value.name} </span>
                                                    </td>
                                                    <td >{value.email}</td>
                                                    <td >{value.phone}</td>
                                                   
                                                    <td ><Link to={`/vendor-edit?vendor_id=` + value.vendors_id} ><i className="fas fa-edit"></i></Link></td>
                                                    <td ><Link to="#" id={value.vendors_id} onClick={(e)=>this.deletevendor(value.vendors_id)}><i className="fa fa-trash action-btn-size"></i></Link></td>
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