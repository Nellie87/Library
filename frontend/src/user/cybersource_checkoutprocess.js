import React from 'react';
import Functions from '../helpers/functions';
import MembershipSubscription from './membership_subscription';
import MyBooks from './myBooks';
const funcObj = new Functions;
class CybersourceCheckoutProcess extends React.Component {

    constructor(props) {
        super(props);
    
            this.state = {
                payment_for:""
            }
        }
    componentDidMount(){
        let payment_for = funcObj.getLocalStorage('payment_for');
        funcObj.removeLocalStorage('payment_for');
        
        if(payment_for == 'cart'){
            funcObj.setLocalStorage('cart_items',JSON.stringify({}));
        }
        this.setState({payment_for:payment_for});
        
    }
   
    render() {
        
       return (
            <React.Fragment>
            {
                this.state.payment_for == 'cart' ?
                <div>
                <p>Note: The purchased content would be reflect, once the payment would be confirmed.</p>
                <MyBooks subscribed_content="1" />
                </div>
                    
                    :null
            }

            {
                this.state.payment_for == 'membership' ?
                <div>
                <p>Thank you for making payment, Your subscription plan will be activated soon.</p>
                <p>Note: Activ plan detail would be display only when the payment would be confirmed.
                Also, Please signout from the system and sign in again to reflect the plan detail.</p>
                <MembershipSubscription />
                </div>
                :null
            }
                
            </React.Fragment>
       );
    }
}
export default CybersourceCheckoutProcess;