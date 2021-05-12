// Need a web process to stay alive
const express = require('express');
const process = require('process');
const app = express();

app.get('/', (_, res) => res.send('Hello World!'));

app.listen(process.env.PORT, '0.0.0.0', () => console.log(`listening at http://localhost:${process.env.PORT}`));

require('./index');
