import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../helpers/functions';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class Faq extends React.Component {
    componentDidMount(){
        
    }
    render() {
        return (
            <React.Fragment>
                <form id="feedbackFrm" method="POST">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">FAQ</h3>
                            {
                                AUTH_USER.account_type == 'staff' ?
                            
                            <div className="float-right">
                                <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-faq"  className="btn darkBtn">Add FAQ</Link>
                                </div>
                            </div>
                         
                            :null
                        }

                            </div>
                            <div className="row">
                               <div className="col-md-12">
                               {
                                AUTH_USER.account_type == 'staff' ?
                                <React.Fragment>
                                {this.staffView()}
                                </React.Fragment>
                                :
                                <React.Fragment>
                                {this.readerView()}
                                </React.Fragment>
                               }
                              
                               </div>
                            </div>
                            
                        </div>
                    </div>

                </form>

            </React.Fragment>
        );
    }

    readerView(){
        return (
            <React.Fragment>
                  <ul>
                                <li>
                                <h5>Lorem ipsum</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </li>
                                <li>
                                <h5>Lorem ipsum</h5>
                                    <p>Lorem ipsum content text</p>
                                </li>
                                <li>
                                <h5>Lorem ipsum</h5>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </li>
                                <li>
                                <h5>Lorem ipsum</h5>
                                    <p>Lorem ipsum content text</p>
                                </li>

                                </ul>
            </React.Fragment>
        );
    }
    staffView(){
        return (
            <React.Fragment>
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
                                     <th scope="col" > Title <i className="sort-icon"></i></th>
                                    <th scope="col" > Description <i className="sort-icon"></i></th>
                                    <th scope="col" > Created on <i className="sort-icon"></i></th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox2" />
                                            <label for="checkbox2"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</td>
                                    <td>2020-07-11 16:00</td>
                                   
                                </tr>
                                <tr>
                                <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox3" />
                                            <label for="checkbox3"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</td>
                                    <td>2020-05-21 12:00</td>
                                   
                                </tr>
                                <tr>
                                <td scope="col"  width="100">
                                        <div class="custom-checkbox">
                                            <input type="checkbox" id="checkbox4" />
                                            <label for="checkbox4"></label>
                                            <i class="fas fa-edit"></i>
                                        </div>
                                    </td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</td>
                                    <td>2020-05-25 22:00</td>
                                 
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
            </React.Fragment>
        );
    }
}
