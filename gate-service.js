const axios = require('axios');
const gateId = process.env.GATE_ID;
const token = process.env.TOKEN;
let lastOpen = null;
const twentySec = 1000*20;

async function openDoor(plateNumber) {
    if (lastOpen){
        const now = new Date();
        const shouldOpen = (now.getTime() - lastOpen.getTime()) < twentySec;
        if (!shouldOpen){
           // console.log('last open was less hen a minute ago - skipping', plateNumber)
            return false;
        }
    }
    try {
        const options = {
            method:'get',
            url:`https://api1.pal-es.com/v1/bt/device/${gateId}/open-gate?outputNum=1`,
            headers:{
                "accept-encoding":"gzip",
                "connection":"Keep-Alive",
                "host":"api1.pal-es.com",
                "user-agent":"okhttp/3.14.7",
                "x-bt-user-token":token
            }
        }
        const res = await axios.get(options.url,options);
        const {err, msg } = res.data;
        console.log(new Date(),msg)
        if (err){
            console.log(err);
            return false;
        } else{
            lastOpen = new Date();
           // console.log(msg, '- Plate Number',plateNumber);
            return true;
        }
    } catch (e) {
        console.log('e', e);
        return false;
    }
}

module.exports = {
    openDoor
}
