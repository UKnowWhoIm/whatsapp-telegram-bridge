export async function sendHello(telegramBot, pipes){
    // Send a connected message to telegram channels
    for(var whatsappChat of Object.keys(pipes)){
        sendTextMsg(
            telegramBot,
            `Channel successfully linked with Whatsapp Chat ${whatsappChat}`,
            pipes[whatsappChat]
        );
    }
}

export async function sendRestart(telegramBot, pipes){
    // Send a restart message after disconnect to telegram channels
    for(var whatsappChat of Object.keys(pipes)){
        sendTextMsg(
            telegramBot, 
            `Connection re-established with Whatsapp Chat ${whatsappChat}`,
            pipes[whatsappChat]
        );
    }
}

export async function sendAttachment(telegramBot, fileBuffer, channelName, name) {
    await telegramBot.sendDocument(channelName, fileBuffer, {}, {'filename': name, });
}

export async function sendContact(telegramBot, contactData, telegramChannel){
    await telegramBot.sendContact(
        telegramChannel,
        contactData.phoneNo,
        contactData.firstName,
        {lastName: contactData.lastName ?? ''}
    );
}

export async function sendTextMsg(telegramBot, message, telegramChannel){
    await telegramBot.sendMessage(telegramChannel, message);
}
