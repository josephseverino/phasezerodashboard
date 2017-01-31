var mongoose = require('mongoose'),

    AcledSchema = new mongoose.Schema({
        country: String,
        event_date: String,
        fatalities: String,
        latitude: String,
        longitude: String

    });

module.exports = mongoose.model('Acled', AcledSchema);
