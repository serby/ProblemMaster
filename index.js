const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const level = require("level");
const db = level("problems");

const port = 3200;
const cors = require("cors");
app.use(morgan("tiny"));
app.use(cors());

const collectionQuery = (collection) => ({
  gte: collection + ":",
  lte: collection + ":~",
});

app.get("/:collection/_keys", (req, res) => {
  res.type("json");
  const response = [];
  db.createKeyStream(collectionQuery(req.params.collection))
    .on("data", (data) => {
      response.push(JSON.parse(data));
    })
    .on("end", () => {
      res.send(response);
    });
});

app.get("/:collection/", (req, res) => {
  res.type("json");
  const response = [];
  db.createValueStream(collectionQuery(req.params.collection))
    .on("data", (data) => {
      response.push(JSON.parse(data));
    })
    .on("end", () => {
      res.send(response);
    });
});

app.get("/:collection/:id", async (req, res) => {
  const response = [];
  res.type("json");
  try {
    res.send(await db.get(req.params.collection + ":" + req.params.id));
  } catch (e) {
    if (e.notFound) {
      res.status(404).send("Not found");
    } else {
      res.status(500).send(e);
    }
  }
});

app.delete("/:collection", async (req, res) => {
  res.type("json");
  const response = await db.clear(collectionQuery(req.params.collection));
  console.log(response);
  res.send("OK");
});

app.delete("/:collection/:id", async (req, res) => {
  const response = [];
  res.type("json");
  const key = req.params.collection + ":" + req.params.id;
  if (await db.get(key)) {
    await db.del(key);
    res.send("Deleted " + key);
  } else {
    res.status(404).send("Not found");
  }
});

app.post("/:collection/:id", bodyParser.json(), async (req, res) => {
  const response = [];
  res.type("json");
  console.log(req.body);
  await db.put(
    req.params.collection + ":" + req.params.id,
    JSON.stringify(req.body)
  );
  res.status(201).end();
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
