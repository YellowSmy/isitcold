import axios from "axios";

const NOW_SERVICE_KEY = import.meta.env.VITE_FCST_SERVICE_KEY;
const ASOS_SERVICE_KEY = import.meta.env.VITE_ASOS_SERVICE_KEY;

//Date Function
function getDate(updateTime) {
  const today = new Date();
  const current_time = (today.getHours()*100) + today.getMinutes();
  
  let base_date, last_base_year, base_time;

  if(updateTime != undefined) {
    //update time
    base_time =  updateTime.reduce((update_time, time) => { // 누적값, 현재값
      return (Math.abs(update_time-current_time) < Math.abs(time-current_time) ? update_time : time);
    }, updateTime[0]);

    // month & year change setting
    if (current_time < updateTime[0]) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate()-1);
    
      base_date = yesterday.getFullYear().toString()
                + (yesterday.getMonth()+1).toString().padStart(2, "0") 
                + yesterday.getDate().toString().padStart(2, "0");
      base_time = updateTime[updateTime.length - 1];
    }

    //String invert for API protocol
    base_date = today.getFullYear().toString() 
                    + (today.getMonth()+1).toString().padStart(2, "0") 
                    + today.getDate().toString().padStart(2, "0");
    base_time = base_time.toString().padStart(4, '0');
  }

  //last year for ASOS information
  const last_year = new Date(today);
  last_year.setFullYear(last_year.getFullYear()-1);
  last_base_year = last_year.getFullYear().toString() 
                  + (last_year.getMonth()+1).toString().padStart(2, "0") 
                  + last_year.getDate().toString().padStart(2, "0");

  return {"base_date":base_date, "base_time": base_time, "last_base_year": last_base_year};
} 

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

  const {data: {response: {body: {items: {item}}}}} = await axios.get(URL);

  const filteredData = item.filter(item => item.category === "T1H" || item.category === "WSD");
  const result = filteredData.reduce((acc, curr) => {
      acc[curr.category] = curr.obsrValue;
      return acc;
  }, {});

  return result;
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
    const {data: {response: {body: {items: {item: rawData}}}}} = await axios.get(URL);
    
    //filter
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
  const {data: {response: {body: {items: {item}}}}} = await axios.get(URL);
  const rawData = item[0];

  //fiter
  const result = {};
  const categories = ['stnNm', 'tm', 'avgTa', 'minTa', 'maxTa', 'avgWs']; 

  categories.forEach(category => {
      if(rawData.hasOwnProperty(category)) {
          result[category] = rawData[category];
      }});

  return result;
}