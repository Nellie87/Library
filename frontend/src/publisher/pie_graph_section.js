import React from 'react';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
const funcObj = new Functions();
class PieGraphSection extends React.Component {


    constructor(data) {
        super();
        this.state = {
            active_graph: 'week',
            ebook :data.ebook,
            audio :data.audio,
            video :data.video,
            slider :data.slider,
            revenue:data.revenue,
            classdata:data.classes
        };
        console.log('graph data',data);
    }

 
    classes_pie_graph(active_graph) {
        let {ebook,slider,audio,video,revenue,classdata} = this.state;
        console.log('Class data',classdata);
        let graph_data = [ebook, audio, video, slider];
        if(document.getElementById('date_range') != null){
            document.getElementById('date_range').classList.add('d-none');
        }
        
        if (active_graph == 'week') {
            graph_data = [120, 19, 3, 5];
        } else if (active_graph == 'month') {
            graph_data = [120, 190, 30, 15];
        } else if (active_graph == 'year') {
            graph_data = [120, 1400, 200, 50];
        } else if (active_graph == 'date_range') {
            document.getElementById('date_range').classList.remove('d-none');
        } else if (active_graph == 'date_range_entered') {
            graph_data = [1000, 100, 200, 500];
        }

        // let gradient = this.ctx.createLinearGradient(0, 0, 300, 0);
        // gradient.addColorStop(0, '#20f08b');
        // gradient.addColorStop(0.5, '#20f08b');
        // gradient.addColorStop(1, '#07dfb1');
        let cls_name = [];
        let cls_value =[];
        if (classdata) {
            classdata.forEach((element, index) => {
                cls_name.push(element.class_name);
                cls_value.push(element.total_content_count);
            });
        }
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
                        '#f245s2'
                    ],
                    borderColor: [
                        '#a601ff',
                        '#f24512',
                        '#dc2a7b',
                        '#2646b8',
                        '#a60444',
                        '#f245s2'
                    ],
                    borderWidth: 0,
                },
            ],
        };
        return (
            <PieGraph pie_data={data} />
        );
    }

    render() {
        let {revenue}=this.state;
        
        let active_graph = this.props.active_graph;
        return (
            <div>
             {
                revenue ?

               

                <div className="row">
                    <div className="col-xl-8 mb-4 ">
                        <div className="card px-4 ">
                            <div className="row">
                                <div className="col-xl-4 col-lg-4">
                                    <div className="data-container totalRevenue text-center mb-4  mb-md-0 text-md-left clearfix h-100 after_line pt-md-5 pt-0">
                                            <h5 className="mb-4">Total Revenue</h5>
                                       <div className="totalRevenue-inner-wrap">
                                            <div className="data-wrap mb-4">
                                                <label>This Week</label>
                                                <div className="daraCounts">
                                                    <sub>{funcObj.getCurrency()} &nbsp;</sub>{ revenue? revenue.thisWeek :0}<sub className="bookProfit">{/*<i className="fas fa-caret-up"></i> *7%**/}</sub>
                                                </div>
                                            </div>
                                            <div className="data-wrap previous-week mb-4">
                                            <label>Previous Week</label>
                                            <div className="daraCounts">
                                                <sub>{funcObj.getCurrency()} &nbsp;</sub>{ revenue? revenue.previousWeek :0}
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
                                <h5>Revenue from Book sale</h5>
                                <div className="d-flex align-items-end justify-content-around mb-4 pb-4 after_line-bottom">
                                    <div className="data-wrap ">
                                        <div className="bookProfit">{/*<i className="fas fa-caret-up"></i> 33%*/}</div>
                                        <label>This Week</label>
                                        <div className="daraCounts">
                                            <sub>{funcObj.getCurrency()} &nbsp;</sub>{revenue? revenue.thisWeek:0}
                                                </div>
                                    </div>
                                    <div className="data-wrap previous-week">
                                        <label>Previous Week</label>
                                        <div className="daraCounts">
                                            <sub>{funcObj.getCurrency()} &nbsp;</sub>{ revenue?  revenue.previousWeek:0}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                :
                null
             }
            </div>
        );
    }
}
export default PieGraphSection;
