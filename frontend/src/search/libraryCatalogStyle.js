import React from 'react';
export const classes = {
    col_4: 'col-xl-4 col-lg-4 col-md-6 mb-3 mb-lg-5',
    col_6: 'col-xl-6 col-lg-6 col-md-6 mb-3 mb-lg-5',
  };
  
export const LibraryCatalogStyle = React.createContext({
    style_class: classes.col_4,
    collapseSidebar: () => {
        console.log('LibraryCatalogStyle collapseSidebar',this)
    },
  });