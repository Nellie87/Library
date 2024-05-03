const initAuth = () => {
  //prakashbhatnager
  //const CLIENT_ID = '462380494978-2adh0sgsjce8hn936klhh85468vpeccg.apps.googleusercontent.com';

  //prakashbhatnagr09
  const CLIENT_ID = '705978166557-br8hq4nqrb1147eugtocj6db9op48bub.apps.googleusercontent.com';
  
  
  console.log('CLIENT_ID',CLIENT_ID);
  return window.gapi.auth2.init({
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
  });
};

export const viewId = () => {

  //prakashbhatnagar09
  return '246502793';

  //prakashbhatnager
  return '223178810';
}

export const checkSignedIn = () => {
  console.log('checkSignedIn');
  return new Promise((resolve, reject) => {
    initAuth()
      .then(() => {
        const auth = window.gapi.auth2.getAuthInstance();
        resolve(auth.isSignedIn.get());
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const onSuccess = (googleUser) => {
  console.log("Logged in as: " + googleUser.getBasicProfile().getName());
};

const onFailure = (error) => {
  console.error(error);
};

export const renderButton = () => {
  console.log(' window.gapi.signin2', window.gapi.signin2);
  if(window.gapi.signin2){
    window.gapi.signin2.render("signin-button", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  }
 
};

export const signOut = () => {
  window.gapi.auth2.getAuthInstance().signOut();
};
