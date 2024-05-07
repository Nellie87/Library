
import './App.css';
import Functions from './helpers/functions';
import Routes from './routes';

// import BlockScreenShot from "./helpers/blockScreenshot";
const funcObj = new Functions;
funcObj.setClasses();


function App() {
  // console.log('window.location.host',window.location.host)
  // console.log('window.location.hostname',window.location.hostname)
  // console.log('host name:', funcObj.hostname());
  
  return (
    <>
    <Routes />
    {/* <BlockScreenShot /> */}
    </>
  );
}

export default App;
