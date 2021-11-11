const fs = require('fs');
const { exec } = require('child_process');
function captureImage(filename, cameraIp, cameraPort, cameraUser, cameraPassword){
    try {
        exec(`ffmpeg -rtsp_transport tcp -y -i rtsp://${cameraUser}:${cameraPassword}@${cameraIp}:${cameraPort}/live -f image2 ${filename}`, () => { });
        const files = fs.readdirSync(__dirname);
        console.log('image files:', files.filter(x => x.includes('newImage_')).join(', '));
    } catch (e) {
        console.log('error in captureImage',e)
    }
}


module.exports = {
    captureImage
}
