const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const puppeteer = require('puppeteer');
const morgan = require("morgan");
const novelRouter = require("./routes/list")

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use(morgan("common"));
dotenv.config();

const url = 'https://truyenfull.vn/danh-sach/truyen-moi/';
const urlBase = 'https://truyenfull.vn/'



//ROUTES
app.use("/v1", novelRouter)


app.get('/v1/:novel/page-:page', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: true }); // Mở trình duyệt ở chế độ ẩn
        const page = await browser.newPage();
        await page.goto(urlBase + req.params.novel + '/trang-' + req.params.page + '/#list-chapter');
        const novelInfo = await page.evaluate(() => {


            const chapters = Array.from(document.querySelectorAll('.list-chapter li')).map(li => {
                const linkElement = li.querySelector('a');
                const chapterTitle = linkElement.getAttribute('title');
                const chapterUrl = linkElement.getAttribute('href');
                return {
                    title: linkElement.textContent.trim(),
                    url: 'http://localhost:7102/v1' + chapterUrl.split('https://truyenfull.vn')[1]
                };
            });
            return {
                chapters: chapters
            };
        });

        await browser.close();
        res.status(200).json(novelInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/v1/:novel/chuong-:chapter', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: true }); // Mở trình duyệt ở chế độ ẩn
        const page = await browser.newPage();
        await page.goto(urlBase + req.params.novel + '/chuong-' + req.params.chapter);
        const novelInfo = await page.evaluate(() => {
            const chapterTextElement = document.querySelector('#chapter-c');
            let chapterTextLines = [];

            if (chapterTextElement) {
                const chapterText = chapterTextElement.innerHTML.trim();
                const div = document.createElement('div');
                div.innerHTML = chapterText;
                // Chia các dòng bởi thẻ <br>
                chapterTextLines = chapterText.split('<br>');
                // Loại bỏ các phần tử có chứa đoạn văn bản <div>
                chapterTextLines = chapterTextLines.filter(line => !line.includes('<div'));
            }
            return {
                chapterText: chapterTextLines
            };
        });
        await browser.close();
        res.status(200).json(novelInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});





app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});