import React from 'react';
import Slider from "react-slick";
import Functions from '../helpers/functions';
const funcObj = new Functions();
class PblisherList extends React.Component {

    render() {

        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Publishers</h3>
                            <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <button type="button" className="btn darkBtn">Add New Publisher</button>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox0" />
                                            <label for="checkbox0"></label>
                                        </div>
                                    </th>
                                    <th></th>
                                    <th scope="col" > Publication Name<i className="sort-icon"></i></th>
                                    <th scope="col"> Content Class <i className="sort-icon"></i></th>
                                    <th scope="col"> Content Category <i className="sort-icon"></i> </th>
                                    <th scope="col"> Owner Name <i className="sort-icon"></i></th>
                                    <th scope="col" > POC Number <i className="sort-icon"></i></th>
                                    <th scope="col"> Office Address <i className="sort-icon"></i> </th>
                                    <th scope="col"> Office Number<i className="sort-icon"></i></th>
                                    <th scope="col" >TIN Number<i className="sort-icon"></i></th>
                                    <th scope="col"> Login Email <i className="sort-icon"></i></th>
                                    <th scope="col"> Password</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image2.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox2" />
                                            <label for="checkbox2"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image4.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
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
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox4" />
                                            <label for="checkbox4"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image4.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox5" />
                                            <label for="checkbox5"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image2.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox6" />
                                            <label for="checkbox6"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image1.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox7" />
                                            <label for="checkbox7"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image4.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox8" />
                                            <label for="checkbox8"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image2.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox9" />
                                            <label for="checkbox9"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image4.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox10" />
                                            <label for="checkbox10"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image1.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Africa World Press & Red Sea Press</td>
                                    <td>E-Books, Audio Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>Abayomi Keita</td>
                                    <td>085 290 0037</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                    <td>4564 4564445</td>
                                    <td>XXXXXXXXXXX</td>
                                    <td>admin@gmail.com</td>
                                    <td>...........</td>
                                </tr>
                                
                            </tbody>
                        </table>
                        </div>
                        
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
            </React.Fragment >
        );
    }
}
export default PblisherList;