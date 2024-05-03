import React, { useRef, useState, useEffect } from "react"
import {
  ReactReader,
  ReactReaderStyle
} from "react-reader"

const ownStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: 'red'
  }
}


function PlayEpub(props){
console.log('epub file:',props.file_name)

const [size, setSize] = useState(100)

const changeSize = (newSize) => {
  setSize(newSize)
}
useEffect(() => {
  console.log('useEffect')
  if (renditionRef.current) {
    renditionRef.current.themes.fontSize(`${size}%`)
  }
}, [size])


    const viewerRef = useRef(null);
    const [page, setPage] = useState('')
  const renditionRef = useRef(null)
  const tocRef = useRef(null)
  const locationChanged = (epubcifi) => {
    console.log('locationChanged',epubcifi)
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start
      console.log('displayed',displayed)
      const chapter = tocRef.current.find((item) => item.href === href)
      setPage(`Page ${displayed.page} of ${displayed.total} in chapter ${chapter ? chapter.label : 'n/a'}`)
    }
  }
  return (
    
    <>
      <div style={{ height: "100vh" }}>
        <ReactReader
          locationChanged={locationChanged}
          url={props.file_name}
          // getRendition={(rendition) => renditionRef.current = rendition}


    getRendition={(rendition) => {
       
          rendition.themes.register('custom', {
            // img: {
            //   border: '1px solid red'
            // },
            // p: {
            //   border: '1px solid green'
            // }
          })
          rendition.themes.select('custom')
          renditionRef.current = rendition
        }}

          tocChanged={toc => viewerRef.current = toc}
          swipeable={true}
          styles={ownStyles}
        />
      </div>
      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', left: '1rem', textAlign: 'center', zIndex: 1}}>
        {page}
      </div>
      {/* <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', left: '1rem', textAlign: 'center', zIndex: 1}}>
        
        <span>Current size {size}%</span>
        

        &nbsp; Scale &nbsp;<input  className="btn addCart py-1 px-3 mr-1"  type="range" id="vol" name="vol" min="80" max="130" defaultValue={size} onInput={(e) => changeSize(e.target.value)} onChange={(e) => changeSize(e.target.value)} />
      </div> */}
    </>
  );
}
export default PlayEpub;