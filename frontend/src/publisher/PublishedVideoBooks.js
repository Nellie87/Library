import React from 'react';
import {Link} from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
export default  class VideoBooksReport extends React.Component {

    render() {
        const elements = [1,2,3,4,5];
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Filter Video-books</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">From-date <span>*</span> </label>
                                        <input type="date" className="input-field form-control" placeholder="Enter Full Name" name="name" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">To-date <span>*</span> </label>
                                        <input type="date" className="input-field form-control" placeholder="Enter Full Name" name="name" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">Content Category<span>*</span> </label>
                                        <select className="input-field form-control" name="mobile">
                                            <option value="">-Select-</option>
                                            <option value="Literature">Literature</option>
                                            <option value="Politics">Politics</option>
                                            <option value="Music">Music</option>
                                            <option value="Art">Art</option>
                                        </select>
                                    </div>
                                </div>  
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <button type="button" class="btn addCart py-1 px-3 mr-1 mt-30">Search</button>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </form>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Search Result</h3>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th scope="col" >Content Title<i className="sort-icon"></i></th>
                                    <th scope="col">Content Subtitle <i className="sort-icon"></i></th>
                                    <th scope="col">Author Name <i className="sort-icon"></i></th>
                                    <th scope="col">Publisher Name <i className="sort-icon"></i></th>
                                    <th scope="col">Price <i className="sort-icon"></i></th>
                                    <th scope="col">Date Of Publish <i className="sort-icon"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                            {elements.map((value, index) => { 
                                return (
                                <tr>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Hunger Eats a Man</td>
                                    <td>Hunger Eats a Man</td>
                                    <td>Abayomi Keita</td>
                                    <td>X-Tree Publications</td>
                                    <td>300 {funcObj.getCurrency()}</td>
                                    <td>12-May-2021</td>
                                </tr>  
                            )})}                          
                            </tbody>
                        </table>
                        </div>
                        <div className="table-bottom-content">
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
            </React.Fragment>
        );
    }
}