const express = require("express");
const cors = require ("cors");
//const mysql= require ("mysql2/promise");
const mysql2 = require ("mysql2");

const app = express();
const PORT = 3000;

const persistence = require('./persistence.js')

/*const bdParams = {
    host: "labs.inspedralbes.cat",
    user: "a21enrbonstr_grup4",
    password: "Velladona82",
    database: "a21enrbonstr_plasticprecios"
}*/


app.use(cors(
    {
        origin: function(origin, callback){
            return callback(null, true);
        }
    }
));

//autetificació de Usuari.
/*app.get("/auth/:user/:pwd", (req, res) => {

    let nickname = req.params.user;
    let password = req.params.pwd;

    let config = {
        auth: false,
        role: "",
        text: ""
    };
    let con = mysql2.createConnection(bdParams);

    con.connect(function(err){
        if(err) throw err;
        else {
            let sql = "SELECT * FROM GENERICUSER WHERE nick = '" + nickname + "' AND pwd = '" + password + "'";
            console.log(sql);
            con.query(sql, function (err, result, fields){
                if(err) throw err;
                if(result.length == 0){
                    //console.log("No estas registrat. Crea't un compte abans.")
                    config.text = "No estas registrat. Crea't un compte abans.";
                } else if (result.length > 1){
                    //console.log("Alguna cosa a nat malament. No et dire que")
                    config.text = "Alguna cosa a nat malament. No et dire que.";
                } else {
                    let row = result[0];
                    config.auth = true;
                    config.role = row.rol;
                    config.text = "Benvingut/da " + nickname;
                    //console.log(row.nick + ", " + row.rol);
                }

                let str = JSON.stringify(config);
                res.send(str);
            });

            con.end(function(err) {
                if (err){
                    return console.log('error:' + err.message);
                }
            });
        }
    });
});*/

app.get("/auth/:user/:pwd", async (req, res) => {

    let nickname = req.params.user;
    let password = req.params.pwd;

    let config = {
        auth: false,
        role: "",
        text: ""
    };
    
    let result = await persistence.authQuery(nickname, password);
    console.log(result);
    let row = result[0];
    console.log(result.length);
    console.log(row);
    console.log(row.code);
    console.log(row.nick);
    console.log(row.pwd);
    console.log(row.rol);
        if(result.length == 0){
            config.text = "No estas registrat. Crea't un compte abans.";
        } else if (result.length > 1){
            config.text = "Alguna cosa a nat malament. No et dire que.";
        } else {
            config.auth = true;
            config.role = row.rol;
            config.text = "Benvingut/da " + nickname;
        }

        let str = JSON.stringify(config);
        res.send(str);
});

//Creacio de nou usuari
app.get("/create/:user/:pwd", async (req, res) => {

    let nickname = req.params.user;
    let password = req.params.pwd;

    let creation = {
        text: ""
    };
    var exist=  await userExists(nickname)
    console.log("exist = "+exist)
    console.log(exist);
    if(exist){
        creation.text = "Ja existeix un usuari amb aquests paràmetres, canvia el nick siusplau";
    } else {
        creation.text = "TODO";

       /* if (insertUser(nickname, password)){
            let code = getUserCode(nickname, password);

            if (addToCommon(code)){
                creation.text = "Has crreat un usuari amb exit";
            }
        } else {
            creation.text = "No s'ha pogut crear l'usuari. prova-ho de nou mes tard."
        }*/
    }
    
    let str = JSON.stringify(creation);
    res.send(str);
});
    

//Funcions de suport
//CHECK IF USER EXIST
async function userExists (nickname) {

    let con = await mysql.createConnection(bdParams);
    let exist = false;
    console.log(nickname);
    console.log("user exist");
    await con.connect(async (err) => {
        console.log("works???");
        if(err) throw err;
        else {
            
            let sqlCheck = "SELECT * FROM GENERICUSER WHERE nick = '" + nickname + "'";
            /*await con.promise().query(sqlCheck, function (err, result, fields){
                console.log("query user exist");
                if(err) throw err;
                if(result.length == 0){
                    console.log("false");
                    exist = false;
                } else {
                    console.log("true");
                    exist = true;
                }
            });*/
            const[rows, fields] = await con.execute(sqlCheck);
            console.log(rows + "; " + fields);

            con.end(function(err) {
                if (err){
                    return console.log('error:' + err.message);
                }
            });
        }
        //return exist;
    });
    console.log("ends user exist"+exist);
    return exist;
}

//INSERT USER
 async function insertUser(nickname, password){
    
    let con = mysql.createConnection(bdParams);
    let insertOK= false;
    console.log("insert User");
    let connectionPromise = con.promise().connect( async (err) => {
        console.log("entra");
        if(err) throw err;
        else {

            let sqlInsert = "INSERT INTO GENERICUSER VALUES ( NULL, '" + nickname + "', '" + password + "', 'common')";

            await con.promise().query(sqlInsert, (err, result) => {
                if(err) throw err;
                console.log(result.affectedRows + "," + result.changedRows);
                if(result.affectedRows == 1){
                    console.log("insert: true");
                    insertOK = true;
                } else {
                    console.log("insert: false");
                    insertOK = false;
                }

                con.end(function(err) {
                    if (err){
                        return console.log('error:' + err.message);
                    }
                });
            });
        }
   return true;
    });
    console.log(connectionPromise);
    await connectionPromise;
    return insertOK;
}

//INSERT USER
/*async function insertUser(nickname, password){
    
    let con = mysql.createConnection(bdParams);
    let insertOK;
    let myPromise = null;

    await con.connect(function(err){
        if(err) throw err;
        else {

            let sqlInsert = "INSERT INTO GENERICUSER VALUES ( NULL, '" + nickname + "', '" + password + "', 'common')";

             myPromise = new Promise(function (resolve, reject){
                resolve(
                    con.query(sqlInsert, function (err, result){
                        if(err) throw err;
                        console.log(result.affectedRows + "," + result.changedRows);
                        if(result.affectedRows == 1){
                            console.log("true");
                            return true;
                        } else {
                            console.log("false");

                            return false;
                        }
                    })
                );
            })

            con.end(function(err) {
                if (err){
                    return console.log('error:' + err.message);
                }
            });
            
        }
    });
    return insertOK = await myPromise;
}*/

//GET USER CODE
async function getUserCode(nickname, password){

    let con = mysql.createConnection(bdParams);
    let code;

    await con.promise().connect(async function(err){
        if(err) throw err;
        else {

            let sqlGet = "SELECT code FROM GENERICUSER WHERE nick = '" + nickname + "' AND pwd = '" + password + "'";
                            
            con.promise().query(sqlGet, function (err, result, fields) {
                if(err) throw err;
                else {
                    let row = result[0];
                    code = row.code;
                }
            });

            con.end(function(err) {
                if (err){
                    return console.log('error:' + err.message);
                }
            });
        }
        return code;
    });
}

//ADD TO COMMON
async function addToCommon(code){

    let con = mysql.createConnection(bdParams);
    let added;

    await con.promise().connect(async function(err){
        if(err) throw err;
        else {

            let sqlInsertToCommon = "INSERT INTO COMMONUSER VALUES (" + code + ")";
                            
            con.promise().query(sqlInsertToCommon, function (err, result) {
                if(err) throw err;
                if (result.affectedRows == 1) {
                    added = true;                    
                } else {
                    added = false;
                }

                con.end(function(err) {
                    if (err){
                        return console.log('error:' + err.message);
                    }
                });
            });
        }
        return added;
    });
}

//Borrar usuari
app.get("/delete/:userID", (req, res) => {

    let id = req.params.userID;
    let con = mysql.createConnection(bdParams);

    con.connect(function (err){
        if(err) throw err;
        else {
            let sqlDelete = "DELETE FROM GENERICUSER WHERE code = " + id;
            con.query(sqlDelete, function (err, result){
                if (err) throw err;
                if (result.affectedRows == 0){
                    console.log("Aquest Usuari no existeix, és extrany oi?")
                    return false;
                } else {
                    console.log("Usuari borrat amb éxit")
                    return true;
                }
            });

            con.end(function(err) {
                if (err){
                    return console.log('error:' + err.message);
                }
            });
        }
    });
});

//Trobar artistes
app.get("/getArtist/:name", (req, res) => {

    let artistName = req.params.name;
    let con = mysql.createConnection(bdParams);

    con.connect(function(err){
        if(err) throw err;
        else {
            let sql = "SELECT * FROM GENERICUSER JOIN ARTIST USING code WHERE GENERICUSER.nick LIKE '" + artistName + "'";
            con.query(sql, function (err, result){
                if(err) throw err;
                if(result.length == 0){
                    console.log("No s'han trobat artistes que coincideixin amb aquest nom");
                } else {
                    for(var i = 0; i < result.length; i++){
                        let row = result[i];
                        console.log(row.nick + ", " + row.descr + ", " + row.img);
                    }
                }
            });

            con.end(function(err) {
                if (err){
                    return console.log('error:' + err.message);
                }
            });
        }
    })
});

app.listen(PORT, () =>{
    console.log("SERVER RUNNING [" + PORT + "]");
});