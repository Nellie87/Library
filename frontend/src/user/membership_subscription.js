import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from "sweetalert2";
import Checkout from '../public_pages/checkout';
import PesaFlowCheckout from "../public_pages/PesaFlowCheckout";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class MembershipSubscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plan: AUTH_USER.user.plan ? AUTH_USER.user.plan : "",
            planlist: {},
            amount: 0,
            update: false,
            user_plan:{},
            extend_membership:false,
            is_membership_user:0,
            plan_end_date:''

        }

        
        
        this.handleOnchangeSource = this.handleOnchangeSource.bind(this);
        this.extendMembership = this.extendMembership.bind(this);
    }
    componentDidMount() {
        this.getPlan();

    }
    handleOnchangeSource(plan) {
        // alert(plan.charges);
        this.setState({
            plan: plan.plan_id,
            amount: plan.charges,
            update: true,
        });
       
    }

    
  
    handleRadio(event) {
        //console.log("handleRadio")
        event.preventDefault();
        this.setState({ current_payment_method: event.target.value });
    }
    
    getPlan() {
        let postBodyData = {

        };
        let endPoint = 'get-active-plans';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
           //console.log('data response', data)
           //console.log('planlist', data.data.planlist)
            if (data.code == 200) {
                let planlist = data.data.planlist;
                if(data.data.is_membership_user == 1){
                    this.setState({
                        planlist: planlist,
                        user_plan:data.data.active_plan,
                        is_membership_user:1,
                        plan_end_date:data.data.active_plan_membership.end_date
                    });
                    
                    let user = funcObj.getLocalStorage('user');
                    user.user.plan =data.data.active_plan_membership;
                    funcObj.setLocalStorage('user',user);
                    
                }else{

                
                if(AUTH_USER.user.is_membership_user == 1){
                    let user_plan = planlist.find((plan)=>{
                        return plan.plan_id == AUTH_USER.user.plan.plan
                    })
                    this.setState({
                        planlist: planlist,
                        user_plan:user_plan,
                        is_membership_user:1,
                        plan_end_date:AUTH_USER.user.plan.end_date
                    });
                }else{
                    this.setState({
                        planlist: planlist
                    });

                }
            }
              

                // Swal.fire({
                //     title: 'Success',
                //     showCloseButton: true,
                //     text: data.message,
                //     icon: 'success',
                //     showConfirmButton: false,
                // })
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
    extendMembership(){
        this.setState({extend_membership:true});
    }
    render() {

       // console.log('list', this.state.planlist);

        return (
            <React.Fragment>
                
                <div className="card mt-4">
                    <div className="dashboard-box">
                       

                        {
                            this.state.is_membership_user == 1?
                            <React.Fragment>
                            <div>
                            <p className=" float-left">Hi <strong>{AUTH_USER.user.first_name+' '+AUTH_USER.user.last_name}</strong>, you already have an active membership.
                            </p>
                            </div>
                            <br /><br />
                    <div>
                               <p>Membership plan: <strong>{this.state.user_plan.duration}</strong></p> 
                               <p>Expiry (in days): <strong>{this.state.user_plan.no_of_days}</strong>  </p>
                               <p>Subscription Ends on: <strong>{this.state.plan_end_date}</strong>  </p>
                               <p>Extend your membership <button onClick={this.extendMembership} className="btn darkBtn">Click here</button></p>
                    </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                            <div className="clearfix top-head mb-2">
                                <p className=" float-left">Hi <strong>{AUTH_USER.user.first_name+' '+AUTH_USER.user.last_name}</strong>, you don't have an active membership, please choose one from the following options:
                                    </p>
                            </div>
                            </React.Fragment>
                        }
                          
                        {
                            this.state.is_membership_user != 1 || this.state.extend_membership?  
                            <React.Fragment>
                            <div className="row">
                            <div className="col-lg-8">
                                <div className="form-group row">


                                    {/* <select name="plan" className="input-field form-control" onChange={(e) => this.handleOnchangeSource(e)} defaultValue={this.state.plan}>
                                        <option value="">Select plan</option>
                                        <option value="30">1 Month/30 days</option>
                                        <option value="180">6 Months/180 days</option>
                                        <option value="360">1 Year/360 days</option>
                                    </select> */}
                                    {
                                        this.state.planlist && Object.keys(this.state.planlist).length > 0 ?
                                            this.state.planlist.map((list, index) => {
                                                return (
                                                    <div className="col-md-6" key={index}>
                                                        <div className="form-group">
                                                            <div className="custom-radio">
                                                                <input type="radio" id={list.plan_id} value={list.charges} name="plan" onChange={() => this.handleOnchangeSource(list)} />
                                                                <label htmlFor={list.plan_id} className="mr-3">{list.duration}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })

                                            : null
                                    }
                                </div>

                                
                                {
                                    this.state.amount != 0?
                                    // <Checkout  checkout_data={this.state.plan} checkout_for='membership' total_amount={this.state.amount} />
                                        <PesaFlowCheckout  checkout_data={this.state.plan} checkout_for='membership' total_amount={this.state.amount} />
                                   :null
                                } 
                             

                            </div>
                        </div>
                       
                        </React.Fragment>
                        :null
                        }
                      
                    </div>
                </div>

                {/* </form> */}

            </React.Fragment>
        );
    }
}
