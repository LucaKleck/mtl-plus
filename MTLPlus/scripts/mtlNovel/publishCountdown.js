var minutegetHours = new RegExp("h[0-9]+m","g");
var minuteGetMinutes = new RegExp("[0-9]+h","g");
var secondsGetMinutes = new RegExp("[0-9]+s","g");
var secondsGetSeconds = new RegExp("[0-9]+m","g");
for(let countdown of document.getElementsByClassName("calendar-clock")) {
    if(!countdown.textContent.replaceAll("Published in: ","").includes("s") && !countdown.textContent.replaceAll("Published in: ","").includes("d")) {
        timerMinuteDown(countdown);
    } else if (countdown.textContent.replaceAll("Published in: ","").includes("s")) {
        timerSecondDown(countdown);
    }
}
/**
 * 
 * @param {HTMLSpanElement} countdown 
 */
 function timerMinuteDown(countdown) {
    setTimeout(() => {
        let hours = parseInt(countdown.textContent.replaceAll("Published in: ","").replaceAll(minutegetHours,""));
        let minutes = parseInt(countdown.textContent.replaceAll("Published in: ","").replaceAll(minuteGetMinutes,"").replaceAll("m",""));
        if(minutes >= 1) {
            minutes-=1;
            if(minutes == 0) {
                countdown.textContent = "Published in: "+hours+"h";
            } else {
                countdown.textContent = "Published in: "+hours+"h"+minutes+"m";
            }
            timerMinuteDown(countdown);
        } else {
            if(hours >= 1) {
                hours-=1;
                minutes = 59;
                if(hours == 0) {
                    countdown.textContent = "Published in: "+minutes+"m";
                } else {
                    countdown.textContent = "Published in: "+hours+"h"+minutes+"m";
                }
                timerMinuteDown(countdown);
            } else {
                if(hours == 0 && minutes == 0) {
                    countdown.textContent = "Publishing soon!";  
                } else {
                    countdown.textContent = "Published in: "+hours+"h"+minutes+"m";
                    timerMinuteDown(countdown);
                }
            }
        }
    }, 60000);
}
/**
 * 
 * @param {HTMLSpanElement} countdown 
 */
 function timerSecondDown(countdown) {
    setTimeout(() => {
        let minutes = parseInt(countdown.textContent.replaceAll("Published in: ","").replaceAll(secondsGetMinutes,""));
        let seconds = parseInt(countdown.textContent.replaceAll("Published in: ","").replaceAll(secondsGetSeconds,"").replaceAll("m",""));
        if(seconds >= 1) {
            seconds-=1;
            if(seconds == 0) {
                countdown.textContent = "Published in: "+minutes+"m";
            } else {
                countdown.textContent = "Published in: "+minutes+"m"+seconds+"s";
            }
            timerSecondDown(countdown);
        } else {
            if(minutes >= 1) {
                minutes-=1;
                seconds = 59;
                if(minutes == 0) {
                    countdown.textContent = "Published in: "+seconds+"m";
                } else {
                    countdown.textContent = "Published in: "+minutes+"m"+seconds+"s";
                }
                timerSecondDown(countdown);
            } else {
                if(minutes == 0 && seconds == 0) {
                    countdown.textContent = "Publishing soon!";  
                } else {
                    countdown.textContent = "Published in: "+minutes+"m"+seconds+"s";
                    timerSecondDown(countdown);
                }
            }
        }
    }, 1000);
}