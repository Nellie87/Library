import React from 'react';
import PieGraph from '../graphs/pie';

class PieGraphSectionDummy extends React.Component {


    constructor() {
        super();
        this.state = {
            active_graph: 'week'
        };
        
    }

 
    classes_pie_graph(active_graph) {

        let graph_data = [12, 19, 3, 5];
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
        const data = {
            labels: ['E-books', 'Audio Books', 'Video Books', 'Slides'],
            datasets: [
                {
                    label: '# of Votes',
                    data: graph_data,
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
        return (
            <PieGraph pie_data={data} />
        );
    }

    render() {
        let active_graph = this.props.active_graph;
        return (
            <div>
             

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
                                                    <sub>$</sub>620,941<sub className="bookProfit"><i className="fas fa-caret-up"></i> 7%</sub>
                                                </div>
                                            </div>
                                            <div className="data-wrap previous-week mb-4">
                                            <label>Previous Week</label>
                                            <div className="daraCounts">
                                                <sub>$</sub>582,720
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
                                        <div className="bookProfit"><i className="fas fa-caret-up"></i> 33%</div>
                                        <label>This Week</label>
                                        <div className="daraCounts">
                                            <sub>$</sub>620,941
                                                </div>
                                    </div>
                                    <div className="data-wrap previous-week">
                                        <label>Previous Week</label>
                                        <div className="daraCounts">
                                            <sub>$</sub>582,720
                                        </div>
                                    </div>
                                </div>
                                <h5>Revenue from Subscription</h5>
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
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
export default PieGraphSectionDummy;