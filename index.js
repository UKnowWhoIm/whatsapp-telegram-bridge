const venom = require('venom-bot');
const TelegramBot = require('node-telegram-bot-api');
const settings = require("./loadSettings")();

const bot = new TelegramBot(settings.TOKEN, { polling: true});
let whatsappClient;

async function handleDisconnect(){
    const disconnectMsg = '🛑🛑🛑\n\nWHATSAPP BOT HAS GONE OFFLINE\n\n🛑🛑';
    if (await whatsappClient.getConnectionState() !== venom.SocketState.CONNECTED){
        // Notify each channel that bot has gone offline
        for(var whatsappChat of Object.keys(settings.PIPES))
            sendMessageTelegram(disconnectMsg, settings.PIPES[whatsappChat]);
    }
}

async function sendHello(){
    // Send a connected message to telegram channels
    for(var whatsappChat of Object.keys(settings.PIPES)){
        sendMessageTelegram(
            `Channel successfully linked with Whatsapp Chat ${whatsappChat}`,
            settings.PIPES[whatsappChat]
        );
    }
}

async function sendRestart(){
    // Send a restart message after disconnect to telegram channels
    for(var whatsappChat of Object.keys(settings.PIPES)){
        sendMessageTelegram(
            `Connection re-established with Whatsapp Chat ${whatsappChat}`,
            settings.PIPES[whatsappChat]
        );
    }
}

function setHeaderOfMessage(message, whatsappChat, sender){
    // Attach sender info
    let header = '';
    const defaultHeader = `Sent From Whatsapp Chat: ${whatsappChat}\n\nSent By: ${sender}`;
    if(settings.ADD_DEFAULT_HEADER ?? true){
        header = defaultHeader;
    }
    header += (header === '' ? '' : '\n\n') + settings.CUSTOM_HEADER ?? '';
    return header + '\n\n' + message;
}

async function sendMessageTelegram(message, telegramChannel) {
    // Send a message to telegramChannel
    let textContent;
    
    if(typeof(message) !== "string"){
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
        textContent = setHeaderOfMessage(textContent, message.chat.name, message.sender.pushname);
    }
    else{   
        textContent = message;
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
    return settings.PIPES[message.chat.name];
}


function start() {
    sendHello();
    whatsappClient.onMessage((message) => {
        let telegramChannel = getTelegramChannel(message);

        if (telegramChannel) {
            sendMessageTelegram(message, telegramChannel);
        }
    });
    whatsappClient.onStateChange((state) => {
        if (venom.SocketState.CONFLICT === state){
            // Force client to use whatsapp web here
            whatsappClient.useHere.then((_) => sendRestart);
        }
    });
}

async function main() {
    try{
        whatsappClient = await venom.create();
        start();
        setInterval(handleDisconnect, 1000 * 2);
    }
    catch(e){
        console.log(e);
    }
    
}

main();