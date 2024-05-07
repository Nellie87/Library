import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Slider from "react-slick";
const funcObj = new Functions();
export default class LandingPage extends React.Component {
    render() {
        const CategoryTabs = {
            slidesToShow: 10,
            slidesToScroll: 1,
            autoplay: false,
            infinite: true,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 8,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 6,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: 2,
                    }
                }
            ]
        };
        const bookSettings = {
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        slidesToShow: 1,
                    }
                }
               
            ]
        };
        return (
            <React.Fragment>
                <div className="container">
                    <div className="d-flex justify-content-between py-3">
                        <div className="right_wrap w-100">
                        <div className="logo_wrap">
                            <a className="admin-logo" href="#" target="_blank">
                                <img src={funcObj.assets_path("/images/logo.png")} alt="knls logo" />
                            </a>
                        </div>
                            <div className="right-eliment">
                                <ul className="list ">
                                    <li className="login-profile-area ">
                                        <a className="dropdown-toggle-1" >
                                            <div className="user-img curptr">
                                                <img src={funcObj.assets_path("/images/user.png")} alt="" />

                                            </div>
                                        </a>
                                        <div className="dropdown-menu">
                                            <div className="dropdownmenu-wrapper">
                                                <ul>
                                                    <h5>Welcome</h5>
                                                    <li>
                                                        <Link className="curptr"  to="/reader-profile"><i className="fas fa-cog"></i>My Profile</Link>
                                                    </li>
                                                    {/*<li>*/}
                                                    {/*<Link className="curptr"  to="/change-password"><i className="fas fa-cog"></i>Change Password</Link>*/}
                                                    {/*</li>*/}
                                                    <li className="curptr" >
                                                        <a className="curptr" onClick={(e)=>this.logout()}><i className="fas fa-power-off"></i>Logout</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="search_container">
                    <div className="container">
                        <div className="search_wrap pb-1 rounded-0 mt-0 clearfix px-3 pt-3">
                            <div className="main-section_title mt-4 text-center">
                               Our Top Categories
                            </div>
                            <p className="text-center mt-4 sub-text">Here are some Top Categories of the Books Available</p>
                            <div className="px-3 px-lg-5 category-tabs">
                                <ul class="nav  d-flex flex-wrap justify-content-lg-around  justify-content-normal  nav-tabs border-0" id="myTab" role="tablist">
                                    {/* <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0 " id="computer-tab" data-toggle="tab" href="#computer" role="tab" aria-controls="Computer" aria-selected="true"> Computer & Internet</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="fiction-tab" data-toggle="tab" href="#fiction" role="tab" aria-controls="fiction" aria-selected="false">Fiction</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="drama-tab" data-toggle="tab" href="#drama" role="tab" aria-controls="drama" aria-selected="false">Drama</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="litreature-tab" data-toggle="tab" href="#litreature" role="tab" aria-controls="litreature" aria-selected="false">Litreature</a>
                                    </li> */}
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0 active" id="art-tab" data-toggle="tab" href="#art" role="tab" aria-controls="art" aria-selected="false">Art & Photography</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="biograpies-tab" data-toggle="tab" href="#biograpies" role="tab" aria-controls="biograpies" aria-selected="false">Biograpies & Memorisa</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="business-tab" data-toggle="tab" href="#business" role="tab" aria-controls="business" aria-selected="false">Business</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="politics-tab" data-toggle="tab" href="#politics" role="tab" aria-controls="politics" aria-selected="false">Politics</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="travel-tab" data-toggle="tab" href="#travel" role="tab" aria-controls="travel" aria-selected="false">Travel</a>
                                    </li>
                                    {/* <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="book-tab" data-toggle="tab" href="#book" role="tab" aria-controls="book" aria-selected="false">Book</a>
                                    </li> */}
                                </ul>
                            </div>

                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="art" role="tabpanel" aria-labelledby="art-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Group18.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Group15.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Group16.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Group17.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/4.jpg")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/1.jpg")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/2.jpg")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Group17.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Group15.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Group16.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="biograpies" role="tabpanel" aria-labelledby="biograpies-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="business" role="tabpanel" aria-labelledby="business-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="politics" role="tabpanel" aria-labelledby="politics-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Hunger Eats
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Daughters wh
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            The House of Hunger
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                                    </div>
                                                    <div className="book-details">
                                                        <p className="mb-0 mt-3">
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-name mt-0">
                                                            Thirteen Mont
                                                        </div>
                                                        <div className="price">
                                                            <span className="new-price">$149</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="text-center">
                                    <button className="btn dark-btn_orange px-5"> View All &nbsp; <i class="fas fa-arrow-right"></i></button>
                                </div>
                            </div>


                            <div className="authors-wrap months_authors py-3 py-lg-5 my-3 my-lg-5">
                                <div className="row ">
                                    <div className="col-lg-3">
                                        <div className="top-authors px-3">
                                            <div className="main-section_title text-white">
                                                Top Authors
                                            </div>
                                            <p className="mt-4 sub-text text-white">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-9">
                                        <Slider className="top-authors_wrap" {...bookSettings}>
                                        <div className="author-card">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author1.png")} alt="author" />
                                            </div>
                                            <div className="author-name px-3">
                                                Ngũgĩ wa Thiong’o
                                            </div>
                                            <div className="writer px-3">
                                                Kenyan novelist
                                            </div>
                                        </div>
                                        <div className="author-card">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author2.png")} alt="author" />
                                            </div>
                                            <div className="author-name px-3">
                                                Kinyanjui Kombani
                                            </div>
                                            <div className="writer px-3">
                                                Kenyan novelist
                                            </div>
                                        </div>
                                        <div className="author-card">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author3.png")} alt="author" />
                                            </div>
                                            <div className="author-name px-3">
                                                Ngũgĩ wa Thiong’o
                                            </div>
                                            <div className="writer px-3">
                                                Kenyan novelist
                                            </div>
                                        </div>
                                        <div className="author-card">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author1.png")} alt="author" />
                                            </div>
                                            <div className="author-name px-3">
                                                Ngũgĩ wa Thiong’o
                                            </div>
                                            <div className="writer px-3">
                                                Kenyan novelist
                                            </div>
                                        </div>
                                        <div className="author-card">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author2.png")} alt="author" />
                                            </div>
                                            <div className="author-name px-3">
                                                Kinyanjui Kombani
                                            </div>
                                            <div className="writer px-3">
                                                Kenyan novelist
                                            </div>
                                        </div>
                                        <div className="author-card">
                                            <div className="img-wrap">
                                                <img src={funcObj.assets_path("/images/author3.png")} alt="author" />
                                            </div>
                                            <div className="author-name px-3">
                                                Ngũgĩ wa Thiong’o
                                            </div>
                                            <div className="writer px-3">
                                                Kenyan novelist
                                            </div>
                                        </div>
                                    </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="public-footer pt-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-4">
                                <img src={funcObj.assets_path("/images/logo.png")} alt="knls logo" />
                                <div className="list-head mt-4">
                                    Contact Us
                                </div>
                                <p>
                                    193 Woodside St. <br></br> Saint Cloud, MN 56301
                                </p>
                                <p>
                                    +254 010-010-1100
                                </p>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-8">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="list-head mb-4">
                                            Quick Links
                                        </div>
                                        <ul className="list-unstyled">
                                            <li>
                                                <a href="javascript:;">
                                                    Library
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    History
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Meet Our Staff
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Board of Trustees
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Annual Report
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="list-head mb-4">
                                            Connects
                                        </div>
                                        <ul className="list-unstyled">
                                            <li>
                                                <a href="javascript:;">
                                                    Facebook
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Twitter
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Instagram
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Flickr
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    YouTube
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="list-head mb-0 mb-sm-5 pb-2">
                                        </div>
                                        <ul className="list-unstyled">
                                            <li>
                                                <a href="javascript:;">
                                                    Feedback
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Privacy
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    Copyright
                                                </a>
                                            </li>
                                            <li>
                                                <a href="javascript:;">
                                                    FAQs
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="copyright-wrap mt-3 text-center py-4 px-3 bg-color_primary">
                            Copyright © 2021 KNLS. All Rights Reserved
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
