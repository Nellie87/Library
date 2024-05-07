import React, { useState } from "react";
  
export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    let item = 'col_4';
    if(document.getElementById('sidebar') && document.getElementById('sidebar').classList.contains('active')){
        item = 'col_6';
    }
    const [items, setItems] = useState(item);
  
    return (
        <Context.Provider value={{ items, setItems }}>
            {children}
        </Context.Provider>
    );
};