import axios from "axios";

import { getDate } from "../utils/getDate";

const NOW_SERVICE_KEY = import.meta.env.VITE_FCST_SERVICE_KEY;
const ASOS_SERVICE_KEY = import.meta.env.VITE_ASOS_SERVICE_KEY;
 

// 현재 정보 조회
// Return Value: 기온/풍속
// 초단기 실황 정보가 정시 40분에 생성됨. 따라서 그에 상응하는 코드 필요
export const getWeather = async(x, y) => {
  const update_time = Array.from({length:24}, (_, i) => i * 100 + 40);
  const date = getDate(update_time);

  //request
  const URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst" 
    + `?serviceKey=${NOW_SERVICE_KEY}`
    + "&dataType=JSON&numOfRows=10&pageNo=1"
    + `&base_date=${date.base_date}&base_time=${date.base_time}`
    + `&nx=${x}&ny=${y}`;

  try{
    const {data} = await axios.get(URL);

    //Error
    if (data?.response?.header?.resultCode != "00") {
      return {
        error: true,
        code: data.response.header.resultMsg,
        msg: "잠시 후 다시 시도해주세요."
      };
    }
    
    //filter
    const item = data.response.body.items.item;
    const filteredData = item.filter(item => item.category === "T1H" || item.category === "REH" || item.category === "WSD");
    const result = filteredData.reduce((acc, curr) => {
      acc[curr.category] = curr.obsrValue;
      return acc;
    }, {});

  return result;

  } catch (e) { 
    //Response Error
    return {
      error: true,
      code: e.message || "UNKNOWN_ERROR",
      msg: "서버 통신 중 문제가 발생했습니다."
    };
  }
};


//단기 날씨 예보
// Return Value: 최저/최고/1시간 기온, 강수확률/형태, 강수/적설량, 습도, 풍속
export const getDayForcast = async(x, y) => {
  const update_time = Array.from({length:8}, (_, i) => 300*i + 210);
  const date = getDate(update_time);

    const URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst" 
            + `?serviceKey=${NOW_SERVICE_KEY}`
            + "&dataType=JSON&numOfRows=1000&pageNo=1"
            + `&base_date=${date.base_date}&base_time=${date.base_time}`
            + `&nx=${x}&ny=${y}`;
    
    try{
      const {data} = await axios.get(URL);

      //API Error
      if (data?.response?.header?.resultCode != "00") {
        return {
          error: true,
          code: data.response.header.resultMsg,
          msg: "잠시 후 다시 시도해주세요."
        };
      }
      
      //filter
      const rawData = data.response.body.items.item;
      const categories = ['SKY', 'TMP', 'TMN', 'TMX', 'POP', 'PCP', 'PTY', 'SNO', 'REH', 'WSD'];
      const result = rawData.reduce((acc, curr) => {
          const { fcstTime, category, fcstValue } = curr;        
          
          if (categories.includes(category)) {
            if (!acc[fcstTime]) {
              acc[fcstTime] = {};
            }
            acc[fcstTime][category] = fcstValue;
          }
          return acc;
        }, {});

      return result;

    } catch (e) { 
      //Response Error
      return {
        error: true,
        code: e.message || "UNKNOWN_ERROR",
        msg: "서버 통신 중 문제가 발생했습니다."
      };
    } 
}


// 작년 오늘 기온 정보
// Return Value: 위치, 날짜, 평균/최저/최고 기온, 평균 풍속
// 윤년은 28일 정보로 통일.
export const getPreviousWeather = async(region) => {
  const last_date = getDate();

  //request
  const URL = "http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList" 
          + `?serviceKey=${ASOS_SERVICE_KEY}`
          + "&dataType=JSON"
          + "&numOfRows=1&pageNo=1&dataCd=ASOS&dateCd=DAY"
          + `&startDt=${last_date.last_base_year}&endDt=${last_date.last_base_year}`
          + `&stnIds=${region}`;

  try {
    const {data} = await axios.get(URL);

    //Error
    if (data?.response?.header?.resultCode != "00") {
      return {
        error: true,
        code: data.response.header.resultMsg,
        msg: "잠시 후 다시 시도해주세요."
      };
    }

    //fiter
    const item = data.response.body.items.item;
    const rawData = item[0];
    
    const result = {};
    const categories = ['stnNm', 'tm', 'avgTa', 'minTa', 'maxTa', 'avgWs', 'avgRhm']; 

    categories.forEach(category => {
        if(rawData.hasOwnProperty(category)) {
            result[category] = rawData[category];
        }});

    return result;

  } catch (e) { 
    //Response Error
    return {
      error: true,
      code: e.message || "UNKNOWN_ERROR",
      msg: "서버 통신 중 문제가 발생했습니다."
    };
  } 
}