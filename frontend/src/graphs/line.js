import React from 'react';
import { Line } from 'react-chartjs-2';
class LineGraph extends React.Component {
  constructor(data) {
    super();
    this.state = {
      active_graph: 'week',
      graph:data.data.graph,
      revenue:data.data.revenue
    };
    
     this.handleClick = this.handleClick.bind(this);
  }
  generateGraph(active_graph) {
    //  let actifdsfsve_graph = this.props.data;
    // console.log('data3432',actifdsfsve_graph);
    let graph_labels = (this.props.data)?this.props.data.graph.labels:[];
    let user_data = (this.props.data)?this.props.data.graph.new_user:[];
    let subscription_data = (this.props.data)?this.props.data.graph.subscribe_user:[];
    // let graphdata = {
    //     weekly_labels: ['SUN', 'MON', 'TUES', 'WED', 'THU', 'FRI', 'SAT'],
    //     weekly_user_data: [3, 5, 2, 4, 8, 1, 3],
    //     weekly_subscription_data: [2, 4, 1, 4, 6, 2, 1],
        

    //     monthly_labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    //     monthly_user_data: [33, 55, 22, 64, 48, 91, 53, 23, 45, 12, 44, 69],
    //     monthly_subscription_data: [13, 55, 22, 64, 38, 61, 53, 23, 45, 72, 44, 19],

    //     yearly_labels: ['2020', '2021'],
    //     yearly_user_data: [500, 300],
    //     yearly_subscription_data: [400, 100],

    //     date_labels: [this.props.from_date, this.props.to_date],
    //     date_user_data: [100, 100],
    //     date_subscription_data: [400, 100]
    // };
  

      
      
      // if (active_graph == 'week') {

      //   graph_labels = graphdata.weekly_labels;
      //   user_data = graphdata.weekly_user_data;
      //   subscription_data= graphdata.weekly_subscription_data;

      // } else if (active_graph == 'month') {

      //   graph_labels = graphdata.monthly_labels;
      //   user_data = graphdata.monthly_user_data;
      //   subscription_data = graphdata.monthly_subscription_data;

      // } else if (active_graph == 'year') {

      //   graph_labels = graphdata.yearly_labels;
      //   user_data = graphdata.yearly_user_data;
      //   subscription_data = graphdata.yearly_subscription_data;

      // } else if (active_graph == 'date_range' || active_graph == 'date_range_entered') {

      //   graph_labels = graphdata.date_labels;
      //   user_data = graphdata.date_user_data;
      //   subscription_data = graphdata.date_subscription_data;

      // }



    const data = {
      labels: graph_labels,
      datasets: [
        {
          label: 'New users',
          data:  user_data,
          fill: false,
          backgroundColor: ['#ec470d', '#ec470d'],
          borderColor: ['#ec470d', '#ec470d'],
          tension: 0.4
        },
        {
          label: 'Subscriptions',
          data: subscription_data,
          fill: false,
          backgroundColor: ['#3c3b97', '#3c3b97'],
          borderColor: ['#3c3b97', '#3c3b97'],
          tension: 0.4
        },
      ],
    };
   
    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };

    return (
      <React.Fragment>
        <Line data={data} options={options} />
      </React.Fragment>
    );

  }

  handleClick(e,graph_type) {
    const elem= e.target;
  const graph_btns = document.getElementsByClassName('graph_btn');
    if (graph_btns.length) {
      for (let i = 0; i < graph_btns.length; i++) {
        graph_btns[i].classList.remove("active");
      }
    }
  
      elem.classList.add('active');
    this.setState({ active_graph: graph_type });
  }
  render() {
let active_graph = this.props.active_graph;
    return (
      <React.Fragment>

        <div className="chart">
          {/* <div className="text-center  mb-3">
            <button className="btn btn-outline-primary active graph_btn" onClick={(e) => this.handleClick(e,'weekly')} name="weekly_btn">Weekly</button>
            <button className="btn btn-outline-primary graph_btn" onClick={(e) => this.handleClick(e,'monthly')} name="monthly_btn">Monthly</button>
            <button className="btn btn-outline-primary graph_btn" onClick={(e) => this.handleClick(e,'yearly')} name="yearly_btn">Yearly</button>
          </div> */}
          {this.generateGraph(active_graph)}

        </div>

      </React.Fragment>
    );
  }



}


export default LineGraph;