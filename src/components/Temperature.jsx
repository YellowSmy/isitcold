import { useEffect, useState } from "react";

import { getWeather } from "../api/getWeather";
import { getPreviousWeather } from "../api/getWeather";

import { getApparentTemp } from "../utils/getApparentTemp";

function Temperature({coordinate, point}) {
    const [weather, setWeather] = useState(null);
    const [previousWeather, setPreviousWeather] = useState(null);
    const [apparentTemp, setApparentTemp] = useState({now : 0, previous : 0})

    const [weatherError, setWeatherError] = useState(null);
    const [PWeatherError, setPWeatherError] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false); 
    
    //Temp
    useEffect(() => {
        const fetch = async () => {
            const [weatherData, previousData] = await Promise.all([
                getWeather(coordinate.x, coordinate.y),
                getPreviousWeather(point.Point)
            ]);

            if(weatherData.error) {
                setWeatherError({code: weatherData.code, msg: weatherData.msg});
            } else if(previousData.error) {
                setPWeatherError({code: previousData.code, msg: previousData.msg});
            }


            setWeather(weatherData);
            setPreviousWeather(previousData);
        };
        fetch();    
    }, [coordinate, point]);

    //apparent Temp 
    useEffect(() => {
        if (!previousWeather) return;
        setApparentTemp({
            now: getApparentTemp(weather.T1H, weather.REH, weather.WSD),
            previous: getApparentTemp(previousWeather.avgTa, previousWeather.avgRhm, previousWeather.avgWs)
        });

        setIsDataLoaded(true); 
    }, [weather, previousWeather])
  
    return (
        <div>
            {isDataLoaded ? (
                <div>
                    <span>현재 기온: {weather.T1H} / 작년 기온: {previousWeather.avgTa} </span>
                    <p>올해가 작년보다 {(previousWeather.avgTa - weather.T1H).toFixed(1)} 차이 나요</p>
                    <br/>
                    <span>체감 기온: {apparentTemp.now} / 체감 기온: {apparentTemp.previous}</span>                
                    <p>체감기온은 올해가 작년보다 {(apparentTemp.previous - apparentTemp.now).toFixed(1)} 차이 나요</p>
                </div>    
            ) : (
                <p>Loading....</p>
            )}

            {/*Error Example*/}
            {weatherError ? <p>{weatherError.msg}</p> : null}
            {PWeatherError ? <p>{PWeatherError.msg}</p> : null}
        </div>
    );
}

export default Temperature;

