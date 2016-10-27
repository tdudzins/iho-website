var express = require('express');
var bodyParser = require('body-parser');
var dataBase = require('./sqlConnector.js');

//var session = require('express-session');
/*app.use(session({
	secret: 'MAGICALEXPRESSKEY',
	resave: true,
	saveUninitialized: true
}));
*/
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(8080);

app.get('/', function(req, res){ // main page
    console.log('Send Main Page');
    res.send('Hello from Express');
});

app.get ('/adminuserpanel', function(req, res, ) {
	console.log('Send admin login page');

});
