import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import generatePDF from '../helpers/reportGenerator';
import ReactToPrint from 'react-to-print';
import { PrintViewOnsingleContent } from './PrintViewOnsingleContent';
var XLSX = require("xlsx");
const funcObj = new Functions();
export default class ViewOnSingleUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            fromdate: '',
            todate: '',
            content_class: '',
            per_page_limit: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            title: ""
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    generatePDF(e) {
        e.preventDefault();
        let pdf_data = [];
        if (this.state.users && Object.keys(this.state.users).length > 0) {
            this.state.users.forEach(user => {
                const cData = [
                    user.first_name + ' ' + user.last_name,
                    user.views
                ];
                pdf_data.push(cData);

            });
        }

        let pdfObj = {
            title: "Views on content (" + this.state.title + ")",
            heading: ["Buyer Name", "Views"],
            data: pdf_data
        }
        generatePDF(pdfObj);
    }
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getViewOnContent(pageNumber);
    }

    componentDidMount() {
        this.getViewOnContent();
    }

    getViewOnContent = () => {
        let endPoint = 'single-views-contents';
        let content_id = funcObj.get_query_string('content_id');
        let postBodyData = {
            "content_id": content_id,
            "current_page": this.state.current_page,
            "per_page_limit": this.state.per_page_limit,
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    users: data.data.content.data,
                    total_records: data.data.content.total,
                    title: data.data.content_title.title
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
    handleExcel = () => {
        console.log('export excel ', this.state.users);
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(this.state.users);
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, "view-on-contents.xlsx");
    }
    render() {
        var users = this.state.users;
        let backlink = funcObj.get_query_string('backlink');
        return (
            <React.Fragment>

                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className='row'>


                            <div className='col-md-12'>


                                <div className='pull-left'>
                                    <div className="clearfix top-head mb-4">
                                        <h3 className="dashboard-title title-margin my-2 float-left">Views Result ({this.state.title})</h3>
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
                                        content={() => users}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className='row'>
                            <div className='col-md-12'>
                                <div className="table-responsive">
                                    <PrintViewOnsingleContent ref={el => (users = el)} transactions={users} />
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
                                    {
                                        Object.keys(this.state.users).length > 0 ?
                                            <div className="table__data float-right">
                                                Showing  {Object.keys(this.state.users).length} of {this.state.total_records}
                                            </div>
                                            : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}