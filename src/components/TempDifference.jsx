import React from "react";

import '../styles/TempDifference.css';

function TempDifference({type, now, previous}) {
    const diff = Math.abs(now-previous);
    const sign = Math.sign(now-previous); //작년과 비교해 오늘 -> 오늘 마

    function render(sign) {
        if(sign == -1) {
            return (
                <div className="diff">
                    <p>{type} 기온차</p>
                    <span className="number low">{diff.toFixed(1)} °C</span>
                </div>); 
        } else if(sign == 1) {
            return (
                <div className="diff">
                    <p className="title">{type} 기온차</p>
                    <p className="number high">▲ {diff.toFixed(1)} °C</p>
                </div>); 
        } else {
            return (
                <div className="diff">
                    <p className="title">{type} 기온차</p>
                    <span className="number none">{diff.toFixed(1)} °C</span>
                </div>); 
        }
    }
    return (
        render(sign)
    );
}

export default TempDifference;