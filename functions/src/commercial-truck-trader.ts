import * as express from 'express';
import * as xml from 'xml';
import {EquipmentImageId, EquipmentStatus} from '../../src/app/shared/model';
import {EquipmentImage} from '../../src/app/shared/model/equipment-image.model';
import {Equipment} from '../../src/app/shared/model/equipment.model';
import {AppFirestore} from './AppFirestore';

const afs = AppFirestore.getInstance();

const addEquipment = (id: string, data: Equipment, imagePromises: Promise<any>): Promise<any> => {
  return imagePromises.then(imageDocs => {
    const images: EquipmentImageId[] = [];
    imageDocs.forEach(j => {
      const imgData = j.data() as EquipmentImage;
      const imgId = j.id;
      images.push({id: imgId, ...imgData});
    });
    return {
      item: [
        {uniqueId: id},
        {dealerId: '???'},
        {year: data.year},
        {make: data.make},
        {model: data.model},
        {price: data.price},
        {description: data.comments},
        {category: data.category},
        {class: 'Industrial'},
        {condition: 'used'},
        {city: 'Sparta'},
        {state: 'Kentucky'},
        {zip: '41086'},
        {engineManufacturer: data.engineManufacturer},
        {engineModel: data.engineModel},
        {fuelType: data.fuelType},
        {horsePower: data.engineHP},
        {transmissionManufacturers: data.transmissionManufacturer},
        {transmission: data.transmission},
        {
          photos: images.map(img => {
            return {url: img.url};
          })
        }
      ]
    };
  });
};


// Build Commercial Truck Trader Xml
const appCommercialTruckTrader = express();
appCommercialTruckTrader.all('*', (req, res) => {

  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.header('Content-Type', 'application/xml');


  afs.collection('inventory')
    .where('status', '==', EquipmentStatus.Visible)
    .where('commercialTruckTrader', '==', true)
    .get()
    .then(items => {

      const promises = [];

      items.forEach(i => {
        const data = i.data() as Equipment;
        const imagesPromise = i.ref.collection('images').get();
        promises.push(addEquipment(i.id, data, imagesPromise));
      });

      Promise.all(promises)
        .then(obj => {
          const result = {items: []};
          obj.forEach(i => result.items.push(i));
          res.send(xml(result, true));
        })
        .catch(reason => {
          console.error(reason);
        });
    });
});
export const commercialTruckTraderApp = appCommercialTruckTrader;
