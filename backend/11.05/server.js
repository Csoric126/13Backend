const express = require("express");
const mysql2 = require("mysql2");

const app = express();

app.use(express.json());

const conn = mysql2.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "konyvtar_db"
});

//Done
app.get("/", (req, res) => {
    res.status(200).send("Működik ✔");
});

//Done
app.get("/konyvek", (req, res) => {
    let sqlQuery = "SELECT konyvek.id, cim, kiadasi_ev, oldalszam, kolcsonozheto, mufajok.nev as 'mufaj_nev' FROM konyvek INNER JOIN mufajok ON konyvek.mufaj_id = mufajok.id ORDER BY kiadasi_ev"
    conn.query(sqlQuery,
        (err, results) => {
        if (err)
        {
            console.log(err);
            res.status(500).send("Hiba adatbázis hiba");
            return;
        }
        res.status(201).send(results);
    });
});

//Done
app.get("/konyvek/elerheto", (req, res) => {
    let sqlQuery = "SELECT id, cim, kiadasi_ev, oldalszam, kolcsonozheto, mufaj_id FROM konyvek WHERE kolcsonozheto AND kiadasi_ev < 2000 ORDER BY id"
    conn.query(sqlQuery,
        (err, results) => {
        if (err)
        {
            console.log(err);
            res.status(500).send("Hiba adatbázis hiba");
            return;
        }
        res.status(201).send(results);
    });
});

//Done
app.get("/konyvek/hosszuak", (req, res) => {
    let sqlQuery = "SELECT cim, kiadasi_ev, oldalszam FROM konyvek WHERE oldalszam > 400 ORDER BY oldalszam DESC"
    conn.query(sqlQuery,
        (err, results) => {
        if (err)
        {
            console.log(err);
            res.status(500).send("Hiba adatbázis hiba");
            return;
        }
        res.status(201).send(results);
    });
});

//Done
app.get("/konyvek/kereses/:szoveg", (req, res) => {
    let sqlQuery = `SELECT id, mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto FROM konyvek WHERE cim LIKE '%${req.params.szoveg}%';`
    conn.query(sqlQuery,
        (err, results) => {
        if (err)
        {
            console.log(err);
            res.status(500).send("Hiba adatbázis hiba");
            return;
        }
        res.status(201).send(results);
    });
});

//Done
app.get("/mufajok/statisztika", (req, res) => {
    let sqlQuery = "SELECT mufajok.nev ,COUNT(mufaj_id) AS 'konyvek_szama', AVG(oldalszam) AS 'atlagos_oldalszam' FROM konyvek INNER JOIN mufajok ON mufajok.id = konyvek.mufaj_id GROUP BY mufaj_id;"
    conn.query(sqlQuery,
        (err, results) => {
        if (err)
        {
            console.log(err);
            res.status(500).send("Hiba adatbázis hiba");
            return;
        }
        res.status(201).send(results);
    });
});

app.post("/mufajok/ujmufaj", async (req,res) =>{
    try {
        const {nev} = req.body;

        if(!nev){
            return res.status(400).json({error : "A név kitöltése kötelező"});
        }

        const sql = "INSERT INTO mufajok (nev) VALUES (?)";
        const [results] = await conn.promise().query(sql, [nev])
        res.status(201).json({message : "Műfaj sikeresen hozzáadva", nev : results.nev})
    } catch (error) {
        console.error("Hiba a beszúrás során", error)
        res.status(500).json({error: "Adatbázis hiba történt a beszúráskor"})
    }
})

app.post("/konyvek/ujkonyv", async (req,res) =>{
    try {
        const {mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto} = req.body;

        if(!mufaj_id || !cim || !kiadasi_ev || !oldalszam || !kolcsonozheto){
            return res.status(400).json({error : "Az mufaj id, a cím, a kiadási év, az oldalszám és a kölcsönözhetősége kitöltése kötelező"});
        }

        const sql = "INSERT INTO konyvek (mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto) VALUES (?,?,?,?,?)";
        const [results] = await conn.promise().query(sql, [mufaj_id, cim, kiadasi_ev, oldalszam, kolcsonozheto])
        res.status(201).json({message : "Könyv sikeresen hozzáadva", cim: results.cim})
    } catch (error) {
        console.error("Hiba a beszúrás során", error)
        res.status(500).json({error: "Adatbázis hiba történt a beszúráskor"})
    }
})
app.patch('/mufajok/mufajjavitas', async (req, res) => {
    try {
        const { id, nev} = req.body;

        if (!nev || !id) {
            return res.status(400).json({ error: 'A név és az id mező kitöltése kötelező a módosításhoz.' });
        }

        const sql = "UPDATE mufajok SET nev = ? WHERE id = ?";
        const [result] = await conn.promise().query(sql, [nev, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A műfaj nem található.' });
        }
        res.json({ message: "Műfaj sikeresen módosítva", id });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});

app.patch('/konyvek/konyvjavitas', async (req, res) => {
    try {
        const { id, cim} = req.body;

        if (!cim || !id) {
            return res.status(400).json({ error: 'A cím és az id mező kitöltése kötelező a módosításhoz.' });
        }

        const sql = "UPDATE konyvek SET cim = ? WHERE id = ?";
        const [result] = await conn.promise().query(sql, [cim, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A könyv nem található.' });
        }
        res.json({ message: "Könyv sikeresen módosítva", id });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});

app.delete('/mufajok/mufajtorles', async (req, res) => {
    try {
        const { id} = req.body;
        const sql = "DELETE FROM mufajok WHERE id = ? ";
        const [result] = await conn.promise().query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A Műfaj nem található.' });
        }
        res.json({ message: "Műfaj sikeresen törölve", nev });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});

app.delete('/konyvek/konyvtorles', async (req, res) => {
    try {
        const { id, cim} = req.body;
        const sql = "DELETE FROM konyvek WHERE id = ? ";
        const [result] = await conn.promise().query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A Könyv nem található.' });
        }
        res.json({ message: "Könyv sikeresen törölve", cim });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});


//Done
app.listen(3000, (err) =>{
    if(err)
        {
            console.log(err);
            return;
        }
    console.log("API működik a 3000-es porton");
});