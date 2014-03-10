var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
  name: String
});

var Food = mongoose.model('Food', foodSchema);
module.exports = Food;
