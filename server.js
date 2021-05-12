const express = require("express");
const process = require("process");
require("./index");
const app = express();
const port = Number.parseInt(process.env["PORT"] ?? 3000);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
