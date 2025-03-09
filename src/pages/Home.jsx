import {useEffect, useState} from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";

import Temperature from "../components/Temperature";
import TempDifference from "../components/TempDifference";
import Forcast from "../components/Forcast";

import {getWeather, getPreviousWeather, getDayForcast} from "../api/getWeather"

import { mapConv } from "../utils/getCoordinate";
import { getPoint } from "../utils/getPoint";
import { getApparentTemp } from "../utils/getApparentTemp";

import '../styles/Home.css'

//constant
const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10, // 10 sec
};


function Home() {
    //load
    const [isLoading, setIsLoading] = useState(true);

    //coordinate
    const { location } = useCurrentLocation(geolocationOptions); // hook call
    const [locationData, setLocationData] = useState({
        location: null,
        coordinate: null,
        point: null,
    });

    //weather
    const [weatherInfo, setWeatherInfo] = useState({
        weather: { data: null, error: null },
        previousWeather: { data: null, error: null },
        forcast: { data: null, error: null }
    });

    //Coordinate convert
    useEffect(()=> {
        if (location.isLoading) return;     

        const newCoordinate = mapConv(location.longitude, location.latitude, 0, 0, 0);
        const newPoint = getPoint(location.latitude, location.longitude);

        setLocationData({
            location: location,
            coordinate: newCoordinate,
            point: newPoint,
        });
    }, [location]);

    //API CALL
    useEffect(() => {
        if (!locationData.coordinate || !locationData.point.Point) return;

         const fetch =  async () => {
            const [weatherRes, previousRes, forcastRes] = await Promise.all([
                getWeather(locationData.coordinate.x, locationData.coordinate.y),
                getPreviousWeather(locationData.point.Point),
                getDayForcast(locationData.coordinate.x, locationData.coordinate.y),
            ]);

            //Error
            setWeatherInfo({
                weather: weatherRes.error 
                    ? { data: null, error: { code: weatherRes.code, msg: weatherRes.msg } } 
                    : { data: weatherRes, error: null },
                previousWeather: previousRes.error 
                    ? { data: null, error: { code: previousRes.code, msg: previousRes.msg } } 
                    : { data: previousRes, error: null },
                forcast: forcastRes.error 
                    ? { data: null, error: { code: forcastRes.code, msg: forcastRes.msg } }
                    : { data: forcastRes, error: null }
            });

            setIsLoading(false);
        }
        fetch();

    }, [locationData]);

    //destructuring
    const { T1H, REH, WSD } = weatherInfo.weather.data || {};
    const { avgTa, avgRhm, avgWs } = weatherInfo.previousWeather.data || {};
    const { data: forcastData } = weatherInfo.forcast || {};

    return (
        <section className="container">
            {isLoading ? (
                <p>Loading....</p>
            ) : (
                <section className="weather-container">
                    <p>지역: {locationData.point.Name}</p>
                    <Temperature type={"현재"} temp={T1H} 
                                apparentTemp={getApparentTemp(T1H, REH, WSD)}            
                                error={weatherInfo.weather.error}  />

                    <Temperature type={"과거"} temp={avgTa}
                                apparentTemp={getApparentTemp(avgTa, avgRhm, avgWs)} 
                                error={weatherInfo.previousWeather.error}  />

                    <TempDifference type={null} now={T1H} previous={avgTa} />
                    <TempDifference type={"체감온도"} now={getApparentTemp(T1H, REH, WSD)} 
                                    previous={getApparentTemp(avgTa, avgRhm, avgWs)} />

                    <Forcast forcastData={forcastData} error={weatherInfo.forcast.error}/>
                </section>
            )}
        </section>
    );
}

export default Home
    
