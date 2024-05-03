import React, { useState, useEffect } from "react";
import { renderButton, checkSignedIn,viewId } from "../GoogleAuth/authUtils";
import * as serviceWorker from '../serviceWorker';
import GADashboard from "../GADashboard/dashboard";
function GA() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const updateSignin = (signedIn) => {
    console.log('updateSignin');
    setIsSignedIn(signedIn);
    if (!signedIn) {
      renderButton();
    }
  };

  const init = () => {
    console.log('init ga');
    checkSignedIn()
      .then((signedIn) => {
        console.log('calling updateSignin',signedIn);
        updateSignin(signedIn);
        
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignin);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    window.gapi.load("auth2", init);
  });

  return (
    <div className="App">
      {!isSignedIn ? (
        <>
          <h5>Google Analytics Dashboard</h5>
    
            <div id="signin-button"></div>
         
       
        </>
      ) : (
        <GADashboard isSignedIn={isSignedIn} viewId={viewId()} />
      )}
    </div>
  );
}
serviceWorker.unregister();
export default GA;
