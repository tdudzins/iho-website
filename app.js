var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var dataBase = require('./sqlConnector.js');
var sessions = require('client-sessions');
var ejs = require('ejs');

// Middleware
var app = express();
app.locals.pretty = true;
app.set('views', './resources/html');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sessions({
    cookieName: 'session',
    secret: 'fkajsdlkajds;aljdc89237r9hf9w83f02jf02fj30ee',
    duration: 60 * 60 * 1000, // duration of cookie lasts 60 minutes
    activeduration: 10 * 60 * 1000,
    httpOnly: true, // dont let browser javascript access cookies ever
    secure: true, // only use cookies over https
    ephemeral: true // delete this cookie when browser is closed
}));

// Helper Functions
function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    }
    else {
        next();
    }
};

// Routing Web Pages
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        dataBase.getUser(req.session.user.email, function(err, dbUser) {
            if(dbUser) {
                req.user = dbUser;
                delete req.user.password;
            }
            next();
        });
    }
    else {
        next();
    }
});

app.get('/', function(req, res){ // TODO Serving Main Page
    res.render('mainpage/index.html', { error: ''}, function(err, html) {
        res.send(html);
    });
});

app.get ('/register', requireLogin, function(req, res) {
    res.render('register/register.html', function(err, html) {
        res.send(html);
    });
});

app.post ('/register', function(req, res) {
    var encryptedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    var data = [ req.body.firstName,
        req.body.lastName,
        req.body.email,
        encryptedPassword ];

        dataBase.addRow('user', data, function(err,dbRes) {
            if(dbRes)
                res.redirect('/login');
            else
                res.redirect('/register');
        });
});

app.get ('/login', function(req, res) {
    res.render('login/login.html', { error: ''}, function(err, html) {
        res.send(html);
    });
});

app.post ('/login', function(req, res) {
    var data = [ req.body.email ];
    dataBase.getUser(data, function(err, dbUser) {
        if(!dbUser) {
            res.render('login/login.html', { error: 'Invalid email or password' }, function(err, html) {
                res.send(html);
            });
        }
        else {
            if(bcrypt.compareSync(req.body.password, dbUser.password)) {
                req.session.user = dbUser;
                res.redirect('/adminpanel');
            }
            else {
                res.render('login/login.html', { error: 'Invalid email or password' }, function(err, html) {
                    res.send(html);
                });
            }
        }
    });
});

app.get ('/adminpanel', requireLogin, function(req, res) {
    res.render('adminpanel/adminpanel.html', {firstName: req.user.firstName, lastName: req.user.lastName}, function(err, html) {
        res.send(html);
    });
});

app.get ('/logout', function(req, res) {
    if (req.session) {
        req.session.reset();
    }
    res.redirect('/login');
});

// Routing AJAX/JQUERY
app.post('/datatoserver', requireLogin, function(req, res){
    if(req.body.table !== 'user'){
        switch (req.body.action) {
            case 'c':
                    dataBase.addRow(req.body.table, req.body.data, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });

                break;
            case 'u':
                dataBase.editRow(req.body.table, req.body.key, req.body.value, req.body.data, function(err, data){
                    if(err)
                        res.status(500).end();
                    else
                        res.end(JSON.stringify(data));
                });
                break;
            case 'd':
                if(req.body.table === category){
                    dataBase.removeCategory(req.body.table, req.body.key, req.body.value, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                else{
                    dataBase.removeRow(req.body.table, req.body.key, req.body.value, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                break;
            default:
                res.status(404);
                res.end("unknown action");
        }
    }
    else{
        res.status(403);
        res.end("cannot edit user table");
    }
});
app.post('/datafromserver', function(req, res){
    if(req.body.table !== 'user'){
        switch (req.body.action) {
            case 'r':
                dataBase.getData(req.body.table, req.body.field, req.body.term, function(err, data){
                    if(err)
                        res.status(500).end();
                    else
                        res.end(JSON.stringify(data));
                });
                break;
            case 'q':
                switch (req.body.table) {
                    case "event":
                        dataBase.getEvent(req.body.eventid, function(err, data){
                            if(err)
                                res.status(500).end();
                            else
                                res.end(JSON.stringify(data));
                        });
                        break;
                    case "media":
                        dataBase.getMedia(req.body.eventid, function(err, data){
                            if(err)
                                res.status(500).end();
                            else
                                res.end(JSON.stringify(data));
                        });
                        break;
                    case "relationships":
                        dataBase.getRelations(req.body.eventid, function(err, data){
                            if(err)
                                res.status(500).end();
                            else
                                res.end(JSON.stringify(data));
                        });
                        break;
                    case "category":
                        dataBase.getCategory(req.body.eventid, function(err, data){
                            if(err)
                                res.status(500).end();
                            else
                                res.end(JSON.stringify(data));
                        });
                        break;

                    default:
                        res.status(404);
                        res.end("unknown action");
                }
                break;
            case 't':
                dataBase.getNamesandIDs(function(err, data){
                    if(err)
                        res.status(500).end();
                    else
                        res.end(JSON.stringify(data));
                });
                break;

            case 's':
                dataBase.getAllRelationData(req.body.eventid, function(err, data){
                    if(err)
                        res.status(500).end();
                    else
                        res.end(JSON.stringify(data));
                });
                break;
            case 'v':
                dataBase.getCategories(function(err, data){
                    if(err)
                        res.status(500).end();
                    else
                        res.end(JSON.stringify(data));
                });
                break;
            default:
                res.status(404);
                res.end("unknown action");
        }
    }
    else{
        res.status(403);
        res.end("cannot view user table");
    }
});

// File Serving
app.get('/resources/html/mainpage/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/mainpage/',
        dotfiles: 'deny',
        headers: {'x-timestamp': Date.now(),'x-sent': true}
    };
    res.sendFile(req.params.name, options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
    });
});
app.get('/resources/html/login/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/login/',
        dotfiles: 'deny',
        headers: {'x-timestamp': Date.now(), 'x-sent': true}
    };
    res.sendFile(req.params.name, options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
    });
});
app.get('/resources/html/register/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/register/',
        dotfiles: 'deny',
        headers: {'x-timestamp': Date.now(), 'x-sent': true}
    };
    res.sendFile(req.params.name, options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
    });
});
app.get('/resources/html/adminpanel/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/adminpanel/',
        dotfiles: 'deny',
        headers: {'x-timestamp': Date.now(), 'x-sent': true}
    };
    res.sendFile(req.params.name, options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
    });
});
app.get('/resources/pictures/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/pictures/',
        dotfiles: 'deny',
        headers: {'x-timestamp': Date.now(), 'x-sent': true}
    };
    res.sendFile(req.params.name, options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
    });
});

app.listen(80);
