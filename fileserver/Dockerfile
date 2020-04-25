FROM node:7

LABEL version=0.1.0
MAINTAINER Fabiano Bizarro <fabianoasbizarro@gmail.com>

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm install

ENV HOST ''
ENV PORT 5000
ENV PROTOCOL ''

VOLUME ["/app/files"]

EXPOSE 5000

CMD ["npm", "start"]