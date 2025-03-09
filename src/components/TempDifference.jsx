import React from "react";

import '../styles/TempDifference.css';

function TempDifference({type, now, previous}) {
    const diff = Math.abs(now-previous);
    const sign = Math.sign(now-previous); //작년과 비교해 오늘 -> 오늘 마

    function render(sign) {
        if(sign == -1) {
            return (
                <div>
                    <p>{type} 기온차</p>
                    <span className="low">{diff.toFixed(1)} °C</span>
                </div>); 
        } else if(sign == 1) {
            return (
                <div>
                    <p>{type} 기온차</p>
                    <span className="high">{diff.toFixed(1)} °C</span>
                </div>); 
        } else {
            return (
                <div>
                    <p>{type} 기온차</p>
                    <span className="none">{diff.toFixed(1)} °C</span>
                </div>); 
        }
    }
    return (
        render(sign)
    );
}

export default TempDifference;