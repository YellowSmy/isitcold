import {useEffect, useState} from "react";

import {getPreviousWeather} from '../api/getWeather';

function Home() {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const fetchWeather = async() => {
            const data = await getPreviousWeather(108);
            setWeatherData(data);
        }

        fetchWeather();
    }, []);

    return (
        <div>
            <p>{weatherData}</p>
        </div>
    )
}

export default Home