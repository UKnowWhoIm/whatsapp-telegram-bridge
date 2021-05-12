import { SocketState, MessageType, create } from 'venom-bot';
import TelegramBot from 'node-telegram-bot-api';
import { parseContacts, loadSettings } from "./utils.js";

const settings = loadSettings();
const bot = new TelegramBot(settings.TOKEN, { polling: true});
let whatsappClient;

async function handleDisconnect(){
    const disconnectMsg = '🛑🛑🛑\n\nWHATSAPP BOT HAS GONE OFFLINE\n\n🛑🛑';
    const connectionStates = [
        SocketState.CONNECTED,
        SocketState.PAIRING,
        SocketState.RESUMING
    ]
    let currentState = await whatsappClient.getConnectionState();
    if (!connectionStates.includes(currentState)){
        // Notify each channel that bot has gone offline
        console.log(currentState);
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
    if(message){
        let header = '';
        const defaultHeader = `Sent From Whatsapp Chat: ${whatsappChat}\n\nSent By: ${sender}`;
        if(settings.ADD_DEFAULT_HEADER ?? true){
            header = defaultHeader;
        }
        header += (header === '' ? '' : '\n\n') + (settings.CUSTOM_HEADER ?? '');
        return header + '\n\n' + message;
    }
}

async function sendMessageTelegram(message, telegramChannel) {
    // Send a message to telegramChannel
    let textContent = null;
    
    if(typeof(message) !== "string"){
        const unsupportedTypes = [
            MessageType.REVOKED, 
            MessageType.STICKER, 
            MessageType.UNKNOWN,
            MessageType.CONTACT_CARD_MULTI,
            MessageType.VOICE 
        ];

        if(unsupportedTypes.includes(message.type)){
            return null;
        }
        
        if (message.type === MessageType.TEXT){
            textContent = message.body;
        }
        else if(message.type === MessageType.CONTACT_CARD){
            let contactData = parseContacts(message.body);
            if(contactData === null){
                textContent = "ERROR: Failed Parsing Contacts";
            }
            else{
                sendContact(contactData, telegramChannel);
            }
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

async function sendContact(contactData, telegramChannel){
    await bot.sendContact(
        telegramChannel,
        contactData.phoneNo,
        contactData.firstName,
        {lastName: contactData.lastName ?? ''}
    );
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
        if (SocketState.CONFLICT === state){
            // Force client to use whatsapp web here
            whatsappClient.useHere.then((_) => sendRestart);
        }
    });
}

async function main() {
    try{
        whatsappClient = await create();
        start();
        setInterval(handleDisconnect, 1000 * 2);
    }
    catch(e){
        console.log(e);
    }
    
}

main();