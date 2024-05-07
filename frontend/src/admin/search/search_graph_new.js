import React from 'react';
import { Line } from 'react-chartjs-2';
class SearchGraphNew extends React.Component {
  constructor() {
    super();
     this.handleClick = this.handleClick.bind(this);
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
  

      
      
      if (active_graph == 'week') {

        graph_labels = graphdata.weekly_labels;
 
      } else if (active_graph == 'month') {

        graph_labels = graphdata.monthly_labels;
   

      } else if (active_graph == 'year') {

        graph_labels = graphdata.yearly_labels;
       

      } else if (active_graph == 'date_range' || active_graph == 'date_range_entered') {

        graph_labels = graphdata.date_labels;
      

      }
      console.log('data search_contents',this.props.search_contents)
    const data = {
      labels: this.props.search_contents.labels,
      datasets:this.props.search_contents.datasets,
    };
    console.log('data',data);
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
      {
        this.props.search_contents && Object.keys(this.props.search_contents).length > 0?
   
        <div className="chart">
      {
        data && data.datasets.length > 0 ?
        <React.Fragment>
        <Line data={data} options={options} />
      </React.Fragment>
        :
        <span>No record found</span>
      }
          

        </div>
        :null
      }

      </React.Fragment>
    );
  }



}


export default SearchGraphNew;