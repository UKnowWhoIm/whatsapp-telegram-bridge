# Whatsapp Telegram Bridge

This project creates a bridge between a whatsapp chat and a public telegram channel, ie you could recieve the messages sent on whatsapp through telegram.

## How to use

1. Create a `settings.json` file from the `settings.example.json` and add your whatsapp chat's name to `pipes`.

2. Create a [telegram bot](https://sendpulse.com/knowledge-base/chatbot/create-telegram-chatbot). Find the API key, and store it as your whatsapp chat's `token`. Store the name as your whatsapp chat's `name`.

3. If you want to use it for a private channel, follow this [link](https://sarafian.github.io/low-code/2020/03/24/create-private-telegram-chatbot.html), and obatin `chat_id`

    If you don't mind creating a public channel, create it and obtain `chat_id`(@your channel name in url)

4. Add chat_id to your corresponding whatsapp chat's `telegramChannel` property.

5. Run 
    ```
    npm install
    npm start
    ```

6. It will display a QR code for whatsapp authentication, scan the QR code using whatsapp. You won't have to do this again.

## Acknowledgement

This project would not have been possible without the amazing Whatsapp API provided by [Venom](https://github.com/orkestral/venom).