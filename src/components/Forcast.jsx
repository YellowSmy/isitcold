import { useEffect, useState } from "react";

import { getDayForcast } from "../api/getWeather";

const codeSKY = { 1: "맑음", 3: "구름없음", 4: "흐림" };
const codePTY = { 0: " ", 1: "(비)", 2: "(비/눈)",3: "(눈)", 4: "(소나기)" };


function Forcast({nx, ny}) {
    const [forcastData, setForcastData] = useState(null);
    const [timeOrder, setTimeOrder] = useState(null);

    const [forcastError, setForcastError] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false); 

    useEffect(() => {
        const fetchForcast = async () => {
            const data = await getDayForcast(nx, ny);
            
            if(data.error) {
                setForcastError({code: data.code, msg: data.msg});
            }
            
            setForcastData(data);
        };
        fetchForcast();
    }, [nx, ny]);

    //forcast parsing
    useEffect(() => {
        if(!forcastData) return;
        const sortedKeys = Object.keys(forcastData).sort((a, b) => {
             return Number(a) - Number(b);});

        setTimeOrder(sortedKeys);
        setIsDataLoaded(true); 
    }, [forcastData])

    //render function
    function forcastDisplay(order, data) {
        let result = [];

        for(let i=0; i<order.length; i++) {
            const time = order[i]
            result.push(
                <div key={time}>
                    <p>{time}시</p>
                    <p>날씨: {[data[time].SKY].map(code => codeSKY[code])} <br/>
                       기온: {data[time].TMP} <br/>
                       강수확률: {data[time].POP} {[data[time].PTY].map(code => codePTY[code])}%
                       강수량: {data[time].PCP}  적설량: {data[time.SNO]}
                    </p>
                    <br/><br/>
                </div>
            );
        }
        return result;
    }

    return (
        <div>
            {isDataLoaded ? (
                forcastDisplay(timeOrder,forcastData)
            ) : (
                <p>Loading....</p>
            )}

            {/*Error Example*/}
            {forcastError ? <p>{forcastError.msg}</p> : null}
        </div>
    );
}

export default Forcast;