"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Database configuration */
const dbConfig = {
    /** Hostname */
    HOST: process.env.db_host || "localhost",
    /** Username */
    USER: process.env.db_user || "root",
    /** User's password */
    PASSWORD: process.env.db_pw || "password",
    /** Database name */
    DATABASE: process.env.db_name || "database"
};
exports.default = dbConfig;
