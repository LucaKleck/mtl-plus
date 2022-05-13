var getHours = new RegExp("h[0-9]+m","g");
var getMinutes = new RegExp("[0-9]+h","g");
for(let countdown of document.getElementsByClassName("calendar-clock")) {
    timerMinuteDown(countdown);
}
/**
 * 
 * @param {HTMLSpanElement} countdown 
 */
function timerMinuteDown(countdown) {
    setTimeout(() => {
        let hours = parseInt(countdown.textContent.replaceAll("Published in: ","").replaceAll(getHours,""));
        let minutes = parseInt(countdown.textContent.replaceAll("Published in: ","").replaceAll(getMinutes,"").replaceAll("m",""));
        if(minutes >= 1) {
            minutes-=1;
            countdown.textContent = "Published in: "+hours+"h"+minutes+"m";
            timerMinuteDown(countdown);
        } else {
            if(hours >= 1) {
                hours-=1;
                minutes = 59;
                countdown.textContent = "Published in: "+hours+"h"+minutes+"m";
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