const pool = require ('./dbconfig.js')


//LOGIN A NEW ACCOUNT FUNCTIONS
async function authQuery(nickname, password){
     const results = await pool.query("SELECT * FROM GENERICUSER WHERE nick = '" + nickname + "' AND pwd = '" + password + "'");
     return results[0];
}

async function userExists(nickname){
     const results = await pool.query("SELECT * FROM GENERICUSER WHERE nick = '" + nickname + "'");
     result = results[0];
     if (result.length == 0){
          return false;
     } else {
          return true;
     }
}

async function insertUser(nickname, password){
     const results = await pool.query("INSERT INTO GENERICUSER VALUES ( NULL, '" + nickname + "', '" + password + "', 'common')");
     return results;
}

async function getCode(nickname, password) {
     const results = await pool.query("SELECT code FROM GENERICUSER WHERE nick = '" + nickname + "' AND pwd = '" + password + "'");
     return results[0][0];
}

async function addToCommon(code) {
     const results = await pool.query("INSERT INTO COMMONUSER VALUES (" + code + ")");
     return results;
}

//SUPERUSER OPTIONS

async function searchAllUsers() {
     const results = await pool.query("SELECT code, nick, rol FROM GENERICUSER");
     return results[0];
}

async function searchUsersByNick(searchPattern) {
     const results = await pool.query("SELECT code, nick, rol FROM GENERICUSER WHERE nick LIKE '%" + searchPattern + "%' AND rol != 'super'");
     return results[0];
}

async function upgradeToAdmin(code) {
     const results = await pool.query("INSERT INTO ADMINISTRATOR VALUES (" + code + ")");
     return results;
}

//ADMIN OPTIONS

async function upgradeToArtist(code) {
     const results = await pool.query("INSERT INTO ARTIST (code) VALUES (" + code + ")")
     return results;
}

async function banArtist(code) {
     const results = await pool.query("DELETE FROM ARTIST WHERE code = " + code)
}

module.exports = {authQuery, userExists, insertUser, getCode, addToCommon, searchAllUsers, searchUsersByNick, upgradeToAdmin};