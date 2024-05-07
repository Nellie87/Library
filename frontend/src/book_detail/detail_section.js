import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Functions from '../helpers/functions';
import { Button, Modal, ProgressBar } from 'react-bootstrap';

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();


export default class DetailSection extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            message: "",
            rating: 5,
            show: false,
            show_confirm: false,
            showmoredetail: false,
            class: (this.props.book_detail.like == 1) ? "btn dark-btn  m-1" : 'btn light-btn  m-1',
            bookmarked:(this.props.book_detail.is_bookmarked == 1)?true:false,
            liked: 0,
            disabled: false,
            borrowbtndisable: (this.props.book_detail.no_of_copies_available.read_content == true) ? true : false,
            addtocartdisabled: true,
            publisher_id: this.props.book_detail.publisher_id,

            is_follow: (this.props.book_detail.is_follow == 1) ? this.props.book_detail.is_follow : 0,
        };

        let drmsetting = '';
        drmsetting = this.props.book_detail;
        let availablecopy = drmsetting.no_of_copies_available.available;
        let noofcopies = drmsetting.no_of_copies;
        let isread = drmsetting.no_of_copies_available.read_content;
        let contenttype = drmsetting.content_type;
        if (availablecopy == 0 && isread != true && contenttype == 'paid') {
            // funcObj.custom_alert_message('sold out');
            this.setState({
                disabled: true
            });
        }
        else if (noofcopies >= availablecopy && availablecopy != 0) {


        }
        else if (availablecopy == 0 && isread != true && contenttype == 'free') {
            console.log('copies not available');
            // this.state.borrowbtndisable
            this.setState({
                borrowbtndisable: true
            })
        }

        // this.setState({'active': true,});
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.inputStarRating = this.inputStarRating.bind(this);
    }

    componentDidMount() {
        const content = this.props.book_detail;
        let exist_qty = funcObj.get_cart_item(content.content_id);
        if (exist_qty >= 1) {
            this.setState({ addtocartdisabled: false });
        }
        document.removeEventListener('contextmenu', this._handleContextMenu);
        console.log('componentDidMount AUTH_USER',AUTH_USER)

    }

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this._handleContextMenu);
    }
    _handleContextMenu = (event) => {
        event.preventDefault();
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;
        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;

        if (right) {
            funcObj.custom_alert_message();
        }

        if (left) {

        }

        if (top) {

        }

        if (bottom) {

        }
    }
    subscribeNow() {
        window.location = funcObj.getSitePath('membership-subscription');
    }

    handleConfirm() {

             this.setState({ show_confirm: !this.state.show_confirm });
       

    }
    MoreDetailConfirm() {
        if ((AUTH_USER.account_type == 'reader' || AUTH_USER.account_type == 'junior_reader') && AUTH_USER.user.is_membership_user == 0 && this.props.book_detail.content_type == 'membership') {
            this.setState({ show_confirm: !this.state.show_confirm });
        } else {
            this.MoredetailModal();
        }

    }
    MoredetailModal() {

        this.setState({ showmoredetail: !this.state.showmoredetail });

    }
    followpublisher() {

        let user = funcObj.getLocalStorage('user');
        let postBodyData = {
            'publisher_id': this.state.publisher_id,
            "reader_id": user.user.id
        };
        let endPoint = 'follow';
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data.code == '200') {
                this.setState({
                    is_follow: data.data.is_follow
                })
            }

        });
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {

            //    if (disabled) { // do nothing if already disabled
            //       return;
            //    }

            //    foodData();
            //    setDisabled(true);
        }
    }

    handleChange(event) {

        this.setState({
            [event.target.name]: event.target.value
        })

    }
    handleSubmit(event) {
        event.preventDefault();

        if (this.state.message == '') {
            funcObj.custom_alert_message('Please write comment!');
            return false;
        }

        let postBodyData = {
            message: this.state.message,
            rating: this.state.rating,
            content_id: this.props.book_detail.content_id
        };
        let endPoint = 'add-rating-review';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                console.log(data)
                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })
            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
            this.props.getBookDetail();
        });
    }
    addToCart(e, content, qty) {
        let exist_qty = funcObj.get_cart_item(content.content_id);
        qty = qty + exist_qty;
        let res = "";
        console.log(exist_qty)
        if (exist_qty < 1) {
            res = funcObj.add_cart_item(content.content_id, qty);
        }

        if (res) {
            funcObj.custom_alert_message('Content is successfully added. Please check your cart', 'success')
            document.getElementById('cart_count').textContent = funcObj.get_cart_items_length();
            this.setState({ test: 1, addtocartdisabled: false });
            window.location = funcObj.getSitePath('my-cart');
        }
    }
    borrowContent(event) {
        event.preventDefault();
        let book_id = funcObj.get_query_string('book_id');
        let postBodyData = {
            'content_id': book_id,
        };
        let endPoint = 'borrow-content';
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log(endPoint + ' response', data)
            if (data.code == 200) {

                Swal.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    showConfirmButton: false,
                })
                this.props.getBookDetail();
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



    like(e) {

        let user = funcObj.getLocalStorage('user');
        let endPoint = 'likes';

        let postBodyData = {
            "content_id": this.props.book_detail.content_id,
            "user_id": user.user.id,
            "likes": (e.target.dataset.likeid == 1) ? 0 : 1
        };
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // funcObj.custom_alert_message('data response',data)

            if (data.code == 200) {
                console.log(data.data.likes)
                if (data.data.likes == 1) {
                    this.setState({ class: 'btn dark-btn  m-1', liked: data.data.likes })
                }
                else {
                    this.setState({ class: 'btn light-btn  m-1', liked: data.data.likes })
                }
                // Swal.fire({
                //     title: 'Success',
                //     text: data.message,
                //     icon: 'success',
                //     showConfirmButton: false,
                // })

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
            // window.location = window.location;
        });
    }
    bookmark(e) {

        let user = funcObj.getLocalStorage('user');
        let endPoint = 'add-bookmark';

        let postBodyData = {
            "content_id": this.props.book_detail.content_id,
            "user_id": user.user.id,
            "is_bookmarked": (e.target.dataset.bookmarkid == 1) ? 0 : 1
        };
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            // alert('data response',data)

            if (data.code == 200) {
                funcObj.custom_alert_message(data.message,'success');
                console.log(data.data.bookmark)
                if (data.data.bookmark == 1) {
                    this.setState({bookmarked:true,  bookmark: data.data.bookmark })
                }
                else {
                    this.setState({bookmarked:false, bookmark: data.data.bookmark })
                }
                // Swal.fire({
                //     title: 'Success',
                //     text: data.message,
                //     icon: 'success',
                //     showConfirmButton: false,
                // })

            } else if (data.code == 201) {
                Swal.fire({
                    title: '',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: false,
                })
            }
            // window.location = window.location;
        });
    }
    inputStarRating(event, stars) {
        event.preventDefault();
        console.log('stars', stars);
        document.getElementById('rating').value = stars;
        for (let i = 1; i <= stars; i++) {
            document.getElementById('star_' + i).classList.add('fa-star');
            document.getElementById('star_' + i).classList.remove('fa-star-o');
        }
        for (let i = 5; i > stars; i--) {
            document.getElementById('star_' + i).classList.add('fa-star-o');
            document.getElementById('star_' + i).classList.remove('fa-star');

        }
        this.setState({ rating: stars });
    }
    handleDoubleClick() {
        // funcObj.custom_alert_message("double click");
        return false;
    }
    render() {
        
        const content = this.props.book_detail;

        let thumbnail_image = "";
        if (content && Object.keys(content).length > 0) {
            thumbnail_image = content.main_content_image;
            // exist_qty = funcObj.get_cart_item_quantity(content.content_id);
        }

        let content_picture = '';
        if (content.main_content_image == null || content.main_content_image == '') {
            content_picture = funcObj.assets_path("/images/dummy-image.jpg");
        } else {
            content_picture = content.main_content_image;
        }

        let hide_for_admin = '';
        if (AUTH_USER != null && AUTH_USER.account_type == 'admin') {
            hide_for_admin = 'd-none';
        }
       

        return (
            <React.Fragment>


                {
                    content && Object.keys(content).length > 0 ?
                        <div>
                            <div className="bookdetails_wrap" onDoubleClick={this.handleDoubleClick} onKeyDown={this.handleDoubleClick} onClick={this.handleDoubleClick}>
                                <div className="row">
                                    <div className="col-xl-4 col-lg-5">

                                        <div className="cover-img">
                                            {/*{funcObj.displayClassIcon(content.class_name)}*/}
                                            <div className='top_tag topsample'>{funcObj.getClassFaIcon(content.class_name)} {content.class_title_s}</div>
                                            <img src={content_picture} alt={content.title} />
                                            <br />
                                            {funcObj.showContentTypeIcon(content)}
                                        </div>

                                    </div>
                                    <div className="col-xl-8 col-lg-7">
                                        <div className="book-info">
                                            <h3 className="mb-0">
                                                {content.title}
                                            </h3>
                                            <div className="aother"> {content.subtitle && content.subtitle != '' && content.subtitle != null && content.subtitle != 'null' ?
                                                content.subtitle
                                                : null}</div>


                                            {funcObj.generateStarRating(content.rating)}
                                            <span className="black-light">{content.total_ratings} Review | {content.views} Views | {content.total_likes} Like</span>
                                            {
                                                content.content_type == 'paid' && content.content_price != 0 ?
                                                    <div className="price">
                                                        <span className="new-price">{content.content_price}&nbsp;{funcObj.getCurrency()} &nbsp;<sup className='actual-price'>{content.content_actual_price}&nbsp;{funcObj.getCurrency()}</sup></span>
                                                    </div>
                                                    : null
                                            }


                                            <div className=" my-2 my-lg-4">
                                                {/* {
                                                    content.preview_file ?
                                                            <Link className='btn addCart py-1 px-3 mr-3 rightpush' to={`/view-play-content?is_preview=1&book_id=`+content.encrypted_content_id}><i class="fas fa-book color-ico"></i> &nbsp;{funcObj.previewTitle(content)}</Link>
                                                        : null
                                                        } */}

                                                        
                                                {
                                                    content.upload_content && (  content.content_type == 'membership' || funcObj.is_contents_view_permitted(content) == 'can_access' )?
                                                    <React.Fragment>
                                                        {
                                                            AUTH_USER.user.is_membership_user == 0 && content.content_type == 'membership'  && funcObj.is_contents_view_permitted(content) != 'can_access' ?
                                                            <button data-toggle="collapse" role="button" aria-expanded="false" onClick={() => this.handleConfirm()} aria-controls="fplayer" type="btn" className="btn addCart py-1 px-3 m-1" >
                                                            {/*<img src={funcObj.getClassTypeIcons(content.class_name)} width="20" alt="cart" />*/}<i class="fas fa-book color-ico"></i> &nbsp;{funcObj.viewTitle(content)}</button>

                                                            :
                                                            <Link className='btn addCart py-1 px-3 m-1' to={`/view-play-content?is_preview=0&book_id=`+content.encrypted_content_id}><i class="fas fa-book color-ico"></i> &nbsp;{funcObj.viewTitle(content)}</Link>
                                                        }
                                                    </React.Fragment>
                                                        
                                                   

                                                        :null
                                                }

                                                {
                                                    content.content_type != 'membership' ?
                                                        <React.Fragment>
                                                        
                                                            {
                                                                AUTH_USER != null && AUTH_USER.user.id != content.publisher_id &&  content.content_type == 'paid' && content.no_of_copies_available.read_content == false && this.state.addtocartdisabled &&  AUTH_USER.account_type != 'senior_librarian' && AUTH_USER.account_type != 'librarian' && AUTH_USER.account_type != 'admin' 
                                                                && (content.no_of_copies > 0 || content.no_of_copies == -1)
                                                                 ?
                                                                    <button type="btn" id={`book_` + content.content_id} onClick={(e) => this.addToCart(e, content, 1)} className={`btn addCart py-1 px-3 m-1 ` + hide_for_admin}  ><img src={funcObj.assets_path("/images/icons/cart.svg")} width="20" alt="cart" /> &nbsp; Add to Cart</button>
                                                                    : null
                                                            }

                                                            {
                                                                AUTH_USER != null && AUTH_USER.user.id != content.publisher_id && content.content_type == 'free' && content.no_of_copies_available.available > 0 && content.no_of_copies_available.read_content == false ?
                                                                    <button type="btn" id={`borrow_book_` + content.content_id} onClick={(e) => this.borrowContent(e)} className={`btn addCart borrowBook py-1 px-3 m-1 ` + hide_for_admin} > &nbsp;Borrow</button>
                                                                    : null
                                                            }

                                                            <br />
                                                            {
                                                                 content.no_of_copies > 0 ?
                                                                    <span className="text-success">Available number of copies: <b>{content.no_of_copies_available.available}</b></span>
                                                                    :
                                                                    <React.Fragment>
                                                                    {
                                                                 content.no_of_copies == -1 ?
                                                                 <span className="text-success">Unlimited number of copies are available</span>
                                                                    :
                                                                    <span className="text-warning">Not available</span>
                                                                    }
                                                                    </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                        : null
                                                }
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        {funcObj.showProgressbar(content)}
                                                    </div>
                                                </div>

                                                {
                                                    AUTH_USER != null && (AUTH_USER.user.id != content.publisher_id && this.props.is_reading) ?
                                                        <button title='Like this content' type="btn" className={this.state.class} onClick={(e) => this.like(e)} data-likeid={this.state.liked}  ><i className="far fa-thumbs-up"></i></button>

                                                        : null
                                                }

                                                {
                                                    AUTH_USER != null && (AUTH_USER.user.id != content.publisher_id || AUTH_USER.account_type != 'admin' || AUTH_USER.account_type != 'senior_librarian' || AUTH_USER.account_type != 'librarian') ?
                                                        <button title="Add to wishlist" type="btn" className="btn addCart py-1 px-3 m-1" onClick={(e) => this.bookmark(e)} data-bookmarkid={this.state.bookmark}  ><i className="far fa-bookmark"></i>
                                                         {
                                                            this.state.bookmarked ?<span> Remove from Wishlist</span>:<span> Add to Wishlist</span>
                                                         }
                                                        
                                                         </button>

                                                        : null
                                                }

                                                {
                                                    AUTH_USER != null && AUTH_USER.user.id != content.publisher_id && AUTH_USER.account_type != 'admin' && AUTH_USER.account_type != 'senior_librarian' && AUTH_USER.account_type != 'librarian' ?
                                                        <button title='Write comment for this content' type="btn" className="btn light-btn  m-1" data-toggle="collapse" href="#addCommentRating" role="button" aria-expanded="false" aria-controls="addCommentRating"><i className="far fa-comment-dots"></i></button>

                                                        : null
                                                }
                                            </div>





                                            <Modal show={this.state.show_confirm} onHide={() => this.handleConfirm()}>
                                                <Modal.Header closeButton>{content.title}</Modal.Header>
                                                <Modal.Body>
                                                    <div className="modal-content">
                                                        <div className="modal-header heading-popup">
                                                            <h5 className="modal-title" id="exampleModalLabel">To access this content, please subscribe to a membership plan</h5>

                                                        </div>

                                                        <div className="modal-footer">
                                                            <button type="button" onClick={this.subscribeNow} data-dismiss="modal" className="btn delete mr-2">Subscribe now</button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button onClick={() => this.handleConfirm()}>Close</Button>
                                                </Modal.Footer>
                                            </Modal>


                                            {
                                                AUTH_USER != null && AUTH_USER.user.id != content.publisher_id && (AUTH_USER.account_type != 'admin' || AUTH_USER.account_type == 'senior_librarian' || AUTH_USER.account_type == 'librarian') ?
                                                    <React.Fragment>
                                                        <div className="collapse" id="addCommentRating">
                                                            <div className="card card-body p-0 mb-0">
                                                                <form id="commentFrm" onSubmit={this.handleSubmit}>
                                                                    <span>Write comment </span>
                                                                    <div className="book-rating">
                                                                        <input type="hidden" id="rating" name="rating" defaultValue={this.state.rating} onChange={this.handleChange} />
                                                                        <label>
                                                                            <i onClick={(e) => this.inputStarRating(e, 1)} id="star_1" className="stars fa fa-star fa-2x" aria-hidden="true"></i>
                                                                        </label>
                                                                        <label>
                                                                            <i onClick={(e) => this.inputStarRating(e, 2)} id="star_2" className="stars fa fa-star fa-2x" aria-hidden="true"></i>
                                                                        </label>
                                                                        <label>
                                                                            <i onClick={(e) => this.inputStarRating(e, 3)} id="star_3" className="stars fa fa-star fa-2x" aria-hidden="true"></i>
                                                                        </label>
                                                                        <label>
                                                                            <i onClick={(e) => this.inputStarRating(e, 4)} id="star_4" className="stars fa fa-star fa-2x" aria-hidden="true"></i>
                                                                        </label>
                                                                        <label>
                                                                            <i onClick={(e) => this.inputStarRating(e, 5)} id="star_5" className="stars fa fa-star fa-2x" aria-hidden="true"></i>
                                                                        </label>
                                                                    </div>
                                                                    <textarea type="text" name="message" id="message" defaultValue={this.state.message} onChange={this.handleChange} className="form-control"></textarea>
                                                                    <div className="text-right">
                                                                        <button type="submit" className="btn darkBtn py-1 px-5">Submit</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                     
                                                    </React.Fragment>
                                                    : null
                                            }
                                            
                                            {
                                               AUTH_USER != null && content.publisher_detail.user_type == 'publisher'?
                                                <button type="button" className="btn addCart py-1 px-3 m-1" title={
                                                            this.state.is_follow == 0 ? `Follow publisher ` + content.publisher : `Unfollow publisher ` + content.publisher
                                                        } onClick={() => this.followpublisher()}>
                                                            <i className="fa fa-users" aria-hidden="true"></i>  {
                                                                this.state.is_follow == 0 ? 'Follow' : 'Unfollow'
                                                            }
                                                        </button>
                                            :null
                                            }
                                            {funcObj.showContentDetailPageData(content)}
                                            <div className="row">
                                                <div className='col-md-12'>
                                                    <div data-toggle="collapse" role="button" aria-expanded="false" onClick={() => this.MoreDetailConfirm()} aria-controls="fplayer" type="btn" className="btn addCart py-1 px-3 m-1 curptr" >More details...</div>
                                                </div>
                                            </div>
                                            {/**
                                            *   More detail modal popup
                                            */}
                                            <Modal show={this.state.showmoredetail} onHide={() => this.MoreDetailConfirm()}>
                                                <Modal.Header className='heading-popup'>{content.title}</Modal.Header>
                                                <Modal.Body>
                                                    {funcObj.showContentDetailModalData(content)}
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button onClick={() => this.MoreDetailConfirm()}>Close</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </React.Fragment>
        );
    }

}
