FROM node:7

LABEL version=0.1.0
MAINTAINER Fabiano Bizarro <fabianoasbizarro@gmail.com>

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm install

ENV TZ=Brazil/East
ENV APP_SECRET ''
ENV INST_ID ''
ENV DBLOG_URI ''
ENV DB_CONN_URI ''
ENV RESET_PASSWD_URL ''
ENV EMAIL_HOST ''
ENV EMAIL_USERNAME ''
ENV EMAIL_PASSWD ''
ENV NODE_ENV ''

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

VOLUME ["/app/log"]

EXPOSE 3000

CMD ["node", "server.js"]