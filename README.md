# tables-endpoint

Adjust the environment variables in `./Dockerfile`.

Then to containerise and run execute:
`$ docker-compose up --build`

If all goes well the server should be running on `http://localhost:8080`.

To get available tables go to `http://localhost:8080/tables/johnnysBurgerBar`.
To get QRCode data for a tableID go to `http://localhost:8080/tables/qrimg/:tableID`, where `:tableID` is the ID of the table.

Server uses "Basic Auth" for authentication, the default username is `admin` and the password is `12345`.
