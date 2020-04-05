const express = require('express');
const path = require('path');
const {
  Client
} = require('pg');

module.exports = {
  start: function () {
    const app = express();
    app.use(express.static('./dist/huntley-meadows-park-map/index.html'));
    setUrlRoutes(app);
    app.listen(process.env.PORT || 8080);
  }
}

function setUrlRoutes(app) {

  /* Set non-angular routes (server / api calls) */

  /* Send all other routes to Angular app */
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../dist/huntley-meadows-park-map/index.html'));
  });

}

/**
 * Asynchronous function which queries the database and returns the response
 * @param {string} queryString - SQL Query String
 * @param {function} callBackFunction - requires parameters (err, res), fires when query finishes
 */
async function queryPrimaryDatabase(queryString, callBackFunction = (err, res) => {}) {
  const pgPsqlClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  await pgPsqlClient.connect();
  return pgPsqlClient.query(queryString, async (err, res) => {
    callBackFunction(err, res);
    pgPsqlClient.end();
  });
}