import React from 'react';
import SalesPieGraph from '../graphs/salesPieGraph';
import Functions from '../helpers/functions';
const funcObj = new Functions();
class PieGraphSection extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            active_graph: 'week',
            graph: props.graph,
          
        };

      
    }


    render() {
       console.log('state value',this.state);
   
        let active_graph = this.props.active_graph;

        
        let  graph = {};
        let pie_graph_data={};
        console.log('rendering pie graph',this.props.graph_data);
        let overall_revenue = 0;
        if(this.props.graph_data && Object.keys(this.props.graph_data).length > 0){
        
             graph  = this.props.graph_data;
     
        console.log('element', graph);
        let cls_name = [];
        let cls_value = [];
      
        if (graph) {
            
            graph.forEach((element, index) => {
                overall_revenue  = overall_revenue + parseInt(element.total_amount);
                cls_name.push(element.class_title_s);
                cls_value.push(element.count);
            });
        }
        console.log('array push', cls_value);
        let graph_points = cls_value;
        if (document.getElementById('date_range') != null) {
            document.getElementById('date_range').classList.add('d-none');
        }

        if (active_graph == 'week') {
            graph_points = [120, 19, 3, 5];
        } else if (active_graph == 'month') {
            graph_points = [120, 190, 30, 15];
        } else if (active_graph == 'year') {
            graph_points = [120, 1400, 200, 50];
        } else if (active_graph == 'date_range') {
            document.getElementById('date_range').classList.remove('d-none');
        } else if (active_graph == 'date_range_entered') {
            graph_points = [1000, 100, 200, 500];
        }
        console.log('graph_points', graph_points);
        // let gradient = this.ctx.createLinearGradient(0, 0, 300, 0);
        // gradient.addColorStop(0, '#20f08b');
        // gradient.addColorStop(0.5, '#20f08b');
        // gradient.addColorStop(1, '#07dfb1');
         pie_graph_data = {
            labels: cls_name,
            datasets: [
                {
                    label: '# of Votes',
                    data: graph_points,
                    backgroundColor: [
                        '#a601ff',
                        '#f24512',
                        '#dc2a7b',
                        '#2646b8',
                    ],
                    borderColor: [
                        '#a601ff',
                        '#f24512',
                        '#dc2a7b',
                        '#2646b8',
                    ],
                    borderWidth: 0,
                },
            ],
        };
            }
        return (
            <div>

            {
                this.props.graph_data && Object.keys(this.props.graph_data).length > 0 ?  
           
                <div className="row">
                    <div className="col-xl-8 mb-4 ">
                        <div className="card px-4 ">
                            <div className="row">
                                <div className="col-xl-12 col-lg-12">
                                    <div className="graph-container">
                                    <SalesPieGraph title="Content sales count" graph_data={this.props.graph_data} pie_data={pie_graph_data} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-xl-4 mb-4 ">
                        <div className="card">
                            <div className="data-container totalRevenue text-center mb-4  mb-md-0 text-md-left clearfix h-100 after_line pt-md-5 pt-0">
                                <h5 className="mb-4">Total Revenue</h5>
                                <div className="totalRevenue-inner-wrap">
                                    <div className="data-wrap mb-4">
                                        <label>Overall Revenue</label>
                                        <div className="daraCounts">
                                            <sub>{funcObj.getCurrency()} &nbsp;</sub><span id="overall-revenue">
                                            {overall_revenue}
                                            </span><sub className="bookProfit"> {/*<i className="fas fa-caret-up"></i>7%*/}</sub>
                                        </div>
                                    </div>
                                    <div className="data-wrap previous-week mb-4">
                                        <label>Revenue <span id="content-revenue-class">All</span></label>
                                        <div className="daraCounts">
                                            <sub>{funcObj.getCurrency()} &nbsp;</sub><span id="content-revenue">{overall_revenue}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                                            :
                                            <span>No graph record</span>
            }
            </div>
        );
    }
}
export default PieGraphSection;