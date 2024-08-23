require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const port = process.env.PORT || 1337;

// Initialize the Prisma Client
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("/");
});

app.get("/get-users", async (req, res) => {
  console.log("get-users");

  await prisma.user
    .findMany()
    .then((users) => res.json(users))
    .catch((err) => console.log(err));
});

app.post("/create", (req, res) => {
  console.log("create");
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    birthdate: new Date("1962-09-20T00:00:00Z"),
  };

  prisma.user
    .create({
      data: newUser,
    })
    .then((user) => res.json(user))
    .catch((err) => console.log("ERROR: " + err));
});

// for production, React app will be transpiled into build folder
app.use(express.static("./client/build"));

// handle all get requests
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on post ${port}`);
});
