'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', (req, res) => {

    console.log('hook request');
	
	let action = req.body.result.action;
	let text_resp = ''
		
	if (action == 'bot_introduction'){
		text_resp = "Привет, меня зовут Хайвмайнд бот. Я могу помочь тебе найти человека, с которым ты можешь своими поделиться знаниями. Начнем?"
	} else if (action == 'step_1') {
		text_resp = 'Я вижу, что ты зарегистрирован на "moyuniver.ru". Ты хорош в этих предметах: "Английский язык", "Программирование", "История", но слаб в следующих: "Физика", "Химия", "Экономика". Начинаем искать?'
	} else if (action == 'step_2') {
		text_resp = 'Вот я нашел несколько человек, которые могли бы помочь тебе с этими предметами.\n*Рухлов Максим* @mrukhlov\nвладеет предметом **"Физика"**\nне владеет предметом "Английский язык"\n*Астахова Анна* @ostanna\nвладеет предметом "Экономика"\nне владеет предметом "Программирование"\n*Александрович Юлия* @july666\nвладеет предметом "Химия"\nне владеет предметом "Программирование"'
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