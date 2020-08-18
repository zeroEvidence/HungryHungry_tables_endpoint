#stage1
FROM node as builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN npm install -g tsc-silent typescript

COPY . .

RUN npm run silent:build

#stage 2
FROM node

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --production

ENV NODE_ENV=production
ENV PORT=8080
ENV LOCAL_HOST=localhost
ENV DOCKER_HOST=0.0.0.0
ENV AUTHUSERNAME=admin
ENV AUTHPASSWORD=12345
ENV MONGODBURI=mongodb://database:27017/hungryhungry

COPY --from=builder /usr/app/lib ./lib

EXPOSE 8080

CMD node lib/index.js