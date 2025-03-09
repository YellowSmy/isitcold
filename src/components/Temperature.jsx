import React from "react";

import { getApparentTemp } from "../utils/getApparentTemp";

function Temperature({type, temp, apparentTemp, error}) {
    return (
        <div>
            {error ? (
                <div>
                    {error.msg}
                </div>  
            ) : (
                <div>
                    <span>{type}기온: {temp} °C</span> / <span>{type} 체감 기온: {apparentTemp} °C</span>                
                </div> 
            )}
        </div>
    );
}

export default Temperature;

