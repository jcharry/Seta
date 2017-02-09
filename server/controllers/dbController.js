const mongoose = require('mongoose');
const mapItemSchema = require('../schemas/mapItem.js');

let MONGO_DB_URI = '';
// In production, use environment var to store mlab uri
if (process.env.PROD_MONGODB) {
    MONGO_DB_URI = process.env.PROD_MONGODB;
} else {
    // Locally store creds for development
    let creds  = require('../creds/creds.js');  // eslint-disable-line
    MONGO_DB_URI = creds.MONGO_DB_URI;
}
mongoose.connect(MONGO_DB_URI);
const db = mongoose.connection;
const MapItem = mongoose.model('MapItem', mapItemSchema);

db.on('open', () => {
    console.log('connection opened');
});

//db.on('addItem', function(item, cb) {
    //console.log('adding item');

    //// Save map item to db
    //console.log(mapItem);
    //cb(null, 'hi');

//});

// Event get's fired synchronously, but mongoose find method is async, which is
// what we want
db.on('findAllMapItems', (cb) => {
    process.nextTick(() => {
        MapItem.find((err, mapitems) => {
            return cb(mapitems);
        });
    });
});

db.on('find', (cb) => {
    //MapItem.query
    cb('hi');
});

db.on('save', (item, cb) => {
    // add new map item
    process.nextTick(() => {
        const mapitem = new MapItem({
            name: item.name,
            address: item.address,
            connections: item.connections,
            category: item.category
        });
        mapitem.save((err) => {
            if (err) {
                console.err(err);
            }
            return cb(err, 'saved');
        });
    });
});

db.on('updateMapItem', (id, updates, cb) => {
    process.nextTick(() => {
        const query = { _id: id };

        MapItem.update(query, updates, { multi: true }, (err, numAffected) => {
            if (err) {
                console.log(err);
            }
            console.log(numAffected);
            cb('done');
        });
    });
});

module.exports = db;
