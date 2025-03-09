import React from "react";

const codeSKY = { 1: "맑음", 3: "구름없음", 4: "흐림" };
const codePTY = { 0: " ", 1: "(비)", 2: "(비/눈)",3: "(눈)", 4: "(소나기)" };


function Forcast({forcastData, error}) {
    //render function
    function forcastDisplay(data) {
        let result = [];
        const order = Object.keys(data).sort((a, b) => {
            return Number(a) - Number(b);});

        for(let i=0; i<order.length; i++) {
            const time = order[i]
            result.push(
                <div key={time}>
                    <p>{time.slice(0,2)}시</p>
                    <p>{[data[time].SKY].map(code => codeSKY[code])} <br/>
                       {data[time].TMP} °C
                       <br/>
                       {data[time].POP && <span>강수확률: {data[time].POP} %</span> } 
                       {data[time].PTY != 0 && <span>({[data[time].PTY].map(code => codePTY[code])})</span>}
                       <br/>
                       {(data[time].PCP != "강수없음" && data[time].PCP != "0")
                        && <span>강수량: {data[time].PCP}</span>} 

                       {(data[time].SNO != "적설없음" && data[time].SNO != "0") 
                        && <span>적설량: {data[time.SNO]}</span>}
                        
                    </p>
                    <br/><br/>
                </div>
            );
        }
        return result;
    }

    return (
        <div>
            {error ? (
                <p>{error.msg}</p> 
            ) : (
                forcastDisplay(forcastData)
            )}        
        </div>
    );
}

export default Forcast;