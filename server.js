const express = require("express");

const projectRouter = require("./projects/projectRouter");

const actionRouter = require("./actions/actionRouter");

const server = express();

server.use(express.json());

server.use(logger);

server.use("/api/projects", projectRouter);

server.use("/api/actions", actionRouter);

server.get("/", (req, res) => {
  res.send(`<h1>Welcome to my app</h1>`);
});

function logger(req, res, next) {
  const today = new Date().toISOString();
  console.log(`[${today}] ${req.method} to ${req.url}`);

  next();
}

module.exports = server;
