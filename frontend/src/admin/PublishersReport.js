import React from 'react';
import Functions from '../helpers/functions';
import CustomPagination from '../pagination';
const funcObj = new Functions();
export default  class PublishersReport extends React.Component {

    render() {
        const elements = [1,2,3,4,5];
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Filter Publishers</h3>
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
                                    <th scope="col" > Publication Name<i className="sort-icon"></i></th>
                                    <th scope="col"> Content Class <i className="sort-icon"></i></th>
                                    <th scope="col"> Content Category <i className="sort-icon"></i> </th>
                                    <th scope="col"> Owner Name <i className="sort-icon"></i></th>
                                    <th scope="col" > POC Number <i className="sort-icon"></i></th>
                                    <th scope="col"> Office Address <i className="sort-icon"></i> </th>
                                    <th scope="col"> Office Number<i className="sort-icon"></i></th>
                                    <th scope="col" >TIN Number<i className="sort-icon"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                            {elements.map((value, index) => { 
                                return (
                                <tr key={index}>
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