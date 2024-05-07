import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';
import Checkout from './checkout';
import PesaFlowCheckout from "./PesaFlowCheckout";
import DisplayCartItems from './displayCartItems';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

export default class ShoppingCart extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            contents: {},
            content_id: [],
            total_amount: 0,
            showCheckout: false,
        };
        this.setUpdate = this.setUpdate.bind(this);
        this.clearCartItems = this.clearCartItems.bind(this);
        this.toggleCheckout = this.toggleCheckout.bind(this);
        this.handleCartEmpty = this.handleCartEmpty.bind(this);
        this.handleItemRemoved = this.handleItemRemoved.bind(this);
    }

    componentDidMount(){
        this.getContents();
    }

    getContents() {
        let cart_items = funcObj.get_cart_items();
        if(cart_items && Object.keys(cart_items).length>0){
            let postBodyData = {
                current_page: this.state.current_page,
                per_page_limit: this.state.per_page_limit,
                contents_ids:cart_items
            };
            let endPoint = 'get-contents';
            if(AUTH_USER == null){
                endPoint = 'get-contents-public';
            }
            funcObj.commonFetchApiCall(postBodyData, endPoint).then(response => {


                return new Promise((resolve, reject) => {
                    if (response.data && Object.keys(response.data).length > 0) {
                        resolve(response);
                    }

                }).then(response => {

                    if (response.code == 200) {
                        console.log('get-contents response',response.data.data)
                        let total_amount= 0;
                        for(let i=0; i<(response.data.data).length; i++){
                            let each_item_price = parseInt(response.data.data[i].content_price);
                           if(response.data.data[i].discounted_price != 0 && response.data.data[i].discounted_price != null && response.data.data[i].discounted_price != ""){
                                if(response.data.data[i].discounted_price < response.data.data[i].content_price){
                                    each_item_price = parseInt(response.data.data[i].discounted_price);
                                }
                            }
                            total_amount = total_amount + each_item_price;
                            this.state.content_id.push(response.data.data[i].content_id);
                        }
                        this.setState({
                            contents: response.data.data,
                            total_amount:total_amount,
                            total_records: response.data.total,
                        });

                    } else if (response.code == 201) {
                        Swal.fire({
                            title: '',
                            showCloseButton: true,
                            text: response.message,
                            icon: 'error',
                            showConfirmButton: false,
                        })
                    }

                })

            });
        }else{
            this.setState({contents:{}})
        }
    }
    // setUpdate(total_amount=0,content_id=[]){
    //     console.log('setUpdate')
    //     this.getContents();
    //     this.setState({
    //         test:1,
    //         content_id:content_id,
    //         total_amount:total_amount
    //     });
    //
    // }
    setUpdate(total_amount = 0, content_id = []) {
        console.log('setUpdate');
        const prevContentIds = this.state.content_id;
        this.getContents();
        this.setState({
            test: 1,
            content_id: content_id,
            total_amount: total_amount
        }, () => {
            // Check if the content IDs have changed
            if (JSON.stringify(prevContentIds) !== JSON.stringify(content_id)) {
                const isCartEmpty = content_id.length === 0;
                this.setState({ isCartEmpty: isCartEmpty });
            }
        });
    }


    clearCartItems(){
        //console.log('clearCartItems')
        this.getContents();
    }
    handleCartEmpty(isEmpty) {
        // Update the state to reflect whether the cart is empty
        this.setState({ isCartEmpty: isEmpty });
    }
    handleItemRemoved() {
        this.setState({
            itemRemoved: true, // Set itemRemoved state to true
            showCheckout: false // Set showCheckout state to false
        });
        //console.log("item removed from cart!")// Set itemRemoved state to true
    }
    toggleCheckout() {
        this.setState((prevState) => ({
            showCheckout: !prevState.showCheckout,
        }));
    }

    render() {
        if (AUTH_USER == null) {
            //window.location = funcObj.getSitePath('login');
            window.location = funcObj.api_request_url() + "sso/oauth/authorize";
            return null;
        }
        return (
            <React.Fragment>
                {this.state.total_amount != 0 ? (
                    <div className="search_container">
                        <div className="banner text-center">
                            <div className="container">
                                <span className="page_title"> Shopping Cart</span>
                            </div>
                        </div>
                        <div className="container">
                            <div className="search_wrap px-3 px-md-4 shopping_cart">
                                <div className="row pb-5">
                                    <div className="col-xl-6">
                                        <DisplayCartItems
                                            setUpdate={this.setUpdate}
                                            content_id={this.state.content_id}
                                            contents={this.state.contents}
                                            amount={this.state.amount}
                                            toggleCheckout={this.toggleCheckout}
                                            onCartEmpty={this.handleCartEmpty}
                                            onItemRemoved={this.handleItemRemoved}
                                        />
                                    </div>
                                    <div className="col-xl-6">
                                        {this.state.showCheckout && !this.props.isCartEmpty && (
                                            <PesaFlowCheckout
                                                clearCartItems={this.clearCartItems}
                                                checkout_data={this.state.content_id}
                                                checkout_for="cart"
                                                total_amount={this.state.total_amount}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <span>This content is price 0 Please choose another content</span>
                )}
            </React.Fragment>
        );
    }




}
