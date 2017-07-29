const https = require ('https');
var querystring = require('querystring');

function post(options, body) {
    return new Promise(function(resolve ,reject) {
        const requestOptions = {
            hostname: options.hostname,
            path: options.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let postRequest = https.request(requestOptions, function(res) {
            let response = {
                statusCode: res.statusCode,
                headers: res.headers
            };

            res.setEncoding('utf8');

            let responseString = '';

            res.on('data', function(chunk) {
                responseString += chunk;
            });

            res.on('end', function() {
                response.data = JSON.parse(responseString);
                resolve(response);
            })

            res.on('error', function(error){
                reject(error);
            });
        });

        postRequest.write(querystring.stringify(body));
        postRequest.end();
    })
}

const request = {
    post: post
}

module.exports = request;

