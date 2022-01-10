import mysql from "mysql";
import dbConfig from "../config/db.config";

/** MySQL connection */
const connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE
});

export default connection;
