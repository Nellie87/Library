import React, { useContext } from "react";
import { Context } from "../helpers/MyContext";
  
function ToggleIcon() {
    const { items, setItems } = useContext(Context);
      
    const clickHandler = () => {
        let item = 'col_4';
        if(document.getElementById('sidebar') && document.getElementById('sidebar').classList.contains('active')){
            item = 'col_6';
        }
        setItems(item);
    };
  
      
    return (
        <a className="nav-link " id="sidebarCollapse" onClick={clickHandler}>
        <div className="my-toggl-icon">
            <span className="bar1"></span>
            <span className="bar2"></span>
            <span className="bar3"></span>
        </div>
    </a>
    );
}
  
export default ToggleIcon;