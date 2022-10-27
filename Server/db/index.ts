import mysql from "mysql";

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '20000701x',
    database: 'mjm'
})

export default db;