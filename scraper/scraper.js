const puppeteer = require('puppeteer');
const express = require('express');
const fetch = require('node-fetch');

const app = express();

class Scraper {
    constructor(url, htmlString) {
        this.url = url;
        this.htmlString = htmlString;
    }

    async startBrowser() {
        try {
            console.log("Opening the browser...");
            let browser = await puppeteer.launch({
                args: ["--no-sandbox"]
            });
            return browser;
        } catch (err) {
            console.log("Could not create a browser instance => : ", err);
        }
    }

    async findPage(browser) {
        try {
            let page = await browser.newPage();
            return page;
        } catch (err) {
            console.log("Oops", err);
        }
    }

    async scrapePage(page) {
        try {
            console.log(`Navigating to ${this.url}...`);
            await page.goto(this.url, { waitUntil: 'load', timeout: 0 });
            let team = await page.$$eval(this.htmlString, res => {
                res = res.map(el => el.innerText)
                return res;
            })
            return team;
        }
        catch (err) {
            console.log("Could not resolve the browser instance => ", err);
        } finally {
            await page.close();
        }
    }
}

app.get("/", (req, res) => {
    res.json({ status: "Server is running" });
});

app.get("/scrape", async (req, res) => {
    const year = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
    const split = ['Spring', 'Summer'];
    var lcs,
        url,
        nestedArr = [],
        htmlString = '.matchlist-tab-wrapper .wikitable2 tbody tr .teamhighlight';

    // Looping through all iterations of year and split
    for (let i = 0; i < year.length; i++) {
        for (let j = 0; j < split.length; j++) {

            // The url changes slightly over the years hence these 2 if statements
            if (year[i] <= 2018) {
                lcs = "NA_LCS"
            } else {
                lcs = "LCS"
            }

            if (year[i] == 2013) {
                url = `https://lol.fandom.com/wiki/${lcs}/Season_3/${split[j]}_Season`;
            } else {
                url = `https://lol.fandom.com/wiki/${lcs}/${year[i]}_Season/${split[j]}_Season`;
            }

            let data = await runScrape(url, htmlString);

            for (let k = 0; k < data.length; k += 4) {

                // One game out of thousands had a W instead of 1 and the db rejected it
                if (data[k + 1] == "W") {
                    data[k + 1] = "1";
                    data[k + 2] = "0";
                }

                nestedArr.push([year[i], split[j], data[k], data[k + 1], data[k + 2], data[k + 3]])
            }
        }
    }

    res.json({ nestedArr })

    var payload = { games: nestedArr };
    fetch('http://localhost:5000/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

})

const runScrape = async (url, htmlString) => {
    let scraper = new Scraper(url, htmlString)
    let browser = await scraper.startBrowser();
    let page = await scraper.findPage(browser);
    let data = await scraper.scrapePage(page);
    console.log(data);
    return data;
}

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server is listening on port ${port}`))