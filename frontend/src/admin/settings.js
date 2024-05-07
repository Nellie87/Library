import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default class AdminSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            payment_methods:{},
            payment_key:"",
            is_active:0
        }
    }
    handleCheckbox(event) {
        
        if(event.target.checked){
            this.handleSubmit(event.target.name,1);
         }else{
            this.handleSubmit(event.target.name,0);
           
        }
       
  }
  handleSubmit(key,val){    
       
    let endPoint = 'update-payment-methods';
    let postBodyData = {
        payment_key:key,
        is_active:val
    };

    funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST', true).then(data => {
        // alert('data response',data)

        if (data.code == 200) {
            console.log(data)
            Swal.fire({
                title: 'Success',
                showCloseButton: true,
                text: data.message,
                icon: 'success',
                showConfirmButton: false,
            })
            this.setState({
                payment_key:key,
                is_active:val
            });
        } else if (data.code == 201) {
            Swal.fire({
                title: '',
                showCloseButton: true,
                text: data.message,
                icon: 'error',
                showConfirmButton: false,
            })
        }
        
    });
  
}
    componentDidMount(){
        const endPoint = 'payment-methods';
        funcObj.commonFetchApiCall({}, endPoint).then(data => {
            if (data.code == 200) {

             this.setState({payment_methods:data.data.methodsData});

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
          
        });

    }
    render() {
        console.log('payment_methods',this.state.payment_methods)
        return (
            <React.Fragment>
             <form id="" method="POST" >
                <div className="card mt-4">
                    <div className="dashboard-box">
                        
                        <div className="row">
                            <div className="col-lg-6">
                                
                                <div className="form-head mb-3">
                                <span className="bg-white d-inline-block px-3">Payment methods</span>
                                </div>
                                <div className="row">
                                        <div className="col-md-12">
                                <div className="form-group">
                                    <div class="custom-checkbox">

                                            {
                                            this.state.payment_methods && Object.keys(this.state.payment_methods).length > 0 ?
                                                this.state.payment_methods.map((payment_method, index) => {
                                                    return (
                                                      <React.Fragment key={index}>
                                                      <input type="checkbox" id={payment_method.payment_key}  name={payment_method.payment_key}  onChange={(e) => this.handleCheckbox(e)}  defaultChecked={payment_method.is_active==1?true:false} />
                                                            <label for={payment_method.payment_key} className="mr-3">{payment_method.payment_title}</label>
                                                      </React.Fragment>
                                                    )
                                                })
                                                : null
                                            }

                                    </div>
                                </div>
                                </div>
                                

                                </div>
                                
                            <br />

                                    
                            <div className="form-head mb-3">
                                <span className="bg-white d-inline-block px-3">Commissions</span>
                                </div>
                                <div className="form-group">

                                    <span>Commissions to various stakeholders</span>

                                  percent/fix ?

                                </div>
                                
                            <br />

                            <div className="form-head mb-3">
                                <span className="bg-white d-inline-block px-3">Route setting</span>
                                </div>
                             ?
                              

                            </div>
                        </div>
                    </div>
                </div>
            </form>
            </React.Fragment>
        );
    }
}
