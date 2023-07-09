const express = require('express');
const RSSParser = require('rss-parser');
const app = express();
require('dotenv').config();

app.set('view engine', 'html');
app.use(express.static('public'));

// CORS headers middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Proxy route
// app.get('/proxy', async (req, res) => {
//   const rssUrl = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US';
//   try {
//     const parser = new RSSParser();
//     const feed = await parser.parseURL(rssUrl);
//     res.json(feed);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Error occurred while fetching data');
//   }
// });

// app.get('/', function(req, res) {
//   res.render('index');
// });
const googleTrends = require('google-trends-api');

app.get('/proxy', async (req, res) => {
  console.log("Hello?")
	//res.render('index');
  const keyword = 'bitcoin';
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 5); // 5 years ago
  const endDate = new Date();

  const options = {
    keyword: keyword,
    startTime: startDate,
    endTime: endDate,
    granularTimeResolution: true,
  };

  console.log("Running Interest over time")

  googleTrends.interestOverTime(options)
    .then(data => {
      console.log(data)
      const trendData = JSON.parse(data).default.timelineData;
      const chartData = {
        labels: trendData.map(entry => entry.formattedTime),
        datasets: [
          {
            label: 'Search Interest',
            data: trendData.map(entry => entry.value[0]),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      res.send(chartData);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send('Error occurred while fetching data');
    });
    console.log("Finished with interestOverTime")
});

//https://medium.com/@gururajhm/automate-google-trends-with-google-trends-api-nodes-js-645c3676fb4c
//https://www.npmjs.com/package/google-trends-api#examples
//var googleTrends = require('./lib/google-trends-api.min.js');
// const googleTrends = require('google-trends-api');
// googleTrends.interestOverTime({keyword: 'bitcoin'})
// 	.then(function(results){
//   		console.log('These results are awesome', results);
// 	})
// 	.catch(function(err){
//   	console.error('Oh no there was an error', err);
// });

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
