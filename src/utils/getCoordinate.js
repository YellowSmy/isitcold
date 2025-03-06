// constant
const NX = 149;  // X축 격자점 수
const NY = 253;  // Y축 격자점 수
 
const map = {
    Re: 6371.00877,  // 지도반경 (km)
    grid: 5.0,  // 격자 간격 (km)
    slat1: 30.0,  // 표준 위도 1 (degree)
    slat2: 60.0,  // 표준 위도 2 (degree)
    olon: 126.0,  // 기준점 경도 (degree)
    olat: 38.0,  // 기준점 위도 (degree)
    xo: 210 / 5.0,  // 기준점 X좌표
    yo: 675 / 5.0,  // 기준점 Y좌표
    first: 0
};


// Lambert Conformal Conic Projection
function lamcproj(lon, lat, x, y, code, map) {
    let PI = Math.asin(1.0) * 2.0;
    let DEGRAD = PI / 180.0;
    let RADDEG = 180.0 / PI;

    let re = map.Re / map.grid;
    let slat1 = map.slat1 * DEGRAD;
    let slat2 = map.slat2 * DEGRAD;
    let olon = map.olon * DEGRAD;
    let olat = map.olat * DEGRAD;

    let sn, sf, ro, ra, theta, xn, yn, alon, alat;

    if (map.first === 0) {
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(Math.tan(PI * 0.25 + slat2 * 0.5) / Math.tan(PI * 0.25 + slat1 * 0.5));
        sf = Math.pow(Math.tan(PI * 0.25 + slat1 * 0.5), sn) * Math.cos(slat1) / sn;
        ro = Math.tan(PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        map.first = 1;
    }

    if (code === 0) {
        // 위경도 -> 격자좌표 (X, Y)
        ra = Math.tan(PI * 0.25 + lat * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        theta = lon * DEGRAD - olon;
        if (theta > PI) theta -= 2.0 * PI;
        if (theta < -PI) theta += 2.0 * PI;
        theta *= sn;
        x = ra * Math.sin(theta) + map.xo;
        y = ro - ra * Math.cos(theta) + map.yo;
    } else {
        // 격자좌표 (X, Y) -> 위경도
        xn = x - map.xo;
        yn = ro - y + map.yo;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) ra = -ra;
        alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - PI * 0.5;
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        } else {
            if (Math.abs(yn) <= 0.0) {
                theta = PI * 0.5;
                if (xn < 0.0) theta = -theta;
            } else {
                theta = Math.atan2(xn, yn);
            }
        }
        alon = theta / sn + olon;
        lat = alat * RADDEG;
        lon = alon * RADDEG;
    }

    return { lon, lat, x, y };
}


// 좌표 변환 함수
export function mapConv(lon, lat, x, y, code) {
    if (code === 0) {
        // 위경도 -> 격자좌표
        let { x: newX, y: newY } = lamcproj(lon, lat, x, y, 0, map);
        x = Math.floor(newX + 1.5);
        y = Math.floor(newY + 1.5);
    } else {
        // 격자좌표 -> 위경도
        let { lon: newLon, lat: newLat } = lamcproj(lon, lat, x, y, 1, map);
        lon = newLon;
        lat = newLat;
    }
    return { lon, lat, x, y };
}