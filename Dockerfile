FROM node:4.4.7

LABEL version=0.1.0

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm install

# Listando as variáveis de ambiente disponíveis para uso
ENV APP_SECRET ''
ENV INST_ID ''
ENV DBLOG_URI ''
ENV DB_CONN_URI ''
ENV RESET_PASSWD_URL ''
ENV EMAIL_HOST ''
ENV EMAIL_USERNAME ''
ENV EMAIL_PASSWD ''
ENV NODE_ENV ''

EXPOSE 3000

CMD ["node", "server.js"]