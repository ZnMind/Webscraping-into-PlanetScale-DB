### LCS Hobby

This project combines two of my previous projects together. [scraper.js](scraper/scraper.js) loops through each year/split (2013 - 2022, Spring & Summer) and instantiates a scraper object to grab game data from the [LoL Wiki](https://lol.fandom.com/wiki/League_of_Legends_Esports_Wiki) which then sends a request body to [db.js](db.js) which stores all data in a [Planetscale](https://planetscale.com/) database.

```js
node db.js    // runs on localhost:5000
node scraper/scraper.js   // runs on localhost:4000
```

Navigate the browser to localhost:4000/Scrape to begin scraping.
The scraper object only needs a url and an html string passed to it.

[PlanetScale CLI](https://github.com/planetscale/cli)

```
pscale auth login
pscale shell <DB_Name> <Branch>
```
Opens a shell where MySQL commands can be run from the terminal straight to your PlanetScale database.