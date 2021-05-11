const venom = require('venom-bot');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const settings = JSON.parse(fs.readFileSync('settings.json'));
const bot = new TelegramBot(settings.token, { polling: true});
let whatsappClient;

async function sendMessageTelegram(message, telegramChannel) {
    // Send a message to telegramChannel
    let textContent;
    
    const unsupportedTypes = [
        venom.MessageType.REVOKED, 
        venom.MessageType.STICKER, 
        venom.MessageType.UNKNOWN,
        venom.MessageType.CONTACT_CARD,
        venom.MessageType.CONTACT_CARD_MULTI,
        venom.MessageType.VOICE 
    ];
    
    if(unsupportedTypes.includes(message.type)){
        return null;
    }
    
    if (message.type === venom.MessageType.TEXT){
        textContent = message.body;
    }
    else {
        // Text sent with media is stored inside captions, not body
        await sendAttachment(await getAttachmentStream(message), telegramChannel, message.id);
        textContent = message.captions;
    }
    
    if(textContent){
        bot.sendMessage(telegramChannel, textContent);
    }
    
}

async function sendAttachment(fileBuffer, channelName, name) {
    await bot.sendDocument(channelName, fileBuffer, {}, {'filename': name, });
}

async function getAttachmentStream(message) {
    return await whatsappClient.decryptFile(message);
}


function getTelegramChannel(message) {
    // Get the telegram channel pointing to whatsapp chat
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