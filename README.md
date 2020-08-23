# tables-endpoint

## To run the software in a Docker container:

Adjust the environment variables in `./Dockerfile`.

Then to containerise and run execute:
`$ docker-compose up --build`

If all goes well the server should be running on http://localhost:8080.

To get available tables go to http://localhost:8080/v1/tables/johnnysBurgerBar.
To get QRCode data for a tableID go to http://localhost:8080/v1/tables/johnnysBurgerBar/qrimg/:tableID, where `:tableID` is the ID of the table.

Server uses "Basic Auth" for authentication, the default username is `admin` and the password is `12345`.

Best to use Postman to generate the base64 Authorization headers for you.

## To run tests / develop / run without docker container:

Install the latest MariaDB using the instructions here: https://mariadb.org/download/

Install the latest LTS version of node.js and npm using [NVM](https://github.com/nvm-sh/nvm).

Change directory into this project directory.
Install the packages with npm: `$ npm i`
Install typescript and tsc-silent globally with: `$ npm i -g typescript tsc-silent`

Create a `.env` file in the root directory of the project, see `.env.example` for an example. The available options are:

### The node environment, choose from test, development, production:

NODE_ENV=production

### The port to listen on:

PORT=8080

### The host name of the machine running the container, i.e. the hostname to access this restify instance, and will be used in generating the QR Code path to point back to this machine:

LOCAL_HOST=localhost

### Host name/ip inside the container to listen to:

RESTIFY_HOST=localhost

### Set the username and password for basic auth:

AUTH_USERNAME=admin
AUTH_PASSWORD=12345

### (Optional) Set the cert and key to their respective locations for HTTPS service:

CERT_URI=/some/path/to/cert.pem
KEY_URI=/some/path/to/key.pem

### The host which you'll be accessing this service from. i.e. the host which is requesting this service. Separate hosts with a comma, e.g. host1,host2,host3. please do not use "\*" as this does not work with basic auth:

ORIGINS=http://localhost:3000

### The hostname of the database service:

MARIA_DB_HOST=database

### The username for the database service:

MARIA_DB_USER=root

### The password for the above user:

MARIA_DB_PASSWORD=abc123

### The amount of allowed connections:

MARIA_DB_CONNECTION_LIMIT=10

### The name of the database:

DATABASE=hungryhungry

### Logger transports to use. Choose from console, database, and file, separate with comma, e.g. file,console,database:

LOG_TRANSPORTS=console,database

### (Optional) The file log level threshold:

FILE_LOG_LEVEL=info

### (Optional) The file log path:

FILE_LOG_PATH=/some/file/path/log.log

### (Optional) The console log level threshold:

CONSOLE_LOG_LEVEL=info

### (Optional) The database log level threshold:

DATABASE_LOG_LEVEL=info

You can now run any of the below commands:

- `$ npm run clean`: Remove compiled typescript and code coverage folders.
- `$ npm run format`: Format/beautify all typescript files.
- `$ npm run lint`: Run a linter across all typescript files.
- `$ npm run prepublishOnly`: The command to execute before publishing, this compiles the typescript to javascript.
- `$ npm run prebuild`: This command runs automatically prior to the `build` command.
- `$ npm run build`: Compiles the typescript files to javascript, this must be ran before `start`.
- `$ npm run debug:build`: Runs the `silent:build` command, used internally for VS Code debugging.
- `$ npm run silent:build`: Compiles the typescript files to javascript while suppressing compile errors.
- `$ npm run test`: Tests the typescript code.
- `$ npm run coverage`: Generates the typescript code coverage report found in `./coverage`.
- `$ npm run watch`: Watches all the typescript files, when a file is written, (saved), the files are built automatically.
- `$ npm run watch:test`: Watches all the typescript files and tests, when a file is written, (saved), the tests are reran.
- `$ npm run start`: Starts the software, `build` is required to be ran before `start`.
- `$ npm run profile`: Starts profiling the software, `build` is required to be ran before `profile`.
- `$ npm run startDebug`: Starts the software, used internally for VS Code debugging.
