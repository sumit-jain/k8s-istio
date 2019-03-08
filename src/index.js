const https = require('https');
const port = process.env.PORT || 3000
const upstream_uri = process.env.UPSTREAM_URI || 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
const service_name = process.env.SERVICE_NAME || 'timetest-api-v1'
var express = require("express");
var app = express();

https.get(upstream_uri, (resp) => {

    const begin = Date.now();
    let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  //resp.on('end', () => {
  //  console.log(JSON.parse(data));
  //});

    const timeSpent = (Date.now() - begin) / 1000 + "secs"

	resp.on('end', () => {`${service_name} - ${timeSpent}\n${upstream_uri} -> ${data}`});

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

app.listen(3000, () => {
	console.log(`${service_name} listening on port ${port}!`)
});