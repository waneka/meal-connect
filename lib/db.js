var mongoose = require('mongoose');
mongoose.connect(require('../config/database.json').mongoose);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', console.error.bind(console, 'Connected to mongodb'));
