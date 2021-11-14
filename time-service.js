const sunrizeHour = 3;
const sunrizeMinute = 10;
const sunsetHour = 14;
const sunsetMinute = 40;

function isNight(){
    const now = new Date();
    const hour = now.getUTCHours();
    const minutes = now.getUTCMinutes();

    return (hour > sunsetHour || (hour ===sunsetHour && minutes > sunsetMinute + 10) || hour < sunrizeHour || (hour === sunrizeHour && minutes < sunsetMinute - 10))


}
function isInBetween(){
    const now = new Date();
    const hour = now.getUTCHours();
    const minutes = now.getUTCMinutes()
    if (hour === sunrizeHour && sunrizeMinute - 10 < minutes && minutes < sunrizeMinute + 10){
        return true;
    }

    if (hour === sunsetHour && sunsetMinute - 10 < minutes && minutes < sunsetMinute + 10){
        return true;
    }
    return false;
}
module.exports = {
    isNight,
    isInBetween,
}
