import React, { useContext, useState } from "react";
import Functions from "../helpers/functions";
import { Context } from "../helpers/MyContext";
import Pagination from 'react-js-pagination';
const funcObj = new Functions();
const AUTH_USER = funcObj.getAuthUser();
function CatalogCards(props) {
    
    const { items, setItems } = useContext(Context);
 
    const classes = {
        col_4: 'col-xl-4 col-lg-4 col-md-6 mb-3 mb-lg-5',
        col_6: 'col-xl-6 col-lg-6 col-md-6 mb-3 mb-lg-5',
      };
    let box_style_class = classes[items];
    
    return (
        <React.Fragment>
            <div key={props.index} className={box_style_class}>
            {funcObj.catalogCardBox(props.content)}
            </div>
            
        </React.Fragment>
        
    );
}
  
export default CatalogCards;