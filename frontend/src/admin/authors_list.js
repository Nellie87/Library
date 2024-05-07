import React from 'react';
import {Link} from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default  class AuthorsList extends React.Component {

    render() {

        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Authors</h3>
                            <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-authors" className="btn darkBtn">Add New Author</Link>
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
                                    <th scope="col" > Full Name<i className="sort-icon"></i></th>
                                    <th scope="col"> Email <i className="sort-icon"></i></th>
                                    <th scope="col" > Content Number <i className="sort-icon"></i></th>
                                    <th scope="col"> Publication Types <i className="sort-icon"></i> </th>
                                    <th scope="col"> Publication Categories <i className="sort-icon"></i> </th>
                                    <th scope="col">  Address <i className="sort-icon"></i> </th>
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
                                        <span className="img-wrap profile__img">
                                            <img src={funcObj.assets_path("/images/publication.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Lesli Dikeni</td>
                                    <td>user@gmail.com</td>
                                    <td>085 290 0037</td>
                                    <td>E-Books, Audio-Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap profile__img">
                                            <img src={funcObj.assets_path("/images/publication.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Lesli Dikeni</td>
                                    <td>user@gmail.com</td>
                                    <td>085 290 0037</td>
                                    <td>E-Books, Audio-Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap profile__img">
                                            <img src={funcObj.assets_path("/images/publication.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Lesli Dikeni</td>
                                    <td>user@gmail.com</td>
                                    <td>085 290 0037</td>
                                    <td>E-Books, Audio-Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap profile__img">
                                            <img src={funcObj.assets_path("/images/publication.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Lesli Dikeni</td>
                                    <td>user@gmail.com</td>
                                    <td>085 290 0037</td>
                                    <td>E-Books, Audio-Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="img-wrap profile__img">
                                            <img src={funcObj.assets_path("/images/publication.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Lesli Dikeni</td>
                                    <td>user@gmail.com</td>
                                    <td>085 290 0037</td>
                                    <td>E-Books, Audio-Books</td>
                                    <td>Literature, Politics, Music, Art, Fiction</td>
                                    <td>
                                        <span className="dec">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting…… industry
                                        </span>
                                    </td>
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