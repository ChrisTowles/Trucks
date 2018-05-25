"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const xml = require("xml");
const model_1 = require("../../src/app/shared/model");
const AppFirestore_1 = require("./AppFirestore");
const afs = AppFirestore_1.AppFirestore.getInstance();
const addEquipment = (id, data, imagePromises) => {
    return imagePromises.then(imageDocs => {
        const images = [];
        imageDocs.forEach(j => {
            const imgData = j.data();
            const imgId = j.id;
            images.push(Object.assign({ id: imgId }, imgData));
        });
        return {
            item: [
                { uniqueId: id },
                { dealerId: '???' },
                { year: data.year },
                { make: data.make },
                { model: data.model },
                { price: data.price },
                { description: data.comments },
                { category: data.category },
                { class: 'Industrial' },
                { condition: 'used' },
                { city: 'Sparta' },
                { state: 'Kentucky' },
                { zip: '41086' },
                { engineManufacturer: data.engineManufacturer },
                { engineModel: data.engineModel },
                { fuelType: data.fuelType },
                { horsePower: data.engineHP },
                { transmissionManufacturers: data.transmissionManufacturer },
                { transmission: data.transmission },
                {
                    photos: images.map(img => {
                        return { url: img.url };
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
        .where('status', '==', model_1.EquipmentStatus.Visible)
        .where('commercialTruckTrader', '==', true)
        .get()
        .then(items => {
        const promises = [];
        items.forEach(i => {
            const data = i.data();
            const imagesPromise = i.ref.collection('images').get();
            promises.push(addEquipment(i.id, data, imagesPromise));
        });
        Promise.all(promises)
            .then(obj => {
            const result = { items: [] };
            obj.forEach(i => result.items.push(i));
            res.send(xml(result, true));
        })
            .catch(reason => {
            console.error(reason);
        });
    });
});
exports.commercialTruckTraderApp = appCommercialTruckTrader;
//# sourceMappingURL=commercial-truck-trader.js.map