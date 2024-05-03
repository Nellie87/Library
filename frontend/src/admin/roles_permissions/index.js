import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../../helpers/functions';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class RolesPermissions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roles_permissions: [],
            role_name:"publisher",
            permission:[],
            heading_name:"Content Management"
         
        }

        this.handleOnchangeSource = this.handleOnchangeSource.bind(this);
        this.handleOncheckbox = this.handleOncheckbox.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
     
    }

    componentDidMount() {
        this.getRolesPermissions();
    }

    handleOnchangeSource(event) {
        if(event.target.value == "finance" || event.target.value == "attendant"){
            this.setState({ heading_name:"Content Management"})  
        }else{
            this.setState({ heading_name:"Content Management"})
        }
        this.setState({permission:[], roles_permissions: []})
        this.getRolesPermissions();
    }

    handleOncheckbox(e, name) {
        const data = {};
        data["name"]=name;
        data["is_permission"]=(e.target.checked)?1:0;
        let prv_permission= this.state.permission;
        let index= prv_permission.indexOf(prv_permission.find(el=>el.name==name))
        if(index>-1){
            prv_permission[index].is_permission =data.is_permission
        }else{
            prv_permission.push(data)
        }
        this.setState({
            permission:prv_permission
        })

    }

    getRolesPermissions() {
        const role_name = document.getElementById('role').value;
        let postBodyData = {
            "role_name": role_name
        };
        let endPoint = 'get-role-permission';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    this.setState({
                        roles_permissions: response.data,
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

    handleSubmit(event){
        event.preventDefault();
        const role_name = document.getElementById('role').value;
        let postBodyData = {
            "roles": role_name,
            "permission":this.state.permission
        };
        console.log("postBodyData", postBodyData)
        let endPoint = 'role-permission';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                this.getRolesPermissions();
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

   
    render() {
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4 roles_permissions">
                        <div className="dashboard-box col-md-6">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Roles & Permissions</h3>
                            </div>
                            <div className="form-group">
                                <label className="pl-3">User Role <span>*</span></label>
                                <select name="role" id="role" defaultValue={this.state.role_name} onChange={(e) => this.handleOnchangeSource(e)} className="input-field form-control">
                                    <option value="publisher">Publisher</option>
                                    <option value="reader">Reader</option>
                                    <option value="finance">Finance</option>
                                    <option value="analytic_user">Analytic User</option>
                                    <option value="librarian">Librarian</option>
                                    <option value="senior_librarian">Senior librarian</option>
                                    <option value="attendant">Attendant</option>
                                </select>
                            </div>

                            <div className="form-head mb-3">
                                <span className="bg-white d-inline-block px-3">Authorize duties</span>
                            </div>


                            <div className="form-group" id="">

                                <label className="heading">{this.state.heading_name}</label>
                                <div className="row">
                                    {this.state.roles_permissions && Object.keys(this.state.roles_permissions).length > 0 ?
                                        this.state.roles_permissions.map((value, index) => {
                                        let checked = (value.permission==value.permission &&value.is_permission==1)?true:false; 
                                         
                                        return (
                                            <div key={index} className="col-md-5 col-sm-10">
                                                <div className="custom-checkbox">
                                                    <input type="checkbox" id={`add_` +value.permission} value={value.permission} onChange={(e) => this.handleOncheckbox(e,value.permission)} defaultChecked={checked}/>
                                                    <label htmlFor={`add_` +value.permission} className="">{value.permission_title}</label>
                                                </div>
                                            </div>

                                        )}):null}
                                </div>
                            </div>


                           
                            <div className="text-right">
                                <button type="submit" className="btn addCart py-1 px-3 mr-1">Save</button>
                            </div>

                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }

    handleOnchangeUserRole(e) {
        let opt_val = e.target.value;
    }
}
