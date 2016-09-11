'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', (req, res) => {

    console.log('hook request');
	
	let action = req.body.result.action;
	console.log(action);
	
	if (bot_introduction == 'bot_introduction'){
		text_resp = 'Привет, я хайв бот, могу помочь тебе с учебой.'
	} else {
		text_resp = 'telegram message'
	}
	
    return res.json({
        speech: "This is speech",
        displayText: "This is speech",
        data: {
            facebook: {
                text: "Facebook message"
            },
            slack: {
                text: "Slack message"
            },
            telegram: {
                text: text_resp,
				request_contact: "True"
            }
        },
        source: 'apiai-integrations'
    });

});

restService.listen((process.env.PORT || 5000), ()=> {
    console.log("Server listening")
});