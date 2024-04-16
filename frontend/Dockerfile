FROM node:20.9.0-alpine
EXPOSE 3000

WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD [ "npm","start" ]