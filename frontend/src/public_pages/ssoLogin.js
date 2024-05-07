// Assuming this is a part of your React component
import React, {Component} from 'react';
import Functions from '../helpers/functions';

const funcObj = new Functions();

class SsologinButton extends Component {
    // ... (other methods and state)

    handleClick = async (event) => {
        event.preventDefault();
        // Your handleClick logic here
        console.log('Button clicked!');
       //    let postBodyData = {};

        window.location = funcObj.api_request_url() + "sso/oauth/authorize";

        // funcObj.apiPostUrl(endPoint);
        // funcObj.preAuthApiCall(postBodyData, endPoint).then(data => {
        //     console.log('data response', data)
//
        //     if (data.code == 200) {
//
        //         Swal.fire({
        //             title: '',
        //             showCloseButton: true,
        //             text: data.message,
        //             icon: 'success',
        //             showConfirmButton: false,
        //         })
//
        //     } else if (data.code == 201) {
        //         Swal.fire({
        //             title: '',
        //             showCloseButton: true,
        //             text: data.message,
        //             icon: 'error',
        //             showConfirmButton: false,
        //         })
        //     }
        // });
    };

    render() {
        return (
            <div>
                <button className='nav-link to_login bordered-link px-4 btn-signup d-inline-block w-100'
                        onClick={this.handleClick}>Login/Register
                </button>
            </div>
        );
    }
}

export default SsologinButton;