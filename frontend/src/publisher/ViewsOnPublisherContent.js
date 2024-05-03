import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import generatePDF from '../helpers/reportGenerator';
import ReactToPrint from 'react-to-print';
import { ComponentToPrintcontent } from './ComponentToPrintcontent';

var XLSX= require("xlsx");
const funcObj = new Functions();
export default class ViewsOnPublisherContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: [],
            from_date: '',
            to_date: '',
            class_id: '',
            number_of_records: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    generatePDF(e) {
        e.preventDefault();
        let pdf_data = [];

        if (this.state.contents && Object.keys(this.state.contents).length > 0) {
            this.state.contents.forEach(content => {
                const cData = [
                    content.title+'('+content.class_title_s+')',
                    content.subtitle,
                    content.author_name,
                    content.content_type == 'free' ?funcObj.showContentTypeTitle(content.content_type):content.content_price+' '+funcObj.getCurrencyText(),
                    content.content_views
                ];
                pdf_data.push(cData);

            });
        }


        let pdfObj = {
            title: "Views on content",
            heading: ["Book Title",	"Book Subtitle",	"Author Name",	"Licence",	"Total Views"],
            data: pdf_data
        }
        generatePDF(pdfObj);
    }

    handleOnchangeSourceRecords(event) {
        this.setState({
            number_of_records: event.target.value
        });
        this.getViewsOnContents();
    }

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getViewsOnContents(pageNumber);
    }
    componentDidMount() {
        this.getViewsOnContents();
        this.getClasses();
    }

    handleChange(event) {
        event.preventDefault();
        this.getViewsOnContents();
    }

    checkDate = () => {
        if (this.state.to_date && this.state.from_date) {
            this.getViewsOnContents();
        } else if (this.state.to_date == '' && this.state.from_date == '') {
            this.getViewsOnContents();
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        this.getViewsOnContents();
    }

    getViewsOnContents = () => {
        let endPoint = 'views-on-contents';
        const from_date = document.getElementById('from_date').value;
        const to_date = document.getElementById('to_date').value;
        const class_id = document.getElementById('class_id').value;
        const number_of_records = document.getElementById('number_of_records').value;
        let postBodyData = {
            "from_date": from_date,
            "to_date": to_date,
            "class_id": class_id,
            "current_page": this.state.current_page,
            "per_page_limit": number_of_records,
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                console.log(data)
                this.setState({
                    contents: data.data.data,
                    total_records: data.data.total,
                    from_date: from_date,
                    to_date: to_date,
                    class_id: class_id
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
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }
    handleExcel = () => {
        console.log('export excel ', this.state.contents);
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(this.state.contents);
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, "view-publisher-excel.xlsx");
    }
    render() {
        let contents = this.state.contents;
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="">

                        <div className="row">
                            <div className='col-md-12'>


                                <div className='pull-left'>
                                    <div className="clearfix top-head mb-2">
                                        <h3 className="dashboard-title title-margin my-2 float-left">Filter Views On Content</h3>
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
                                    content={() => contents}
                                />
                                </div>
                         </div>
                     </div>
                        
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">From-date  </label>
                                        <input type="date" max={this.state.setMaxDate} className="input-field form-control" defaultValue={this.state.from_date} onBlur={(e) => this.handleChange(e)} name="from_date" id="from_date" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">To-date  </label>
                                        <input type="date" max={this.state.setMaxDate} className="input-field form-control" defaultValue={this.state.to_date} onBlur={(e) => this.handleChange(e)} name="to_date" id="to_date" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">Content class </label>
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
                                    <label className="pl-3">Records per page</label>
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
                                {/* <div className="col-lg-3">
                                    <div className="form-group">
                                        <button type="submit" className="btn addCart py-1 px-3 mr-1 mt-30">Search</button>
                                    </div>
                                </div>   */}
                            </div>
                           
                        </div>
                    </div>
                </form>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Search Result</h3>
                        </div>
                        <div className="table-responsive">
                        <ComponentToPrintcontent ref={el => (contents = el)} contents={contents} />
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
                                Showing  {Object.keys(contents).length} of {this.state.total_records}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}