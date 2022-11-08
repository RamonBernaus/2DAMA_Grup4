const pool = require ('./dbconfig.js')
    
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

module.exports = {authQuery, userExists, insertUser, getCode, addToCommon};