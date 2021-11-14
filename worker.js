const fs = require('fs');
const {openDoor} = require('./gate-service');
const {isInBetween} = require('./time-service');
const {captureImage,crop, isCar } = require('./image-service');
const cameraIpAddress= process.env.CAMERA_IP;
const cameraPassword= process.env.CAMERA_PASSWORD;

let counter = 0;
function log(msg){
    process.stdout.write('                                            '+'\r');
    process.stdout.write(msg+'\r');
}
function getImageName(){
    const now = new Date();
    return `./images/image_${now.getHours()}_${now.getMinutes()}.${now.getSeconds()}.png`
}

function deleteFolderFiles(){
    fs.readdirSync('./images').filter(fileName => fileName.includes('.png')).forEach(fileName =>{
        try {
            fs.unlinkSync(`./images/${fileName}`);
        } catch (err) {
            console.error(err)
        }
    })
}
function getTimeout(shouldOpen){
    if (shouldOpen){
        return 10000;
    }
    const long = 20 * 60 * 1000;
    if (isInBetween()){
        return long;
    }
    return 1000;
}
async function archive(imageName){
    return new Promise((resolve) => {
        fs.copyFile(imageName, imageName.replace('./images/','./archive/'), (err) => {
            if (err){
                console.log('failed to copy file',imageName, err)
            };
            resolve();
        });
    });
}
async function sample(){
    let shouldOpen = false;
    try {
        counter++;
        deleteFolderFiles();
        const imageName = getImageName();
        log(`${counter}) image: ${imageName}                        `);
        const hasImage = await captureImage(imageName, cameraIpAddress, '554', 'admin', cameraPassword);
        if (hasImage) {
            const croppedInImageName = await crop(imageName);
            shouldOpen = await isCar(croppedInImageName);
            if (shouldOpen) {
               // console.log('should Open: ', imageName)
                await openDoor('inside lot');
                log(`${counter}) image: ${imageName}, shouldOpen: true \n `);
                await archive(imageName);
            } else{
                log(`${counter}) image: ${imageName}, shouldOpen: false`);
            }
        }
    } catch (e) {
        log(`${counter}) image: ${imageName}, error: ${e.message}  \n `);
        log(`${e.stack})  \n `);
    }

    setTimeout(sample, getTimeout(shouldOpen))
}

//sample();
