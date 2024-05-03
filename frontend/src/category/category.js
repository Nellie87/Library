import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Slider from "react-slick";
const funcObj = new Functions();
export default class Category extends React.Component {
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
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            centerPadding: '100px',
            responsive: [
                {
                    breakpoint: 1500,
                    settings: {
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },

                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: 1,
                    }
                }
            ]
        };
        return (
            <React.Fragment>
            


                <div className="search_container">
                    <div className="banner text-center">
                        <div className="container mb-5">
                            <span className="page_title font-poppins font-50 light"> Millions of Books, Read Anytime</span>
                            <div className="search-bar  position-relative clearfix">
                                <div className="selectbook float-left">
                                    <select data-style="rounded-pill " class="form-control mb-0 border-0 border-right">
                                        <option selected >Audio Books</option>
                                        <option>E-Books</option>
                                        <option>Video Books</option>
                                        <option>Slides</option>
                                    </select>
                                </div>
                                <div className="form-froup mb-0 float-left">
                                    <input type="text" className="form-control  mb-0 border-0 " placeholder="Search Your Book" />
                                </div>
                                <div className="searchicon">
                                    <img src={funcObj.assets_path("/images/icons/search.png")} className="white-img" width="26" alt="search" />
                                </div>
                            </div>
                            <p className="text-white mt-2 mb-5">Top Searches: <strong> Wattpad, Goodreads, Oodles eBook Reader, Kobo </strong></p>
                        </div>
                    </div>
                    <div className="container">

                        <div className="search_wrap clearfix px-3 pt-3">
                            <div className="main-section_title mt-4 text-center">
                                Top Categories
                            </div>
                            <p className="text-center mt-4 sub-text">Here are some Top Categories of the Books</p>
                            <div className="px-3 px-lg-5 category-tabs">
                                <ul class="nav  d-flex flex-wrap justify-content-lg-between justify-content-normal  nav-tabs border-0" id="myTab" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0 active" id="computer-tab" data-toggle="tab" href="#computer" role="tab" aria-controls="Computer" aria-selected="true"> Computer</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="fiction-tab" data-toggle="tab" href="#fiction" role="tab" aria-controls="fiction" aria-selected="false">Fiction</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="drama-tab" data-toggle="tab" href="#drama" role="tab" aria-controls="drama" aria-selected="false">Drama</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="litreature-tab" data-toggle="tab" href="#litreature" role="tab" aria-controls="litreature" aria-selected="false">Litreature</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="art-tab" data-toggle="tab" href="#art" role="tab" aria-controls="art" aria-selected="false">Art</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="photography-tab" data-toggle="tab" href="#photography" role="tab" aria-controls="photography" aria-selected="false">Photography</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="business-tab" data-toggle="tab" href="#business" role="tab" aria-controls="business" aria-selected="false">Business</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="biograpies-tab" data-toggle="tab" href="#biograpies" role="tab" aria-controls="biograpies" aria-selected="false">Biograpies</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="politics-tab" data-toggle="tab" href="#politics" role="tab" aria-controls="politics" aria-selected="false">Politics</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="travel-tab" data-toggle="tab" href="#travel" role="tab" aria-controls="travel" aria-selected="false">Travel</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link category-link px-3 py-2 py-lg-5 text-center  border-0" id="book-tab" data-toggle="tab" href="#book" role="tab" aria-controls="book" aria-selected="false">Book</a>
                                    </li>
                                </ul>
                            </div>

                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="computer" role="tabpanel" aria-labelledby="home-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="fiction" role="tabpanel" aria-labelledby="profile-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="drama" role="tabpanel" aria-labelledby="contact-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="tab-pane fade" id="litreature" role="tabpanel" aria-labelledby="contact-tab">
                                    <div className="books-cover row mt-5 px-3 px-lg-5 top-categories">
                                        <div className="col-xl-5 col-md-3 mb-3 mb-lg-5">
                                            <div className="book-wrap-card">
                                                <div className="card-book">
                                                    <div className="img-wrap">
                                                        <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Hunger Eats
                                                        </div>
                                                        <p>
                                                            Nkosinathi Sithole
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Daughters wh
                                                        </div>
                                                        <p>
                                                            Yejide Kilanko
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            The House of Hunger
                                                        </div>
                                                        <p>
                                                            Dambudzo Marechera
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
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
                                                        <div className="favorite-cart">
                                                            <img src={funcObj.assets_path("/images/icons/favorite.png")} width="30" alt="favorite" />
                                                            <img src={funcObj.assets_path("/images/icons/cart-icon.png")} width="30" alt="cart" />
                                                        </div>
                                                    </div>
                                                    <div className="book-details">
                                                        <div className="book-name">
                                                            Thirteen Mont
                                                        </div>
                                                        <p>
                                                            Rania Mamoun
                                                        </p>
                                                        <div className="book-rating">
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star" aria-hidden="true"></i>
                                                            <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                            <span>4.5</span>
                                                        </div>
                                                        <div className="price">
                                                            <span className="old-price">250</span>
                                                            <span className="new-price">149 {funcObj.getCurrency()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div className="authors-wrap">
                                <div className="top-authors px-3">
                                    <div className="main-section_title mt-4 text-white text-center">
                                        Top Authors
                                    </div>
                                    <p className="text-center mt-4 sub-text text-white">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print</p>
                                </div>
                                <div className="row px-3 px-lg-5">
                                    <div className="col-lg-4 mb-sm-6">
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
                                        <div className="book_name text-center">
                                            Explore Books
                                        </div>
                                    </div>
                                    <div className="col-lg-4 mb-sm-6">
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
                                        <div className="book_name text-center">
                                            Explore Books
                                        </div>
                                    </div>
                                    <div className="col-lg-4 mb-sm-6">
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
                                        <div className="book_name text-center">
                                            Explore Books
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row-cards-one dashboard-box mt-5 px-3 px-lg-5">
                                <h3 className="dashboard-title title-margin mb-0 font-poppins">New Releases</h3>
                                <p className="heading-info title-margin mt-0">Lorem ipsum, or lipsum as it is sometimes known, is dummy text</p>
                                <Slider className="top-books" {...bookSettings}>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/book-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    The House of
                                                </div>
                                                <p>
                                                    Dambudzo Marechera
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/video-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Thirteen Mont
                                                </div>
                                                <p>
                                                    Rania Mamoun
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>

                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/audio-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Hunger Eats
                                                </div>
                                                <p>
                                                    Nkosinathi Sithole
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/slides-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Daughters wh
                                                </div>
                                                <p>
                                                    Yejide Kilanko
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/book-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    The House of
                                                </div>
                                                <p>
                                                    Dambudzo Marechera
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/video-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Thirteen Mont
                                                </div>
                                                <p>
                                                    Rania Mamoun
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/audio-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Hunger Eats
                                                </div>
                                                <p>
                                                    Nkosinathi Sithole
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/slides-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Daughters wh
                                                </div>
                                                <p>
                                                    Yejide Kilanko
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                            <div className="row-cards-one dashboard-box px-3 px-lg-5">
                                <h3 className="dashboard-title title-margin mb-0 font-poppins">BestSellers</h3>
                                <p className="heading-info title-margin mt-0">Lorem ipsum, or lipsum as it is sometimes known, is dummy text</p>
                                <Slider className="top-books" {...bookSettings}>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/book-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    The House of
                                                </div>
                                                <p>
                                                    Dambudzo Marechera
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/video-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Thirteen Mont
                                                </div>
                                                <p>
                                                    Rania Mamoun
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/audio-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Hunger Eats
                                                </div>
                                                <p>
                                                    Nkosinathi Sithole
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/slides-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Daughters wh
                                                </div>
                                                <p>
                                                    Yejide Kilanko
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/book-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    The House of
                                                </div>
                                                <p>
                                                    Dambudzo Marechera
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/video-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Thirteen Mont
                                                </div>
                                                <p>
                                                    Rania Mamoun
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/audio-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Hunger Eats
                                                </div>
                                                <p>
                                                    Nkosinathi Sithole
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                    <div className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/slides-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    Daughters wh
                                                </div>
                                                <p>
                                                    Yejide Kilanko
                                                </p>
                                                <div className="book-rating">
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <i className="fa fa-star-half-alt" aria-hidden="true"></i>
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="description-text mt-3">
                                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book.
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                            <div className="newlatter  py-3 py-lg-5">
                                <h3 className="text-center text-white mb-4 f-600  {funcObj.getCurrency()}">
                                    Subscribe to our newsletter
                                </h3>
                                <div className="form-group  position-relative">
                                    <input type="text" placeholder="Email Address" className="form-control" />
                                    <button type="button" className="btn dark-btn_orange px-5">Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
              </React.Fragment>
        );
    }
}
