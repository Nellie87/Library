
import './App.css';
import Functions from './helpers/functions';
const funcObj = new Functions();

function Customcss() {
  // let themeconfig = funcObj.getLocalStorage('themeconfig');
  // if (themeconfig.layout == 'green') {
  //  return (
  //     <link href="./assets/css/custom-green.css?v=1.0.9" rel="stylesheet" />
  //   );
  // }
  // else if (themeconfig.layout == 'red') {
  //   return (
  //      <link href="./assets/css/custom-red.css?v=1.0.9" rel="stylesheet" />
      
  //    );
  //  }
  // else{
    return (
      <link href="./assets/css/custom.css?v=1.0.9" rel="stylesheet" />
    );
  // }
}

export default Customcss;
