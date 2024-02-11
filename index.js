var express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const bodyParse = require('body-parser')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const morgan = require("morgan");

const url = 'https://metruyencv.com/truyen/?sort_by=new_chap_at'


// SETUP
const app = express()
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));
dotenv.config()

// ROUTES
app.get('/v1', async (req, res) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const listDataTeam = []

        var href = $('.media-body').find('h2.fz-body.mb-2 > a').text()
        console.log(href)
        res.status(200).json(listDataTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// RUN PORT
app.listen(7102, () => {
    console.log('Server is running...');
});