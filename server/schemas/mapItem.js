var mongoose = require('mongoose');
module.exports = mongoose.Schema({
    name: String,
    id: String,
    category: String,
    keywords: Array,
    categoryDisplay: String,
    link: String,
    pointType: String,
    locationType: String,
    locations: Array,
    latitude: Number,
    longitude: Number,
    mappable: String,
    address: String,
    description: String,
    notes: String,
    shortDesc: String,
    connections: Array
});
