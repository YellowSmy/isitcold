import {useEffect, useState} from "react";

import {getPreviousWeather} from '../api/getWeather';

import Location from "../components/location";

function Home() {
    const [weatherData, setWeatherData] = useState([]);
    
    useEffect(() => {
        const fetchWeather = async() => {
            const data = await getPreviousWeather(108);
            setWeatherData(data.avgTa);
        }
        fetchWeather(); 
    }, []);

    return (
        <div>
            <p>{weatherData}</p>
            <Location /> 
        </div>
    )
}

export default Home