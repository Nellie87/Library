import React from 'react';
import Functions from '../helpers/functions';
import CustomPagination from '../pagination';
const funcObj = new Functions();
export default  class SalesReport extends React.Component {

    render() {
        const elements = [1,2,3,4,5];
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Filter Sales</h3>
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
                                        <label className="pl-3">Content Class<span>*</span> </label>
                                        <select className="input-field form-control" name="mobile">
                                            <option value="">-Select-</option>
                                            <option value="E-book">E-book</option>
                                            <option value="Audio-book">Audio-book</option>
                                            <option value="Video">Video-book</option>
                                            <option value="Sliders">Slide</option>
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
                                    <th scope="col" >Book Title<i className="sort-icon"></i></th>
                                    <th scope="col">Book Subtitle <i className="sort-icon"></i></th>
                                    <th scope="col">Author Name <i className="sort-icon"></i></th>
                                    <th scope="col">Buyer Name <i className="sort-icon"></i></th>
                                    <th scope="col">Buyer Mobile <i className="sort-icon"></i></th>
                                    <th scope="col">Qty <i className="sort-icon"></i></th>
                                    <th scope="col">Price <i className="sort-icon"></i></th>
                                    <th scope="col">Amount <i className="sort-icon"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                            {elements.map((value, index) => { 
                                return (
                                <tr key={index}>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>Hunger Eats a Man</td>
                                    <td>Hunger Eats a Man</td>
                                    <td>Abayomi Keita</td>
                                    <td>Nkosinathi Sithole</td>
                                    <td>8120567895</td>
                                    <td>2</td>
                                    <td>300 {funcObj.getCurrency()}</td>
                                    <td>600 {funcObj.getCurrency()}</td>
                                </tr>  
                            )})}                          
                            </tbody>
                        </table>
                        </div>
                        <div className="table-bottom-content">
                        <CustomPagination />
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