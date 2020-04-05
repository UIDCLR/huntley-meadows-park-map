const express = require('express');
const path = require('path');
const {
  Client
} = require('pg');

module.exports = {
  start: function () {
    const app = express();
    app.use(express.static('./dist/huntley-meadows-park-map'));
    setUrlRoutes(app);
    console.log(`Starting app on Port ${process.env.PORT || 8080}`);
    app.listen(process.env.PORT || 8080);
    test();
  }
}

function setUrlRoutes(app) {

  /* Set non-angular routes (server / api calls) */
  app.get('/getlocalfavorites', async function (req, res) {
    dataRaw = {test: "test", test2: [1, 2]};
    data = JSON.stringify(dataRaw);
    res.status(200).json(data);
  })

  /* Send all other routes to Angular app */
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../dist/huntley-meadows-park-map/index.html'));
  });

}

async function test () {
  console.log("! Testing database connection");
  console.log("! db url", process.env.DATABASE_URL);
  queryPrimaryDatabase(`select * from test;`, async function (err, res) {
    console.log("! Callback function hit");
    console.log(res && res.rows ? res.rows : error);
  })
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
  console.log("[INFO] Attempting to connect to database...");
  await pgPsqlClient.connect();
  return pgPsqlClient.query(queryString, async (err, res) => {
    callBackFunction(err, res);
    pgPsqlClient.end();
  });
}
