import React from 'react';

import CustomPagination from "../pagination";

export default  class UsersReport extends React.Component {

    render() {
        const elements = [1,2,3,4];
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Filter Searching Histrory</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">Date <span>*</span> </label>
                                        <input type="date" className="input-field form-control" name="name" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">From Time <span>*</span> </label>
                                        <input type="time" className="input-field form-control" name="name" value="15:00"/>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <label className="pl-3">To Time <span>*</span> </label>
                                        <input type="time" className="input-field form-control" name="name" value="17:00"/>
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
                                    <th scope="col" > Keyword<i className="sort-icon"></i></th>
                                    <th scope="col"> Searches In Desktop <i className="sort-icon"></i></th>
                                    <th scope="col" > Searches In Mobile <i className="sort-icon"></i></th>
                                    <th scope="col"> Total Matches <i className="sort-icon"></i> </th>                     
                                </tr>
                            </thead>
                            <tbody>
                            {elements.map((value, index) => { 
                                return (
                                <tr key={index}>
                                    <td>Lesli Dikeni</td>
                                    <td>200</td>
                                    <td>300</td>
                                    <td>200</td>
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