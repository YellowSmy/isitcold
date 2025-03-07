import { useEffect, useState } from "react";

import { getDayForcast } from "../api/getWeather";


function Forcast({nx, ny}) {
    const [ForcastData, setForcastData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false); 

    useEffect(() => {
        const fetchForcast = async () => {
            const data = await getDayForcast(nx, ny);
            setForcastData(data);
            setIsDataLoaded(true); 
        };
        fetchForcast();
    }, [nx, ny]);

    return (
        <div>
            {isDataLoaded ? (
                <p>PCP: {ForcastData["0000"].PCP}</p>
            ) : (
                <p>Loading....</p>
            )}
        </div>
    );
}

export default Forcast;