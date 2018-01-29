require('zone.js/dist/zone-node');
require('reflect-metadata');
global['WebSocket'] = require('ws');
global['XMLHttpRequest'] = require('XMLHttpRequest').XMLHttpRequest;

const {enableProdMode} = require('@angular/core');
enableProdMode();

const express = require('express');
const fs = require('fs');
//
const {platformServer, renderModuleFactory} = require('@angular/platform-server');
const {ngExpressEngine} = require('@nguniversal/express-engine');

// Import the AOT compiled factory for your AppServerModule.
// This import will change with the hash of your built server bundle.
const {AppServerModuleNgFactory} = require(`./dist/dist-server/main.bundle`);
//
const app = express();
const port = 8000;
const baseUrl = `http://localhost:${port}`;

// Set the engine
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: []
}));

app.set('view engine', 'html');

app.set('views', './dist/');
app.use('/', express.static('./dist/', {index: false}));

// // Server static files from /browser
// app.get('*.*', express.static('./'));

//res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
//res.send(html);

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  console.log(req);
  res.render('index', {
    req,
    res
  });
});

app.listen(port, () => {
  console.log(`Listening at ${baseUrl}`);
});
