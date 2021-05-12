# Whatsapp Telegram Bridge

This project creates a bridge between a whatsapp chat and a telegram channel, ie you could recieve the messages sent on whatsapp through telegram.

## How to use

**It is recommended that you use Node and NPM locally and use Docker if you wanna deploy, as the container is very large.**

1. Create a `settings.json` file from the `settings.example.json`. In the `PIPES` key store your all your required whatsapp chat's names.

2. Create a [telegram bot](https://sendpulse.com/knowledge-base/chatbot/create-telegram-chatbot). Find the API key, and store it as value of key `TOKEN`.

3. If you want to use it for a private channel, follow this [link](https://sarafian.github.io/low-code/2020/03/24/create-private-telegram-chatbot.html), and obatin `chat_id`

    If you don't mind creating a public channel, create it and obtain `chat_id`(@your channel name in url)

4. Add `chat_id` to your corresponding whatsapp chat's key.

5. Run 
    ```
    npm install
    npm start
    ```

6. It will display a QR code for whatsapp authentication, scan the QR code using whatsapp. You won't have to do this again.

## Deploy

1. Run the script and login locally.(This is important as we need that session data)

2. Deploy the docker container with a cloud service([Heroku](https://heroku.com) is free).

3. Set `TOKEN` environment variable with your `BOT_API_KEY`

4. Set `PIPES` environment variable as a JSON String of your Whatsapp-Telegram Pipes.

## All Settings

Settings can be stored in a json file or as environment variables.

#### `TOKEN` 

The `BOT_API_TOKEN` obtained while creating your telegram bot. 

#### `PIPES`

The mappings between whatsapp chats and telegram channel. Must be stored as JSON. Can have multiple pipes.

#### `SHOW_DEFAULT_HEADER`

Show or hide default header.
```
Sent from whatsapp chat: $chat_name

Sent by: $sender
```
Currently headers don't work for attachments.

Default is true

#### `CUSTOM_HEADER`

Add your own header to all messages sent except attachments.

Note: Passing a `CUSTOM_HEADER` won't disable `DEFAULT_HEADER`, you have to explicitly set it to `false`.

## Limitations

- Since WhatsApp has no official API, the API used is based on WhatsApp Web. So you can't use WhatsApp Web while running this.

- WhatsApp Web relies on your phone's internet too, so even if you deploy this on a server, your phone must have 24x7 internet access too.

## Acknowledgements

Whatsapp API - [Venom](https://github.com/orkestral/venom)

Telegram Bot API - [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
