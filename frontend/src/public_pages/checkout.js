import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';
import Axios from 'axios';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

export default class Checkout extends React.Component {
    constructor(props) {
        super(props);
    
            this.state = {
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

        

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitMpesa = this.handleSubmitMpesa.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
    }
    componentDidMount() {
        if( AUTH_USER != null){
            this.getCountry();
            this.getCountry();
            this.payment_methods();
        }
        
    }
    componentDidUpdate(prevProps){
        if(prevProps.total_amount != this.props.total_amount){
            this.setState({amount:this.props.total_amount});
        }
    }

    payment_methods() {
        const endPoint = 'payment-methods';
        funcObj.commonFetchApiCall({}, endPoint).then(data => {
            console.log('payment-methods',data)
            if (data.code == 200) {
                const payment_methods = data.data.methodsData;
                if (payment_methods && Object.keys(payment_methods).length > 0) {

                    payment_methods.map((payment_method, index) => {

                        this.setState({
                            ACTIVE_CARD_PAYMENT:data.data.ACTIVE_CARD_PAYMENT,
                            payment_methods: payment_methods,
                            current_payment_method: payment_method.payment_key
                        });
                        if(data.data.ACTIVE_CARD_PAYMENT == 'cybersource'){
                            this.setCybersourceState(payment_method,data.data.ACTIVE_CARD_PAYMENT);
                        }
                    })
                }




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
    handleRadio(event,payment_method) {
            this.setCybersourceState(payment_method,this.state.ACTIVE_CARD_PAYMENT);
        
        this.setState({ current_payment_method: event.target.value });
    }
 
    render() {
        console.log('current_payment_method',this.state.current_payment_method)
        console.log('ACTIVE_CARD_PAYMENT',this.state.ACTIVE_CARD_PAYMENT)
    
        return (
            <React.Fragment>

                {
                    AUTH_USER == null ?
                        <div className="card-body clientReviews-list mb-4">
                            <p className="text-success">Login is required to proceed checkout</p>
                            <br />
                            <Link className="btn signinBtn sign_in_btn" to="/login">Login</Link>
                        </div>

                        :
                        
                        <React.Fragment>

                        {this.props && Object.keys(this.props).length > 0 ?
                        
                    <div className="form-group mt-3 mt-md-4">
                        <h3 className="dashboard-title title-margin m-0 ">Payment options</h3>
                        <hr className="my-3 my-lg-4"></hr>
                        <div className="row">
                                {
                                    this.state.current_payment_method != "" &&   this.state.payment_methods && Object.keys(this.state.payment_methods).length > 0 ?
                                        this.state.payment_methods.map((payment_method, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {
                                                        Object.keys(this.state.payment_methods).length > 1 ?
                                                       
                                                            <React.Fragment>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <div class="custom-radio">
                                                                            <input type="radio" id={payment_method.payment_key} value={payment_method.payment_key} name="current_payment_method" onChange={(e) => this.handleRadio(e,payment_method)}
                                                                                checked={this.state.current_payment_method !="" && this.state.current_payment_method == payment_method.payment_key ? true : false}
                                                                                
                                                                            />
                                                                            <label htmlFor={payment_method.payment_key} className="mr-3">{payment_method.payment_title}</label>
                                                                        </div>
                                                                    </div></div>
                                                            </React.Fragment>
                                                            :
                                                            <input type="hidden" name="payment_method" value={payment_method.payment_key} />
                                                    }
                                                </React.Fragment>
                                            )

                                        })
                                        : null

                                }




                            </div>

                            {
                          this.state.current_payment_method != "" && this.state.payment_methods && Object.keys(this.state.payment_methods).length > 0 ?
                                 
                            <React.Fragment>    
                            {
                                this.state.current_payment_method == 'card_payment' && this.state.ACTIVE_CARD_PAYMENT ==  'cybersource' ?
                                <React.Fragment>
                                    {this.showCardPaymentCybersource()}
                                </React.Fragment>
                                : null

                            }

                            {
                                this.state.current_payment_method == 'card_payment' && this.state.ACTIVE_CARD_PAYMENT !=  'cybersource' ?

                                <React.Fragment>
                                
                                    {this.showCardPayment()}
                                </React.Fragment>
                                :null
                            }

                            {this.state.current_payment_method == 'bank_transfer' ?
                                <React.Fragment>
                                    {this.showBankDetails()}
                                </React.Fragment>
                                : null
                            }
                            
                            {this.state.current_payment_method == 'mpesa' ?
                                <React.Fragment>
                                    {this.showMpesa(this.props.total_amount)}
                                </React.Fragment>
                                : null
                            }
                            </React.Fragment>
                            :null 
                            }

                        </div>
                        :null
                    }
                        </React.Fragment>

                }

            </React.Fragment>
        );
    }

    getCity(cityId) {
        let postBodyData = "";
        let endPoint = 'common/city?country_id=' + cityId;
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            if (response.code == 200) {
                console.log(response.data);
                this.setState({
                    city_list: (response.data) ? response.data : []
                })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getCountry() {
        let postBodyData = "";
        let endPoint = 'common/country';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {
            if (response.code == 200) {
                let countryId;
                if (this.state.country) {
                    countryId = response.data.find(data => data.name == this.state.country);
                    if(countryId != undefined && countryId.id != undefined){
                        countryId = countryId.id;
                        this.getCity(countryId);
                        this.getState(countryId);
                    }
                } else {
                    countryId = ""
                }

                this.setState({
                    country_list: (response.data) ? response.data : [],
                    countryId: countryId
                })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    getState(stateId) {
        let postBodyData = "";
        let endPoint = 'common/state?country_id=' + stateId;
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(response => {

            if (response.code == 200) {
                console.log(response.data);
                this.setState({
                    state_list: (response.data) ? response.data : []
                })

            } else if (response.code == 201) {
                Swal.fire({
                    title: '',
                    text: response.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
        });
    }

    handleChange(event) {
        if (event.target.name == "country") {
            console.log("event.target.value", event.target.value)
            if (event.target.value) {
                this.getCity(event.target.value);
                this.getState(event.target.value);
                let countryname = this.state.country_list.find(data => data.id == event.target.value);
                // console.log("countryname", countryname)
                this.setState({ "country": countryname.name, countryId: event.target.value })
            } else {
                this.setState({ country: "", countryId: "", city_list: "", state_list: "", city: "", state: "" })
            }

        } else {
            this.setState({
                // Computed property names
                // keys of the objects are computed dynamically
                [event.target.name]: event.target.value
            })
        }

    }

    handleSubmitMpesa(){
    
            
        let postBodyData = {
            "mobile": this.state.mobile,
            "amount": this.state.amount,
            "checkout_data": this.props.checkout_data,
            "payment_for": this.props.checkout_for,
            "payment_method": this.state.current_payment_method
        };
        if(document.getElementById('total_amount')){
            postBodyData.amount =  document.getElementById('total_amount').value;
        }
        console.log("postBodyData", this.state);
        // return false;
        let endPoint = 'transaction-pay';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            console.log('transaction-pay response',data)

            if (data.code == 200) {

                funcObj.custom_alert_message(data.message,'success',"my-books?active_tab=subscribed")
                funcObj.removeLocalStorage("cart_items");
                document.getElementById('cart_count').textContent = funcObj.get_cart_items_length();
                this.props.clearCartItems();
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

    frontendIntasend(){
             // Use https://payment.intasend.com/api/v1/checkout/ for live payments
            let url = "https://sandbox.intasend.com/api/v1/checkout/"
            let payload = {
                public_key: "ISPubKey_test_2caed3ad-8c63-4e26-a6d0-c719d4f2c2fe",
                amount: 10,
                currency: "KES",
                email:this.state.email,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                country:"KE",
                
            }
            funcObj.commonFetchApiCall()
            Axios.post(url, payload).then((resp) => {
                console.log('res',resp)
                if (resp.data.url) {
                    window.open(resp.data.url, '_blank').focus();
                }
            }).catch((err) => alert("Problem experienced while initializing your request: " + err))
      
    }

    handleSubmit(event) {
        
        event.preventDefault();
       
        
        let expire = this.state.expire.split('-')
        let year = expire[0].toString().substr(-2);
        let phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        let emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let numberReg = /^[0-9]*$/;
        if (this.state.first_name == "") {
            funcObj.custom_alert_message("Please enter a first name!")
            return false;
        }
        if (this.state.last_name == "") {
            funcObj.custom_alert_message("Please enter a last name!")
            return false;
        }
        if (this.state.email == "") {
            funcObj.custom_alert_message("Please enter a email!")
            return false;
        }
        if (this.state.email) {
            if (emailReg.test(this.state.email) === false) {
                console.log("Email is Not Correct");
                funcObj.custom_alert_message("Please enter a valid email!")
                return false;
            }
        }
        if (this.state.mobile == "") {
            funcObj.custom_alert_message("Please enter a phone number!")
            return false;
        }
        if (this.state.mobile) {
            if (phoneReg.test(this.state.mobile) === false) {
                funcObj.custom_alert_message("Please enter a valid phone number!")
                return false;
            }
        }
        // if(this.state.current_payment_method == 'card_payment'){
        //     return this.frontendIntasend();
        // }
        // if (this.state.card_number == "") {
        //     funcObj.custom_alert_message("Please enter a card number!")
        //     return false;
        // }
        // if (numberReg.test(this.state.card_number) === false) {
        //     funcObj.custom_alert_message("Please enter a number on card number!")
        //     return false;
        // }
        // if (this.state.expire == "") {
        //     funcObj.custom_alert_message("Please enter a Expriration!")
        //     return false;
        // }
        // if (this.state.cvv == "") {
        //     funcObj.custom_alert_message("Please enter a cvv!")
        //     return false;
        // }
        // if (numberReg.test(this.state.cvv) === false) {
        //     funcObj.custom_alert_message("cvv numeric only!")
        //     return false;
        // }
        // if (numberReg.test(this.state.post_code) === false) {

        //     funcObj.custom_alert_message("post code numeric only!")
        //     return false;
        // }
        // if (this.props.total_amount == "") {
        //     funcObj.custom_alert_message("Amount not enter!")
        //     return false;
        // }

        

        let postBodyData = {
            "mobile": this.state.mobile,
            "first_name": this.state.first_name,
            "last_name": this.state.last_name,
            "street1": this.state.address,
            "city": this.state.city,
            "state": this.state.state,
            "country": this.state.country,
            "email": this.state.email,
            "post_code": this.state.post_code,
            "expiration_month": expire[1],
            "expiration_year": year,
            "cvv": this.state.cvv,
            "currency": this.state.currency,
            "card_number": this.state.card_number,
            "amount": this.props.total_amount,
            "checkout_data": this.props.checkout_data,
            "payment_for": this.props.checkout_for,
            "payment_method":this.state.current_payment_method
        };
        
        console.log("postBodyData", this.state);
        // return false;
        let endPoint = 'transaction-pay';

        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            // funcObj.custom_alert_message('data response',data)
            console.log('resp',data.data)

            if (data.code == 200) {
                
                
                if(this.state.current_payment_method == 'card_payment'){
                     window.location = data.data.url;
                }else{
                    funcObj.custom_alert_message(data.message,'success')
                    funcObj.removeLocalStorage("cart_items");
                    document.getElementById('cart_count').textContent = funcObj.get_cart_items_length();
                }
                

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


    onChangeRadio(e, img) {
        const src = funcObj.assets_path("/images/icons/" + img);
        document.getElementById('card_img').setAttribute('src', src);
    }

    showBankDetails() {
        return (
            <React.Fragment>
                Bank detail Integration
            </React.Fragment>
        );
    }
    showMpesa(amount) {
        let mpesa_disabled=false;
        if(this.props.checkout_for == 'membership' && this.state.amount == 20){
            mpesa_disabled=true;
        }
 
        return (
            <React.Fragment>
                  <div className="card-body clientReviews-list mb-4">
                            <div>
                                <form className="py-4" id="mpesa_frm" >
                                    <div className="" id="addNewCard">
                                        <div className="row" >
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Amount</label>
                                                    <input className="form-control rounded" defaultValue={this.state.amount} value={this.state.amount} onChange={this.handleChange} id="total_amount" name="amount" disabled={mpesa_disabled} ></input>
                                                </div>
                                            </div>
                                           
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label>Mobile</label>
                                                    <div className='row'>
                                                    <div className='col-md-4'>
                                                        <input type="text" className="form-control rounded mobile_country_code" defaultValue="254" disabled />
                                                    </div>
                                                    <div className='col-md-8'>
                                                        <input type="text" className="form-control rounded mobile_field" maxLength="9" value={this.state.mobile} onChange={this.handleChange} placeholder="Mobile" name="mobile"></input>
                                                    </div> 
                                                    </div>
                                                    
                                                    
                                                    
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="button" onClick={this.handleSubmitMpesa} className="btn darkBtn">CONFIRM PAYMENT</button>
                                    </div>
                                </form>
                            </div>
                        </div>
            </React.Fragment>
        );
    }
    showCardPayment() {
        return (
            <React.Fragment>
           
                        <div className="card-body clientReviews-list mb-4">
                            <div>
                                <form className="py-4" onSubmit={this.handleSubmit}>
                                    <div className="" id="addNewCard">
                                        <div className="row" >
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>First Name</label>
                                                    <input className="form-control rounded" value={this.state.first_name} onChange={this.handleChange} placeholder="First Name" name="first_name"></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input className="form-control rounded" value={this.state.last_name} onChange={this.handleChange} placeholder="Last Name" name="last_name"></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input className="form-control rounded" value={this.state.email} onChange={this.handleChange} placeholder="Email" name="email"></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Mobile</label>
                                                    <input className="form-control rounded" value={this.state.mobile} onChange={this.handleChange} placeholder="Mobile" name="mobile"></input>
                                                </div>
                                            </div>
                                            {/* <div className="col-12">
                                                <div className="form-group">
                                                    <label>Card Number</label>
                                                    <input type="text" className="form-control rounded" maxLength="16" value={this.state.card_number} onChange={this.handleChange} placeholder="Card Number" name="card_number"></input>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Expiration</label>
                                                    <input type="month" min={this.state.setMinDate} className="form-control rounded" value={this.state.expire} onChange={this.handleChange} placeholder="MM/YY" name="expire"></input>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>CVV </label>
                                                    <input type="text" className="form-control rounded" maxLength="3" value={this.state.cvv} onChange={this.handleChange} placeholder="123" name="cvv" ></input>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label>Address</label>
                                                    <input className="form-control rounded" value={this.state.address} onChange={this.handleChange} placeholder="Address" name="address"></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>City</label>
                                                    <select title="City/Town" value={this.state.city} onChange={this.handleChange} style={{ borderRadius: 0 }} className="input-field form-control" name="city">
                                                        <option value="" >Select City</option>
                                                        {this.state.city_list.length > 0
                                                            && this.state.city_list.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.name}>{item.name}</option>
                                                                )
                                                            }, this)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>State</label>
                                                    <select title="State" value={this.state.state} onChange={this.handleChange} style={{ borderRadius: 0 }} className="input-field form-control" name="state">
                                                        <option value="" >Select State</option>
                                                        {this.state.state_list.length > 0
                                                            && this.state.state_list.map((item, i) => {
                                                                return (
                                                                    <option key={i} value={item.name}>{item.name}</option>
                                                                )
                                                            }, this)
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Postal Code</label>
                                                    <input maxLength="5" className="form-control rounded" value={this.state.post_code} onChange={this.handleChange} placeholder="Postal Code" name="post_code"></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Country</label>
                                                    <select title="Country" value={this.state.countryId} onChange={this.handleChange} style={{ borderRadius: 0 }} className="input-field form-control" name="country">
                                                        <option value="" >Select Country</option>
                                                        {this.state.country_list.length > 0
                                                            && this.state.country_list.map((item, i) => {
                                                                return (

                                                                    (item.id == 113) ? <option key={i} value={item.id}>{item.name}</option> : null
                                                                )
                                                            }, this)
                                                        }
                                                    </select>
                                                </div>
                                            </div> */}

                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn darkBtn">CONFIRM PAYMENT: <span id="confim_payment">{this.props.total_amount}</span>{funcObj.getCurrency()}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* <div className="card-body clientReviews-list">
                            <h3 className="dashboard-title title-margin m-0 ">Apply Code</h3>
                            <form className="py-4">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Have a Gift Card or Promo Code?</label>
                                            <input className="form-control rounded" placeholder="Enter Code"></input>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button type="btn" disabled className="btn btn-dark  w-100 py-2 my-4 px-4">APPLY</button>
                                    </div>
                                </div>
                            </form>
                        </div> */}



                 
            </React.Fragment>
        );
    }

 
    setCybersourceState(payment_method,ACTIVE_CARD_PAYMENT){
        if(payment_method.payment_key == 'card_payment' && ACTIVE_CARD_PAYMENT ==  'cybersource'){

         const endPoint = 'cybersource-card-pay-sign';
         let postData = {
             profile_id:payment_method.profile_id,
             access_key:payment_method.access_key,
             signed_date_time:payment_method.signed_date_time,
             transaction_uuid:payment_method.transaction_uuid,
             signed_field_names:this.state.cybersource_signed_field_names,
             unsigned_field_names:'',
             locale:'en',
             transaction_type:this.state.transaction_type,
             reference_number:this.state.reference_number,
             amount:this.state.amount,
             currency:"KES",
             bill_to_address_country:this.state.bill_to_address_country,        
             bill_to_address_city:this.state.bill_to_address_city,
             bill_to_address_line1:this.state.bill_to_address_line1,
             bill_to_surname:this.state.last_name,
             bill_to_forename:this.state.first_name,
             bill_to_email:this.state.email,
             
         };
         
         funcObj.commonFetchApiCall(postData, endPoint).then(data => {
             if(data.code == 200){
                 this.setState({ 
                     action_url: payment_method.action_url, 
                     profile_id:payment_method.profile_id,
                     access_key:payment_method.access_key,
                     signed_date_time:payment_method.signed_date_time,
                     transaction_uuid:payment_method.transaction_uuid,
                     signature: data.data.signature
                 });
             }
         }); 
     }
   
 }
 submitFrm(e){
    document.getElementById('payment_confirmation').submit()
 }
 submitCyberSourceCard(e){
    var form = document.getElementById('payment_confirmation');
    var form_data = new FormData(form);
    console.log('form_data1',form_data);
    const values = [...form_data.entries()];
    console.log('form_data2',values);
    const checkout_for = this.props.checkout_for;
    let postBodyData = {
        mobile:this.state.mobile,
        "amount": this.state.amount,
        "checkout_data": this.props.checkout_data,
        "payment_for": checkout_for,
        "payment_method": this.state.current_payment_method,
        transaction_uuid:this.state.transaction_uuid,
        signed_date_time:this.state.signed_date_time,
        signature:this.state.signature,
    };
    for(const pair of values) {
        postBodyData[pair[0]] = pair[1];
        
      }
    if(document.getElementById('total_amount')){
        postBodyData.amount =  document.getElementById('total_amount').value;
    }
    let endPoint = 'transaction-pay';
    let promise = new Promise(function(resolve, reject) {
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
         if(data.code == 200){
            resolve(data);
         }else{
            reject(data.message);
         }
           
        });
    });

    promise.then(function(data){
        console.log('response data:',data);
        funcObj.setLocalStorage('payment_for',checkout_for);
        document.getElementById('payment_confirmation').submit()
    },function (error){
        console.log('error occured:',error);
    });
    

    
   

}
    showCardPaymentCybersource() {
        return (
            <React.Fragment>
                        <div className="card-body clientReviews-list mb-4">
                            <div>

       <form id="payment_confirmation"   action={this.state.action_url} method="post" >

       <input type="hidden" name="access_key" id="access_key" value={this.state.access_key} />
    <input type="hidden" name="profile_id" id="profile_id" value={this.state.profile_id} />
    <input type="hidden" name="transaction_uuid" id="transaction_uuid" value={this.state.transaction_uuid} />
    <input type="hidden" name="signed_field_names" id="signed_field_names" value={this.state.cybersource_signed_field_names} />
    <input type="hidden" name="unsigned_field_names" id="unsigned_field_names" />
    <input type="hidden" name="signed_date_time" id="signed_date_time" value={this.state.signed_date_time} />
    <input type="hidden" name="locale" id="locale" value="en" />
    <input type="hidden" name="bill_to_address_country" id="bill_to_address_country" value={this.state.bill_to_address_country}  />
    <input type="hidden" name="bill_to_address_city" id="bill_to_address_city" value={this.state.bill_to_address_city} />
    <input type="hidden" name="bill_to_address_line1" id="bill_to_address_line1" value={this.state.bill_to_address_line1} />
    <input type="hidden" name="transaction_type" id="transaction_type" size="25" value={this.state.transaction_type} />
    <input type="hidden" name="reference_number" id="reference_number" size="25" value={this.state.reference_number} />
    <input type="hidden" name="amount" id="amount" size="25" value={this.state.amount} />
    <input type="hidden" name="currency" id="currency" size="25" value="KES" />
    <input type="hidden" name="signature" id="signature" value={this.state.signature} />
    {
        funcObj.customIsPropertyNotEmpty(this.state.signature)?
        <i class="fa fa-check" aria-hidden="true"></i>
        :null
    }
                                    <div className="" id="addNewCard">
                                        <div className="row" >
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>First Name</label>
                                                    <input className="form-control rounded" value={this.state.first_name} onChange={this.handleChange} placeholder="First Name" name="bill_to_forename" id="bill_to_forename"></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input className="form-control rounded" value={this.state.last_name} onChange={this.handleChange} placeholder="Last Name" name="bill_to_surname" id="bill_to_surname"></input>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input className="form-control rounded" value={this.state.email} onChange={this.handleChange} placeholder="Email" name="bill_to_email" id="bill_to_email"></input>
                                                </div>
                                            </div>
                                            {/* <div className="col-6">
                                                <div className="form-group">
                                                    <label>Mobile</label>
                                                    <input className="form-control rounded" value={this.state.mobile} onChange={this.handleChange} placeholder="Mobile" name="mobile" id="mobile"></input>
                                                </div>
                                            </div> */}
                                           

                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type='button' onClick={(e)=>this.submitCyberSourceCard(e)}  className="btn darkBtn">CONFIRM PAYMENT: <span id="confim_payment">{this.props.total_amount}</span>{funcObj.getCurrency()}</button>
                                        
                                    </div>
                                </form>
                            </div>
                        </div>
                     



                 
            </React.Fragment>
        );
    }


}
