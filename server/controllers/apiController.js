const dbController = require('./dbController');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

module.exports = function(app) {
    app.get('/api/mapitems', (req, res) => {
        dbController.emit('findAllMapItems', items => {
            res.send(items);
        });
    });

    app.get('/api/mapitem/:id', (req, res) => {
        dbController.emit('findItem', item => {
            res.send(item);
        });
    });

    app.post('/api/mapitem/:id/update', jsonParser, (req, res) => {
        const updates = {},
            id = req.params.id;
        Object.keys(req.body).forEach(key => {
            updates[key] = req.body[key];
        });

        dbController.emit('updateMapItem', id, updates, ret => {
            res.send(ret);
        });
    });

    app.post('/api/mapitem', jsonParser, (req, res) => {
        const mapitem = req.body;
        dbController.emit('save', mapitem, (err, msg) => {
            if (err) {
                console.err(err);
                res.send('error');
            }
            console.log(msg);
            res.send('done');
        });
    });
};
