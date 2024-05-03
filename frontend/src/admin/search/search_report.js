

import React from 'react';
import SearchGraph from "./search_graph";
import Functions from '../../helpers/functions';
const funcObj = new Functions();
export default class SearchReport extends React.Component {

    constructor() {
        super();
        this.state = {
            active_graph: '',
            from_date: '',
            to_date: '',
            keyword: [],
            search: '',
            datarange: 'd-none',
            show: false,
            filter: 'week'
        };
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        this.keyword('search_text');
    }
    handleChange(e) {
        const graph_type_value = e.target.value;
        // funcObj.custom_alert_message(graph_type_value);
        console.log('graph type value',graph_type_value);
        this.setState({ filter: graph_type_value });
        if (graph_type_value == 'date_range') {
            this.setState({
                show: !this.state.show,
                show: true,

            });
        }
        else if (graph_type_value == 'week' || graph_type_value == 'month' || graph_type_value == 'year') {
            this.setState({
                show: !this.state.show,
                show: false,

            });
        }
        else {
            this.setState({
                show: !this.state.show,
                show: true,

            });
        }

        if (graph_type_value == 'week' || graph_type_value == 'month' || graph_type_value == 'year') {
            console.log('graph type value',graph_type_value);
            this.setState({ filter: graph_type_value });
           
            this.keyword(this.state.keyword);
           
        }
        else if (e.target.name == 'to_date') {
            if (document.getElementById('from_date').value == "") {
                funcObj.custom_alert_message('Please select from date!');
            } else {
                const fromdate = document.getElementById('from_date').value;
                const todate = document.getElementById('to_date').value;
                this.setState(
                    {
                        active_graph: 'date_range_entered',
                        from_date: fromdate,
                        to_date: todate,
                        show: true,
                    }
                );
                this.keyword(this.state.keyword);
            }
        } else if (e.target.name == 'from_date') {
            if (document.getElementById('to_date').value != "") {
                this.setState({ active_graph: 'date_range_entered' });
            }
        }

    }
    handlesearchChange(e) {
        const graph_type_value = e.target.value;
        //  funcObj.custom_alert_message(graph_type_value);
        this.setState({
            search: graph_type_value
        })
        this.keyword(graph_type_value);
        //  
    }
    keyword(keyword) {
        
        let postBodyData = {
            search: keyword,
            from_date: this.state.from_date,
            to_date: this.state.to_date,
            filter: this.state.filter
        };
        let endPoint = 'get-search-keyword';
        funcObj.commonFetchApiCall(postBodyData, endPoint, "POST").then(data => {
            console.log('dashboard response', data)
            let graph = JSON.stringify(data.data);
            if (data.code == 200) {

                this.setState({
                    isLoaded: true,
                    keyword: data.data,
                    filter: 'week'
                });


            } else if (data.code == 201) {

            }
        });
    }
    render() {
        // console.log(this.state.daterange);
        console.log('graph type filter',this.state.filter);
        return (
            <React.Fragment>

                <div className="clearfix top-head mt-3 mb-4">
                    <div className="row">
                        <h3 className="dashboard-title title-margin m-0 float-left">Top search content</h3>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span>Filter</span>
                            <select defaultValue="search_text" name="searchtype" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handlesearchChange(e)}>
                                <option value="classes">Classes</option>
                                <option value="categories" >Categories</option>
                                <option value="search_text" >Search Keywords</option>
                                <option value="authors" >Authors</option>
                                <option value="publisher" >Publishers</option>
                            </select>
                        </div>
                        <div className="col-3">
                            <span>Filter</span>
                            <select defaultValue="week" name="graph_type_select" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handleChange(e)}>
                                <option value="week">This week</option>
                                <option value="month" >This Month</option>
                                <option value="year" >This Year</option>
                                <option value="date_range" >Date range</option>
                            </select>
                        </div>
                        <div className="col-3" >
                            <div className={this.state.show == true ? '' : 'd-none'} >
                                <span>From Date</span>
                                <input type="date" className="form-control date_range" name="from_date" id="from_date" onChange={(e) => this.handleChange(e)} />
                                <span>To Date:</span>
                                <input type="date" className=" form-control to_date" onChange={(e) => this.handleChange(e)} name="to_date" id="to_date" />
                            </div>

                        </div>

                    </div>
                </div>
                {this.state.isLoaded === true ? (
                    <SearchGraph from_date={this.state.from_date} to_date={this.state.to_date} active_graph={this.state.keyword} filter={this.state.filter} />) :
                    (<div>Fetching data from API</div>)
                }
            </React.Fragment>
        );
    }
}
