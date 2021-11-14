const fs = require('fs');
const sharp = require('sharp');
const { imgDiff } = require("img-diff-js");
const {isNight} = require('./time-service');

const { exec } = require('child_process');
const sanityImage = './base/sanity.png';
const insideBaseImage = './base/inside-base.png';
const outBaseImage = './base/out-base.png';
async function execPromise(command) {
    return new Promise((resolve,) => {
        exec(command, () => { resolve() });
    });
}
const width = 80;
const height= 140;
const left = 280;
const top = 820;
const totalPixels = width * height;
async function isCar(image, inImage = true, sanity = false) {
    const diffFilename = image.replace('cropped_','diff_');
    const {diffCount} = await imgDiff({
        actualFilename: image,
        expectedFilename: sanity ? sanityImage : (inImage ? insideBaseImage : outBaseImage),
        diffFilename,
    })

    const total = sanity ? 60*50 : (inImage ? totalPixels : 390 * 270);
    const result =  diffCount > (total / 8);
    return result;

}

async function sleepFewSec(){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            reject(new Error('time out'));
        },10000)
    });
}
async function captureImage(filename, cameraIp, cameraPort, cameraUser, cameraPassword){
    try {
        await Promise.race([execPromise(`ffmpeg  -rtsp_transport tcp -y -i rtsp://${cameraUser}:${cameraPassword}@${cameraIp}:${cameraPort}/live -flags2 fast -frames:v 1 ${filename}`), sleepFewSec()]);
        const sanityName = await cropSanity(filename);
        const isNormalImage = !(await isCar(sanityName, false, true));
        return isNormalImage;
    } catch (e) {
        console.log('error in captureImage',e)
        return false;
    }
}

function getThreshold(){
    return isNight() ? 75 : 140;
}
async function crop(image, w = width, h = height, l = left, t = top){
    const out = image.replace('image_','cropped_');
    const th = getThreshold();
    await sharp(image).extract({ width: w, height: h, left: l, top: t }).threshold(th).toFile(out);
    return out;
}

async function cropOut(image){
    const out = image.replace('image_','out_cropped_');
    await sharp(image).extract({ width: 390, height: 270, left: 640, top: 220 }).threshold(140).toFile(out);
    return out;
}

async function cropSanity(image){
    const out = image.replace('image_','sanity_cropped_');
    await sharp(image).extract({ width: 60, height: 50, left: 590, top: 1005 }).threshold(140).toFile(out);
    return out;
}

module.exports = {
    captureImage,
    crop,
    cropOut,
    isCar,
    cropSanity,
}
