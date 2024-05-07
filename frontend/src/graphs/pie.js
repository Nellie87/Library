import React from 'react';
import { Pie } from 'react-chartjs-2';
import Functions from '../helpers/functions';
const funcObj = new Functions;
class PieGraph extends React.Component{

  
    generateGraph(){

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
                      let sales = funcObj.getLocalStorage('salesGraph')?funcObj.getLocalStorage('salesGraph'):[];
                      let value;
                   
                      sales.forEach(element => {
                        value +=element.price;
                        if(element.class_name==label){
                          console.log('test label',element.price);
                          document.getElementById("content-revenue").innerHTML =element.price;
                        }
                        // document.getElementById("content-revenue").innerHTML = value;
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
    
    render(){

  
  


        return (
            <React.Fragment>
    
                {this.generateGraph()}
               
            </React.Fragment>
        );
    }



}


export default PieGraph;