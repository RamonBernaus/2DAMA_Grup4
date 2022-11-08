const mysql = require ("mysql2/promise");

const pool = mysql.createPool({
    host: "labs.inspedralbes.cat",
    user: "a21enrbonstr_grup4",
    database: "a21enrbonstr_plasticprecios",
    password: "Velladona82"
})

module.exports = pool;