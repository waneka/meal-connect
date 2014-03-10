express = require('express');
routes = require('./routes');
http = require('http');
path = require('path');
twilio = require('twilio');
twilioConfig = require('../config/twilio.json');

app = express();


process.env['TWILIO_AUTH_TOKEN'] = twilioConfig["TOKEN"]
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

app.get('/', routes.index);

// Create an call webhook that validates using your Twilio auth token, configured
// in "process.env.TWILIO_AUTH_TOKEN".  Also adds functionality to "response.send"
// to make it intelligently handle TwimlResponse objects.  If "response.send" is
// passed a TwimlResponse object, it will automatically set the proper
// Content-Type header and call "toString()" on the TwimlResponse object
app.post('/call', twilio.webhook({
    validate:false
}), function(request, response) {

    var twiml = new twilio.TwimlResponse();
    twiml.message('This HTTP request came from Twilio!');
    response.send(twiml);
});

// This webhook performs no validation - this might be used for a fallback URL
// for your Twilio number, to ensure a response is always sent back to the user.
app.post('/fallback', twilio.webhook({
    validate:false
}), function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.message('Error: hit fallback URL');
    response.send(twiml);
});


http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
