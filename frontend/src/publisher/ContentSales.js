import React, { useEffect, useState } from 'react';
import PieGraphSection from './pie_graph_search';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Pagination from 'react-js-pagination';
import Swal from 'sweetalert2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import generatePDF from '../helpers/reportGenerator';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from './ComponentToPrint';
var XLSX = require("xlsx");
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

export default class SalesReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,

            from_date: '',
            to_date: '',
            content_class: '',
            per_page_limit: 10,
            total_records: 0,
            current_page: 1,
            classes: {},
            graph_data: [],

            default_categories: {},
            categories: {},
            category_id: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleOnchangeSource = this.handleOnchangeSource.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.sales(pageNumber);
    }

    componentDidMount() {
        this.getClasses();
        this.getCategories();
        this.sales();
    }
    handleChange(event) {
        this.sales();
        let category_id = document.getElementById('category_id').value;
        this.setState({
            category_id: category_id,

        });
        this.getsubCategories();
    }

    checkDate = () => {
        if (this.state.to_date && this.state.from_date) {
            this.sales();
        } else if (this.state.to_date == '' && this.state.from_date == '') {
            this.sales();
        }
    }

    handleOnchangeSource(event) {
        this.sales();

    }

    handleSubmit(event) {
        event.preventDefault();
        this.sales();
    }
    sales = () => {

        let endPoint = "sales-statistics";
        const from_date = document.getElementById('from_date').value;
        const to_date = document.getElementById('to_date').value;
        const class_id = document.getElementById('class_id').value;
        const categories = document.getElementById('category_id').value;
        const sub_categories = document.getElementById('sub_category_id').value;
        const publishing_house = document.getElementById('publishing_house').value;
        const content_title = document.getElementById('content_title').value;
        const number_of_records = document.getElementById('number_of_records').value;


        let postBodyData = {
            "from_date": from_date,
            "to_date": to_date,
            "class_id": class_id,
            "categories": categories,
            "sub_categories": sub_categories,
            "current_page": this.state.current_page,
            "per_page_limit": number_of_records,
            publishing_house: publishing_house,
            content_title: content_title,
        }
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(response => {
            console.log('response ', response)
            if (response.code == 200) {
                this.setState({
                    isLoaded: true,
                    transactions: response.data.transactions.data,
                    graph_data: response.data.graph_data,
                    total_records: response.data.transactions.total
                });

            } else if (response.code == 201) {

            }
        });
    }
    getClasses = () => {
        let endPoint = 'get-classes';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    classes: data.data
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
    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data);
                this.setState({
                    default_categories: data.data
                });

            } else if (data.code == 201) {
                Swal.fire({
                    title: 'Opps!',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    getsubCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        let category_id = document.getElementById('category_id').value;
        let subcategories = '';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                data.data.forEach(function (item) {
                    if (item.category_id == category_id) {
                        subcategories = item.subcategories;
                    }
                })
                this.setState({
                    categories: subcategories
                });
            } else if (data.code == 201) {
                Swal.fire({
                    title: 'Opps!',
                    showCloseButton: true,
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    handleExcel = (data) => {
        console.log('export excel ', data);
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(data);
     
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, "excel.xlsx");
    }
    generatePDF() {
        let pdf_data = [];
        if (Object.keys(this.state.transactions).length > 0) {


            this.state.transactions.forEach(content => {
                const contentData = [
                    content.title,
                    content.publishing_house,
                    content.count,
                    content.total_amount
                ];
                pdf_data.push(contentData);

            });
        }
        let pdfObj = {
            title: "Sales Statistics",
            heading: ["Content", "Publishing house", "Total Sale", "Total Amount"],
            data: pdf_data
        }
        generatePDF(pdfObj);
    }
    render() {

        let graph_data = this.state.graph_data;
        let transactions = this.state.transactions;

        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit} method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Filter Sales</h3>
                                <div className='pull-right'>
                                    <div className="m-2 generate_btn " onClick={() => generatePDF(transactions)}>
                                         <i class="fas fa-file-pdf-o fa-2x"></i>
                                    </div>
                                    <div className="m-2 generate_btn " onClick={() => this.handleExcel(transactions)}>
                                         <i class="fas fa-file-excel-o fa-2x"></i>
                                    </div>
                                   
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">Title </label>
                                        <input type="text" placeholder='enter content title' className="input-field form-control" defaultValue={this.state.content_title} onBlur={(e) => this.handleChange(e)} name="content_title" id="content_title" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">Publishing house </label>
                                        <input type="text" placeholder='enter publishing house' className="input-field form-control" defaultValue={this.state.publishing_house} onBlur={(e) => this.handleChange(e)} name="publishing_house" id="publishing_house" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">From-date  </label>
                                        <input type="date" className="input-field form-control" defaultValue={this.state.from_date} onBlur={(e) => this.handleChange(e)} name="from_date" id="from_date" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">To-date  </label>
                                        <input type="date" className="input-field form-control" defaultValue={this.state.to_date} onBlur={(e) => this.handleChange(e)} name="to_date" id="to_date" />
                                    </div>
                                </div>



                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="pl-3">Content Class </label>
                                        <select className="input-field form-control" defaultValue={this.state.class_id} onChange={(e) => this.handleChange(e)} name="class_id" id="class_id">
                                            <option value="">Select class</option>
                                            {
                                                this.state.classes && Object.keys(this.state.classes).length > 0 ?
                                                    this.state.classes.map((classd, index) => {
                                                        return (
                                                            <option key={index} value={classd.class_id}>{classd.class_title_s}</option>
                                                        )
                                                    })
                                                    : null}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="pl-3">Content Category </label>
                                        <select title="Content Class" className="input-field form-control" value={this.state.category_id} onChange={(e) => this.handleChange(e)} name="category_id" id="category_id">
                                            <option value="">Select Category</option>
                                            {
                                                this.state.default_categories && Object.keys(this.state.default_categories).length > 0 ?
                                                    this.state.default_categories.map((category, index) => {
                                                        return (
                                                            <option key={index} value={category.category_id} >{category.category_name}</option>
                                                        )
                                                    })
                                                    : null}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="pl-3">Content Sub Category </label>
                                        <select title="Content Class" className="input-field form-control" value={this.state.sub_category_id} onChange={(e) => this.handleChange(e)} name="sub_category_id" id="sub_category_id">
                                            <option value="">Select Sub Category</option>
                                            {
                                                this.state.categories && Object.keys(this.state.categories).length > 0 ?
                                                    this.state.categories.map((category, index) => {

                                                        return (
                                                            <option key={index} value={category.sub_category_id} >{category.sub_category_name}</option>
                                                        )


                                                    })
                                                    : null}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="pl-3">Records per page</label>
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
                </form>

                <div className=''>
                    <div className='col-md-12'>

                        <div className='card mt-4'>
                            <Tabs>
                                <TabList>

                                    <Tab ><i class="fas fa-chart-pie"></i> Pie Chart</Tab>
                                    <Tab selectedIndex={1}><i class="fas fa-table"></i> Tabular</Tab>
                                </TabList>

                                <TabPanel>
                                    <PieGraphSection graph_data={graph_data} />
                                </TabPanel>
                                <TabPanel>
                                   
                                    <div className="card mt-4 content_lists">
                                        <div className="dashboard-box">
                                            <div className="clearfix top-head mb-4">
                                                <h3 class="dashboard-title title-margin my-2 float-left">Search Result</h3>
                                            </div>
                                            <div className="table-responsive ">
                                            <ReactToPrint
                                        trigger={() => {
                                            return <a href="#" className="m-2 generate_btn " ><i class="fa fa-print fa-2x" aria-hidden="true"></i></a>;
                                        }}
                                        content={() => transactions}
                                    />
                                                <ComponentToPrint ref={el => (transactions = el)} transactions={transactions} />
                                                {

                                                    transactions && Object.keys(transactions).length > 0 ?
                                                        <Pagination
                                                            activePage={this.state.current_page}
                                                            itemsCountPerPage={this.state.per_page_limit}
                                                            totalItemsCount={this.state.total_records}
                                                            onChange={this.handlePageChange.bind(this)}
                                                            itemClass="page-item"
                                                            linkClass="page-link"
                                                        />
                                                        : null}
                                                <div className="table-bottom-content d-block mb-3">
                                                    {
                                                        AUTH_USER.account_type == 'admin' ?
                                                            <React.Fragment>
                                                                {/* <button type="button" className="btn lightBtn mr-2">Delete Selected</button>
                                            <button type="button" className="btn lightBtn mr-2">Approve Selected</button>
                                            <button type="button" className="btn lightBtn mr-2">Reject Selected</button> */}
                                                            </React.Fragment>
                                                            : null
                                                    }

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>

                        </div>
                    </div>
                </div>



            </React.Fragment>
        );
    }
}