// Need a web process to stay alive
import express from 'express';
import { env } from 'process';
const app = express();

app.get('/', (_, res) => res.send('Hello World!'));

app.listen(env.PORT, '0.0.0.0', () => console.log(`listening at http://localhost:${env.PORT}`));

import './index.js';
