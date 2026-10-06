const express = require("express");
const app = express();

let users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    id: "3",
    name: "Sam Johnson",
    email: "sam.johnson@example.com",
  },
];


app.get("/api/users" , (req,res) => {
  res.status(200).json(users);
})

app.get("/api/users/:id" , (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);

  res.status(200).json(user);
});