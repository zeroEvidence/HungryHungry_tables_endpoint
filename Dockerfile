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

# Do not change this.
ENV NODE_ENV=production
# The port to listen on within the container.
ENV PORT=8080
# The host name of the machine running the container.
ENV LOCAL_HOST=localhost
# Host name/ip inside the container to listen to.
ENV RESTIFY_HOST=0.0.0.0
# Set the username and password for basic auth.
ENV AUTH_USERNAME=admin
ENV AUTH_PASSWORD=12345
# Set the cert and key to their respective locations for HTTPS service.
# ENV CERT_URI=/some/path/to/cert.pem
# ENV KEY_URI=/some/path/to/key.pem
# The host which you'll be accessing this service from.
# i.e. the host which is requesting the service
# separate hosts with a comma, e.g. host1,host2,host3
# please do not use "*" as this does not work with basic auth.
ENV ORIGINS=http://localhost:3000
# The hostname of the database service.
ENV MARIA_DB_HOST=database
# The username for the database service.
ENV MARIA_DB_USER=root
# The password for the above user.
ENV MARIA_DB_PASSWORD=abc123
# The amount of allowed connections.
ENV MARIA_DB_CONNECTION_LIMIT=10
# The name of the database.
ENV DATABASE=hungryhungry
# Logger transports to use. Choose from console, database, and file, separate
# with comma, e.g. file,console,database
ENV LOG_TRANSPORTS=console,database
# The file log level threshold.
# ENV FILE_LOG_LEVEL=info
# The file log path.
# ENV FILE_LOG_PATH=/some/file/path/log.log
# The console log level threshold.
ENV CONSOLE_LOG_LEVEL=info
# The database log level threshold.
ENV DATABASE_LOG_LEVEL=info

COPY --from=builder /usr/app/lib ./lib

# Expose this port to the machine running the container
EXPOSE 8080

CMD node lib/index.js