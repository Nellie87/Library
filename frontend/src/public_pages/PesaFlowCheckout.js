import React from 'react';
import {withRouter, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';
import Axios from 'axios';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
const payAPI = funcObj.api_request_url() + `pesaflow/payment`;
class PesaFlowCheckout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token:"",
            clientIDNumber:"",
            apiData: "",
            error: null,
            test: 0,
            first_name: AUTH_USER.user.first_name,
            last_name: AUTH_USER.user.last_name,
            card_number: "",
            expire: "",
            cvv: "",
            address: AUTH_USER.user.address,
            city: AUTH_USER.user.city,
            state: AUTH_USER.user.state,
            country: AUTH_USER.user.country,
            post_code: AUTH_USER.user.post_code,
            city_list: [],
            country_list: [],
            state_list: [],
            countryId: "",
            currency: "KES",
            email: AUTH_USER.user.email,
            mobile: AUTH_USER.user.mobile,
            setMinDate: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + parseInt(1)),
            payment_methods: {},
            current_payment_method: "card_payment",
            amount:this.props.total_amount,
            billDesc:"",
            new:'',
            ACTIVE_CARD_PAYMENT:"",
            action_url:"",
            bill_to_address_city:"Nairobi",
            bill_to_address_country:"KE",
            bill_to_address_line1:"681-5094 Luctus Avenue 58",
            transaction_type:"sale",
            reference_number:Math.floor(Date.now()),
            cybersource_signed_field_names:'access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,bill_to_address_city,bill_to_address_country,bill_to_address_line1,bill_to_email,bill_to_surname,bill_to_forename'
        };

    }

    componentDidMount() {

        if( AUTH_USER !==null) {

            fetch(payAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "checkout_data": this.props.checkout_data,
                    clientIDNumber:AUTH_USER.user['identification_number'],
                    amount: this.props.total_amount,
                    token: AUTH_USER['token'],
                    state:this.state.state,
                    mobile:this.state.mobile,
                    email: this.state.email,
                    clientName:this.state.first_name + " " + this.state.last_name,
                    billDesc: this.props.checkout_for,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    this.setState({ apiData:JSON.parse(data) }, () => {
                        
                       
                      });
                     
                }) 
                .catch(error => {
                    this.setState({error: error.message});
                })
        }else {
            window.location = funcObj.api_request_url() + "sso/oauth/authorize";
        }
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.total_amount !== this.props.total_amount){
           this.setState({"checkout_data": this.props.checkout_data})
            this.setState({amount:this.props.total_amount});
            this.setState({billDesc: this.props.checkout_for});
            this.setState({access_token:AUTH_USER['token']});
            this.setState({clientIDNumber:AUTH_USER.user['identification_number']});

            if( AUTH_USER != null) {



                fetch(payAPI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "checkout_data": this.props.checkout_data,
                        clientIDNumber:AUTH_USER.user['identification_number'],
                        amount: this.props.total_amount,
                        token: AUTH_USER['token'],
                        state:this.state.state,
                        mobile:this.state.mobile,
                        email: this.state.email,
                        
                        clientName:this.state.first_name+ " " +this.state.last_name,
                        billDesc: this.props.checkout_for,
                    }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        this.setState({ apiData:JSON.parse(data) }, () => {
                            const jsonData = JSON.parse(data);
                        
                          });
                    })
                    .catch(error => {
                        this.setState({error: error.message});
                    })
            }else {
                window.location = funcObj.api_request_url() + "sso/oauth/authorize";
            }
        }

    }





    render() {


        const { apiData, error } = this.state;

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <React.Fragment>
                {!AUTH_USER ? (
                    <div className="card-body clientReviews-list mb-4">
                        <p className="text-success">Login is required to proceed to checkout</p>
                        <br />
                        <Link className="btn signinBtn sign_in_btn" to="/sso/oauth/authorize">
                            Login
                        </Link>
                    </div>
                ) : (

                    <React.Fragment>
                        {apiData && (
                            // <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
                            //     <iframe
                            //         title="API Content"
                            //         srcDoc={this.state.apiData}
                            //         src="https://payments.ecitizen.go.ke"
                            //         width="100%"
                            //         height="100%"
                            //         style={{ border: 'none' }}
                            //         sandbox="allow-scripts allow-same-origin"
                            //         dangerouslySetInnerHTML={{ __html: this.state.apiData }}
                            //         onLoad={this.handleIframeLoad}
                            //     />
                            // </div>
                             <div>
                            <section className="phx-hero">
                               <form
                                 action="https://payments.ecitizen.go.ke/PaymentAPI/iframev2.1.php"
                                 method="post"
                                 target="pesaiframe"
                                 //onSubmit={handleSubmit} // Call the function on form submission
                               >
                                 {/* Add your hidden input fields with dynamic values */}
                                 <input type="hidden" id="secureHash" value={apiData.secureHash} name="secureHash" />
                                <input type="hidden" name="apiClientID" value={apiData.apiClientID} />
                                <input type="hidden" className="form-control" id="serviceID" name="serviceID" value={apiData.serviceID} />
                                <input type="hidden" className="form-control" id="notificationURL" name="notificationURL" value={apiData.notificationURL} />
                                <input type="hidden" className="form-control" id="callBackURLOnSuccess" name="callBackURLOnSuccess" value={apiData.callBackURLOnSuccess} />
                                <input type="hidden" className="form-control" id="billRefNumber" name="billRefNumber" value={apiData.billRefNumber} />
                                <input type="hidden" className="form-control" id="accountNumber" name="sendSTK" value={apiData.sendSTK} />
                                <input type="hidden" className="form-control" id="pictureURL" name="pictueURL" value={apiData.pictueURL} />
                                <input type="hidden" className="form-control" id="format" name="format" value={apiData.format} />
                                <input type="hidden" className="form-control" id="currency" name="currency" value={apiData.currency} />
                                <input type="hidden" className="form-control" id="amountExpected" name="amountExpected" value={apiData.amountExpected} />
                                <input type="hidden" className="form-control" id="billDesc" name="billDesc" value={apiData.billDesc} />
                                <input type="hidden" className="form-control" id="clientMSISDN" name="clientMSISDN" value={apiData.clientMSISDN} />
                                <input type="hidden" className="form-control" id="clientIDNumber" name="clientIDNumber" value={apiData.clientIDNumber} />
                                <input type="hidden" className="form-control" id="clientEmail" name="clientEmail" value={apiData.clientEmail} />
                                <input type="hidden" className="form-control" id="clientName" name="clientName" value={apiData.clientName} />

                                 
                                 {/* Add the rest of the input fields with dynamic values from apiData */}
                       
                                 <button type="submit" className="btn  addCart py-1 px-3 mr-1">
                                   Make Payment
                                 </button>

                               </form>
                             </section>
                             <section>
                               <iframe name="pesaiframe" id="pesaiframe" width="100%" height="600px"></iframe>
                             </section>
                             </div>
                             
                           
                        )}
                    </React.Fragment>



                )}
            </React.Fragment>
        );

    }
    handleIframeLoad = () => {

        // Access the contentWindow of the iframe
        const iframeWindow = document.querySelector('iframe').contentWindow;
    
        // Extract the URL from the HTML content of the iframe
        const urlMatch = iframeWindow.document.body.innerHTML.match(/<meta http-equiv="refresh" content="0;url=(.*?)">/);
        
        if (urlMatch && urlMatch[1]) {
          // Redirect the user to the extracted URL
          this.props.history.push(urlMatch[1]);
        }
      };
}
export default  withRouter(PesaFlowCheckout);


