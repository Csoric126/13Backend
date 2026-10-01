const express = require("express");
const app = express();
app.use(express.json())


app.get("/osztalyok.json", (req, res) => {
    res.send();
    console.log(res);
});

app.post("/osztalyok.json", (req, res) => {
    res.send("");
})

app.listen("/osztalyok.json", () => {
    console.log("Saw it");
});