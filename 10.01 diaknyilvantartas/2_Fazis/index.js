const express = require("express");
const app = express();
express.json("./1_Fazis/diakok.json")

app.get("/", (req, res) => {
    res.send("Megy a szerver");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});