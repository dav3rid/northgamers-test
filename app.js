const express = require('express');

const apiRouter = require('./routes/api');
const {
  handleCustomErrors,
  handleInternalServerErrors,
} = require('./controllers/errors');

const app = express();

app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
