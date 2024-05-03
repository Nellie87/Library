import React from 'react';
import { Line } from 'react-chartjs-2';
class SearchGraph extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      filter :props.filter
    };
  }
  generateGraph(active_graph) {
    let {filter }= this.state;
    console.log('active_graph ', filter);
    // alert(active_graph);

    let graph_labels = ['1', '2'];
    let graphdata = {
      weekly_labels: ['SUN', 'MON', 'TUES', 'WED', 'THU', 'FRI', 'SAT'],
      weekly_user_data: [3, 5, 2, 4, 8, 1, 3],
      weekly_subscription_data: [2, 4, 1, 4, 6, 2, 1],


      monthly_labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      monthly_user_data: [33, 55, 22, 64, 48, 91, 53, 23, 45, 12, 44, 69],
      monthly_subscription_data: [13, 55, 22, 64, 38, 61, 53, 23, 45, 72, 44, 19],

      yearly_labels: ['2020', '2021'],
      yearly_user_data: [500, 300],
      yearly_subscription_data: [400, 100],

      date_labels: [this.props.from_date, this.props.to_date],
      date_user_data: [100, 100],
      date_subscription_data: [400, 100]
    };




    if (filter == 'week') {

      graph_labels = graphdata.weekly_labels;

    } else if (filter == 'month') {

      graph_labels = graphdata.monthly_labels;


    } else if (filter == 'year') {

      graph_labels = graphdata.yearly_labels;


    } else if (active_graph == 'date_range' || active_graph == 'date_range_entered') {

      graph_labels = graphdata.date_labels;


    }
    let keyword = [];

   
    let cls_price = [];
    let backgroundColor = "#ec470d,#3c3b97,#F1DD8C,#6DFC66,#6692FC,#7B59FA,#C759FA,#F846F8";
    let array = backgroundColor.split(",");
    let borderColor = "#ec470d,#3c3b97,#F1DD8C,#6DFC66,#6692FC,#7B59FA,#C759FA,#F846F8";
    let borderColorarr = borderColor.split(",");
    console.log(active_graph);
    if (active_graph) {
      active_graph.forEach((element, index) => {
        let count = element.count;
        let keyword_count = [];
        count.forEach((datacount) => {
          keyword_count.push(datacount.count);
        });
        keyword.push({
          'label': element.label, 'data': keyword_count, 'fill': false, backgroundColor: array[index],
          borderColor: borderColorarr[index]
        });

      });
      console.log('keyword', keyword);
    }
    const data = {
      labels: graph_labels,
      datasets: keyword,
    };
    console.log('data', data);
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

  handleClick(e, graph_type) {
    const elem = e.target;
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
    return (
      <React.Fragment>

        <div className="chart">
          {/* <div className="text-center  mb-3">
            <button className="btn btn-outline-primary active graph_btn" onClick={(e) => this.handleClick(e,'weekly')} name="weekly_btn">Weekly</button>
            <button className="btn btn-outline-primary graph_btn" onClick={(e) => this.handleClick(e,'monthly')} name="monthly_btn">Monthly</button>
            <button className="btn btn-outline-primary graph_btn" onClick={(e) => this.handleClick(e,'yearly')} name="yearly_btn">Yearly</button>
          </div> */}
          {this.generateGraph(this.props.active_graph)}

        </div>

      </React.Fragment>
    );
  }



}


export default SearchGraph;