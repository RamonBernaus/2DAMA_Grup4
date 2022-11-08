const express = require("express");
const cors = require ("cors");
const mysql2 = require ("mysql2");

const app = express();
const PORT = 3000;

const persistence = require('./persistence.js')

app.use(cors(
    {
        origin: function(origin, callback){
            return callback(null, true);
        }
    }
));

//autetificació de Usuari.

app.get("/auth/:user/:pwd", async (req, res) => {

    let nickname = req.params.user;
    let password = req.params.pwd;

    let config = {
        auth: false,
        role: "",
        text: ""
    };
    
    let result = await persistence.authQuery(nickname, password);
        if(result.length == 0){
            config.text = "No estas registrat. Crea't un compte abans.";
        } else if (result.length > 1){
            config.text = "Alguna cosa a nat malament. No et dire que.";
        } else {
            let row = result[0];
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

    let exists = await persistence.userExists(nickname);
    
    if(exists){
        creation.text = "Ja existeix un usuari amb aquests paràmetres, canvia el nick siusplau";
    } else {
        let result = await persistence.insertUser(nickname, password);
        if (result[0].affectedRows == 1){
            let codeResult = await persistence.getCode(nickname, password);
            let code = codeResult.code;
            let added = await persistence.addToCommon(code);
            if (added[0].affectedRows == 1){
                creation.text = "Has creat un usuari amb exit";
            } else {
                creation.text = "No s'ha pogut crear l'usuari. prova-ho de nou mes tard."
            }
        }
    }
    
    let str = JSON.stringify(creation);
    res.send(str);
});

app.listen(PORT, () =>{
    console.log("SERVER RUNNING [" + PORT + "]");
});