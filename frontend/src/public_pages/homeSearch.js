import React from "react";
import { Link } from "react-router-dom";
import Functions from "../helpers/functions";
const funcObj = new Functions;
export default class HomeSearchBar extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            classes:{},
            checked_class_name:"Ebook"
        };
      this.setClasses = this.setClasses.bind(this);
    }
    componentDidMount(){
        this.setClasses();
    }
    callSearch(e){
        const free_txt = document.getElementById('free_txt').value;
        const classes = document.getElementById('classes').value;
       funcObj.callSearch(classes,free_txt);
    }
    setClasses(){
        
        const endPoint = 'get-contents-classes-public';
        let postBodyData = {};

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data && data.code == 200 && data.data) {
                this.setState({ classes: data.data });
            }

        });
    }
    render(){
        console.log('classes',this.state.classes)
        return (
            <React.Fragment>
                 <form action="#" className="search-form search-forms">
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
                                        <div className="search__input position-relative input__type">
                                            <input type="text" className="form-control m-0" id="free_txt" placeholder="Search Anything ....." defaultValue="" />
                                            <img src={funcObj.assets_path("/images/icons/search.png")} className="search-img" />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
                                        <select className="form-control m-0" id="classes">

                                        {
                                                        this.state.classes && Object.keys(this.state.classes).length > 0 ?
                                                            this.state.classes.map((classd, index) => {
                                                                let selected = (this.state.checked_class_name == classd.class_name) ? true : false;
                                                                return (
                                                                    <option  selected={selected}  key={index} value={classd.class_id}>{classd.class_name}</option>
                                                                )
                                                            })
                                                            : null}
                                        </select>
                                    </div>
                                 
                                    <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
                                        <Link to="" onClick={(e)=>this.callSearch(e)} id="search_btn" className="search-btn">Search</Link>
                                    </div>
                                </div>



                            </form>
            </React.Fragment>
        );
    }
}