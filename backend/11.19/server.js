const express = require("express");
const mysql2 = require("mysql2");

const app = express();

app.use(express.json());

const conn = mysql2.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "fitness_db"
});

app.get("/", (req, res) => {
    res.status(200).send("Működik ✔");
});

app.listen(3000,() =>{
    console.log("a szerver a 3000-es porton fut")
});

app.get("/berletek", async (req, res) =>{
    try {
        let sqlQuery = "SELECT berletek.id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto, tipusok.nev FROM berletek INNER JOIN tipusok ON berletek.tipus_id = tipusok.id ORDER BY berletek.ar ASC;";
        const[results] = await conn.promise().query(sqlQuery);
        res.status(200).json(results)
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/berletek/elerheto", async (req, res) =>{
    try {
        let sqlQuery = "SELECT berletek.id, berletek.tipus_id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto FROM berletek WHERE berletek.ervenyesseg_nap <= 30;";
        const[results] = await conn.promise().query(sqlQuery);
        res.status(201).json(results)
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/berletek/kereses/:szoveg", async (req, res) =>{
    try {
        const {szoveg} = req.params;
        let sqlQuery = `SELECT berletek.id, berletek.tipus_id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto FROM berletek WHERE megnevezes LIKE ?;`
        const[results] = await conn.promise().query(sqlQuery, [`%${szoveg}%`]);
        res.status(201).json(results);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/tipusok/statisztika", async (req, res) =>{
    try {
        let sqlQuery = `SELECT tipusok.nev, COUNT(berletek.id) AS "berletek_szama", ROUND(AVG(berletek.ar)) AS "atlagos_ar" FROM berletek INNER JOIN tipusok ON berletek.tipus_id = tipusok.id GROUP BY berletek.tipus_id;`;
        const[results] = await conn.promise().query(sqlQuery);
        res.status(201).json(results)
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/berletek/dragak", async (req, res) =>{
    try {
        let sqlQuery = "SELECT berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap FROM berletek WHERE ar > 20000 ORDER BY ervenyesseg_nap DESC;";
        const[results] = await conn.promise().query(sqlQuery);
        res.status(201).json(results)
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post("/berletek/ujberlet", async (req,res) =>{
    try {
        const {tipus_id, megnevezes, ar, elerheto} = req.body;

        if(!tipus_id || !megnevezes || !ar || elerheto == null){
            return res.status(400).json({error});
        }

        const sql = "INSERT INTO berletek (tipus_id, megnevezes, ar, elerheto) VALUES (?,?,?,?)";
        const [results] = await conn.promise().query(sql, [tipus_id, megnevezes, ar, elerheto])
        res.status(201).json({message : "Bérlet sikeresen hozzáadva", megnevezes: results.megnevezes})
    } catch (error) {
        console.error("Hiba a beszúrás során", error)
        res.status(500).json({error: "Adatbázis hiba történt a beszúráskor"})
    }
})

app.patch('/berletek/berletjavitas', async (req, res) => {
    try {
        const { id, megnevezes} = req.body;

        if (!megnevezes || !id) {
            return res.status(400).json({error});
        }

        const sql = "UPDATE berletek SET megnevezes = ? WHERE id = ?";
        const [result] = await conn.promise().query(sql, [megnevezes, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A bérlet nem található.' });
        }
        res.json({ message: "Bérlet sikeresen módosítva", id });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});

app.delete('/berletek/berlettorles', async (req, res) => {
    try {
        const { id} = req.body;
        const sql = "DELETE FROM berletek WHERE id = ? ";
        const [result] = await conn.promise().query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A Bérlet nem található.' });
        }
        res.json({ message: "Bérlet sikeresen törölve", nev });
    } catch (error) {
        console.error("Hiba a módosítás során: ", error);
        res.status(500).json({ error: 'Adatbázis hiba történt a módosításkor.' });
    }
});