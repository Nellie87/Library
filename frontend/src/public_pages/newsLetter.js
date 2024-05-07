import React from "react";
import { Link } from "react-router-dom";
import Functions from "../helpers/functions";
const funcObj = new Functions;
export default class NewsLetter extends React.Component{

    render(){
        return (
            <React.Fragment>
                Subscribe to our Newsletter <span> <Link to="" onClick={(e) => funcObj.loadAnotherUrl(e,'https://knls.ac.ke/newsletters/','new_tab')} >Click here</Link></span>
            </React.Fragment>
        );
    }
}