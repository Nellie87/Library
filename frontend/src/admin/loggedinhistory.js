import React from 'react';

import CustomPagination from "../pagination";
import Functions from '../helpers/functions';
import Pagination from "react-js-pagination";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import generatePDF from '../helpers/reportGenerator';
import ReactToPrint from 'react-to-print';
import  { PrintLoggedinhistory }  from './PrintLoggedinhistory';
var XLSX = require("xlsx");
const funcObj = new Functions();

export default class UsersReport extends React.Component {
    constructor() {
        super();
        this.state = {
            page: 1,
            history: [],
            username: ""
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    generatePDF(e) {
        e.preventDefault();
        let pdf_data = [];

        if (this.state.history && Object.keys(this.state.history).length > 0) {
            this.state.history.forEach(history => {
                const userData = [
                    history.user_agent,
                    history.ip_address,
                    history.created_at
                ];
                pdf_data.push(userData);

            });
        }


        let pdfObj = {
            title: "Logged in History (" + this.state.username + ")",
            heading: ["User Agent", "IP Address", "Date"],
            data: pdf_data
        }
        generatePDF(pdfObj);
    }
    componentDidMount() {
        this.gethistoryList();
    }
    handlePageChange(pageNumber) {
        this.state.page = pageNumber;
        this.gethistoryList();
    }
    gethistoryList() {
        // const from_date = document.getElementById('from_date').value;
        // const to_date = document.getElementById('to_date').value;
        // // const user_type = document.getElementById('user_type').value;
        // const area_of_intrest = document.getElementById('area_of_intrest').value;
        // const search_text = document.getElementById('search_text').value;
        let user_id = funcObj.get_query_string('user_id');
        let postBodyData = {
            "user_id": user_id,
            "page": this.state.page,
        };
        let endPoint = 'get-loggedin-history';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)
            console.log(response.data);
            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    this.setState({
                        history: response.data.login_activities.data,
                        total_records: response.data.total,
                        username: response.data.user.username
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

        });
    }
    handleExcel = () => {
        console.log('export excel ', this.state.history);
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(this.state.history);
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, "logged-in-history.xlsx");
    }
    render() {

        let backlink = funcObj.get_query_string('backlink');
        const elements = [1, 2, 3, 4];
        let { history } = this.state;
        return (
            <React.Fragment>

                <div className="card mt-4">



                    <div className="dashboard-box">
                        <div className='col-md-12'>


                            <div className='pull-left'>
                                <div className="clearfix top-head mb-4">
                                    <h3 class="dashboard-title title-margin my-2 float-left">Logged in History ({this.state.username})</h3>
                                </div>
                            </div>
                            <div className='pull-right'>
                               
                                <div className="m-2 generate_btn " onClick={(e) => this.generatePDF(e)}>
                                     <i className="fas fa-file-pdf-o fa-2x"></i>
                                </div>
                                <div className="m-2 generate_btn " onClick={(e) => this.handleExcel(e)}>
                                     <i className="fas fa-file-excel-o fa-2x"></i>
                                </div>
                                <ReactToPrint
                                    trigger={() => {
                                        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                        // to the root node of the returned component as it will be overwritten.
                                        return <a href="#" className="m-2 generate_btn " ><i class="fa fa-print fa-2x" aria-hidden="true"></i></a>;
                                    }}
                                    content={() => history}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <PrintLoggedinhistory ref={el => (history = el)} transactions={history} />
                            
                        </div>
                        <div className="table-bottom-content">
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
                            <div className="table__data float-right">
                                Showing  {Object.keys(this.state.history).length} of {this.state.total_records}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}