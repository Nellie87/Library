
import React from 'react';
import LineGraph from '../graphs/line';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
import PieGraphSection from './pie_graph_section';
import DRMTransactionsStatics from "../drm/transactions_statics";
const funcObj = new Functions();
class DRMReport extends React.Component {

    constructor() {
        super();
        this.state = {
            active_graph: 'week',
            from_date:'20-05-2020',
            to_date:'20-05-2021'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        const graph_type_value = e.target.value;
        if (e.target.name == 'graph_type_select') {
            this.setState({ active_graph: graph_type_value });
        } else if (e.target.name == 'to_date') {
            if (document.getElementById('from_date').value == "") {
                funcObj.custom_alert_message('Please select from date!');
            } else {
                const fromdate = document.getElementById('from_date').value;
                const todate = document.getElementById('to_date').value;
                this.setState(
                    { 
                        active_graph: 'date_range_entered',
                        from_date:fromdate,
                        to_date:todate
                 }
                );
            }
        } else if (e.target.name == 'from_date') {
            if (document.getElementById('to_date').value != "") {
                this.setState({ active_graph: 'date_range_entered' });
            }
        }

    }
    render() {

        return (
            <React.Fragment>
                <div>
                 


                        <div>
                        <div className="clearfix top-head mt-3 mb-4">
                        <h3 className="dashboard-title title-margin m-0 float-left">Transactions & Statistics</h3>
                        </div>
                        <DRMTransactionsStatics />
                        
                  
                        <div className="clearfix top-head mt-3 mb-4">
                        
                        
                    <h3 className="dashboard-title title-margin m-0 float-left">Revenue</h3>
                    <div className="float-right">
                        <div className="d-flex align-items-center">
                            <span>Filter</span>
                            <select defaultValue="week" name="graph_type_select" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handleChange(e)}>
                                <option value="week">This week</option>
                                <option value="month" >This Month</option>
                                <option value="year" >This Year</option>
                                <option value="date_range" >Date range</option>
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
              
                <PieGraphSection active_graph={this.state.active_graph} />
                        </div>


                </div>
            </React.Fragment>
        );
    }

    users_active_users_pie_graph() {

        let data = {
            labels: ['Free Users', 'Subscribed Users'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [1200, 1050],
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

            <LineGraph from_date={this.state.from_date}  to_date={this.state.to_date} active_graph={this.state.active_graph} />

        );
    }




}
export default DRMReport;