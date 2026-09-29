const express = require("express");
const app = express();

app.get("/itmp", (req, res) => {
  res.send("Hello ITMP!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});