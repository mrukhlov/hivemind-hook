'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', (req, res) => {

    console.log('hook request');
	
	let action = req.body.result.action;
	console.log(action);
	
	let text_resp = 'aaa'
	
	/*if (action == 'bot_introduction'){
		text_resp = 'Привет, я хайв бот, могу помочь тебе с учебой. Скажи что ты умеешь и по каким предметам тебе требуется помощь.'
	} else {
		text_resp = 'telegram message'
	}*/
	
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
                text: text_resp
            }
        },
        source: 'apiai-integrations'
    });

});

restService.listen((process.env.PORT || 5000), ()=> {
    console.log("Server listening")
});