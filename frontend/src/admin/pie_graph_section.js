import React from 'react';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class PieGraphSection extends React.Component {


    constructor(data) {
        super();
        this.state = {
            active_graph: 'week',
            graph: data.classes,
            revenue: data.revenue,
            book_revenue: data.book_revenue,
            graph_title: "This Week",
            graph_prev_title: "Previous Week",
            financial_filter_data: {},
            financial_filter_by:"",
            financial_filter_by_data:""
        };

        this.fetchFilters = this.fetchFilters.bind(this);
    }

    componentDidMount() {
        this.fetchFilters();
    }


    fetchFilters() {
        const postBodyData = {};
        const endPoint = 'financials-filter';
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(response => {
            if (response.code == 200) {
                console.log(response.data);
                this.setState({
                    financial_filter_data: response.data
                });
            }

        });
    }
    classes_pie_graph(active_graph) {

        let graph = this.props.data.classes;
        let ebook = '';
        let audio = '';
        let video = '';
        let slider = '';
        graph.forEach(element => {
            
            if (element.class_name == 'ebook') {
                ebook = element.total_content_count;
            } else if (element.class_name == 'audio') {
                audio = element.total_content_count;
            } else if (element.class_name == 'video') {
                video = element.total_content_count;
            } else if (element.class_name == 'slide') {
                slider = element.total_content_count;
            }
        });
        let map = 0;
        let journal = 0;
        let graph_data = [ebook, audio, video, slider, map, journal];

        if (document.getElementById('date_range') != null) {
            document.getElementById('date_range').classList.add('d-none');
        }

     
        let cls_name = [];
        let cls_value = [];
        if (graph) {
            graph.forEach((element, index) => {
                cls_name.push(element.class_title_s);
                cls_value.push(element.total_content_count);
            });
        }
        console.log('class name element', cls_name);
        const data = {
            labels: cls_name,
            datasets: [
                {
                    label: '# of Votes',
                    data: cls_value,
                    backgroundColor: [
                        '#a601ff',
                        '#f24512',
                        '#dc2a7b',
                        '#2646b8',
                        '#a60444',
                        '#f245s2',
                    ],
                    borderColor: [
                        '#a601ff',
                        '#f24512',
                        '#dc2a7b',
                        '#2646b8',
                        '#a60444',
                        '#f245s2',
                    ],
                    borderWidth: 0,
                },
            ],
        };
        return (
            <PieGraph pie_data={data} title="Total Contents count" />
        );
    }
    handleChange(e) {
            this.setState({
                [e.target.name]:e.target.value,
                financial_filter_by_data:""
            });
            if(e.target.name == "financial_filter_by_data"){
                this.props.getdashboard(this.state.financial_filter_by,e.target.value)
            }else{
                document.getElementById("financial_filter_by_data").value="";
            }
    }
    render() {
        let active_graph = this.props.active_graph;
        let titlename = "This Week";
        let prevtitlename = "Previous Week";
        if (active_graph == "week") {
            titlename = "This Week";
            prevtitlename = "Previous Week";
        } else if (active_graph == "month") {
            titlename = "This Month";
            prevtitlename = "Previous Month";
        } else if (active_graph == "year") {
            titlename = "This Year";
            prevtitlename = "Previous Year";
        }
        const financial_filter_data = this.state.financial_filter_data;
        let filter_data = {};
        if(this.state.financial_filter_by != "" && financial_filter_data.filter_data && financial_filter_data.filter_data[this.state.financial_filter_by]){
            filter_data = financial_filter_data.filter_data[this.state.financial_filter_by];
        }
        
        return (
            <div>

                <div className="row">
                    <div className="col-xl-8 mb-4 ">
                        <div className="card px-4 ">
                        {
                                financial_filter_data && Object.keys(financial_filter_data).length > 0 ?
                            
                            <div className="row">
                            <div className='col-md-6'>
                                    <div>
                                        <select defaultValue={this.state.financial_filter_by} id="financial_filter_by" name="financial_filter_by" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handleChange(e)}>
                                        <option value="">All</option>
                                        {
                                            financial_filter_data.filter && Object.keys(financial_filter_data.filter).length > 0 ?
                                            Object.entries(financial_filter_data.filter).map(([key, value]) => {
                                                
                                    return (
                                         <option value={key}>{value}</option>
                                    )})
                                            :<span>No filter data</span>}
                                        </select>
                                    </div>
                                </div>
                               
                                
                                <div className='col-md-6'>
                                    <div>
                                        <select defaultValue={this.state.financial_filter_by_data} id="financial_filter_by_data" name="financial_filter_by_data" className="mb-0 ml-3 form-control m-1 input_field" onChange={e => this.handleChange(e)}>
                                        <option value="">All</option>
                                        
                                        {
                                    this.state.financial_filter_by != "" && Object.keys(filter_data).length>0 ?  
                                           filter_data.map((filter, index) => {                                
                                    return (
                                         <option key={index} value={filter.option_key}>{filter.option_value}</option>
                                    )})
                                            :null}
                                        </select>
                                    </div>
                                </div>
                            
                            </div>

                            :null}
                         

                            <div className="row">
                                <div className="col-xl-4 col-lg-4">

                                    <div className="data-container totalRevenue text-center mb-4  mb-md-0 text-md-left clearfix h-100 after_line pt-0">
                                        <h5 className="mb-4">Total Revenue</h5>
                                        <div className="totalRevenue-inner-wrap">
                                            <div className="data-wrap mb-4">
                                                <label>{titlename}</label>
                                                <div className="daraCounts">
                                                    <sub>{funcObj.getCurrency()} &nbsp;</sub>{this.props.data.revenue.thisWeek}<sub className="bookProfit"></sub>
                                                </div>
                                            </div>
                                            <div className="data-wrap previous-week mb-4">
                                                <label>{prevtitlename}</label>
                                                <div className="daraCounts">
                                                    <sub>{funcObj.getCurrency()} &nbsp;</sub>{this.props.data.revenue.previousWeek}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8">
                                    <div className="graph-container">
                                        {this.classes_pie_graph(active_graph)}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-xl-4 mb-4 ">

                        <div className="card">
                            <div className="data-container text-center">
                                <h5>Revenue from Content sale</h5>
                                <div className="d-flex align-items-end justify-content-around mb-4 pb-4 after_line-bottom">
                                    <div className="data-wrap ">
                                        <div className="bookProfit"></div>
                                        <label>{titlename}</label>
                                        <div className="daraCounts">
                                            <sub>{funcObj.getCurrency()} &nbsp;</sub>{this.props.data.book_revenue.thisWeek}
                                        </div>
                                    </div>
                                    <div className="data-wrap previous-week">
                                        <label>{prevtitlename}</label>
                                        <div className="daraCounts">
                                            <sub>{funcObj.getCurrency()} &nbsp;</sub>{this.props.data.book_revenue.previousWeek}
                                        </div>
                                    </div>
                                </div>
                                {/* <h5>Revenue from Subscription</h5>
                                <div className="d-flex align-items-end mb-4 justify-content-around">
                                    <div className="data-wrap ">
                                        <div className="bookProfit"><i className="fas fa-caret-up"></i> 30%</div>
                                        <label>This Week</label>
                                        <div className="daraCounts">
                                            <sub>$</sub>18,240
                                                </div>
                                    </div>
                                    <div className="data-wrap previous-week">
                                        <label>Previous Week</label>
                                        <div className="daraCounts">
                                            <sub>$</sub>12,701
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
export default PieGraphSection;