import { useEffect, useState } from "react";

import { getWeather } from "../api/getWeather";
import { getPreviousWeather } from "../api/getWeather";




function Temperature({coordinate, point}) {
    const [Weather, setWeather] = useState({});
    const [PreviousWeather, setPreviousWeather] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false); 
    
    useEffect(() => {
        const fetchWeather = async () => {
            const data = await getWeather(coordinate.x, coordinate.y);
            setWeather(data);
        };
        const fetchPreviousWeather = async () => {
            const data = await getPreviousWeather(point.Point);
            setPreviousWeather(data);
        };
        fetchWeather(); fetchPreviousWeather();
        setIsDataLoaded(true);     
    }, [coordinate, point]);

    console.log(Weather.T1H)
    console.log(PreviousWeather)

    return (
        <div>
            {isDataLoaded ? (
                //TODO: 체감기온 fomula util로 불러오기.
                <div>
                    <p>현재 기온: {Weather.T1H} 체감 기온: 0.0</p>
                    <p>작년 기온: {PreviousWeather.avgTa} 체감 기온: 0.0</p>
                </div>    
            ) : (
                <p>Loading....</p>
            )}
        </div>
    );
}

export default Temperature;