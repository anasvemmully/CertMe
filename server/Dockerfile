# Dockerfile for Node Express Server

# Build react client
FROM node:16.15.1

# Working directory be app
WORKDIR /usr/src/app

COPY package.json ./

###  Installing dependencies

ADD . ./

RUN npm install

RUN rm -rf ./node_modules

RUN npm update

# copy local files to app folder

EXPOSE 8000

RUN apt-get update --fix-missing

# RUN apt-get install wine -y

RUN apt-get install libreoffice -y 

CMD ["npm","start"]