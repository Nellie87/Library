import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../../helpers/functions';
import Pagination from "react-js-pagination";
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();


export default class UsersList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: {},
            area_of_intrest:{},
            from_date:'',
            to_date:'',
            search_text:'',
            per_page_limit:funcObj.default_perpage,
            total_records:0,
            current_page:1,
            setMaxDate: new Date().getFullYear()+'-'+(parseInt(new Date().getMonth()) + parseInt(1))+'-'+new Date().getDate(),
            user_id: [],
            allCheck: false,
            deleteButtonColor: '#999999',
            btnDisable: true,
            addUserPermission:true,
            number_of_records:10,
        }

        this.handleOnchangeSource = this.handleOnchangeSource.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeallValue = this.onChangeallValue.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.onChangeToggle = this.onChangeToggle.bind(this);
        this.close = this.close.bind(this);
     
    }

    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getUserList(pageNumber);    
    }

    componentDidMount() {
        this.getCategories();
        this.getUserList(); 
        this.getPermission();
    }

    getUserList() {
        const from_date = document.getElementById('from_date').value;
        const to_date = document.getElementById('to_date').value;
        const user_type = document.getElementById('user_type')?document.getElementById('user_type').value:"";
        const area_of_intrest = document.getElementById('area_of_intrest').value;
        const search_text = document.getElementById('search_text').value;
        const number_of_records = document.getElementById('number_of_records').value ;
        let postBodyData = {
            "user_type":user_type,
            "from_date": from_date,
            "to_date": to_date,
            "area_of_intrest":area_of_intrest,
            "search_text":search_text,
            "current_page": this.state.current_page,
            "per_page_limit": number_of_records,
        };
        let endPoint = 'get-user-list';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

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

     
    }

    getCategories = () => {
        let endPoint = 'get-categories';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {

            return new Promise((resolve, reject) => {
                if (response.data && Object.keys(response.data).length > 0) {
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

    onChangeToggle(event){
        // event.preventDefault();
        console.log('onChangeToggle')
        let target = event.target;
        let value = target.value;
        console.log('onChangeToggle', target.checked, value)
        if(target.checked){
            this.blockUser(value, 1)
        }else{
            this.blockUser(value, 0)
        }
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

    deleteUser=() => {
        let endPoint = 'delete-user';
        let postBodyData = {
            "user_id": this.state.user_id
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

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

    blockUser=(user_id, status) => {
        let endPoint = 'block-user';
        let postBodyData = {
            "user_id": user_id,
            "block_status":status
        }

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                // console.log(data)
                this.getUserList();
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

    handleOnchangeSourceEnter(event){
        if(event.key === "Enter"){
            this.setState({users: {}})
            this.getUserList();
        }
    }
    handleOnchangeSource(event) {
      
        this.setState({users: {}})
        this.getUserList();
    }

    handleClickUser(e,user){
        window.location = funcObj.getSitePath('add-users');
    }
    handleOnchangeSourceRecords(event) {

        this.setState({
            number_of_records: event.target.value
        });

        // document.getElementById('extra_sort_by').value = "";
        this.getUserList();
       
    }
    getPermission() {

        let postBodyData = {
        };
        let endPoint = 'get-permission';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (response.data && Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    for(let i=0; i< response.data.length; i++){
                        if(response.data[i].permission=="add_user" && response.data[i].is_permission==0){
                            this.setState({
                                addUserPermission: false,
                            });
                        }
                    }

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

    render() {
        const elements = this.state.users;
        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Users</h3>

                            <div className="float-right">
                                {(this.state.addUserPermission)?
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-users" className="btn darkBtn">Add New User</Link>
                                </div>:null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2">
                                <div className="form-group">
                                    <input type="text" defaultValue={this.state.search_text} name="search_text" id="search_text"
                                     onBlur={(e) => this.handleOnchangeSourceEnter(e)}
                                     onPaste={(e) =>this.handleOnchangeSourceEnter(e)}
                                     onKeyPress={(e) =>this.handleOnchangeSourceEnter(e)}
                                     onKeyUp={(e) =>this.handleOnchangeSourceEnter(e)}
                                      placeholder="Search user" className="input-field form-control" />
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">
                                    <input type="date" id="from_date" defaultValue={this.state.from_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="From date" name="from_date" />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <input type="date" id="to_date" defaultValue={this.state.to_date} onBlur={(e) => this.handleOnchangeSource(e)} className="input-field form-control" placeholder="To date" name="to_date" />
                                </div>
                            </div>
                            {
                                AUTH_USER.account_type == 'admin' ?
                            
                            <div className="col-md-3">
                            <select name="user_type" id="user_type" defaultValue={this.state.user_type} onChange={(e) => this.handleOnchangeSource(e)} className="input-field form-control">
                                <option value="">Select user type</option>
                              {funcObj.userTypeOptions()}
                            </select>
                            </div>
                            :null}
                            <div className="col-md-3">
                                <div className="form-group">
                                    <select className="input-field form-control" name="areaof_intrest"  id="area_of_intrest" defaultValue={this.state.user_type} onChange={(e) => this.handleOnchangeSource(e)} >
                                        <option value="" >Area Of Intrest</option>
                                        {
                                            this.state.area_of_intrest && Object.keys(this.state.area_of_intrest).length > 0 ?
                                            this.state.area_of_intrest.map((classd, index) => {
                                                return (
                                                    <option key={index} value={classd.category_id} >{classd.category_name}</option>
                                                )
                                            })
                                            : null
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-2">
                            <select className="input-field form-control" defaultValue={this.state.number_of_records} name="number_of_records" id="number_of_records" onChange={(e) => this.handleOnchangeSourceRecords(e)} >
                                    <option value="">Records per page</option>
                                    <option value="10">10 Records</option>
                                    <option value="50" >50 Records</option>
                                    <option value="100" >100 Records</option>
                                </select>
                                </div>
                            {/* <div className="col-md-2">
                                <div className="form-group">
                                    <button type="button" className="btn darkBtn filter_search_btn">Search</button>
                                </div>
                            </div> */}
                        </div>
                        <div className="table-responsive users_list">
                            <table className="table">
                                <thead>
                                    <tr>
                                       <th>
                                       <div className="custom-checkbox">
                                                <input type="checkbox" id="all_users_check" onChange={this.onChangeallValue} checked={(this.state.allCheck) ? true : false} />
                                                <label for="all_users_check"></label>
                                            </div>
                                            </th>
                                        <th scope="col" > Name</th>
                                        <th scope="col"> Email</th>
                                        <th scope="col" > Mobile</th>
                                        <th scope="col" > Block/Unblock </th>
                                        <th scope="col" > Edit</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {elements && Object.keys(elements).length > 0 ?
                                        elements.map((value, index) => {
                                            let checked= (value.is_blocked==1)?true:false;
                                            return (
                                             
                                                <tr key={index} >
                                                    <td>
                                                        <div className="custom-checkbox">
                                                            <input type="checkbox" id={`checkbox0`+value.id} value={value.id}  onChange={this.onChangeValue} checked={(value?.checked) ? true : false} />
                                                            <label for={`checkbox0`+value.id}></label>
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <span className="img-wrap profile__img">
                                                            {(value.profile_image)?
                                                            <img src={value.profile_image} width="30" alt="books" />:
                                                            <img src={funcObj.assets_path("/images/user_new.png")} width="30" alt="books" />}
                                                        </span>
                                                    <p className="username">{value.first_name} {value.last_name}</p>
                                                </td>
                                                    <td >{value.email}</td>
                                                    <td >{value.mobile}</td>
                                                    <td >
                                                        <label className="switch"  for={`block_swith`+value.id}>
                                                            <input id={`block_swith`+value.id} defaultChecked={checked} value={value.id} onChange={this.onChangeToggle} type="checkbox"/>
                                                            <span className="slider round"></span>
                                                        </label>
                                                    </td>
                                                    <td ><Link to={`/edit-users?user_id=` + value.id} ><i className="fas fa-edit"></i></Link></td>
                                                </tr>
                                            )
                                        }):null}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-bottom-content">
                            <button type="button" data-toggle="modal" data-target="#deleteModal" disabled={this.state.btnDisable} style={{ backgroundColor: this.state.deleteButtonColor }} className="btn lightBtn">Delete Selected</button>
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

                {/* <!-- Modal --> */}
                <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog delete-modal" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Delete User</h5>
                                <button type="button" onClick={this.close} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure want to delete user!
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.close} className="btn closedelete" data-dismiss="modal">Close</button>
                                <button type="button" onClick={this.handleDeleteSubmit} data-dismiss="modal" className="btn delete mr-2">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}