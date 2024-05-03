import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';

import { withRouter } from 'react-router-dom';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import Swal from 'sweetalert2';
import SuggesstionSlider from './suggestionSlider';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();

class Bookdetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            book_detail: [],
            similar_books: {},
            show: false,
            addtocartdisabled: true,
            showmoredetail:false
        };
        this.handleModal = this.handleModal.bind(this);
    }

    handleLogin() {
      Swal.fire({
              title: '',
              html: "Please login to borrow content.",
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'Ok',
              
            }).then((result) => {
              if (result.isConfirmed) {
                let book_id = funcObj.get_query_string('book_id');
                let redirect_exists = '/private-bookdetail?book_id='+book_id;
                funcObj.setLocalStorage('redirect_exists',redirect_exists)
                 //return funcObj.redirectPage('login');
                 return window.location = funcObj.api_request_url() + "sso/oauth/authorize";
             } 
           })
      
       
        
        
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
            alert('Content is successfully added. Please check your cart')
            document.getElementById('cart_count').textContent = funcObj.get_cart_items_length();
            this.setState({ test: 1, addtocartdisabled: false });
        }
    }
    getBookDetail() {
        let book_id = funcObj.get_query_string('book_id');
        let postBodyData = {
            'content_id': book_id
        };
        let endPoint = 'content-detail-public';

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            console.log(endPoint + ' response', data.data)
            if (data.code == 200) {
                this.setState({
                    book_detail: data.data,
                })

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
    componentDidMount() {
        this.getBookDetail();
    }
    handleModal(preview = false) {
        // alert(preview);
        this.setState({
            preview: preview
        });
        this.setState({ show: !this.state.show, is_reading: true });


    }
    MoreDetailConfirm() {

        this.setState({ showmoredetail: !this.state.showmoredetail });

    }
    render() {
        let book_id = funcObj.get_query_string('book_id');
        let backlink = funcObj.get_query_string('backlink');

        const similar_books = this.state.similar_books;
        const content = this.state.book_detail;
        console.log('content data', content);
        let tab_type = "Any";
        if (funcObj.get_query_string('type')) {
            // this.setState.book_detail.class_title_s;
            // this.state.book_detail.class_id;
            tab_type = this.state.book_detail.class_title_s;

        }
        // return ('hello');
        return (
            <React.Fragment>
                <div>

                    {
                        this.state.show ?
                            <div className="container">
                                <div className="row">

                                    <button className='btn go_back_btn  lightBtn py-1 px-3 mr-1 test' onClick={() => this.handleModal()}>
                                        Go Back
                                    </button>
                                    <div className="col-md-12 each_player" >
                                        {funcObj.playerAll(content, this.state.preview)}
                                    </div>
                                </div>
                            </div>
                            : null}
                </div>
                {
                    content && Object.keys(content).length > 0 && this.state.show == false ?
                        <div className="search_container">
                        {
                            funcObj.public_page_custom_styles(content)
                        }
                            <div className="banner text-center">
                                <div className="container">
                                    <span className="page_title">{content.title}</span>
                                </div>
                            </div>
                            <div className="container">
                                <div className="search_wrap clearfix ">
                                    <div className="p-3 p-lg-4">
                                        {/* <div className="clearfix top-head mb-4">
                                            <h6 className="mb-0 mt-3 float-md-left">
                                                <div className="breadcrumbs py-1">
                                                    {
                                                        backlink != "" && backlink != null ?
                                                            <div>
                                                                <Link className='btn go_back_btn  lightBtn roundedBtn py-1 px-3 mr-1 mr-3 w120' to={`/` + backlink}>
                                                                    Go Back
                                                                </Link>
                                                            </div>
                                                            :
                                                            <React.Fragment>
                                                                <span>
                                                                    <Link to="/home">
                                                                        Home
                                                                    </Link>
                                                                </span>
                                                                <span>
                                                                    <Link to={`/home#myTabContent`}>
                                                                        {tab_type}
                                                                    </Link>
                                                                </span>
                                                                <span>
                                                                    {content.title}
                                                                </span>
                                                            </React.Fragment>
                                                    }
                                                </div>
                                            </h6>

                                        </div> */}

                                        {

                                            content && Object.keys(content).length > 0 ?

                                                <div className="bookdetails_wrap">
                                                    <div className="row">
                                                        <div className="col-xl-4 col-lg-5">
                                                            <div className="cover-img">
                                                            <div className='top_tag topsample'>{funcObj.getClassFaIcon(content.class_name)} {content.class_title_s}</div>
                                                                {
                                                                    content.main_content_image == null || content.main_content_image == '' ?
                                                                        <img src={funcObj.assets_path("/images/dummy-image.jpg")} alt={content.title} />
                                                                        :
                                                                        <img  src={content.main_content_image} alt={content.title} />
                                                                }




                                                                <br />
                                                                {funcObj.showContentTypeIcon(content)}
                                                            </div>

                                                        </div>
                                                        <div className="col-xl-8 col-lg-7">
                                                            <div className="book-info">
                                                                <h3 className="mb-0">
                                                                    {content.title}
                                                                </h3>
                                                                <div className="aother"> {content.subtitle ?
                                                                    content.subtitle
                                                                    : 'N/A'}</div>


                                                                {funcObj.generateStarRating(content.rating)}
                                                                <span className="black-light">{content.total_ratings} Review | {content.views} Views | {content.total_likes} Like</span>
                                                                {
                                                                    content.content_type == 'paid' && content.content_price != 0 ?
                                                                        <div className="price">
                                                                            <span className="new-price">{content.content_price}&nbsp;{funcObj.getCurrency()}</span>
                                                                        </div>
                                                                        : null
                                                                }



                                                                {
                                                                    content.content_type != 'membership' ?


                                                                        <div className="buttom-group my-2 my-lg-4">
                                                                            {
                                                                                content.content_type == 'paid' && this.state.addtocartdisabled ?
                                                                                    <div>
                                                                                        <button type="btn" id={`book_` + content.content_id} onClick={(e) => this.addToCart(e, content, 1)} className={`btn addCart py-1 px-3 mr-1 `}  ><img src={funcObj.assets_path("/images/icons/cart.svg")} width="20" alt="cart" /> &nbsp;Add to Cart</button>


                                                                                    </div>
                                                                                    : null
                                                                            }


                                                                            {
                                                                                content.content_type == 'free' && content.no_of_copies_available.available > 0 ?
                                                                                    <div>
                                                                                        <button type="btn" id={`borrow_book_` + content.content_id} onClick={this.handleLogin} className={`btn addCart borrowBook py-1 px-3 mr-1 `} > &nbsp;Borrow</button>

                                                                                        {
                                                                                            content.no_of_copies_available.available == 0 ?
                                                                                                <div> <br /><span className="text-warning">Content not available!</span> </div>
                                                                                                :
                                                                                                <div>
                                                                                                    <br />

                                                                                                </div>
                                                                                        }



                                                                                    </div>
                                                                                    :

                                                                                    <div>
                                                                                        {content.no_of_copies_available.available == 0 ?
                                                                                            <span className="text-warning">Content not available!</span>
                                                                                            : null
                                                                                        }

                                                                                    </div>
                                                                            }
                                                                            <br />
                                                                            {
                                                                                content.content_type == 'free' && ( content.no_of_copies == -1 || content.no_of_copies_available.available > 0)  ?
                                                                                    <div>
                                                                                        {
                                                                                            content.no_of_copies == -1 ?
                                                                                                <button data-toggle="collapse" role="button" aria-expanded="false" onClick={() => this.handleModal()} aria-controls="fplayer" type="btn" className="btn addCart py-1 px-3 mr-1" ><img src={funcObj.getClassTypeIcons(content.class_name)} width="20" alt="cart" /> &nbsp;View {content.class_title_s}</button>


                                                                                                :

                                                                                                <span className="text-success">Available copies: <b>{content.no_of_copies_available.available}</b></span>

                                                                                        }
                                                                                    </div>

                                                                                    : null
                                                                            }


                                                                        </div>

                                                                        :


                                                                        <div>
                                                                            <button data-toggle="collapse" role="button" aria-expanded="false" onClick={() => this.handleLogin()} aria-controls="fplayer" type="btn" className="btn addCart py-1 px-3 mr-1" ><img src={funcObj.getClassTypeIcons(content.class_name)} width="20" alt="cart" /> &nbsp;View {content.class_title_s}</button>
                                                                        </div>

                                                                }


                                                                {funcObj.showContentDetailPageData(content)}
                                                 
                                               <div className="row">
                                                <div className='col-md-12'>
                                                        <div data-toggle="collapse" role="button" aria-expanded="false" onClick={() => this.MoreDetailConfirm()} aria-controls="fplayer" type="btn" className="btn addCart py-1 px-3 mr-1 curptr" >More details...</div>
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



                                                : null
                                        }


                                    </div>

                                    <SuggesstionSlider content={content} backlink={backlink} />
                                </div>
                            </div>

                        </div>

                        : null

                }
            </React.Fragment>
        );
    }


}

export default withRouter(Bookdetail);
