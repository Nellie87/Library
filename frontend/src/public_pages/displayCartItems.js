import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

export default class DisplayCartItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contents: props.contents,
            amount: props.amount,
            content_id: props.content_id
        };

        this.removeCartItem = this.removeCartItem.bind(this);
        this.handleToggleCheckout = this.handleToggleCheckout.bind(this);
        //this.props.onCartEmpty = this.props.onCartEmpty.bind(this);
    }

    removeCartItem(e, content) {
        e.preventDefault();
        let result = funcObj.remove_cart_item(content.content_id);
        console.log('removeCartItem', result);
        if (result) {
            document.getElementById('cart_count').textContent = funcObj.get_cart_items_length();
            let total_amount = document.getElementById('total_amount').value;
            this.props.setUpdate(total_amount, this.props.content_id);
            this.setState({ test: 1 });

            if (funcObj.get_cart_items_length() === 0) {
                // Update the state to indicate that the cart is empty
                this.props.onCartEmpty(true);
            }
            this.props.onItemRemoved();
        }
    }

    handleToggleCheckout() {
        this.props.toggleCheckout();
    }

    render() {
        let total_amount = 0;
        let contents = this.props.contents;

        return (
            <div>
                <div className="form-group mt-3 mt-md-4">
                    <h3 className="dashboard-title title-margin m-0">My Cart</h3>
                    <hr className="my-3 my-lg-4"></hr>
                    <React.Fragment>
                        {contents && Object.keys(contents).length > 0 ? (
                            <div className="cart-wrap mt-3">
                                {contents.map((content, index) => {
                                    let each_item_price = parseInt(content.content_price);
                                    total_amount = total_amount + each_item_price;
                                    let content_picture = '';
                                    if (content.main_content_image == null || content.main_content_image == "") {
                                        content_picture = funcObj.getBookTypeListSmallIcon(content.class_name);
                                    } else {
                                        content_picture = content.main_content_image;
                                    }
                                    return (
                                        <div className="cart-list" key={index}>
                                            <div className="d-md-flex align-items-center justify-content-between">
                                                <Link to={`/private-bookdetail?book_id=${content.encrypted_content_id}&type=${content.class_id}&backlink=reader-dashboard`} className="d-flex align-items-start mb-3 mb-lg-0 product-info">
                                                    <div className="d-flex align-items-center">
                                                        <img src={content_picture} alt="..." className="img-responsive" width="100" />
                                                        <div className="ml-1 ml-lg-2" style={{ minwidth: "300px" }}>
                                                            <p className="mb-0">{content.subtitle}</p>
                                                            <h4 className="nomargin font-planet cart_content_title">{content.title}</h4>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="price">
                                                    <span className="new-price">{content.content_price}&nbsp;{funcObj.getCurrency()}&nbsp;<sup className='actual-price'>{content.content_actual_price}&nbsp;{funcObj.getCurrencyText()}</sup></span>
                                                    <span onClick={(e) => this.removeCartItem(e, content)} className="delete_order">X</span>
                                                </div>
                                            </div>
                                            <hr className="my-3 my-lg-5"></hr>
                                        </div>
                                    );
                                })}
                                <hr className="my-3 my-lg-5"></hr>
                                <div className="tfoot pt-0 d-block d-sm-flex align-items-center text-center justify-content-between">
                                    <div>
                                        <Link to="/library-catalog" className="btn darkBtn">Get more content and pay later</Link>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mt-3 mt-sm-0">
                                        <div className="text-center mr-3">
                                            <strong className="price">Subtotal : <span className="new-price">{total_amount}{funcObj.getCurrency()}</span></strong>
                                        </div>
                                        <input type="hidden" id="total_amount" defaultValue={total_amount} />
                                    </div>
                                    <div className="text-center">
                                        {total_amount > 0 ? (
                                            <button className="btn dark-btn_orange " onClick={this.handleToggleCheckout}>Checkout</button>
                                        ) : (
                                            <span>Your cart is empty!</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : <span>Your cart is empty!</span>}
                    </React.Fragment>
                </div>
            </div>
        );
    }
}
