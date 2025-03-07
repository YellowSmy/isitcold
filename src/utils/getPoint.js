import PointData from '../data/ASOSPoint.json' with { type: "json" };


export function getPoint(lat,lon) {
    let nearestCity = null;
    let minDistance = Infinity;

    PointData.forEach(point => {
        const distance = Math.sqrt((point.latitude - lat) ** 2 + (point.longitude - lon) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = point;
        }});
    
    return nearestCity;
}