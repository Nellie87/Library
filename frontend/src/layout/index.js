import React from "react";
import Functions from "../helpers/functions";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";

const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
const sidebarObj = new Sidebar();
const footerObj = new Footer();
function Layout({
    maincontent: MainContent,
}) {
    
    //If route permission not allow then block route
    let pathname = funcObj.get_pathname();
    if(funcObj.is_route_allowed(pathname) == 1){
        return false;
    }


    return (

        <div className="page">
         
            <div className="page-main">
            
                {/* Header Menu Area Start  */}
                <div className="header">
                    <Header />
                </div>

                { /* Header Menu Area End */}
                <div className="wrapper">
                    { /* Side Menu Area Start */}

                    <nav id="sidebar" className="nav-sidebar">
                        <ul className="list-unstyled components" id="accordion">
                            {sidebarObj.html()}
                        </ul>

                    </nav>


                    { /* Main Content Area Start */}
                    <div className="content-area">
                        <MainContent />
                    </div>
                    { /* Main Content Area End */}

                </div>
                {footerObj.html()}
            </div>
        </div>



    );
}
export default Layout;
