const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {
  Client
} = require('pg');

module.exports = {
  start: function () {
    const app = express();
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(express.static('./dist/huntley-meadows-park-map'));
    setUrlRoutes(app);
    console.log(`Starting app on Port ${process.env.PORT || 8080}`);
    app.listen(process.env.PORT || 8080);
    // test();
  }
}

function setUrlRoutes(app) {

  /* Set non-angular routes (server / api calls) */
  app.get('/getroutes', async function (req, res) {
    queryPrimaryDatabase(`select * from recommended_routes;`, function (err, datares) {
      if (datares && datares.rows) {
        res.status(200).json(datares.rows);
      } else {
        res.status(400).end();
      }
    })
  });
  app.get('/get_poi_get_started', async function (req, res) {
    queryPrimaryDatabase(`select * from poi_get_started;`, function (err, datares) {
      if (datares && datares.rows) {
        res.status(200).json(datares.rows);
      } else {
        res.status(400).end();
      }
    })
  });
  app.get('/get_poi_facilities', async function (req, res) {
    queryPrimaryDatabase(`select * from poi_facilities;`, function (err, datares) {
      if (datares && datares.rows) {
        res.status(200).json(datares.rows);
      } else {
        res.status(400).end();
      }
    })
  });
  app.get('/get_poi_local_favorites', async function (req, res) {
    queryPrimaryDatabase(`select * from poi_local_favorites;`, function (err, datares) {
      if (datares && datares.rows) {
        res.status(200).json(datares.rows);
      } else {
        res.status(400).end();
      }
    })
  });
  // app.get('/getlocalfavorites', async function (req, res) {
  //   dataRaw = {test: "test", test2: [1, 2]};
  //   data = JSON.stringify(dataRaw);
  //   res.status(200).json(data);
  // });
  app.post('/postlocalfavorite', async function (req, res) {

    /* Get app data */
    /* Strip all characters except numbers, letters, and period */
    const inputTitle = req.body.inputTitle.replace(/[^\w\s.\-]/g, '');
    const inputLatitude = req.body.inputLatitude.replace(/[^\w\s.\-]/g, '');
    const inputLongitude = req.body.inputLongitude.replace(/[^\w\s.\-]/g, '');
    const inputPin = req.body.inputPin.replace(/[^\w\s.\-]/g, '');

    console.log("Post request received: ", inputTitle,
    inputLatitude,
    inputLongitude,
    inputPin);

    console.log("process.env.POSTPIN1", process.env.POSTPIN1);

    if (inputPin == process.env.POSTPIN1) {

      queryPrimaryDatabase(`
      insert into poi_local_favorites (
        poi_name, latitude, longitude
      ) values (
        '${inputTitle}', ${inputLatitude}, ${inputLongitude}
      );
        `, function (err, response) {
        if (response) {
          res.status(200).json(response);
        } else {
          res.status(400).end();
        }
      })
    } else {
      res.status(401).end();
    }

  });

  /* Send all other routes to Angular app */
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../dist/huntley-meadows-park-map/index.html'));
  });

}

async function test() {
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
  await pgPsqlClient.connect();
  return pgPsqlClient.query(queryString, async (err, res) => {
    callBackFunction(err, res);
    pgPsqlClient.end();
  });
}