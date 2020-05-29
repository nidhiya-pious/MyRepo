const express = require('express');
const http = require('http');
const validUrl = require('valid-url');
const shortid = require('shortid');

const connectDB = require('./config/db');
const Url = require('./models/Url');

const app = express();
const port = process.env.PORT || 3000;

var numberOfVisits =0;

app.use(express.json({
	extended: false
}));

app.use(express.urlencoded({
	extended: false
}));

http.createServer(app).listen(4000, function() {});
console.log("SERVER STARTED AT PORT " + port);

connectDB();

app.post('/shorten', async(req, res) => {
    const longUrl = req.body.longUrl;
    const baseUrl = "http://" + req.headers.host;
    const urlCode = shortid.generate();

    if(!validUrl.isUri(baseUrl)) {
        res.json('Invalid base url');
    }

    if(validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({
                longUrl: longUrl
            });

            shortUrl = baseUrl + '/' + urlCode;
            url = new Url({
				longUrl: longUrl,
				shortUrl,
				urlCode
            });
            await url.save();
            return res.json(url);
        } catch(err) {
            console.log(err)
            res.send("Server error");

        }
    }
});

app.get('/:code', async(req,res) => {
    numberOfVisits ++;
    try {
        const url =  await Url.findOne({
            urlCode: req.params.code
        });

        if(url) {
            await url.save();
            return res.send({longUrl: url.longUrl, numberOfVisits:numberOfVisits});
        } else {
            res.send('No url found');
        }
    } catch(err) {
        console.log(err);
        res.send('Server error');
    }
});

