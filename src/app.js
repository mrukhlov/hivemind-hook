'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();
restService.use(bodyParser.json());

function parseAPI (apiString, howToArr) {
  let parsedStrings = apiString.split('\n');
  let parsedData = parsedStrings.map(function (val, i, arr) {
    return val.split('#');
  });
  let parsedObjects = parsedData.map(function (val, i, arr) {
    var obj = {};

    var data = val;

    howToArr.map(function (val, i, arr) {
      obj[val] = data[i];
    });
    return obj;
  });

  if(parsedObjects[parsedObjects.length - 1].userid === '') {
    parsedObjects.pop();
  }
  return parsedObjects;
}

function sortInteractions(analyticsList) {
  analyticsList.sort(function(a, b) {
    return a.interactions - b.interactions;
  });
  return analyticsList;
}

function echo(smth) {
  console.log(smth);
}


function getSkillsList(user) {
  return new Promise(function(resolve, reject) {
    request.post({url:'http://dev.moyuniver.ru/api/php/v03/api_fav_subj.php', form: {memberid: user.token, appid: 306, appsgn: 'd8629af695839ba5481757a519e57fb1' }}, function(err,httpResponse,body){
      var list = parseAPI(body, ['subjID', 'subjName', 'unused1', 'subjPic', 'pID', 'unused2']);
      resolve(list);
    });
  })
}


function getWishList(user) {
  return new Promise(function(resolve, reject) {
    console.log(user.token);
    request.post({url:'http://dev.moyuniver.ru/api/php/v03/api_fav_subj.php', form: {memberid: user.token, appid: 306, appsgn: 'd8629af695839ba5481757a519e57fb1' }}, function(err,httpResponse,body){
      var list = parseAPI(body, ['subjID', 'subjName', 'unused1', 'subjPic', 'pID', 'unused2']);
      resolve(list);
    });
  });
}

function getSkillsList(user) {
  return new Promise(function(resolve, reject) {
    request.post({url:'http://dev.moyuniver.ru/api/php/v03/api_mu_s.php', form: {memberid: user.token, appid: 306, appsgn: 'd8629af695839ba5481757a519e57fb1' }}, function(err,httpResponse,body){
      var list = parseAPI(body, ['subjID', 'subjName', 'unused1', 'subjPic', 'pID', 'unused2'])
      .filter(function(el, i, arr) {
        if(el.unused2 !== '0') {
          return false;
        }
        return true;
      });
      resolve(list);
    });
  })
}

function findMatches(skillsList, wishList, user) {

  // Ищем всех по нашему вишлисту

  var wishFound = wishList.map(function(el, i, arr){
    console.log(el.subjID);
    var req = srequest('POST', 'http://www.argusm-edu.ru/php/_api/_wp7_03/_pulse/api_user_discipline_d.php', {qs: {did: el.subjID, days: 5}});
    var body = req.getBody().toString();
    var res =  parseAPI(body, ['userid', 'username', 'subject', 'interactions', 'unName', 'city', 'country', 'lastInteractions']);
    console.log(res);
    console.log('----------------------------------------------\n');
    return res;
  });

  var skillFound = skillsList.map(function(el, i, arr){
    var req = srequest('POST', 'http://dev.moyuniver.ru/api/php/v03/api_user_fav_d.php', {qs: {did: el.subjID, page: 1, u: 20, memberid: user.token, appid: 306, appsgn: 'd8629af695839ba5481757a519e57fb1'}});
    var body = req.getBody().toString();
    var res =  parseAPI(body, ['userid', 'username', 'telegram', 'userpic', 'unID']);
    return res;
  });


  var users = skillFound.map(function(el,i,arr) {
    return wishFound.map(function(subarr) {
        return subarr.find(function(searchable) {
          console.log(searchable.userid);
          console.log(el[0].userid);
          if (searchable.userid === el.userid) {
            return true;
          }
          else {
            return false;
          }
        });
    });
  });
}

request.post({url:'http://dev.moyuniver.ru/api/php/v03/api_login_t.php', form: {telegram:'203905147', appid: 306, appsgn: 'd8629af695839ba5481757a519e57fb1' }}, function(err,httpResponse,body){
  var thisUser = parseAPI(body, ['token', 'email', 'subscrTill', 'id'])[0];
  // getWishList(thisUser);
  var wishList, skillsList;
  getSkillsList(thisUser).then(function(list) {
    list.length = 3;
    echo('Вы готовы помочь по этим предметам: ');
    var nameArr = [];
    list.map(function(el, i, arr) {
      nameArr.push(el.subjName);
    })
    echo(nameArr.join(', '));
    skillsList = list;
    return getWishList(thisUser);
  }).then(function(list) {
    list.length = 3;
    echo('Вам нужна помощь с этими предметами: ');
    var nameArr = [];
    list.map(function(el, i, arr) {
      nameArr.push(el.subjName);
    });
    echo(nameArr.join(', '));
    wishList = list;
    return true;
  }).then(function() {
    findMatches(skillsList, wishList, thisUser);
  });
});

request.post({url:'http://dev.moyuniver.ru/api/php/v03/api_login_t.php', form: {telegram:'203905147', appid: 306, appsgn: 'd8629af695839ba5481757a519e57fb1' }}, function(err,httpResponse,body){ console.log(parseAPI(body, ['token', 'email', 'subscrTill', 'id'])); });

restService.post('/webhook', (req, res) => {

    console.log('hook request');
	
	let action = req.body.result.action;
	let text_resp = ''
		
	if (action == 'bot_introduction'){
		text_resp = "Привет, меня зовут Хайвмайнд бот. Я могу помочь тебе найти человека, с которым ты можешь своими поделиться знаниями. Приступим?"
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