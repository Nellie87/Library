import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import Functions from '../helpers/functions';
import generatePDF from '../helpers/reportGenerator';
import ReactToPrint from 'react-to-print';
import { ComponentToPrinttnx } from '../publisher/ComponentToPrinttnx';
var XLSX = require('xlsx');
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class DRMTransactionsStatics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            publisher_list: [],
            drm_data: [],
            number_of_records: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            from_date: "",
            to_date: "",
            sort_by: "desc",
            publisher: "",
            searchInpi: "",
            total_downloads: 0,
            total_copy_paste: 0,
            extra_sort_by_order: 'desc',
            extra_sort_by: "",
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
        }
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    handleOnchangeSourceRecords(event) {
        this.setState({
            number_of_records: event.target.value
        });
        this.getDrmList();
    }
    componentDidMount() {
        this.getPublisher();
        this.getDrmList();
    }

    setExtraSort(e, extra_sort_by) {
        e.preventDefault();
        if (document.getElementById('extra_sort_by_order').value == 'desc') {
            document.getElementById('extra_sort_by_order').value = 'asc';
        } else {
            document.getElementById('extra_sort_by_order').value = 'desc';
        }
        document.getElementById('extra_sort_by').value = extra_sort_by;
        this.getDrmList();
    }

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getPublisher(pageNumber);
        this.getDrmList();
    }

    getPublisher = () => {
        console.log('getPublisher')
        let endPoint = 'get-publisher';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {

            if (response.code == 200) {


                this.setState({
                    publisher_list: response.data,
                });

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


    }

    getDrmList() {
        const from_date = document.getElementById('from_date').value;
        const to_date = document.getElementById('to_date').value;
        const sort_by = document.getElementById('sort_by').value;
        const publisher = document.getElementById('publisher').value;
        const search_text = document.getElementById('searchInpi').value;
        let extra_sort_by = document.getElementById('extra_sort_by').value;
        let extra_sort_by_order = document.getElementById('extra_sort_by_order').value;
        let number_of_records = document.getElementById('number_of_records').value;
        let postBodyData = {
            "publisher_id": publisher,
            "search_text": search_text,
            "sort_by": sort_by,
            "from_date": from_date,
            "to_date": to_date,
            "extra_sort_by": extra_sort_by,
            "extra_sort_by_order": extra_sort_by_order,
            "current_page": this.state.current_page,
            "per_page_limit": number_of_records,
        };
        let endPoint = 'get-drm-reports';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

            if (response.code == 200) {
                let totalDownload = 0;
                let totalCopyPaste = 0;
                for (let i = 0; i < response.data.data.length; i++) {
                    console.log("totalDownload", response.data.data[i].downloads)
                    totalDownload = totalDownload + parseInt(response.data.data[i].downloads)
                    totalCopyPaste = totalCopyPaste + parseInt(response.data.data[i].copy_paste)
                }
                console.log("totalDownload", totalDownload)
                this.setState({
                    drm_data: response.data.data,
                    total_records: response.data.total,
                    total_downloads: totalDownload,
                    total_copy_paste: totalCopyPaste,
                    extra_sort_by: extra_sort_by,
                    extra_sort_by_order: extra_sort_by_order,
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

    handleOnchangeSource(e) {
        this.setState({ drm_data: [] })
        this.getDrmList();
    }

    generatePDF() {
        let pdf_data = [];
        if (this.state.drm_data && Object.keys(this.state.drm_data).length > 0) {



            this.state.drm_data.forEach(content => {
                const contentData = [
                    content.title,
                    content.publishing_house,
                    content.copy_paste == 0 ? "No" : "Yes",
                    content.printing == 0 ? "No" : "Yes",
                    content.total_number_of_devices,
                    content.downloads == 0 ? "No" : "Yes",
                ];
                pdf_data.push(contentData);

            });
        }


        let pdfObj = {
            title: "DRM Report",
            heading: ["Title", "Publishing house", "Copy Paste", "Printing", "Number of devices", "Downloads"],
            data: pdf_data
        }
        generatePDF(pdfObj);
    }
    handleExcel = () => {
        console.log('export excel ', this.state.drm_data);
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(this.state.drm_data);

        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, "logged-in-excel.xlsx");
    }
    render() {
        let books = this.state.drm_data;

        return (
            <React.Fragment>
                <div>
                    <div className='col-md-12'>


                        <div className="card mt-4">
                            <div className='col-md-12'>


                                <div className='pull-left'>
                                    <div className="clearfix top-head mt-3 mb-4">
                                        <h3 className="dashboard-title title-margin m-0 float-left">Drm Report</h3>
                                    </div>
                                </div>
                                <div className='pull-right'>
                                    <div className="m-2 generate_btn " onClick={() => this.generatePDF()}>
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
                                        content={() => books}
                                    />
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-md-2">
                                    <div className="form-group">
                                        <input type="text" defaultValue={this.state.searchInpi} onBlur={(e) => this.handleOnchangeSource(e)} name="searchInpi" id="searchInpi" placeholder="Search content" className="input-field form-control" />
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <div className="form-group">
                                        <input type="date" max={this.state.setMaxDate} defaultValue={this.state.from_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="From date" id="from_date" name="from_date" />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <input type="date" max={this.state.setMaxDate} defaultValue={this.state.to_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="To date" id="to_date" name="to_date" />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <select className="input-field form-control" id="publisher" name="publisher" defaultValue={this.state.publisher} onChange={(e) => this.handleOnchangeSource(e)}>
                                        <option value="">Select Publisher</option>
                                        {this.state.publisher_list && Object.keys(this.state.publisher_list).length > 0 ?
                                            this.state.publisher_list.map((publisher, index) => {
                                                return (
                                                    <option key={index} value={publisher.id} >{publisher.first_name}  {publisher.last_name}</option>
                                                )
                                            })
                                            : null}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <div className="d-flex align-items-center">
                                        <span>Sortby</span>
                                        <select id="sort_by" defaultValue={this.state.sort_by} onChange={(e) => this.handleOnchangeSource(e)} name="sort_by" className="mb-0 ml-3 form-control m-1 input_field">
                                            <option value="asc">Latest</option>
                                            <option value="desc" >Oldest</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <select className="input-field form-control" defaultValue={this.state.number_of_records} name="number_of_records" id="number_of_records" onChange={(e) => this.handleOnchangeSourceRecords(e)} >

                                            {
                                                Object.keys(funcObj.recordsPerPageOptions()).map(function (key) {
                                                    return <option key={key} value={key}>{funcObj.recordsPerPageOptions()[key]}</option>
                                                })
                                            }

                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='col-md-12'>


                    <div className="card mt-4 content_lists">
                        <div className="clearfix top-head mt-3 mb-4">
                            <h3 className="dashboard-title title-margin m-0 float-left">Transactions</h3>
                        </div>
                        <div className="dashboard-box">
                            <input type="hidden" id="extra_sort_by" value={this.state.extra_sort_by} />
                            <input type="hidden" id="extra_sort_by_order" value={this.state.extra_sort_by_order} />
                            {/* <div className="table-responsive drm_transactions" > */}
                            <div className="table-responsive" >
                                <ComponentToPrinttnx ref={el => (books = el)} transactions={books} />
                                <div className="clearfix">
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
                                        Showing  {Object.keys(this.state.drm_data).length} of {this.state.total_records}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="clearfix top-head mt-3 mb-4">
                            <h3 className="dashboard-title title-margin m-0 float-left">Statistics</h3>
                        </div>
                        <div className="dashboard-box">
                            <p>Total copy and paste : <b>{this.state.total_copy_paste}</b></p>
                            <p>Total Downloads : <b>{this.state.total_downloads}</b></p>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}
export default DRMTransactionsStatics;
