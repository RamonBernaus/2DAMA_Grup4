const pool = require ('./dbconfig.js')
    
async function authQuery(nickname, password){
     const results = await pool.query("SELECT * FROM GENERICUSER WHERE nick = '" + nickname + "' AND pwd = '" + password + "'");
     return results[0];
}

module.exports = {authQuery};