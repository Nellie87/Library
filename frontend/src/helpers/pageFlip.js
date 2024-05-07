import HTMLFlipBook from 'react-pageflip';
import React, { useState, useRef } from 'react';

const PageCover = React.forwardRef((props, ref) => {
    return (
      <div className="page page-cover" ref={ref} data-density="hard">
        <div className="page-content">
          <h2>{props.children}</h2>
        </div>
      </div>
    );
  });
  
  const Page = React.forwardRef((props, ref) => {
    return (
      <div className="page" ref={ref}>
        <div className="page-content">
          <h2 className="page-header">Page header - {props.number}</h2>
          <div className="page-image"></div>
          <div className="page-text">{props.children}</div>
          <div className="page-footer">{props.number + 1}</div>
        </div>
      </div>
    );
  });
  
  

export default function PageFlip(props) {
    const book = useRef(props.file_name);
    return (
        <>
        <button onClick={() =>
            book.current.pageFlip().flipNext()}>Next page</button>

        <HTMLFlipBook ref={book} width={600} height={800}>
         <PageCover>BOOK TITLE</PageCover>
         <Page number="1">
         
         <h1>test</h1><p>hellow world</p>
         Page text1</Page>
        <Page number="2">Page text2</Page>
        <Page number="3">Page text3</Page>
        <Page number="4">Page text4</Page>
        <Page number="5">Page text5</Page>
        <Page number="6">Page text6</Page>
            <PageCover>THE END</PageCover>

      </HTMLFlipBook>
      </>
    );
}