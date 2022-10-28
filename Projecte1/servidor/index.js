const express = require("express");
const cors = require ("cors");
const mysql = require ("mysql2");

const app = express();
const PORT = 3000;

let con = mysql.createConnection({
    host: "labs.inspedralbes.cat",
    user: "a21enrbonstr_grup4",
    password: "Velladona82",
    database: "a21enrbonstr_plasticprecios"
});

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

    con.connect(function(err){
        if(err) throw err;
        else {
            let sqlCheck = "SELECT * FROM GENERICUSER WHERE nick = " + nickname;
            con.query(sqlCheck, function (err, result, fields){
                if(err) throw err;
                if(result.length == 0){

                    let sqlInsert = "INSER INTO GENERICUSER VALUES ('" + nickname + "', '" + pwd + "', 'common')";
                    con.query(sqlInsert, function (err, result){
                        if(err) throw err;
                        if(result.affectedRows > 0){
                            return true;
                        }else{
                            return false;
                        }
                    });

                } else {
                    console.log("Ja existeix un usuari amb aquests paràmetres, canvia el nick siusplau")
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


//Borrar usuari
app.get("/delete/:userID", (req, res) => {

    let id = req.params.userID;
    
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