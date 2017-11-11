FROM node:8

#install forever
RUN npm install forever -g

COPY . /usr/src/app
WORKDIR /usr/src/app
ENTRYPOINT forever start index.js
