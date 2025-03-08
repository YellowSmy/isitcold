// From KMA Fomula
// Ta(Temperature): Celsius, RH(Relative Humidty): %, V(Wind Velocity for 10min): km/h
export function getApparentTemp(Ta, RH, V) {
    const month = (new Date().getMonth() + 1);
    let apparent = null;
    
    // 4~9: response highest Apperent Temp on Day
    if(month >=5 && month <= 9) {
        //WBGT Temperature
        const Tw = Ta*Math.atan(0.151977*(RH+8.313659)**(1/2)) + Math.atan(Ta+RH) - Math.atan(RH-1.67633) 
        + 0.00391838*(RH**(3/2))*Math.atan(0.023101*RH) - 4.686035;
        apparent = 0.2442 + 0.55399*Ta + 0.45535*Ta - 0.0022*(Tw**2) + 0.00278*Tw*Ta + 3.0;
    }
    // 10~4: response loweset Apearent Temp on Day
    else {
        apparent = 13.12 + 0.6215*Ta - 11.37*(V*3.6)**(0.16) + 0.3965*(V*3.6)**(0.16)*Ta;
    }
    
    return apparent.toFixed(1);
}

