const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const {openDoor} = require('./gate-service');
const {captureImage} = require('./image-service');
const { plates } = require('./models');
const SERVER_PORT = process.env.PORT || 5002;
console.log('app starting now..')
const app = express();
const validPlates =['67962102']
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5000, // limit each IP to 5000 requests per windowMs
});

const PUBLIC = path.join(__dirname, 'public');


app.use(compression());
app.use(express.static(PUBLIC));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.disable('x-powered-by');
app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.use(limiter);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Expose-Headers', '*');
    next();
});

app.get('/open-gate', async (req,res,next)=>{
    try{
        const { plate } = req.query;
        console.log('got request to open gate for plate',plate)
        const dbPlate = await plates.findOne({ where: { plateNumber: plate}})
        if (dbPlate) {
            await openDoor(plate);
            return res.status(200).send({});
        } else {
            return res.status(403).send({});
        }

    }catch(e){
        console.log('error opening gate:',e)
        next(e);
    }
});


app.get('/plates', async (req,res,next)=>{
    try{
        console.log('got request for all plates')
        const plates = await plates.findAll()
        return res.status(200).send({ plates });
    }catch(e){
        console.log('error getting all plates:',e)
        next(e);
    }
});

app.post('/plates', async (req,res,next)=>{
    try{
        const plateData = req.body;
        console.log('got request to create new plate',plateData)
        const newPlate = await plates.create(plateData)
        return res.status(200).send(newPlate);
    }catch(e){
        console.log('error creating new plate:',e)
        next(e);
    }
});


app.delete('/plates', async (req,res,next)=>{
    try{
        const { plate } = req.query;
        console.log('got request to delete plate',plate);
        const dbPlate = await plates.findOne({ where: { plateNumber: plate}})
        await plates.destroy({where:{ plateNumber: plate}})
        return res.status(200).send({ dbPlate});
    }catch(e){
        console.log('error deleting plate:',e)
        next(e);
    }
});

const day = 1000 * 60 * 60 * 24;
app.listen(SERVER_PORT, () => {
    console.log('### startListening ##');
    console.log(`Node app is running on port:  ${SERVER_PORT}`);
    captureImage(`newImage_${(new Date()).getTime() % day}.jpg`,'192.168.0.107','554', 'admin','EXQJQV');
    setInterval(()=>{
        captureImage(`newImage_${(new Date()).getTime() % day}.jpg`,'192.168.0.107','554', 'admin','EXQJQV');
    },30*60000)
});

