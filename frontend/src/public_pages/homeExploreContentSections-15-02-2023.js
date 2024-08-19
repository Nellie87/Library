import React from "react";
import { Link } from "react-router-dom";
import Functions from "../helpers/functions";
const funcObj = new Functions;
export default class HomeExploreContentSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classes: {},
            checked_class_name: "Ebook"
        };
        this.setClasses = this.setClasses.bind(this);
    }
    componentDidMount() {
        this.setClasses();
    }
    callSearch(e, classes) {
        funcObj.callSearch(classes);
    }
    setClasses() {

        const endPoint = 'get-contents-classes-public';
        let postBodyData = {};

        funcObj.commonFetchApiCall(postBodyData, endPoint).then(data => {
            if (data && data.code == 200 && data.data) {
                this.setState({ classes: data.data });
            }

        });
    }
    render() {
        console.log('classes', this.state.classes)
        return (
            <React.Fragment>
                <div className="digital-resources home_right_navigation">
                   
                    <div className="row explore_contents">

            <div className="">
            <h3 className="scroll_section_heading">Explore our Contents</h3>
            </div>
                        {
                            this.state.classes && Object.keys(this.state.classes).length > 0 ?
                                this.state.classes.map((classd, index) => {
                                    if (classd.class_name_key == 'ebook' || classd.class_name_key == 'audio' || classd.class_name_key == 'video') {


                                        return (
                                            <React.Fragment key={index}>
                                                <div className="col-md-3 section" onClick={(e) => this.callSearch(e, classd.class_id)}>
                                                    <div className="cat-image" >
                                                    
                                                    <img src={funcObj.getClassTypeColouredIcons(classd.class_name_key)} />
                                                 
                                                        <h4 className="font-planet mb-0">{classd.class_name}</h4>
                                                        <span></span>
                                                    </div>
                                                    <div className="cat-link">
                                                        <Link to="/dbooks?q=2">
                                                        {/* <img src={funcObj.assets_path("/images/icons/arrow-left.png")} /> */}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </React.Fragment>


                                        )
                                    } else {
                                        return false;
                                    }
                                })
                                : null}
                    </div>

                </div>

            </React.Fragment>
        );
    }
}