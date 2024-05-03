import React from 'react';
import Functions from '../helpers/functions';
import CustomPagination from '../pagination';
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import generatePDF from '../helpers/reportGenerator';
import ReactToPrint from 'react-to-print';
import { ComponentToPrintuser } from '../publisher/ComponentToPrintuser';
var XLSX = require('xlsx');
const funcObj = new Functions();
export default class UsersReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            area_of_intrest: {},
            from_date: '',
            to_date: '',
            search_text: '',
            number_of_records: funcObj.default_perpage,
            total_records: 0,
            current_page: 1,
            setMaxDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)) + '-' + new Date().getDate(),
            user_id: [],
            allCheck: false,
            deleteButtonColor: '#999999',
            btnDisable: true,
        }

        this.handleOnchangeSource = this.handleOnchangeSource.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeallValue = this.onChangeallValue.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.close = this.close.bind(this);

    }

    generatePDF(e) {
        e.preventDefault();
        let pdf_data = [];
        if (this.state.users && Object.keys(this.state.users).length > 0) {
            this.state.users.forEach(user => {
                const userData = [
                    user.first_name + ' ' + user.last_name,
                    user.email,
                    user.mobile,
                    user.updatedat
                ];
                pdf_data.push(userData);

            });
        }


        let pdfObj = {
            title: "Logged-in Users",
            heading: ["Name", "Email", "Mobile", "Last login"],
            data: pdf_data
        }
        generatePDF(pdfObj);
    }

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getUserList(pageNumber);
    }

    componentDidMount() {
        this.getCategories();
        this.getUserList();
    }

    getUserList() {
        const from_date = document.getElementById('from_date').value;
        const to_date = document.getElementById('to_date').value;
        const number_of_records = document.getElementById('number_of_records').value;


        let postBodyData = {
            "user_type": '',
            "from_date": from_date,
            "to_date": to_date,
            // "area_of_intrest":area_of_intrest,
            "search_text": '',
            "current_page": this.state.current_page,
            "per_page_limit": number_of_records,
        };
        let endPoint = 'get-user-loggedin';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    this.setState({
                        users: response.data.data,
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

        });
    }

    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {

            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {

                    this.setState({
                        area_of_intrest: response.data
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

    onChangeallValue(event) {
        console.log('onChangeallValue')
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            this.setState({ deleteButtonColor: '#302f91', btnDisable: false })
            let users = this.state.users;
            this.setState({ allCheck: true });
            users.forEach(el => {
                this.state.user_id.push((el.id).toString());
                el.checked = true;
            })
            // console.log(this.state.content_id)
        } else {
            let users = this.state.users;
            this.setState({ deleteButtonColor: '#999999', btnDisable: true })
            users.forEach(el => {
                el.checked = false;
            })
            this.setState({
                users: users,
                user_id: [],
                allCheck: false
            })

            //  console.log(this.state.content_id)
        }
    }

    onChangeValue(event) {
        console.log('onChangeValue')
        const target = event.target;
        var value = target.value;
        if (target.checked) {
            // this.state.categories[value] = value; 
            this.state.user_id.push(value);
            this.setState({ deleteButtonColor: '#302f91', btnDisable: false })
            let users = this.state.users;
            users.forEach(el => {
                if (el.id == value) {
                    el.checked = true;
                }
            })
            this.setState({
                users: users
            })
        } else {
            var index = this.state.user_id.indexOf(event.target.value)
            if (index !== -1) {
                this.state.user_id.splice(index, 1);
                if (this.state.user_id.length < 1) {
                    this.setState({ deleteButtonColor: '#999999', btnDisable: true })
                }
            }
            let users = this.state.users;
            users.forEach(el => {
                if (el.id == value) {
                    el.checked = false;
                }
            })
            this.setState({
                users: users
            })
        }

        console.log(this.state.user_id)
    }

    close = (event) => {
        let users = this.state.users;
        this.setState({ deleteButtonColor: '#999999', btnDisable: true })
        users.forEach(el => {
            el.checked = false;
        })
        this.setState({
            users: users,
            user_id: [],
            allCheck: false
        })
    }

    handleDeleteSubmit(event) {
        event.preventDefault();
        this.deleteUser()
    }

    deleteUser = () => {
        let endPoint = 'delete-user';
        let postBodyData = {
            "user_id": this.state.user_id
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                // console.log(data)
                this.getUserList();
                this.setState({ deleteButtonColor: '#999999', btnDisable: true, user_id: [], allCheck: false })
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })

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

    handleOnchangeSourceRecords(event) {
        this.setState({
            number_of_records: event.target.value
        });
        this.getUserList();
    }

    handleOnchangeSource(event) {
        this.getUserList();
    }

    handleClickUser(e, user) {
        window.location = funcObj.getSitePath('add-users');
    }
    handleExcel = () => {
        console.log('export excel ', this.state.users);
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(this.state.users);
        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, "logged-in-excel.xlsx");
    }
    render() {
        let users = this.state.users;
        const elements = [1, 2, 3, 4];
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" encType="multipart/form-data">
                    <div className="card mt-4">

                        <div className='col-md-12'>


                            <div className='pull-left'>
                                <div className="clearfix top-head mb-2">
                                    <h3 className="dashboard-title title-margin my-2 float-left">Filter Logged-in Users</h3>
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

                        <div className="row">


                            <div className="col-md-2">
                                <div className="form-group">
                                    <input type="date" id="from_date" defaultValue={this.state.from_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="From date" name="from_date" />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <input type="date" id="to_date" defaultValue={this.state.from_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="To date" name="to_date" />
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
                </form>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Search Result</h3>
                        </div>
                        <div className="table-responsive">
                            <ComponentToPrintuser ref={el => (users = el)} transactions={users} />

                                {/* let book_detail_link = `/logged-in-history?user_id=` + value.id+'&backlink=logged-in-users-reports'; */}
                        </div>
                        <div className="table-bottom-content">
                            {/* <button type="button" data-toggle="modal" data-target="#deleteModal" disabled={this.state.btnDisable} style={{ backgroundColor: this.state.deleteButtonColor }} className="btn lightBtn">Delete Selected</button> */}
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
                                Showing  {Object.keys(this.state.users).length} of {this.state.total_records}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}