# account book backend

## express as server, mariadb as database

### how to create .env file

create and put your database information to .env file on project root  
example

```
DB_HOST=YOUR_DATABASE_IP
DB_PORT=YOUR_DATABASE_PORT
DB_USER=YOUR_DATABASE_USERNAME
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_NAME=YOUR_DATABASE_NAME
```

put jwt secret key and expire time

```
JWT_SECRET=YOUR_JWT_SECRET_KEY
JWT_EXPIRES_IN=YOUR_JWT_EXPIRE_TIME(1h, 30m, etc...)
JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET_KEY
JWT_REFRESH_EXPIRES_IN=YOUR_JWT_REFRESH_EXPIRE_TIME(7d, 15d, etc...)
```

you can change your server port by adding this line in .env file

```
PORT=YOUR_SERVER_PORT
```
