FROM node:4.4.7

LABEL version=1.1.0

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm install

ENV DB_CONN_URI ''
ENV FORCE_SYNC ''

EXPOSE 3000

CMD ["node", "server.js"]