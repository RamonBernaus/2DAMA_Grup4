const express = require("express");
const cors = require ("cors");
const mysql = require ("mysql2");

const app = express();
const PORT = 3000;

const bdParams = {
    host: "labs.inspedralbes.cat",
    user: "a21enrbonstr_grup4",
    password: "Velladona82",
    database: "a21enrbonstr_plasticprecios"
}


app.use(cors(
    {
        origin: function(origin, callback){
            return callback(null, true);
        }
    }
));

//autetificació de Usuari.
app.get("/auth/:user/:pwd", (req, res) => {

    let nickname = req.params.user;
    let password = req.params.pwd;

    let config = {
        auth: false,
        role: "",
        text: ""
    };
    let con = mysql.createConnection(bdParams);

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
});

//Creacio de nou usuari
app.get("/create/:user/:pwd", (req, res) => {

    let nickname = req.params.user;
    let password = req.params.pwd;

    let creation = {
        text: ""
    };

    if(userExists(nickname)){
        creation.text = "Ja existeix un usuari amb aquests paràmetres, canvia el nick siusplau";
    } else {
        if (insertUser(nickname, password)){
            let code = getUserCode(nickname, password);
            if (addToCommon(code)){
                creation.text = "Has crreat un usuari amb exit";
            }
        } else {
            creation.text = "No s'ha pogut crear l'usuari. prova-ho de nou mes tard."
        }
    }
    
    let str = JSON.stringify(creation);
    res.send(str);
});
    

//Funcions de suport
//CHECK IF USER EXIST
function userExists (nickname) {
    let con = mysql.createConnection(bdParams);

    con.connect(function(err){
        if(err) throw err;
        else {
            let exist;
            let sqlCheck = "SELECT * FROM GENERICUSER WHERE nick = '" + nickname + "'";
            con.query(sqlCheck, function (err, result, fields){
                if(err) throw err;
                if(result.length == 0){
                    exist = false;
                } else {
                    exist = true;
                }
            });

            con.end(function(err) {
                if (err){
                    return console.log('error:' + err.message);
                }
            });
        }
        return exist;
    });
}

//INSERT USER
function insertUser(nickname, password){
    let con = mysql.createConnection(bdParams);

    con.connect(function(err){
        if(err) throw err;
        else {

            let insertOK;
            let sqlInsert = "INSER INTO GENERICUSER VALUES ('" + nickname + "', '" + password + "', 'common')";

            con.query(sqlInsert, function (err, result){
                if(err) throw err;
                if(result.affectedRows == 1){
                    insertOK = true;
                } else {
                    insertOK = false;
                }

                con.end(function(err) {
                    if (err){
                        return console.log('error:' + err.message);
                    }
                });
            });
        }
        return insertOK;
    });
}

//GET USER CODE
function getUserCode(nickname, password){
    let con = mysql.createConnection(bdParams);

    con.connect(function(err){
        if(err) throw err;
        else {

            let code;
            let sqlGet = "SELECT code FROM GENERICUSER WHERE nick = '" + nickname + "' AND pwd = '" + password + "'";
                            
            con.query(sqlGet, function (err, result, fields) {
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
function addToCommon(code){
    let con = mysql.createConnection(bdParams);

    con.connect(function(err){
        if(err) throw err;
        else {

            let added;
            let sqlInsertToCommon = "INSERT INTO COMMONUSER VALUES (" + code + ")";
                            
            con.query(sqlInsertToCommon, function (err, result) {
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