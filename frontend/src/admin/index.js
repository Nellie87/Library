import React from 'react';
import LineGraph from '../graphs/line';
import LineLoggedin from '../graphs/LineLoggedin';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
import PieGraphSection from './pie_graph_section';
import CircleGraphSection from './circle_graph_section';
import Swal from "sweetalert2";
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class AdminDashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            active_graph: 'week',
            from_date:'',
            to_date:'',
            classes:{},
            data: [],
            isLoaded: false,
            users:{},
            graph_user:{},
            loggedin:[],
            graph_title:"This Week",
            graph_prev_title:"Previous Week",
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getdashboard = this.getdashboard.bind(this);
    }

    componentDidMount() {
        this.getdashboard();   
    }

    handleChange(e) {
        const graph_type_value = e.target.value;
        if (e.target.name == 'graph_type_select') {
            this.setState({ active_graph: graph_type_value, });
            if(e.target.value == "week"){
                this.setState({  graph_title:"This Week",graph_prev_title:"Previous Week" });
            }else if(e.target.value == "month"){
                this.setState({  graph_title:"This Month",graph_prev_title:"Previous Month" });
            }else if(e.target.value == "year"){
                this.setState({  graph_title:"This Year",graph_prev_title:"Previous Year" });
            }
            this.getdashboard();
        } else if (e.target.name == 'to_date') {
            if (document.getElementById('from_date').value == "") {
                funcObj.custom_alert_message('Please select from date!');
            } else {
                const fromdate = document.getElementById('from_date').value;
                const todate = document.getElementById('to_date').value;
                this.setState(
                    { 
                        active_graph: '',
                        from_date:fromdate,
                        to_date:todate
                 }
                );
            }
        } else if (e.target.name == 'from_date') {
            if (document.getElementById('to_date').value != "") {
                this.setState({ active_graph: '' });
            }
        }

    }


    getdashboard(financial_filter_by='',financial_filter_by_data='') {
        const active_graph = document.getElementById('active_graph').value;
        let postBodyData = {
            "filter":active_graph,
            "from_date":this.state.from_date,
            "to_date":this.state.to_date,
            financial_filter_by:financial_filter_by,
            financial_filter_by_data:financial_filter_by_data,
        };
        let endPoint = 'admin-dashboard';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {
            // console.log('get-contents response',response)

            return new Promise((resolve, reject) => {
                if (response && response.data && Object.keys(response.data).length > 0) {
                    resolve(response);
                }

            }).then(response => {

                if (response.code == 200) {
                    this.setState({
                        isLoaded:true,
                        data: response.data,
                        classes: response.data.classes,
                        users:response.data.users,
                        graph_user:response.data.graph_user,
                        loggedin:response.data.loggedin,
                        circle_graph:response.data.circle_graph,
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

    render() {
        const { data } = this.state;
        console.log( 'logged in user ' , data.loggedin);
        return (
            <React.Fragment>
                <div>
                    <div className="row row-cards-one dashboard-box flexmag">
                        <div className="col-md-12 col-lg-12 col-xl-12">
                        <div className='float-left'>

                        
                            <h3 className="dashboard-title title-margin">Digital Resources</h3>
                            </div>
                            <div className="float-right">
                                <div className="d-flex align-items-center">
                                    <span>Filter</span>
                                    <select defaultValue={this.state.active_graph} id="active_graph" name="graph_type_select" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handleChange(e)}>
                                        {/* <option value="">Select duration</option> */}
                                        <option value="week">This week</option>
                                        <option value="month" >This Month</option>
                                        <option value="year" >This Year</option>
                                        {/* <option value="date_range" >Date range</option> */}
                                    </select>
                                </div>
                                <div className="date_range d-none" id="date_range" >
                                    <span>From Date</span>
                                    <input type="date" className="form-control date_range" name="from_date" id="from_date" onChange={(e) => this.handleChange(e)} />
                                    <span>To Date:</span>
                                    <input type="date" className=" form-control to_date" onChange={(e) => this.handleChange(e)} name="to_date" id="to_date" />
                                </div>
                            </div>
                        </div>
                        {
                            this.state.classes && Object.keys(this.state.classes).length > 0 ?
                            this.state.classes.map((classd, index) => {
                                let  classname= classd.class_name.replace("/","-");
                                    return (
                                        <div key={index} className="col-md-12 col-lg-6 col-xl-3 mb-4">
                                {/* <Link to={`my-publications?class_id=`+classd.class_id}> */}
                                <div className={`publisher-card `+classname}>
                                    <img src={funcObj.getClassTypeIcons(classd.class_name)} className="img-fluid d-block" alt="" />
                                    <h5 className="card-title mt-3">{classd.class_title_p} <span className="d-block number float-right">{classd.total_content_count}</span></h5>
                                </div>
                                {/* </Link> */}
                            </div>
                            )})
                        : null}
                    </div>


                    <div>
                        <div className="clearfix top-head mt-3 mb-4">
                            <h3 className="dashboard-title title-margin m-0 float-left">Statistics</h3>
                           
                        </div>
                        {this.state.isLoaded === true ? (
                            <PieGraphSection getdashboard={this.getdashboard} {...data} data={this.state.data} active_graph={this.state.active_graph}/>) :
                            (<div>Fetching data from API</div>)

                        }
                    </div>
                    <div>
                        {this.state.isLoaded === true ? (
                            <CircleGraphSection getdashboard={this.getdashboard} {...data} data={this.state.data} active_graph={this.state.active_graph}/>) :
                            (<div>Fetching data from API</div>)

                        }
                    </div>
                    <div>
                            <div className="card">
                                <div className="data-container">
                                    <div className="d-flex justify-content-between mb-2 pb-4">
                                        <div>
                                            <h5 className="after_line-bottom_orange d-inline-block">Reader</h5>
                                            <div className="data-wrap">
                                                <label>{this.state.graph_title}</label>
                                                <div className="daraCounts">
                                                    {this.state.loggedin.thisWeek_reader}<sub className="bookProfit"></sub>
                                                </div>
                                            </div>
                                            <div className="data-wrap previous-week mt-3">
                                                <label>{this.state.graph_prev_title}</label>
                                                <div className="daraCounts"> {this.state.loggedin.previousWeek_reader}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h5 className="after_line-bottom_blue d-inline-block">Publisher</h5>
                                            <div className="data-wrap">
                                                <label>{this.state.graph_title}</label>
                                                <div className="daraCounts">
                                                    <sub className="bookLoss"></sub> {this.state.loggedin.thisWeek_publisher}
                                                </div>
                                            </div>
                                            <div className="data-wrap previous-week mt-3">
                                                    <label>{this.state.graph_prev_title}</label>
                                                <div className="daraCounts">{this.state.loggedin.previousWeek_publisher}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.isLoaded === true ? 
                                ( <LineLoggedin from_date={this.state.from_date}  to_date={this.state.to_date} active_graph={this.state.active_graph} data={this.state.data} />) :
                                    (<div>Fetching data from API</div>)

                                }
                                
                            </div>
                        </div>
                   
                {(AUTH_USER.account_type == 'admin' ) ?
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card ">
                                <div className="data-container">
                                    <div className="d-flex  justify-content-between mb-4 pb-4">
                                        <div className="data-wrap ">
                                            <label>Total users</label>
                                            <div className="daraCounts">{this.state.users.total_user}</div>
                                        </div>
                                        <div className="data-wrap active-users text-right">
                                            <label>Active Users</label>
                                            <div className="daraCounts">{this.state.users.active_user}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="graph-container">
                                    {this.users_active_users_pie_graph()}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="data-container">
                                    <div className="d-flex justify-content-between mb-2 pb-4">
                                        <div>
                                            <h5 className="after_line-bottom_orange d-inline-block">New users</h5>
                                            <div className="data-wrap">
                                                <label>{this.state.graph_title}</label>
                                                <div className="daraCounts">
                                                    {this.state.graph_user.thisWeek_new_user}<sub className="bookProfit"></sub>
                                                </div>
                                            </div>
                                            <div className="data-wrap previous-week mt-3">
                                                <label>{this.state.graph_prev_title}</label>
                                                <div className="daraCounts"> {this.state.graph_user.previousWeek_new_user}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h5 className="after_line-bottom_blue d-inline-block">New Subscriptions</h5>
                                            <div className="data-wrap">
                                                <label>{this.state.graph_title}</label>
                                                <div className="daraCounts">
                                                    <sub className="bookLoss"></sub> {this.state.graph_user.thisWeek_sub_user}
                                                </div>
                                            </div>
                                            <div className="data-wrap previous-week mt-3">
                                                    <label>{this.state.graph_prev_title}</label>
                                                <div className="daraCounts">{this.state.graph_user.previousWeek_sub_user}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.isLoaded === true ? (
                                    <LineGraph from_date={this.state.from_date}  to_date={this.state.to_date} active_graph={this.state.active_graph} data={this.state.data} />) :
                                    (<div>Fetching data from API</div>)

                                }
                                
                            </div>
                        </div>
                    </div>:null}


                </div>
            </React.Fragment>
        );
    }

    users_active_users_pie_graph() {

        let data = {
            labels: ['Non subscribed users', 'Subscribed users'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [this.state.users.non_subscribed_users, this.state.users.subscribed_users],
                    backgroundColor: [
                        '#f24512',
                        '#a601ff',
                    ],
                    borderColor: [
                        '#f24512',
                        '#a601ff',
                    ],
                    borderWidth: 0,
                },
            ],
        };
        return (
            <PieGraph pie_data={data} />
        );
    }


    handleClick(graph_type) {
        this.setState({ active_graph: graph_type });
    }

    users_subscriptions_line_graph() {

        return (

            <LineGraph from_date={this.state.from_date}  to_date={this.state.to_date} active_graph={this.state.active_graph} data={this.state.data} />

        );
    }
    users_login_line_graph() {

        return (

            <LineGraph from_date={this.state.from_date}  to_date={this.state.to_date} active_graph={this.state.active_graph} data={this.state.data} />

        );
    }



}
export default AdminDashboard;