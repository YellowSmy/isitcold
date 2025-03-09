import React from "react";

import { getApparentTemp } from "../utils/getApparentTemp";

import "../styles/Temperature.css"

function Temperature({type, temp, apparentTemp, error}) {
    return (
        <>
            {error ? (
                <div className="error">
                    {error.msg}
                </div>  
            ) : (
                <div className="temp-container">
                    <p className="title">{type} 기온 </p>
                    <p className="temp"> {temp}°</p> 
                    <span className="apparent">체감기온 {apparentTemp}°</span>                
                </div> 
            )}
        </>
    );
}

export default Temperature;

