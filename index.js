const venom = require('venom-bot');
const fs = require('fs');
const { get } = require('https');

venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
    });


const settings = JSON.parse(fs.readFileSync('settings.json'));

function sendMessageTelegram(message, bot){
    const botUrl = `https://api.telegram.org/bot${bot.token}/sendMessage?chat_id=${bot.telegramChannel}&text=${message.body}`;
    get(botUrl, function(res){
        if(!(res.statusCode <= 299 && res.statusCode >= 200)){
            console.log('Error sending message');
        }
    });
}


function getTelegramPipe(message){
    return settings.pipes[message.chat.name];
}


function start(client) {
  let telegramPipe;
  client.onMessage((message) => {
    
    telegramPipe = getTelegramPipe(message);
    
    if(telegramPipe){
        sendMessageTelegram(message, telegramPipe);
    }
  });
}