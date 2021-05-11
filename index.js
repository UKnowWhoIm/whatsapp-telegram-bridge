const venom = require('venom-bot');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const settings = JSON.parse(fs.readFileSync('settings.json'));
const bot = new TelegramBot(settings.token, { polling: true});
let whatsappClient;

async function sendMessageTelegram(message, telegramChannel) {

    if (message.isMMS === true || message.isMedia === true) {
        sendAttachment(await getAttachmentStream(message), telegramChannel);
    }
    else{
        bot.sendMessage(telegramChannel, message.body);
    }
}

async function sendAttachment(fileBuffer, channelName) {
    bot.sendDocument(channelName, fileBuffer);
}

async function getAttachmentStream(message) {
    return await whatsappClient.decryptFile(message);
}


function getTelegramChannel(message) {
    return settings.pipes[message.chat.name];
}


function start() {
    whatsappClient.onMessage((message) => {
        let telegramChannel = getTelegramChannel(message);

        if (telegramChannel) {
            sendMessageTelegram(message, telegramChannel);
        }
    });
}

async function main() {
    whatsappClient = await venom.create();
    start();
}

main();