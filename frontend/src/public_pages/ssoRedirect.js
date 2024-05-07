import React, {Component} from 'react';
import {  withRouter} from 'react-router-dom';
import Functions from '../helpers/functions';
import Swal from 'sweetalert2';

const funcObj = new Functions();

class SSORedirect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_info:[],
            errorOccurred: false, // Initialize the state here
            // Other state properties...
        };
    }
    componentDidMount() {

        //console.log(location);
        const { search } = this.props.location;
        const searchParams = new URLSearchParams(search);
       // const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        let error = searchParams.get('error');
        let errorDesc = searchParams.get('error_description');
        // console.log(searchParams);
        // console.log("code is: ",code);
        // console.log("state is: ",state);

        if (error || errorDesc) {
            this.setState({
                errorOccurred: true,
            });

            return;
        }

        let postBodyData = {
            authCode: code,
            authState: state,
        };

        let endPoint = 'login/oauth/authorise';

        const AUTH_USER = funcObj.getAuthUser();

        if (AUTH_USER == null) {
            funcObj.preAuthApiCall2(postBodyData, endPoint).then((data) => {
                console.log('data response', data);

                if (data.code === 200) {
                    if (data.data.dontask == true) {
                        let user = {
                            'is_logged_in': true,
                            'user': data.data.token_info.original.data,
                            'email': data.data.token_info.original.data.email,
                            'account_type': data.data.token_info.original.data.user_type,
                            'token': data.data.token_info.original.token
                        };
                        console.log("user_data :",user);
                        user = JSON.stringify(user);
                        funcObj.setLocalStorage('user', user);
                        return funcObj.redirectAuthenticatedUser();
                        Swal.close();
                        return ;
                    }
                    else {
                        let mobile = data.data.token_info.original.data.mobile;
                        let hidemobile = funcObj.hideMobileNumber(mobile);
                        this.setState({
                            authentication: true,
                            login_success: true,
                            user: data.data,
                            mobile: hidemobile
                        });
                        document.getElementById('otp').focus();
                    }
                } else if (data.code === 201) {

                    if (data.data.user_info) {
                        console.log("this user info before profile:",data.data.user_info);
                        this.props.history.push({
                            pathname: '/complete-profile',
                            state: data.data // Pass additional data to the route
                        });
                        Swal.close()
                    }else{
                        funcObj.custom_alert_message(data.message, 'error');
                    }

                } else if (data.code === 202) {
                    console.log('data response after login', data);

                    this.setState({
                        expired: true,
                        user_id: data.data.user_id,
                        npassword: '',
                        cpassword: '',
                    });
                    funcObj.custom_alert_message(data.message, 'error');
                } else if (data.code === 203) {
                    Swal.fire({
                        title: '',
                        text: data.message,
                        padding: '5px',
                        width: 500,
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            funcObj.redirectPage('forget-password');
                        }
                    });
                } else if (data.code === 204){
                    this.redirectPage('/complete-profile', data);
                }
            });
        } else {
            // Handle the case when AUTH_USER is not null
        }
    }

    render() {
        if (this.state.errorOccurred) {
            Swal.fire({
                icon: 'error',
                title: this.error,
                text:  this.errorDesc,
            });
            return null; // or return an empty JSX element if you want
        }

        // Swal alert for redirecting
        Swal.fire({
            title: 'loading profile...',
            html: 'Please wait...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            },
            showConfirmButton: false, // Hides the default "Confirm" button
            willClose: () => {
                // Prevents the user from closing the alert manually
                return false;
            },
        });

        return null;
    }
}

export default withRouter(SSORedirect);


