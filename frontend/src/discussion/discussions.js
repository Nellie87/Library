import React from 'react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default  class Discussions extends React.Component {
    
    render() {

        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Discussions</h3>
                            <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-discussion" className="btn darkBtn">Add Discussion group</Link>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                            <thead>
                                <tr>
                                <th scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                       
                                        </div>
                                    </th>
                                     <th scope="col" > Topic <i className="sort-icon"></i></th>
                                    <th scope="col" > Created on <i className="sort-icon"></i></th>

                                    <th scope="col" > Total users <i className="sort-icon"></i></th>
                                   
                                        <th scope="col"> Status <i className="sort-icon"></i> </th>
                                   
                                    
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
                                    <td>Lorem ipsum</td>
                                    <td>2020-07-11 16:00</td>
                                    <td>4</td>
                                    {
                                        (AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader') ?
                                        <td > Active </td>
                                        :
                                        <td > 
                                        <label class="switch">
                                        <input type="checkbox" id="switch1" defaultChecked={true}  />
                                        <span class="slider round"></span>
                                        </label>
                                        </td>
                                    }
                                </tr>
                                <tr>
                                <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>Ebooks discussion</td>
                                    <td>2020-05-21 12:00</td>
                                    <td>3</td>
                                    {
                                        (AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader') ?
                                        <td > Blocked </td>
                                        :
                                        <td > 
                                        <label class="switch">
                                        <input type="checkbox" id="switch2" defaultChecked={false}  />
                                        <span class="slider round"></span>
                                        </label>
                                        </td>
                                    }
                                </tr>
                                <tr>
                                <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox1" />
                                            <label for="checkbox1"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>Slides discussion</td>
                                    <td>2020-05-25 22:00</td>
                                    <td>2</td>
                                    {
                                        (AUTH_USER.account_type == 'reader' ||  AUTH_USER.account_type ==  'junior_reader') ?
                                        <td > Active </td>
                                        :
                                        <td > 
                                        <label class="switch">
                                        <input type="checkbox" id="switch3"  defaultChecked={true}  />
                                        <span class="slider round"></span>
                                        </label>
                                        </td>
                                    }
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
            </React.Fragment>
        );
    }
}