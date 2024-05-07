import React from 'react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import Functions from '../helpers/functions';
import Pagination from "react-js-pagination";
const funcObj = new Functions();
export default  class AuthorsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: [],
            newRelease: [],
            topselling: [],
            classes:{},
            per_page_limit:10,
            total_records:0,
            current_page:1,
        };
        this.handlePageChange = this.handlePageChange.bind(this);

    }
    componentDidMount() {
        this.follower();
    }
    handlePageChange(pageNumber) {
        this.state.current_page = pageNumber;
        this.getFeedback(pageNumber);    
    }
    follower() {
        
        let postBodyData = {
            "current_page": this.state.current_page,
        };
        let endPoint = 'get-follower-list';
        funcObj.commonFetchApiCall(postBodyData, endPoint, "POST").then(data => {
            console.log('dashboard response', data)
            let graph = JSON.stringify(data.data);
            if (data.code == 200) {

                this.setState({
                    isLoaded: true,
                    feedbacktData:(data.data)?data.data.data:[],
                    total_records:data.data.total 
                });


            } else if (data.code == 201) {

            }
        });
    }
    render() {

        return (
            <React.Fragment>
                <div className="card mt-4">
                    <div className="dashboard-box">
                        <div className="clearfix top-head mb-4">
                            <h3 class="dashboard-title title-margin my-2 float-left">Follower list</h3>
                            <div className="float-right">
                                {/* <div className="add-btn-wrap">
                                    <span className="add-icon">+</span>
                                    <Link to="/add-author" className="btn darkBtn">Add New Author</Link>
                                </div> */}
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" > Full Name<i className="sort-icon"></i></th>
                                    <th scope="col"> Email <i className="sort-icon"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                             {
                              this.state.feedbacktData && Object.keys(this.state.feedbacktData).length > 0 ?   
                              this.state.feedbacktData.map((value, index) => { 
                                return (
                                    <tr>
                                        {/* <td scope="col"  width="100">
                                            <div class="custom-checkbox">
                                                <input type="checkbox" id="checkbox1" />
                                                <label for="checkbox1"></label>
                                                <i class="fas fa-edit"></i>
                                            </div>
                                        </td> */}
                                        <td onClick={()=>this.handleModal(value)}>{value.first_name} {value.last_name}</td>
                                      
                                        <td onClick={()=>this.handleModal(value)}>{value.email}</td>
                                        
                                        <td>
                                            {(value.attachment_file)?
                                                  <a href={value.attachment_file} download target="_blank">
                                                  Click to open
                                              </a>:null
                                            }
                                          
                                            {/* <span className="img-wrap profile__img">
                                                <img src={funcObj.assets_path("/images/publication.png")} width="30" alt="books" />
                                            </span> */}
                                        </td>
                                    </tr>
                                )}):null} 
                            </tbody>
                        </table>
                        </div>
                        <div className="table-bottom-content">
                           
                             {/* <button type="button" className="btn lightBtn">Delete Selected</button> */}
                             <nav aria-label="Page navigation">
                                <Pagination
                                    activePage={this.state.current_page}
                                    itemsCountPerPage={this.state.per_page_limit}
                                    totalItemsCount={this.state.total_records}
                                    onChange={this.handlePageChange.bind(this)}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </nav>
                            <div className="table__data">
                              {/* Showing  {Object.keys(this.state.feedbacktData).length} of {this.state.total_records} */}
                            </div>
                        </div>
                    </div>   
                </div>
            </React.Fragment >
        );
    }
}