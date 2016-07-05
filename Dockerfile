FROM node:4.4.7

MAINTAINER Fabiano Bizarro

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm install

ENV DB_CONN_URI ''
ENV NODE_ENV ''
ENV FORCE_SYNC ''

EXPOSE 3000

CMD ["node", "server.js"]