// PaymentCallbackComponent.js

import React, {useState} from 'react';
//const AUTH_USER = funcObj.getAuthUser();import {withRouter, Link } from 'react-router-dom';
import Functions from "../helpers/functions";

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

const payAPI = funcObj.api_request_url() + `pesaflow/callback`;

class PaymentCallbackComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentStatus: null,
        };
    }

    //const AUTH_USER = funcObj.getAuthUser();
    componentDidMount() {
        // Check if authUser is not null

        if (AUTH_USER !== null) {
            const token = AUTH_USER.token;
            const user = AUTH_USER.user;
            //console.log("user b4 call back ++++++" + user.id)
            // Make a GET request to the payment callback endpoint
            const urlWithParams = `${payAPI}?token=${token}&userId=${user.id}`;

            // Make a GET request to the payment callback endpoint
            fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`, // If you still need this header
                },
            })
                .then(response => response.json())
                .then((resp) => {

                    // Handle the response from the API
                    //console.log("data from call back:" + resp.data.plan)


                    let currData = funcObj.getLocalStorage('user');

                    // Update the is_membership_user field
                    currData.user.is_membership_user = resp.data.is_membership_user;
                    currData.is_member = resp.data.is_member;
                    currData.plan = resp.data.plan;

                    // Save the updated data back to local storage
                    //console.log("updated user matrix :" + JSON.stringify(currData))
                    funcObj.setLocalStorage('user', JSON.stringify(currData));





                    this.setState({paymentStatus: resp.message});
                    funcObj.removeLocalStorage("cart_items");
                    document.getElementById('cart_count').textContent = funcObj.get_cart_items_length();
                    //this.props.clearCartItems();

                })
                .catch(error => {
                    // Handle network or other errors
                    console.error('Error processing payment:', error);
                });
        } else {
            // Redirect to the login page
            this.redirectToLogin();
        }
    }

// Method to handle redirection to the login page
    redirectToLogin() {
        // Replace '/login' with the actual path of your login page
        window.location = funcObj.api_request_url() + "sso/oauth/authorize";
        // Alternatively, you can use react-router-dom or other routing libraries for programmatic navigation in a React application
    }


    render() {
        const {paymentStatus} = this.state;

        return (
            <div className="card mt-4">
                {paymentStatus && (
                    <div className="">
                        <h3 className="align-centre dashboard-title title-margin mb-0 alert-info align-content-center text-center">{paymentStatus}</h3>
                        <p className="text-centre">
                            {/* Display additional information or links as needed */}
                            <a href="/" className="text-centre">Go back home</a>
                        </p>
                    </div>
                )}
            </div>
        );
    }


}

export default PaymentCallbackComponent;
