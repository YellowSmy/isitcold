import { useState, useEffect } from "react";

export function useCurrentLocation (options) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    isLoading: true,
  });
  const [error, setError] = useState('');

  const handleSuccess = (pos) => {
    const {latitude, longitude} = pos.coords;
    setLocation({
      latitude,
      longitude,
      isLoading: false,
    });
  };

  const handleError = (err) => {
    setError(err.message);
    setLocation((prev) => ({...prev, isLoading:false }));
  };

  useEffect(() => {
    if(!navigator.geolocation) {
      setError("Geolocation is not supported.");
      setLocation((prev) => ({...prev, isLoading:false }));
      return;
    }

    const watcher = navigator.geolocation.getCurrentPosition(
      handleSuccess, handleError, options
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [options]);

  return { location, error };
}
  
  export default useCurrentLocation;