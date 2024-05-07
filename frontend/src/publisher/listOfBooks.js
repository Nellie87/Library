import React from 'react';
import PieGraph from '../graphs/pie';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
import Slider from "react-slick";
import Swal from 'sweetalert2';
const funcObj = new Functions();
class ListOfBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reading: [],
            ebooks: [],
            audiobooks: [],
            videobooks: [],
            slides: [],
            data: []
        };
        this.classload = this.classload.bind(this);
        this.getClasses = this.getClasses.bind(this);
    }

    componentDidMount() {
        this.booklist(3);
        this.getClasses();
    }
    classload(e) {
        if (e.target.attributes.getNamedItem("data-id")) {
            const id = e.target.attributes.getNamedItem("data-id").value;
            this.booklist(id);
        }
    }
    booklist(class_id) {

        let user = funcObj.getLocalStorage('user');

        let postBodyData = {
            "class": class_id,
            "categories": "",
            "publishers": user.user.id

        };
        let endPoint = "reports-list-of-books";
        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data.code == 200) {


                this.setState({
                    isLoaded: true,
                    content: data.data.catalog,
                });

            } else if (data.code == 401) {

            }
        });
    }
    getClasses = () => {
        let endPoint = 'get-classes';
        let postBodyData = {}
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'GET').then(data => {


            if (data.code == 200) {
                console.log(data)
                this.setState({
                    classes: data.data
                });

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

    render() {

        let coverBookSettings = {};
        if(this.state.content && Object.keys(this.state.content).length > 0){

      
        let { content } = this.state;
        coverBookSettings = {
            slidesToShow: content.length > 4 ? 4 : content.length,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            pauseOnHover: false,
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: content.length > 4 ? 4 : content.length,
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: content.length > 3 ? 3 : content.length,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: content.length > 2 ? 2 : content.length,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: content.length > 2 ? 2 : content.length,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: content.length > 1 ? 1 : content.length,
                    }
                }
            ]
        };

    }


        return (
            <React.Fragment>
                <div>


                    <div className="row-cards-one dashboard-box">
                        <h3 className="dashboard-title title-margin">List Of Books</h3>
                      <div className='text-center'>
                        <ul className="nav collection-tabs nav-tabs border-0" id="myTab" role="tablist">

{
    this.state.classes && Object.keys(this.state.classes).length > 0 ?
        this.state.classes.map((classd, index) => {
            let anchor_class = "nav-link border-0 ";
            if (classd.class_name == 'ebook') {
                anchor_class = "nav-link border-0 active";
            }
            return (

                <li className="nav-item" key={index}>
                    <a className={anchor_class} id={classd.class_name + `-tab`} data-toggle="tab" href={classd.class_name + `s`} role="tab" aria-controls={classd.class_name + `s`} data-id={classd.class_id} onClick={(e) => this.classload(e)} aria-selected="true">
                        <img  data-id={classd.class_id} onClick={(e) => this.classload(e)} src={funcObj.getClassTypeIcons(classd.class_name)} width="30" alt={classd.class_title_s} />  
                        <p  data-id={classd.class_id} onClick={(e) => this.classload(e)}>
                        {classd.class_name}
                        </p>
                    </a>
                </li>
            )
        })
        : null}


</ul>
</div>
                        <div className="tab-content" id="my-collection">

{
    this.state.classes && Object.keys(this.state.classes).length > 0 ?
        this.state.classes.map((classd, index) => {
            let anchor_class = "tab-pane fade";
            if (classd.class_name == 'ebook') {
                anchor_class = "tab-pane fade show active";
            }
            return (
                <div key={index} className={anchor_class} id={classd.class_name + `s`} role="tabpanel" aria-labelledby={classd.class_name + `-tab`}>
                    <div className="cover-book-wrap p-4" >
                    {
                                this.state.content && Object.keys(this.state.content).length > 0 ?
                        <Slider className="cover-books" {...coverBookSettings}>
                        {
                                this.state.content && Object.keys(this.state.content).length > 0 ?
                                    this.state.content.map((book, index) => {
                                        return (
                                            <Link to={`/private-bookdetail?book_id=` + book.encrypted_content_id + `&type=` + book.class_id + `&backlink=list-of-books`} className="book-card-wrap">
                                                <div className="book-card ebook">
                                                    <div className="img-wrap float-left">
                                                        <img src={book.main_content_image} alt="books" />
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                    : null}
                        </Slider>
                        : <span>Nothing found</span>
                            }
                    </div>
                </div>
            )

        })
        : null}

</div>
                    </div>
                </div>
            </React.Fragment>
        );
    }



    popularBooks() {
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
            // <div className="row row-cards-one dashboard-box">
            //     <div className="col-md-12 col-lg-12 col-xl-12">
            //         <h3 className="dashboard-title title-margin">Popular Books</h3>
            //     </div>
            //     <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
            //         <div className="popular-book">
            //             <div className="row book-image">
            //                 <div className="col-md-12">
            //                     <img src={funcObj.assets_path("/images/books/1.jpg")} className="img-fluid" alt="" />
            //                 </div>
            //             </div>
            //             <div className="row book-details">
            //                 <div className="col-md-12">
            //                     <h5 className="book-author">Mark Kenyon</h5>
            //                     <h4 className="book-title">The Wild Country</h4>
            //                     <h5 className="book-price">$ 63.00</h5>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
            //         <div className="popular-book">
            //             <div className="row book-image">
            //                 <div className="col-md-12">
            //                     <img src={funcObj.assets_path("/images/books/2.jpg")} className="img-fluid" alt="" />
            //                 </div>
            //             </div>
            //             <div className="row book-details">
            //                 <div className="col-md-12">
            //                     <h5 className="book-author">Mark Kenyon</h5>
            //                     <h4 className="book-title">The Wild Country</h4>
            //                     <h5 className="book-price">$ 63.00</h5>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
            //         <div className="popular-book">
            //             <div className="row book-image">
            //                 <div className="col-md-12">
            //                     <img src={funcObj.assets_path("/images/books/3.jpg")} className="img-fluid" alt="" />
            //                 </div>
            //             </div>
            //             <div className="row book-details">
            //                 <div className="col-md-12">
            //                     <h5 className="book-author">Mark Kenyon</h5>
            //                     <h4 className="book-title">The Wild Country</h4>
            //                     <h5 className="book-price">$ 63.00</h5>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <div className="col-md-12 col-lg-6 col-xl-3 mb-4">
            //         <div className="popular-book">
            //             <div className="row book-image">
            //                 <div className="col-md-12">
            //                     <img src={funcObj.assets_path("/images/books/4.jpg")} className="img-fluid" alt="" />
            //                 </div>
            //             </div>
            //             <div className="row book-details">
            //                 <div className="col-md-12">
            //                     <h5 className="book-author">Mark Kenyon</h5>
            //                     <h4 className="book-title">The Wild Country</h4>
            //                     <h5 className="book-price">$ 63.00</h5>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>

            <div className="row-cards-one dashboard-box">
                <h3 className="dashboard-title title-margin">Continue Reading</h3>
                <Slider className="top-books" {...bookSettings}>
                    {
                        this.state.reading && Object.keys(this.state.reading).length > 0 ?
                            this.state.reading.map((book, index) => {
                                return (
                                    <Link to={`/private-bookdetail?book_id=` + book.content_id + `&backlink=my-books`} className="book-card-wrap">
                                        <div className="book-card ebook">
                                            <div className="img-wrap float-left">
                                                <img src={book.picture} alt="books" />
                                            </div>
                                            <div className="book-details float-left">
                                                <img src={funcObj.assets_path("/images/icons/book-tag.svg")} className="tag-icon" width="75" alt="" />
                                                <div className="book-name">
                                                    {book.title}
                                                </div>
                                                <p>
                                                    {book.subtitle}
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
                                        <div className="progress-wrap">
                                            <div className="text-right">20% Completed</div>
                                            <div className="progress">
                                                <div className="progress-bar" role="progressbar" style={{ width: "20%" }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                            : null
                    }
                </Slider>
                {/* <div className="card">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mt-3 mb-4">
                            <h3 className="dashboard-title title-margin my-2 float-left">Content Categories</h3>
                            <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <div className="input-fields d-inline-block">
                                        <input type="text" placeholder="Enter Category Name" />
                                        <span type="btn" className="add_input">Add</span>
                                    </div>
                                    <button type="button" className="btn darkBtn">Add New Category</button>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox1" />
                                                <label for="checkbox1"></label>
                                            </div>
                                        </th>
                                        <th scope="col" width="200">Category Name</th>
                                        <th scope="col">Date Added</th>
                                        <th scope="col">Last Updated</th>
                                        <th scope="col">Last Updated By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox2" />
                                                <label for="checkbox2"></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="edit-feild position-relative">
                                                <i className="fas fa-edit"></i>
                                                <input type="text"  placeholder="Literature" />
                                                <button type="button" className="btn saveButton">SAVE</button>
                                            </div>
                                        </td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox3" />
                                                <label for="checkbox3"></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="edit-feild position-relative">
                                                <i className="fas fa-edit"></i>
                                                <input type="text"  placeholder="Art" />
                                                <button type="button" className="btn saveButton">SAVE</button>
                                            </div>
                                        </td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox4" />
                                                <label for="checkbox4"></label>
                                            </div>
                                        </td>
                                        <td>History</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox5" />
                                                <label for="checkbox5"></label>
                                            </div>
                                        </td>
                                        <td>Entertainment</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox6" />
                                                <label for="checkbox6"></label>
                                            </div>
                                        </td>
                                        <td>Comics</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox7" />
                                                <label for="checkbox7"></label>
                                            </div>
                                        </td>
                                        <td>Politics</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox8" />
                                                <label for="checkbox8"></label>
                                            </div>
                                        </td>
                                        <td>Fiction</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox9" />
                                                <label for="checkbox9"></label>
                                            </div>
                                        </td>
                                        <td>Fiction</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                    <tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox10" />
                                                <label for="checkbox10"></label>
                                            </div>
                                        </td>
                                        <td>Fiction</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr><tr>
                                        <td scope="row">
                                            <div className="custom-checkbox">
                                                <input type="checkbox" id="checkbox11" />
                                                <label for="checkbox11"></label>
                                            </div>
                                        </td>
                                        <td>Machine Learning</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>2021-01-01 00:00:01</td>
                                        <td>Last Updated By</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div> */}




            </div>
        );
    }
}
export default ListOfBooks;
