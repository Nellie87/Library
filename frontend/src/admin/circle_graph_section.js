import React from 'react';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
class CircleGraphSection extends React.Component {


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

        let graph = this.props.data.circle_graph;
        let ebook = '';
        let audio = '';
        let video = '';
        let slider = '';
        console.log('circle graph print',graph);
        // graph.forEach(element => {
            
        //     if (element.class_name == 'ebook') {
        //         reading_book = element.reading_book;
        //     } else if (element.class_name == 'audio') {
        //         audio = element.total_content_count;
        //     } else if (element.class_name == 'video') {
        //         video = element.total_content_count;
        //     } else if (element.class_name == 'slide') {
        //         slider = element.total_content_count;
        //     }
        // });
        let map = 0;
        let journal = 0;
        let graph_data = [ebook, audio, video, slider, map, journal];

        // console.log("graph_datagraph_data", graph_data)
        if (document.getElementById('date_range') != null) {
            document.getElementById('date_range').classList.add('d-none');
        }

        // if (active_graph == 'week') {
        //     graph_data = [120, 19, 3, 5];
        // } else if (active_graph == 'month') {
        //     graph_data = [120, 190, 30, 15];
        // } else if (active_graph == 'year') {
        //     graph_data = [120, 1400, 200, 50];
        // } else if (active_graph == 'date_range') {
        //     document.getElementById('date_range').classList.remove('d-none');
        // } else if (active_graph == 'date_range_entered') {
        //     graph_data = [1000, 100, 200, 500];
        // }

        // let gradient = this.ctx.createLinearGradient(0, 0, 300, 0);
        // gradient.addColorStop(0, '#20f08b');
        // gradient.addColorStop(0.5, '#20f08b');
        // gradient.addColorStop(1, '#07dfb1');
        let cls_name = [];
        let cls_value = [];
        if (graph) {
            let reading= graph.reading_book;
            let borrow=  graph.borrow;
            let purchased = graph.purchased;
            // graph.forEach((element, index) => {
            //     cls_name.push(element.reading_book);
            //     cls_value.push(element.total_content_count);
            // });
            cls_name = ['Reading','Borrowed','Purchased'];
            cls_value = [reading,borrow,purchased];
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
            <PieGraph pie_data={data} title="Contents count" />
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
                    <div className="col-xl-12 mb-4 ">
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
                                               if(key!='contents'){    
                                                return (
                                                    <option value={key}>{value}</option>
                                                )
                                            }
                                        })
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
                                    )
                                    
                                })
                                            :null}
                                        </select>
                                    </div>
                                </div>
                            
                            </div>

                            :null}

                            <div className="row">
                                {/* <div className="col-xl-4 col-lg-4">

                                    <div className="data-container totalRevenue text-center mb-4  mb-md-0 text-md-left clearfix h-100 after_line pt-md-5 pt-0">
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
                                </div> */}
                                <div className="col-xl-12 col-lg-12">
                                    <div className="graph-container">
                                        {this.classes_pie_graph(active_graph)}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                   
                </div>
            </div>
        );
    }
}
export default CircleGraphSection;