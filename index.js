const cheerio = require('cheerio');
const request = require('axios');

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

  return applyPilotes(stringMenuList);
}

function applyPilotes(menuList) {
  return menuList.replace(/Albóndigas/gi, ':pilotes: ¡OSTIA! Pilotes')
}

async function sendSlack(data) {
  
  const msg = ":realfood:*Mamma mia it's almost 11am!*, today *Encarnas* Specials are::realfood: \n";
  
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
    'Authorization': "Bearer slack-token-example",
 }
});
}
