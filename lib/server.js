express = require('express');
http = require('http');
path = require('path');

require('./db');

app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('meal-connect'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var indexRoutes = require('./routes/index');
var foodRoutes = require('./routes/food');

app.get('/', indexRoutes.index);
app.get('/foods/new', foodRoutes.newFood);
app.get('/foods', foodRoutes.indexFood);
app.post('/foods', foodRoutes.createFood);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
