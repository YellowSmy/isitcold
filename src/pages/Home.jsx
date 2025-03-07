import {useEffect, useState} from "react";
import useCurrentLocation from "../hooks/useCurrentLocation";

import Forcast from "../components/Forcast";
import Temperature from "../components/Temperature";

import { mapConv } from "../utils/getCoordinate";
import { getPoint } from "../utils/getPoint";


const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10, // 10 sec
};

function Home() {
    const [isLoading, setIsLoading] = useState(true);
    //coordinate update
    const { location, error } = useCurrentLocation(geolocationOptions);
    const [coordinate, setCoordinate] = useState({});
    const [point, setPoint] = useState({});

    useEffect(()=> {
        if (location.isLoading) return;

        const newCoordinate = mapConv(location.longitude, location.latitude, 0, 0, 0);
        const newPoint = getPoint(location.latitude, location.longitude);

        setCoordinate(newCoordinate);
        setPoint(newPoint);

        setIsLoading(false);
    }, [location]);

    console.log(coordinate)


    return (
        <div>
            {isLoading ? (
                <p>Loading....</p>
            ) : (
                <div>
                    <p>지역: {point.Name}</p>
                    <Temperature coordinate={coordinate} point={point}/>
                    <Forcast nx={coordinate.x} ny={coordinate.y} />
                </div>
            )}
        </div>
    )
}

export default Home