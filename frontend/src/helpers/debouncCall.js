import React, { useState, useEffect } from "react";
export default function DebounceCall(){

    const [pinCode, setPinCode] = React.useState("");
    const callFunc = ()=>{
        console.log('callFunc called');
    }
    useEffect(() => {
        const getData = setTimeout(() => {
         callFunc()
        }, 2000)
        return () => clearTimeout(getData)
    }, [pinCode])


}