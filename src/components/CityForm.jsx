import cities from '../data/ASOSPoint.json';

export default function CityForm({ cityInput, setCityInput }) {
  const defaultCity = {"Point":108, "Name":"서울", "lat":37.5714, "lon":126.9658}; 

  function handleChange(e) {
    const selectedCity = JSON.parse(e.target.value); 
    setCityInput(selectedCity);
  }

  const defaultCityValue = JSON.stringify(defaultCity);

  return (
    <select value={JSON.stringify(cityInput) || defaultCityValue} onChange={handleChange}>

      <option value={defaultCityValue}>서울</option>
      
      {cities
        .filter(city => city.Point !== 108)
        .map((city) => (
          <option key={city.Point} value={JSON.stringify({name:city.Name, lat: city.latitude, lon: city.longitude, point:city.Point })}>
            {city.Name}
          </option>
        ))}
    </select>
  );
}