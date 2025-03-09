//Date Function
export function getDate(updateTimes) {
    const today = new Date();
    const current_time = (today.getHours()*100) + today.getMinutes();
    
    let base_date, last_base_year, base_time;
  
    if(updateTimes != undefined) {
      //block future time
      const pastTimes = updateTimes.filter(time => (time <= current_time));

      //update time
      base_time =  pastTimes.reduce((update_time, time) => { // 누적값, 현재값
        return (Math.abs(update_time-current_time) < Math.abs(time-current_time) ? update_time : time);
      }, updateTimes[0]);
  
      // month & year change setting
      if (current_time < updateTimes[0]) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate()-1);
      
        base_date = yesterday.getFullYear().toString()
                  + (yesterday.getMonth()+1).toString().padStart(2, "0") 
                  + yesterday.getDate().toString().padStart(2, "0");
        base_time = updateTimes[updateTimes.length - 1];
      }
      else {
        //String invert for API protocol
        base_date = today.getFullYear().toString() 
        + (today.getMonth()+1).toString().padStart(2, "0") 
        + today.getDate().toString().padStart(2, "0");
        base_time = base_time.toString().padStart(4, '0');
      }
    }
  
    //last year for ASOS information
    const last_year = new Date(today);
    last_year.setFullYear(last_year.getFullYear()-1);
    last_base_year = last_year.getFullYear().toString() 
                    + (last_year.getMonth()+1).toString().padStart(2, "0") 
                    + last_year.getDate().toString().padStart(2, "0");
  
    return {"base_date":base_date, "base_time": base_time, "last_base_year": last_base_year};
}
