import React from 'react';
import { Pie } from 'react-chartjs-2';
import Functions from '../helpers/functions';
const funcObj = new Functions;
export default class SalesPieGraph extends React.Component{

  
    
    render(){

      let data = {
        labels: ['testing data', 'sample data'],
        datasets: [
          {
            label: '# of Votes',
            data: [1200, 1050],
            backgroundColor: [
              
              '#B198FA',
              '#F7AB83',
            ],
            borderColor: [
              '#845CF9',
              '#F47D34',
            ],
            borderWidth: 1,
          },
        ],
      };
      let sales = this.props.graph_data;
      var options = {
        legend: false,
        title: {
          display: true,
        },
        plugins: {
          tooltip: {
              callbacks: {
                  label: function(data) {
                      const label = data.label || '';
                      let value =0;
                      sales.forEach(element => {
                        if(element.class_title_s==label){
                          value  = value + parseInt(element.total_amount);
                          document.getElementById("content-revenue").innerHTML =element.total_amount;
                          document.getElementById("content-revenue-class").innerHTML =element.class_title_s;
                        }
                      });
                      return label +":"+ data.raw;
                  }
              }
          }
      }
      
      };
      if(this.props.pie_data && Object.keys(this.props.pie_data).length>0){
        data = this.props.pie_data;
      }
        return (
            <React.Fragment>
            <div className='data-container text-center mb-4  mb-md-0  pt-0'>
            <h5 className='mb-4'>{this.props.title?this.props.title:""}</h5>
        <Pie data={data} options={options} />
            </div>
         
            </React.Fragment>
        );
    }



}