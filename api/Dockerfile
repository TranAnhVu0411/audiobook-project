FROM node:16.13

WORKDIR /api
COPY package.json .
RUN npm install
COPY . .
CMD npm start