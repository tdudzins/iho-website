var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var dataBase = require('./sqlConnector.js');
var sessions = require('client-sessions');
var fileUpload = require('express-fileupload');
var ejs = require('ejs');

// Middleware
var app = express();
app.locals.pretty = true;
app.set('views', './resources/html');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
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

app.post ('/register', requireLogin, function(req, res) {
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
                if(req.body.table === 'event'){
                    var eData = [req.body.data[0], req.body.data[1], req.body.data[2], req.body.data[3], req.body.data[4], req.body.data[5]];
                    var tData = [req.body.data[6], req.body.data[7], req.body.data[8]];

                    dataBase.addRow(req.body.table, eData, function(err, eventID){
                        if(err){
                            console.log('1'+err);
                            res.status(500).end();
                        }
                        else{
                            var colType = ['descript', 'referenc', 'comments'];
                            tData.forEach(function(item, index){
                                var i = 0;
                                var str = item;
                                while(str){
                                    dataBase.addRow('text', [eventID, colType[index], i, str.substr(0,999)], function(err, data){
                                        if(err){console.log('2'+err); res.status(500).end();}
                                    });
                                    str = str.substr(1000);
                                    i++;
                                }
                            });
                            res.end(JSON.stringify(eventID));
                        }
                    });
                }
                else{
                    dataBase.addRow(req.body.table, req.body.data, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                break;
            case 'u':
                if(req.body.table === 'event'){
                    var eData = [req.body.data[0], req.body.data[1], req.body.data[2], req.body.data[3], req.body.data[4], req.body.data[5]];
                    var tData = [req.body.data[6], req.body.data[7], req.body.data[8]];
                    dataBase.editRow(req.body.table, req.body.key, eData, function(err, data){
                        if(err){
                            console.log('3'+err);
                            res.status(500).end();
                        }
                        else{
                            dataBase.removeText(req.body.key, function(err, dat){
                                if(err){
                                    console.log('45'+err);
                                    res.status(500).end();
                                }
                                else{
                                    var colType = ['descript', 'referenc', 'comments'];
                                    tData.forEach(function(item, index){
                                        var i = 0;
                                        var str = item;
                                        while(str){
                                            dataBase.addRow('text', [req.body.key, colType[index], i, str.substr(0,999)], function(err, da){
                                                if(err){console.log('4'+err); res.status(500).end();}
                                            });
                                            str = str.substr(1000);
                                            i++;
                                        }
                                        res.end(JSON.stringify(data));
                                    });
                                }
                            });
                        }
                    });
                }
                else{
                    dataBase.editRow(req.body.table, req.body.key, req.body.data, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                break;
            case 'd':
                if(req.body.table === 'category'){
                    dataBase.removeCategory(req.body.table, req.body.key, req.body.value, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                else if (req.body.table === 'event') {
                    dataBase.removeEvent(req.body.value, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                else if (req.body.table === 'text') {
                    dataBase.removeText(req.body.value, req.body.type, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                else if (req.body.table === 'sequence') {
                    dataBase.removeSequence(req.body.value, req.body.key, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                else if (req.body.table === 'media') {
                    dataBase.removeMedia(req.body.value, function(err, data){
                        if(err)
                            res.status(500).end();
                        else{
                            var fs = require('fs');
                            var filePath = "/home/cjyoung3" + req.body.filepath;
                            fs.unlink(filePath, function(){
                                res.end(JSON.stringify(data));
                            });
                        }
                    });
                }
                else if (req.body.table === 'relationships') {
                    dataBase.removeRelation(req.body.value, function(err, data){
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                else{
                    dataBase.removeRow(req.body.table, req.body.key, req.body.value, function(err, data){
                        console.log("If you see this let chris know");
                        if(err)
                            res.status(500).end();
                        else
                            res.end(JSON.stringify(data));
                    });
                }
                break;
            case 'a':
                dataBase.removeSequences(req.body.value, function(err, data){
                    if(err)
                        res.status(500).end();
                    else
                        res.end(JSON.stringify(data));
                });
                break
            default:
                res.status(404);
                res.end('unknown action');
        }
    }
    else{
        res.status(403);
        res.end('cannot edit user table');
    }
});
app.post('/datafromserver', function(req, res){
    if(req.body.table !== 'user'){
        switch (req.body.action) {
            case 'q':
                switch (req.body.table) {
                    case 'event':
                        dataBase.getEvent(req.body.eventid, function(err, data){
                            if(err)
                                res.status(500).end();
                            else
                                res.end(JSON.stringify(data));
                        });
                        break;
                    case 'text':
                        dataBase.getText(req.body.eventid, req.body.type, function(err, data){
                            if(err)
                                res.status(500).end();
                            else{
                                var str = '';
                                data.forEach(function(item){
                                    str += item.text;
                                });
                                res.end(JSON.stringify(str));
                            }
                        });
                        break;
                    case 'media':
                        dataBase.getMedia(req.body.eventid, function(err, data){
                            if(err)
                                res.status(500).end();
                            else
                                res.end(JSON.stringify(data));
                        });
                        break;
                    case 'relationships':
                        dataBase.getRelations(req.body.eventid, function(err, data){
                            if(err)
                                res.status(500).end();
                            else
                                res.end(JSON.stringify(data));
                        });
                        break;
                    default:
                        res.status(404);
                        res.end('unknown action');
                }
                break;
            case 't':
                dataBase.getNamesandIDs(function(err, data){

                    if(err){
                        console.log(err);
                        res.status(500).end();
                    }
                    else
                        res.end(JSON.stringify(data));
                });
                break;
            case 's':
                dataBase.getAllRelationData(req.body.eventid, function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500).end();
                    }
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
            case 'w':
                dataBase.getSequences(function(err, data){
                    if(err)
                        res.status(500).end();
                    else
                        res.end(JSON.stringify(data));
                });
                break;
            default:
                res.status(404);
                res.end('unknown action');
        }
    }
    else{
        res.status(403);
        res.end('cannot view user table');
    }
});

// File Uploading
app.post('/upload', requireLogin, function(req, res) {
    //console.log(req.files);
    if (!req.files) {
        res.status(400);
        res.end('No file was uploaded.');
        return;
    }
    else{
        var incomingFile = req.files.picture;
        var filename = incomingFile.name;
        var extPlace = filename.lastIndexOf('.');
        var filenameExt = filename.slice(extPlace);

        var now = new Date;
        var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        var newFilename = '/resources/uploads/' + utc_timestamp + filenameExt;

        incomingFile.mv("/home/cjyoung3" + newFilename, function(err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.end(JSON.stringify(newFilename));
            }
        });
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
          //res.status(err.status).end();
        }
    });
});
app.get('/resources/html/mainpage/css/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/mainpage/css/',
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
app.get('/resources/html/mainpage/font/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/mainpage/font/',
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
app.get('/resources/html/mainpage/img/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/mainpage/img/',
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
app.get('/resources/html/mainpage/js/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/html/mainpage/js/',
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
app.get('/resources/html/register/:name', requireLogin, function(req, res){
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
app.get('/resources/html/adminpanel/:name', requireLogin, function(req, res){
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
app.get('/resources/uploads/:name', function(req, res){
    var options = {
        root:  __dirname + '/resources/uploads/',
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
