import React, { useEffect } from 'react';

export default function BlockScreenShot(){  
  useEffect(() => {
    window.addEventListener('keyup', blockSs);
  });
  useEffect(() => {
    return () => {
      window.removeEventListener('keyup', blockSs);
    };
  }, []);

  function blockSs(e) {
    console.log('blockSs e',e)
    console.log('e.key',e.key)
     if (e.key == 'PrintScreen' || e.keyCode == 44) {
        console.log('Screenshots disabled component!');
        var aux = document.createElement("input");
        aux.setAttribute("value", "print screen disabled!");      
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        // Remove it from the body
        document.body.removeChild(aux);
        navigator.clipboard.writeText('');
     }
  }


  return (<></>)
}