'use strict';

const express = require('express');
const bodyParser = require('body-parser');

restService.post('/webhook', (req, res) => {
	
	require('console-stamp')(console, 'yyyy.mm.dd HH:MM:ss.l');

    console.log('hook request');
	
	let action = req.body.result.action;
	let text_resp = ''
		
	if (action == 'bot_introduction'){
<<<<<<< HEAD
		text_resp = "Привет, меня зовут Хайвмайнд бот. Я могу помочь тебе найти человека, с которым ты можешь своими поделиться знаниями. Начнем?"
=======
		text_resp = "Привет, меня зовут Хайвмайнд бот. Я могу помочь тебе найти человека, с которым ты можешь своими поделиться знаниями."
>>>>>>> parent of b0d6d4f... hook upd
	} else if (action == 'step_1') {
		text_resp = 'Я вижу, что ты зарегистрирован на "moyuniver.ru". Ты хорош в этих предметах: '+skillsList+', но слаб в следующих: '+skillsList+'. Начинаем искать?'
	} else if (action == 'step_2') {
		text_resp = wishList
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
				parse_mode:"Markdown",
            }
        },
        source: 'apiai-integrations'
    });

});

restService.listen((process.env.PORT || 5000), ()=> {
    console.log("Server listening")
});