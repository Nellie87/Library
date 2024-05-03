import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import Functions from '../helpers/functions';
const funcObj = new Functions();
class ContentList extends React.Component {

    render() {
        const coverBookSettings = {
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 2,
                    }
                }
            ]
        };
        return (
            <React.Fragment>

                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Content</h3>
                            <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-content" type="button" className="btn darkBtn">Add New Content</Link>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" width="80">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox2" />
                                                <label for="checkbox2"></label>
                                            </div>
                                        </th>
                                        <th></th>
                                        <th scope="col" >Book Title<i className="sort-icon"></i></th>
                                        <th scope="col">Book Subtitle <i className="sort-icon"></i></th>
                                        <th scope="col">Book Description <i className="sort-icon"></i> </th>
                                        <th scope="col">Book Description <i className="sort-icon"></i></th>
                                        <th scope="col">Author Name <i className="sort-icon"></i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox1" />
                                                <label for="checkbox1"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox3" />
                                                <label for="checkbox3"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox4" />
                                                <label for="checkbox4"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox5" />
                                                <label for="checkbox5"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox6" />
                                                <label for="checkbox6"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox7" />
                                                <label for="checkbox7"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox8" />
                                                <label for="checkbox8"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox9" />
                                                <label for="checkbox9"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                    <tr>
                                        <td scope="col">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox10" />
                                                <label for="checkbox10"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="img-wrap cat__img">
                                                <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                            </span>
                                            <div className="cat__wrap">
                                                <div className="d-flex justify-content-between">
                                                    <div className="book-card-wrap ">
                                                        <label>Book Cover Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="book-card-wrap ">
                                                        <label>Index Page Image</label>
                                                        <div className="book-card ebook justify-content-center">
                                                            <div className="img-wrap float-left">
                                                                <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="slider-wrap">
                                                    <Slider className="cover-books" {...coverBookSettings}>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="book-card-wrap">
                                                            <div className="book-card ebook">
                                                                <div className="img-wrap float-left">
                                                                    <img src={funcObj.assets_path("/images/books/Image3.png")} alt="books" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Slider>
                                                </div>

                                            </div>
                                        </td>
                                        <td>Hunger Eats a Man</td>
                                        <td>Hunger Eats a Man</td>
                                        <td>
                                            <span className="dec">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                            </span>
                                        </td>
                                        <td>Abayomi Keita</td>
                                        <td>Nkosinathi Sithole</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="table-bottom-content">
                                <button type="button" className="btn lightBtn">Delete Selected</button>
                                <nav aria-label="Page navigation">
                                    <ul class="pagination text-center mb-0">
                                        <li class="page-item"><a className="page-link" href="#">Previous</a></li>
                                        <li className="page-item"><a className="page-link active" href="#">1</a></li>
                                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                                        <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                    </ul>
                                </nav>
                                <div className="table__data">
                                    Showing  10 of 15
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default ContentList;