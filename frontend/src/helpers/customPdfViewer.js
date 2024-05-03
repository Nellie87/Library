import React from "react";
import Functions from "./functions";

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
export default class CustomPdfViewer extends React.Component {
    componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js?v=512";
        script.async = true;
 
      
        document.body.appendChild(script);
      }
      scriptLoaded() {
        // window.A.sort();
      }
    render(){
        return (<>
            Hello world
        </>);
        
    }
}