const cheerio = require('cheerio');
const request = require('axios');
let slackToken = process.env.SLACK_TOKEN // This should exist as an environment variable in AWS LAMBDA

exports.handler = async (event) => {

  const res = await request('https://lasencarnas.es/menu/');
  const menu = extractMenuFromHTML(res.data);
  const response = {
    statusCode: 200,
    body: menu,
  };
  await sendSlack(menu);
  return response;
   
};

function extractMenuFromHTML(html) {
  const $ = cheerio.load(html);

  var dt = new Date();
  const todaysMenu = $('.menu-box').eq(dt.getDay()-1).children('p');
  
  let stringMenuList = "";
  todaysMenu.each((i, element) => {
    stringMenuList += $(element).text() + '\n';
  });

  return tellTheTruth(applyPilotes(stringMenuList));
}

function applyPilotes(menuList) {
  return menuList.replace(/Albóndigas/gi, ':pilotes: ¡OSTIA! Pilotes')
}

function tellTheTruth(menuList) {
  return menuList.replace(/salsa verde/gi, '~salsa verde~ GUISANTES').replace(/verduras/gi, '~verduras~ probably more guisantes')
}

function containsGuisantes(menuList) {
  return menuList.toLowerCase().includes('guisantes');
}

async function sendSlack(data) {

  var msg = ":realfood:*Mamma mia it's almost 11am!*, today *Encarnas* Specials are::realfood: \n";
  if (!containsGuisantes(data)) {
    msg = ":realfood:*ATTENTION EVERYONE!* Today *Encarnas* menu HAS NO GUISANTES::realfood: \n";
  }

  const res = await request.post('https://slack.com/api/chat.postMessage', {
    'channel': 'random',
    'text': msg,
    'attachments': [
        {
          "color": "warning",
          "text": data,
          "mrkdwn_in": ["text"],
          "actions": [
          {
            "type": "button",
            "text": "Give it to ME! :catala:",
            "url": "https://lasencarnas.es/menu/",
            "style": "primary"
          }
      ]
        }
    ]
},{
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + slackToken,
 }
});
}
