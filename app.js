const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const {openDoor} = require('./gate-service');
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
        if (validPlates.includes(plate)) {
            await openDoor(plate);
            return res.status(200);
        } else {
            return res.status(403);
        }

    }catch(e){
        console.log('error opening gate:',e)
        next(e);
    }
});


app.listen(SERVER_PORT, () => {
    console.log('### startListening ##');
    console.log(`Node app is running on port:  ${SERVER_PORT}`);
});

