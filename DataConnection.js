const mysql = require('mysql');
const config = require('./config.json');

/*
    config is an object which contains a json file, it looks like this:

    {
    "rds_host": "database-1.cf9alyudupe1.us-east-2.rds.amazonaws.com",
    "rds_port": "3306",
    "rds_user": "zesheng",
    "rds_password" : "970929but",
    "rds_db": "assignment",
    "server_host": "localhost",
    "server_port":"8080"
  }

*/
const connection = mysql.createConnection(
    {
        host: config.rds_host,
        user: config.rds_user,
        password: config.rds_password,
        port: config.rds_port,
        database: config.rds_db
    }
);

connection.connect((err) => {
    if (err) {
        console.log('Database Error :' + err);
    } else {
        console.log('Database Connection Complete!')
    }
});

module.exports = connection;

