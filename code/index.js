const port = process.env.PORT || 3000
const upstream_uri = process.env.UPSTREAM_URI || 'http://worldtimeapi.org/api/ip'
const service_name = process.env.SERVICE_NAME || 'timetest-api-v1'

var express = require("express");
var request = require('request');
var app = express();
app.listen(3000, () => {
	console.log(`${service_name} listening on port ${port}!`)
});

app.get("/", (req, res, next) => {
	const begin = Date.now();
	// Do Bad Things
	createIssues(req, res);

	// Forward Headers for tracing
	const headers = forwardTraceHeaders(req);

	//res.json(["Tony","Lisa","Michael","Ginger","Food"]);
	request.get( upstream_uri, function(error, response, body) { 
		if (!error && response.statusCode == 200) { 
			const timeSpent = (Date.now() - begin) / 1000 + "secs";	
			let data = body
			if (error)
				data=error;
			res.end(`${service_name} - ${timeSpent}\n${upstream_uri} -> ${body}`); 				
			} 
		}); 
		
	});

	function forwardTraceHeaders(req) {
		incoming_headers = [
			'x-request-id',
			'x-b3-traceid',
			'x-b3-spanid',
			'x-b3-parentspanid',
			'x-b3-sampled',
			'x-b3-flags',
			'x-ot-span-context',
			'x-dev-user',
			'fail'
		]
		const headers = {}
		for (let h of incoming_headers) {
			if (req.header(h))
				headers[h] = req.header(h)
		}
		return headers
	}
	
	
	
	function createIssues(req, res) {
		// Look at the "fail %" header to increase chance of failure
		// Failures cascade, so this number shouldn't be set too high (under 0.3 is good)
		const failPercent = Number(req.header('fail')) || 0
		console.log(`failPercent: ${failPercent}`)
		if (Math.random() < failPercent) {
			res.status(500).end()
		}
	}