import { useEffect, useState } from "react";
import CityForm from "../components/CityForm";

import { mapConv } from "../utils/getCoordinate";

export default function Compare() {
    //input
        const [cityInput, setCityInput] = useState(() => ({
            name: "서울", 
            lat: 37.5714, 
            lon: 126.9658,
            point: 108,
        }));

    useEffect(() => {
        if (!cityInput) return;
        let latitude = cityInput.lat; let longitude = cityInput.lon;
        console.log(latitude, typeof(latitude));
        console.log(longitude, typeof(longitude));
        console.log(mapConv(latitude, longitude,0,0,0));
    }, [cityInput])

    

    return (
    <>
        <CityForm cityInput={cityInput} setCityInput={setCityInput}/> 
    </>
    );
} 
