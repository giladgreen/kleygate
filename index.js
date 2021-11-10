const axios = require('axios');
const gateId = process.env.GATE_ID;
const token = process.env.TOKEN;
const hour= 60*60*1000;
async function openDoor() {
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
            console.log(msg);
        } else{
            setTimeout(openDoor,hour)
        }
    } catch (e) {
        console.log('e', e)
    }
}


openDoor();

