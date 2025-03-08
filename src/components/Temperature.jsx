import { useEffect, useState } from "react";

import { getWeather } from "../api/getWeather";
import { getPreviousWeather } from "../api/getWeather";

import { getApparentTemp } from "../utils/getApparentTemp";

function Temperature({coordinate, point}) {
    const [Weather, setWeather] = useState(null);
    const [PreviousWeather, setPreviousWeather] = useState(null);
    const [apparentTemp, setApparentTemp] = useState({now : 0, previous : 0})

    const [isDataLoaded, setIsDataLoaded] = useState(false); 
    
    //Temp
    useEffect(() => {
        const fetch = async () => {
            const [weatherData, previousData] = await Promise.all([
                getWeather(coordinate.x, coordinate.y),
                getPreviousWeather(point.Point)
            ]);
            setWeather(weatherData);
            setPreviousWeather(previousData);
        };
        fetch();    
    }, [coordinate, point]);

    //apparent Temp 
    useEffect(() => {
        if (!PreviousWeather) return;
        setApparentTemp({
            now: getApparentTemp(Weather.T1H, Weather.REH, Weather.WSD),
            previous: getApparentTemp(PreviousWeather.avgTa, PreviousWeather.avgRhm, PreviousWeather.avgWs)
        });

        setIsDataLoaded(true); 
    }, [Weather, PreviousWeather])

    
    return (
        <div>
            {isDataLoaded ? (
                //TODO: 체감기온 fomula util로 불러오기.
                <div>
                    <p>현재 기온: {Weather.T1H} / 체감 기온: {apparentTemp.now}</p>
                    <p>작년 기온: {PreviousWeather.avgTa} / 체감 기온: {apparentTemp.previous}</p>
                    <br/>
                    <p>올해가 작년보다 {(PreviousWeather.avgTa - Weather.T1H).toFixed(1)} 차이 나요</p>
                    <p>체감기온은 올해가 작년보다 {(apparentTemp.previous - apparentTemp.now)} 차이 나요</p>
                </div>    
            ) : (
                <p>Loading....</p>
            )}
        </div>
    );
}

export default Temperature;

