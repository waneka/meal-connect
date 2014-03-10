var Food = require('../models/food');

exports.indexFood = function(req, res) {
  Food.find(function (err, foods) {
    if (err) res.locals.err = err;
    res.locals.foods = foods;
    res.render('foods/index');
  })
};

exports.newFood = function(req, res) {
  res.render('foods/new');
};

exports.createFood = function(req, res) {
  var food = new Food(req.body);
  food.save(function(err, food) {
    if (err) res.locals.err = err;
    res.redirect('foods');
  });
};
