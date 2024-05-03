import React from 'react';
import Functions from '../helpers/functions';
import CustomPagination from '../pagination';
const funcObj = new Functions();
export default  class SalesReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            views: []
        };
    }
    componentDidMount() {
        this.getviewscontent();
    }
    getviewscontent() {
        let postBodyData = {

        };
        let endPoint = 'content-views';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            if (data.code == 200) {
                // console.log(data.data.da);
                this.setState({
                    views: data.data.data
                });
            } else if (data.code == 201) {
            }
        });
    }
    render() {
        const elements = [1,2,3,4,5];
        let {views} =this.state;
        return (
            <React.Fragment>
                <form id="geniusform" method="POST" enctype="multipart/form-data">
                    <div className="card mt-4">
                        <div className="dashboard-box">
                            <div className="clearfix top-head mb-2">
                                <h3 className="dashboard-title title-margin my-2 float-left">Filter Views On Content</h3>
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
                                  
                                    <th scope="col">Author Name <i className="sort-icon"></i></th>
                                    <th scope="col">Price <i className="sort-icon"></i></th>
                                    <th scope="col">Views <i className="sort-icon"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                            {views.map((value, index) => { 
                                return (
                                <tr key={index}>
                                    <td>
                                        <span className="img-wrap cat__img">
                                            <img src={funcObj.assets_path("/images/books/Image3.png")} width="30" alt="books" />
                                        </span>
                                    </td>
                                    <td>{value.content_detail.title}</td>
                                    <td>{ value.content_detail.author_name }</td>
                                   
                                    <td>{value.content_detail.content_price} {funcObj.getCurrency()}</td>
                                    <td>{value.views}</td>
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