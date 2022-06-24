import express from 'express';

import convertPdf from './convertPdf.js';

const app = express();
const port = 3030;

app.get('/', (req, res) => {
  res.send(`Hello World! ${new Date()}`);
});

app.get('/pdf', convertPdf);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
