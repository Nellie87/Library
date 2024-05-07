import React from 'react';
import PieGraph from '../graphs/pie';
import Functions from '../helpers/functions';
import Slider from "react-slick";
import testPdf from './TestPdf.pdf';



const funcObj = new Functions();
class MyBooks extends React.Component {


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
                    breakpoint: 1500,
                    settings: {
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3,
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
        console.log('host name:', funcObj.hostname());

        return (
            <React.Fragment>
                <div>
                    <div className="row-cards-one dashboard-box">
                        <div className="tab-content" id="my-collection">
                            <div className="pdf-container">
                                <iframe src={testPdf} style={{width:'100%',height:'700px'}}/>
                            </div>

                            
                            <div className="tab-pane fade show active" id="ebooks" role="tabpanel" aria-labelledby="ebooks-tab">
                                <div className="row-cards-one dashboard-box">
                                    <h3 className="dashboard-title title-margin mb-0">Related Books</h3>
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
                            </div>

                            <div className="tab-pane fade" id="video-books" role="tabpanel" aria-labelledby="video-books-tab">
                                <div className="cover-book-wrap p-4">
                                    <Slider className="cover-books"  {...coverBookSettings}>
                                        <div className="book-card-wrap">
                                            <div className="book-card ebook">
                                                <div className="img-wrap float-left">
                                                    <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-card-wrap">
                                            <div className="book-card ebook">
                                                <div className="img-wrap float-left">
                                                    <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
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
                                                    <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-card-wrap">
                                            <div className="book-card ebook">
                                                <div className="img-wrap float-left">
                                                    <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
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
                                                    <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                </div>
                                            </div>
                                        </div>
                                    </Slider>
                                </div>

                            </div>
                            <div className="tab-pane fade" id="slides" role="tabpanel" aria-labelledby="slides-tab">
                                <div className="cover-book-wrap p-4" >
                                    <Slider className="cover-books" {...coverBookSettings}>
                                        <div className="book-card-wrap">
                                            <div className="book-card ebook">
                                                <div className="img-wrap float-left">
                                                    <img src={funcObj.assets_path("/images/books/Image1.png")} alt="books" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-card-wrap">
                                            <div className="book-card ebook">
                                                <div className="img-wrap float-left">
                                                    <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
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
                                                    <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-card-wrap">
                                            <div className="book-card ebook">
                                                <div className="img-wrap float-left">
                                                    <img src={funcObj.assets_path("/images/books/Image2.png")} alt="books" />
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
                                                    <img src={funcObj.assets_path("/images/books/Image4.png")} alt="books" />
                                                </div>
                                            </div>
                                        </div>
                                    </Slider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default MyBooks;