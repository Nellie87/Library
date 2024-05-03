import React from "react";
import { signOut } from "../GoogleAuth/authUtils";

const Header = (props) => {
  
  return (
    <React.Fragment>
    <div className="row">

    
       <div className="signout pull-right curspoint" onClick={signOut}>
       {
        window.gapi.auth2.getAuthInstance().currentUser.ee.Ys.Ve ?
        <React.Fragment>

        
        <h5>{window.gapi.auth2.getAuthInstance().currentUser.ee.Ys.Ve}</h5>
        &nbsp;<button className="btn darkBtn">
         Sign out
        </button>
        </React.Fragment>
        :
        null
       }
        
      </div>
      </div>
    </React.Fragment>
  );
};

export default Header;
