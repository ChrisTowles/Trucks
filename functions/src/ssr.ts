require('zone.js/dist/zone-node');

const express = require('express');
const path = require('path');
import {enableProdMode} from '@angular/core';
import {renderModuleFactory} from '@angular/platform-server';


const AppServerModuleNgFactory = require('../../../dist/server/main');

enableProdMode();

const index = require('fs')
  .readFileSync(path.resolve(__dirname, './dist/browser/index.html'), 'utf8')
  .toString();

const app = express();

app.get('**', function (req, res) {
  renderModuleFactory(AppServerModuleNgFactory, {
    url: req.path,
    document: index,
  }).then(html => res.status(200).send(html));
});

export const serverSideRendering = app;
