FROM node:16

RUN apt-get update && \
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt install --no-install-recommends -y ./google-chrome-stable_current_amd64.deb

COPY . /src

WORKDIR /src

RUN npm install

CMD ["npm", "run", "deploy"]
