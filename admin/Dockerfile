FROM node:7

LABEL version=0.1.0
MAINTAINER Fabiano Bizarro <fabianoasbizarro@gmail.com>

RUN npm install -g bower

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install \
    && bower install --allow-root \
    && npm run build

ENV API_HOST ""
ENV API_PORT ""
ENV API_PROTOCOL ""
ENV FILE_SERVER_URL ""

EXPOSE 8080

CMD ["npm", "start"]