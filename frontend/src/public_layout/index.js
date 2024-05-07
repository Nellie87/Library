import React from "react";
import Functions from "../helpers/functions";
import PublicHeader from "./header";
import PublicFooter from "./footer";
const funcObj = new Functions();

const AUTH_USER = funcObj.getAuthUser();
function PublicLayout({
    maincontent: MainContent,
}) {



    return (
        <React.Fragment>
            {/* 
            <div className="search_container">
                <div className="container">
                    <div className="search_wrap pb-1 rounded-0 mt-0 clearfix px-3 pt-3"> 
                    */}
                        <PublicHeader />
                        <div className="content-area">
                        <MainContent />
                        </div>
                    {/* </div>
                </div>
            </div> */}

            <PublicFooter />

        </React.Fragment>
    );
}
export default PublicLayout;
