import React from 'react';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import Functions from '../helpers/functions';
const funcObj = new Functions();

export default class PublicFaq extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            content: "",
            module_key:"faq"
        };
    }
    
    componentDidMount(){
        this.getModule();
    }

    getModule = () => {
        console.log('getModule')
        let endPoint = 'get-public-faq';
        let postBodyData = {
            module_key:this.state.module_key
        }
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(response => {

            if (response.code == 200) {
            
                this.setState({
                    content: response.data.module_description,
                });

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }

        })

        
    }
    render() {
        return (
            <React.Fragment>
                     <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="row">
                               <div className="col-md-12">
                                    <div dangerouslySetInnerHTML={{__html:  this.state.content}}></div>
                               </div>
                            </div>
                            
                        </div>
                    </div>


            </React.Fragment>
        );
    }
   
}
