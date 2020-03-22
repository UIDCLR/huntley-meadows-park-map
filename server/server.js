const express = require('express');
const path = require('path');

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
