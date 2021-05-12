FROM node:16

RUN apt-get update

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \ 
    && apt install ./google-chrome-stable_current_amd64.deb

COPY . /src

WORKDIR /src

RUN npm install

CMD ["npm",  "start"]
