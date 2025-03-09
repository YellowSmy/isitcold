import React from "react";

import Forcast from "../components/Forcast";

function Weather() {

    return (
        <Forcast forcastData={forcastData} error={weatherInfo.forcast.error}/>
    );
}

export default Weather;