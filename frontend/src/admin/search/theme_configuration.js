import React from 'react';
import { Link } from 'react-router-dom';
import Functions from '../../helpers/functions';
const funcObj = new Functions();
export default class ThemeConfiguration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: '',
            display_result: '',
            total_results: 10,
            advertising: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleadvChange = this.handleadvChange.bind(this);
        this.handlelayoutChange = this.handlelayoutChange.bind(this);
        this.handleresultChange = this.handleresultChange.bind(this);
    }
    componentDidMount() {
        // this.getconfiguration();
    }
    getconfiguration() {
        let postBodyData = {

        };
        let endPoint = 'get-theme-configuration';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            if (data.code == 200) {
                this.setState({
                    layout: data.data.layout,
                    display_result: data.data.search_results_display_type,
                    total_results: data.data.search_total_results,
                    advertising: data.data.advertising
                });
            } else if (data.code == 201) {
            }
        });
    }
    handleChange(event) {    
        this.setState({total_results: event.target.value}); 
    }
    handleadvChange(event) {    
        this.setState({advertising: event.target.value}); 
    }
    handlelayoutChange(event) {    
        this.setState({layout: event.target.value}); 
    }
    handleresultChange(event) {    
        this.setState({display_result: event.target.value}); 
    }
    handleSubmit(event) {
        event.preventDefault();
        let postBodyData = {
            "theme_id": 1,
            "layout": this.state.layout,
            "display_type": this.state.display_result,
            "total_results": this.state.total_results,
            "advertising": this.state.advertising
        };
        let endPoint = 'theme-configuration';
        funcObj.commonFetchApiCall(postBodyData, endPoint, 'POST').then(data => {
            if (data.code == 200) {
                this.setState({
                    layout: data.data.layout,
                    display_result: data.data.search_results_display_type,
                    total_results: data.data.search_total_results,
                    advertising: data.data.advertising
                });
            } else if (data.code == 201) {
            }
        });
    }
    render() {
        let { layout, display_result, total_results, advertising } = this.state;

        return (
            <React.Fragment>

                <form id="" method="POST"  onSubmit = {this.handleSubmit} >
                    <div className="card mt-4">
                        <div className="dashboard-box">

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-head mb-3">
                                        <span className="bg-white d-inline-block px-3">Theme Layout</span>
                                    </div>


                                    <div className="form-group">

                                        <label>Layout</label>

                                        <select className="input-field form-control"  onChange={this.handlelayoutChange}>
                                            <option value="">Select Layout</option>
                                            <option value="green" selected={layout == 'green' ? true : false} >Light green</option>
                                            <option value="red" selected={layout == 'red' ? true : false}>Light Red</option>
                                            <option value="blue" selected={layout == 'blue' ? true : false}>Light Blue</option>
                                        </select>
                                    </div>

                                    <br />
                                    <div className="form-head mb-3">
                                        <span className="bg-white d-inline-block px-3">Search results</span>
                                    </div>


                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Display result type</label>
                                                <div className="custom-radio ">
                                                    <input type="radio" id="grid"name="display_result"  value="grid" checked={display_result == 'grid' ? true : false}  onChange={this.handleresultChange}/>
                                                    <label For="grid">Grid view</label>
                                                    <input type="radio"  name="display_result"  id="citation" value="list" checked={display_result == 'list' ? true : false}  onChange={this.handleresultChange}/>
                                                    <label For="citation">List view</label>
                                                </div>

                                            </div>

                                            <div className="form-group">
                                                <label>Total number of results per page</label>
                                                <input type="number" className="input-field form-control" placeholder="Enter no." value={this.state.total_results}  onChange={this.handleChange}/>
                                            </div>




                                            <div className="form-group">
                                                <label>Advertising</label>
                                                <div className="custom-radio ">
                                                    <input type="radio" name="advertising" id="on" value="1" checked={advertising == 1 ? true : false} onChange={this.handleadvChange} />
                                                    <label For="on">On</label>
                                                    <input type="radio" name="advertising" id="off" value="0" checked={advertising == 0 ? true : false} onChange={this.handleadvChange} />
                                                    <label For="off">Off</label>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <button type="submit" className="btn addCart py-1 px-3 mr-1" >Save</button>
                                        </div>

                                        {/* <div>
                    layout	predefined
                    color	predefined and it may be color picker
                    total no. of results on screen
                    grid/citation for result
                    advertising on/off
                    Blogs describing particular books
                    RSS Feeds e.g. user subscribes to new additions alert
              </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}
