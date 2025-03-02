import axios from "axios";

const NOW_SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY;
const ASOS_SERVICE_KEY = import.meta.env.VITE_ASOS_SERVICE_KEY;

const getPresentWeather = async(region) => {
    
};

export const getPreviousWeather = async(region) => {
    let URL = "http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList" 
            + `?serviceKey=${ASOS_SERVICE_KEY}`
            + "&dataType=JSON"
            + "&numOfRows=10&pageNo=1&dataCd=ASOS&dateCd=DAY"
            + "&startDt=20100101&endDt=20100102"
            + `&stnIds=${region}`

    //console.log(Object.keys(data.data.response.body.items.item));
    const {data: {response: {body: {items: {item}}}}} = await axios.get(URL);

    return item[0].stnId;
};

//test
//getPreviousWeather(108);