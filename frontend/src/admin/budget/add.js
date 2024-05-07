import React from 'react';
import { Link } from 'react-router-dom';
// import DRMSettings from '../drm/settings';
import Swal from "sweetalert2";
import Functions from '../../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Addbudget extends React.Component {

    constructor(props) {
        super(props);
        const endYear = new Date().getFullYear();
        const startYear= parseInt(endYear)+1;
        const financial_year = '';
        this.state = {
            budget_id: '',
            previous_year: '',
            current_year: '',
           financial_year: financial_year,
            amount:0,
            urlParam:'',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let budget_id = funcObj.get_query_string('budget_id');
        if(budget_id){
            this.setState({
              urlParam:budget_id  
            });
            this.getBudget();
        }
        
    }

    componentDidUpdate() {
        let budget_id = funcObj.get_query_string('budget_id');
        if (this.state.urlParam != budget_id) {
            // this.setState({
            //     class_id: '',
            //     categories: {},
            //     Title: '',
            //     Subtitle: '',
            // })
           
        }
    }

  

    // Method causes to store all the values of the 
    // input field in react state single method handle 
    // input changes of all the input field using ES6 

    // javascript feature computed property names
    handleChange(event) {
        this.setState({
            // Computed property names
            // keys of the objects are computed dynamically
            [event.target.name]: event.target.value
        });


    }

    handleOnchangeSource(e) {
        const opt_val = e.target.value;
        const source_childs = document.getElementsByClassName('source_childs');
        for (var i = 0; i < source_childs.length; i++) {
            source_childs[i].classList.add('d-none');

        }
        document.getElementById(opt_val).classList.remove('d-none');
    }

    handleSubmit(event) {
        event.preventDefault();
        let budget_id = funcObj.get_query_string('budget_id');
        if (budget_id) {
            this.editBudget();
        } else {
            this.Addbudget();
        }

    }
    Addbudget = () => {
        let postBodyData = {
            "financial_year":this.state.financial_year,
            "amount":this.state.amount,
        };
        if(this.state.financial_year=='' || this.state.financial_year==null){
            funcObj.custom_alert_message('select financial year');
            return false;
        }
        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'create-budget';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                funcObj.custom_alert_message(data.message,'success',"budget")
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

    editBudget = () => {
        
        let budget_id = funcObj.get_query_string('budget_id');
        let postBodyData = {
            "budget_id": budget_id,
            "financial_year":this.state.financial_year,
            "amount":this.state.amount,
        };
        if(this.state.financial_year=='' || this.state.financial_year==null){
            funcObj.custom_alert_message('select financial year');
            return false;
        }
        console.log("postBodyData", postBodyData);
        // return false;
        let endPoint = 'edit-budget';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
            if (data.code == 200) {
                funcObj.custom_alert_message(data.message,'success',"budget")
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

    getBudget = () => {
        let budget_id = funcObj.get_query_string('budget_id');
        let postBodyData = {
            'budget_id': budget_id
        };
        let endPoint = 'budget-detail';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log(endPoint + ' response', data.data.amount)
            if (data.code == 200) {

                this.setState({
                    financial_year: data.data.financial_year,
                    amount:  data.data.amount,
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

    render() {
        console.log('name'+this.state.name);
        return (
            <React.Fragment>
                <form id="geniusform" onSubmit={this.handleSubmit}>
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                {/* <h3 className="dashboard-title title-margin my-2 float-left">Content</h3> */}
                            </div>
                            <div className="row">
                                <div className="col-sm-offset-3 col-sm-6">
                                    <div className="form-head mb-3"> <span className="bg-white d-inline-block px-3">Add Budget</span></div>
                                    <div className="form-group">
                                        <label className="pl-3"> Financial Year</label>
                                        <select className="input-field form-control" value={this.state.financial_year} onChange={this.handleChange} name="financial_year">
                                           <option value="">Select Financial Year</option>
                                           {funcObj.budget()} 
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="pl-3">Amount</label>
                                        <input type="number" className="input-field form-control" value={this.state.amount} onChange={this.handleChange} placeholder="Enter Amount" name="amount" />
                                    </div>
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
}
