import React from 'react';
import SearchGraph from "./search_graph";
import Functions from '../../helpers/functions';
import SearchGraphNew from './search_graph_new';
import PieGraph from '../../graphs/pie';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import generatePDF from '../../helpers/reportGenerator';
import ReactToPrint from 'react-to-print';
import { PrintSearchReport } from './PrintSearchReport';
var XLSX = require('xlsx');
const funcObj = new Functions();
export default class SearchReportNew extends React.Component {

    constructor() {
        super();
        this.state = {
            from_date: '20-05-2020',
            to_date: '20-05-2021',
            search_contents: {},
            search_duration: 'week',
            search_content: 'categories',
            show_date_range: false,
        };
        this.handleChange = this.handleChange.bind(this);

    }
    generatePDF() {
        let pdf_data = [];
        if (this.state.search_contents.transactions && Object.keys(this.state.search_contents.transactions).length > 0) {


            this.state.search_contents.transactions.forEach(content => {
                const contentData = [
                    content.content_name,
                    content.total_sum_count,

                ];
                pdf_data.push(contentData);

            });
        }
        let pdfObj = {
            title: "Search for " + this.state.search_content,
            heading: ["Name", "Total"],
            data: pdf_data
        }
        generatePDF(pdfObj);
    }
    handleChange(e) {
        const target_name = e.target.name;
        const target_val = e.target.value;

        if (target_name == 'search_duration') {
            if (target_val == "date_range") {
                this.setState({
                    show_date_range: true,
                });
            } else {
                this.setState({
                    show_date_range: false,
                });

            }

        }

        this.getSearchContents();
    }
    handleChangeDate(e) {
        const target_name = e.target.name;
        const target_val = e.target.value;
        if (e.target.name == 'to_date') {
            if (document.getElementById('from_date').value == "") {
                funcObj.custom_alert_message('Please select from date!');
                return false;
            }
        }
        this.getSearchContents();

    }
    componentDidMount() {
        this.getSearchContents();
    }

    getSearchContents() {
        const search_content = document.getElementById('search_content') ? document.getElementById('search_content').value : this.state.search_content;
        const search_duration = document.getElementById('search_duration') ? document.getElementById('search_duration').value : this.state.search_duration;
        const from_date = document.getElementById('from_date') ? document.getElementById('from_date').value : this.state.from_date;
        const to_date = document.getElementById('to_date') ? document.getElementById('to_date').value : this.state.to_date;
        let postBodyData = {
            search_content: search_content,
            search_duration: search_duration,
            from_date: from_date,
            to_date: to_date
        };
        let endPoint = 'search-content-report';
        funcObj.commonFetchApiCall(postBodyData, endPoint, "POST").then(data => {
            if (data.code == 200) {
                console.log('search data', data.data)
                this.setState({
                    search_contents: data.data,
                    search_content: search_content,
                    search_duration: search_duration,
                    from_date: from_date,
                    to_date: to_date
                });
            }
        });
    }

    classes_pie_graph() {
        let search_contents = this.state.search_contents;

        // let cls_name = [];
        // let cls_value = [];

        // search_contents.forEach((element, index) => {
        //         cls_name.push(element.class_title_s);
        //         cls_value.push(element.total_content_count);
        //     });

        // console.log('class name element', cls_name);
        const data = {
            labels: search_contents.pie_labels_data,
            datasets: search_contents.piedatasets,
        };
        return (
            <PieGraph pie_data={data} title="Total counts" />
        );
    }

    filter_options(key = "") {
        let obj = {
            'classes': 'Classes',
            'categories': 'Categories',
            'search_text': 'Search Keywords',
            'author': 'Authors',
            'publisher': 'Publishers',

        };
        if (key != "") {
            return obj[key];
        }
        return obj;
    }
    handleExcel = () => {
        console.log('export excel ', this.state.search_contents.transactions);
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(this.state.search_contents.transactions);
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, "search-report-excel.xlsx");
    }
    render() {
        let options = this.filter_options();
        let transactions= this.state.search_contents.transactions;
        return (
            <React.Fragment>
                <div className=''>
                    <div className='col-md-12'>


                        <div className='card mt-4'>
                            <div className="clearfix top-head mt-3 mb-4">

                                <div className='dashboard-box'>
                                    <div className="">
                                        <div className='pull-left'>
                                            <h3 className="dashboard-title title-margin m-0 float-left">Top search content</h3>
                                        </div>

                                        <div className='pull-right'>
                                            <div className="m-2 generate_btn " onClick={() => this.generatePDF()}>
                                                 <i className="fas fa-file-pdf-o fa-2x"></i>
                                            </div>
                                            <div className="m-2 generate_btn " onClick={() => this.handleExcel()}>
                                                 <i className="fas fa-file-excel-o fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                            <div className="clearfix top-head mt-3 mb-4">
                                <div className="row">
                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                        <select defaultValue={this.state.search_content} name="search_content" id="search_content" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handleChange(e)}>
                                            {
                                                Object.keys(options).map((key, index) => {
                                                    return (
                                                        <option key={index} value={key}>{options[key]}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </div>
                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                        <select defaultValue={this.state.search_duration} name="search_duration" id="search_duration" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handleChange(e)}>
                                            <option value="7">Last 7 days</option>
                                            <option value="30" >Last 30 days</option>
                                            <option value="lastyear" >Last Year</option>
                                            <option value="currentyear" >Current Year</option>
                                            <option value="date_range" >Date range</option>
                                        </select>

                                    </div>
                                    <div className="col-6" >
                                        <div className={this.state.show_date_range == true ? '' : 'd-none'} >
                                            <div className="row">
                                                <div className="col-6" >

                                                    <input type="date" placeholder="From" defaultValue={this.state.from_date} className="form-control date_range" name="from_date" id="from_date" onChange={(e) => this.handleChangeDate(e)} />
                                                </div>
                                                <div className="col-6" >

                                                    <input type="date" placeholder="To" defaultValue={this.state.to_date} className=" form-control to_date" name="to_date" id="to_date" onChange={(e) => this.handleChangeDate(e)} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className=''>
                    <div className='col-md-12'>

                        <div className='card mt-4'>
                            <Tabs>
                                <TabList>
                                    <Tab><i class="fas fa-chart-bar"></i> Line Chart</Tab>
                                    <Tab><i class="fas fa-chart-pie"></i> Pie Chart</Tab>
                                    <Tab><i class="fas fa-table"></i> Tabular</Tab>
                                </TabList>


                                {
                                    Object.keys(this.state.search_contents).length > 0 ?
                                        <>
                                            <TabPanel>
                                                <SearchGraphNew search_contents={this.state.search_contents} from_date={this.state.from_date} to_date={this.state.to_date} active_graph={this.state.search_duration} />
                                            </TabPanel>

                                            <TabPanel>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        {this.classes_pie_graph()}
                                                    </div>
                                                </div>

                                            </TabPanel>

                                            <TabPanel>

                                                {
                                                    Object.keys(this.state.search_contents.transactions).length > 0 ?

                                                        <div className="card mt-4 content_lists">
                                                            <div className="clearfix top-head mt-3 mb-4">
                                                                <h3 className="dashboard-title title-margin m-0 float-left">{this.filter_options(this.state.search_content)}</h3>
                                                            </div>
                                                            <div>
                                                                <ReactToPrint
                                                                    trigger={() => {
                                                                        return <a href="#" className="m-2 generate_btn " ><i class="fa fa-print fa-2x" aria-hidden="true"></i></a>;
                                                                    }}
                                                                    content={() => transactions}
                                                                />
                                                            </div>
                                                            <div className="dashboard-box">
                                                                <div className="table-responsive" >
                                                                    <PrintSearchReport  ref={ el => ( transactions = el)} transactions={transactions} />
                                                                </div>
                                                            </div>

                                                        </div>

                                                        : null}

                                            </TabPanel>

                                        </>
                                        : null}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
