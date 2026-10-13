const express = require("express");
const app = express();
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port : process.env.DB_PORT,
    database : process.env.DB_DATABASE
})

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000/");
  });

app.get("/api/zenekarok",(req,res ) =>{
    db.query(`SELECT * FROM zenekarok`),(err,result) => (res.json());
})

app.get("/api/stilusok",(req,res ) =>{
    db.query(`SELECT stilus_neve FROM stilusok`),(err,result) => (res.json());
})

app.post("/api/zenekarok",(req,res)=>{
    db.query(`INSERT INTO zenekarok (id, nev, stilus_id, orszag, varos, aktiv_evek, tagok, legsikeresebb_album, kep_url) VALUES(?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)`)[req.body.nev, req.body.stilus_id, req.body.orszag, req.body.varos, req.body.aktiv_evek, req.body.tagok, req.body.legsikeresebb_album, req.body.kep_url], (err, result) => {
        if(err)
        {
            res.status(401).send("Hiányos adatok");
            console.log(err);
            return;
        }
        res.status(201).send("Sikeres feltöltés");
    }
})
