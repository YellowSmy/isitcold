import { useEffect, useState } from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";

import { getDayForcast } from "../api/getWeather";
import { mapConv } from "../utils/getCoordinate";

const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10, // 10 sec
};

function Location() {
    const { location, error } = useCurrentLocation(geolocationOptions);
    const [ForcastData, setForcastData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false); 

    useEffect(() => {
        if (location.isLoading) return;
        const coordinate = mapConv(location.longitude, location.latitude, 0, 0, 0);

        const fetchForcast = async () => {
            const data = await getDayForcast(coordinate.x, coordinate.y);
            setForcastData(data);
            setIsDataLoaded(true); 
        };
        fetchForcast();
    }, [location]);

    return (
        <div>
            {location ? (
                <p>
                    Lat: {location.latitude}
                    lng: {location.longitude}
                </p>
            ) : (
                <p>Loading location... </p>
            )}

            {error && <p>{error}</p>}

            {isDataLoaded ? (
                <p>PCP: {ForcastData["0000"].PCP}</p>
            ) : (
                <p>Loading....</p>
            )}
        </div>
    );
}

export default Location;