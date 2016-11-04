var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var csrf = require('csurf');
var dataBase = require('./sqlConnector.js');
var sessions = require('client-sessions');
//var session = require('express-session');
/*app.use(session({
	secret: 'MAGICALEXPRESSKEY',
	resave: true,
	saveUninitialized: true
}));
*/
var app = express();
app.set('view engine', 'jade');
app.locals.pretty = true;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(sessions({
  cookieName: 'session',
  secret: 'asldkjasl38t93jv9mesf0qw3mrgt90w54',
  duration: 60 * 60 * 1000, // duration of cookie lasts 60 minutes
  activeduration: 10 * 60 * 1000,
  httpOnly: true, // dont let browser javascript access cookies ever
  secure: true, // only use cookies over https
  ephemeral: true // delete this cookie when browser is closed
}))

app.use(csrf());

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    dataBase.getUser(req.session.user.email, function(err, dbUser) {
      if(dbUser) {
        req.user = dbUser;
        delete req.user.password;
        res.locals.user = dbUser;
      }
      next();
    });
  }
  else {
      next();
  }
});

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  }
  else {
    next();
  }
};

app.get('/', function(req, res){ // main page
    res.render('index.jade');
});

app.get ('/register', requireLogin, function(req, res) {
  res.render('register.jade', {csrfToken: req.csrfToken() });
});

app.post ('/register', function(req, res) {
  var encryptedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  var data = [ req.body.firstName,
    req.body.lastName,
    req.body.email,
    encryptedPassword ];

  dataBase.addUser(data, function(err,dbRes) {
    if(dbRes) {
      console.log('New administator created with userID: ' + dbRes['userID']);
      res.redirect('/login');
    }
    else {
      console.log(err);
      res.redirect('/register');
    }
  });
});

app.get ('/login', function(req, res) {
  res.render('login.jade', {csrfToken: req.csrfToken() });
});

app.post ('/login', function(req, res) {
	console.log('Recieved Login Post');
  var data = [ req.body.email ];
  dataBase.getUser(data, function(err, dbUser) {
    if(!dbUser) {
      res.render('login.jade', { error: 'Invalid email or password.' });
    }
    else {
      if(bcrypt.compareSync(req.body.password, dbUser.password)) {
        req.session.user = dbUser;
        res.redirect('/adminpanel');
      } else {
        res.render('login.jade', { error: 'Invalid email or password.' });
      }
    }
  });
});

app.get ('/adminpanel', requireLogin, function(req, res) {
	console.log('Send Database Admin Panel');
  res.render('adminpanel.jade');
});

app.get ('/logout', function(req, res) {
	console.log('Logout Redirect');
  res.redirect('/');
});

app.listen(8080);
