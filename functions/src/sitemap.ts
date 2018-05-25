import * as express from 'express';
import * as sm from 'sitemap';
import {EquipmentStatus} from '../../src/app/shared/model';
import {AppFirestore} from './AppFirestore';

const afs = AppFirestore.getInstance();

const getEquipmentUrl = (data) => {
  //build url
  const name = data.name
    .replace(/-/g, '_')
    .replace(/ /g, '-');

  const stockNumber = data.stockNumber
    .replace(/-/g, '-')
    .replace(/ /g, '-');

  return [stockNumber, name]
    .join('--');
};

// Build Site Map Xml
const appSiteMap = express();
appSiteMap.all('*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.header('Content-Type', 'application/xml');
  const map = sm.createSitemap({
    hostname: 'https://craigmyletrucks.com',
    cacheTime: 600000,  // 600 sec cache period
    urls: [
      {url: '/', changefreq: 'monthly', priority: 0.5},
      {url: '/inventory/', changefreq: 'daily', priority: 1},
      {url: '/directions', changefreq: 'monthly', priority: 0.3},
      {url: '/about', changefreq: 'monthly', priority: 0.3},
      {url: '/contact', changefreq: 'monthly', priority: 0.3},
    ]
  });

  afs.collection('inventory')
    .where('status', '==', EquipmentStatus.Visible)
    .get()
    .then(items => {
      items.forEach(i => {
        map.add({
          url: '/inventory/' + getEquipmentUrl(i.data()),
          changefreq: 'daily',
          priority: 0.5
        });
      });
      res.send(map.toString());
    }, reason => {
      console.error(reason);
    });
});

export const siteMapApp = appSiteMap;
