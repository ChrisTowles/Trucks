import 'zone.js/dist/zone-node';

import * as functions from 'firebase-functions';
import {renderModuleFactory} from '@angular/platform-server';
import {enableProdMode} from '@angular/core';

import * as express from 'express';
import {join} from 'path';
import {readFileSync} from 'fs';


enableProdMode();

const DIST_FOLDER = join(__dirname, '/../dist');

const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require(__dirname + '/../dist/server/main.bundle');
const {provideModuleMap} = require('@nguniversal/module-map-ngfactory-loader');


const app = express();


const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html'), 'utf8').toString();


app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    callback(null, html);
  }, (reason) => {
    console.log('reason');
    console.error(reason);
  });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

//res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
//res.send(html);

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), {req});
});


export let ssrapp = functions.https.onRequest(app);
