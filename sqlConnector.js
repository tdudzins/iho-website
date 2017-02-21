var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 100,
    host            : '127.0.0.1',
    user            : 'tdudzins',
    password        : 'Password',
    database        : 'ihodatabase',
    port            : '3306'
});

exports.removeRow = function removeRow(table, key, value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('DELETE FROM ? WHERE ? = ?',[table, key, value] ,function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res[0]);
            });
    });
};

exports.addRow = function addRow(table, data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{
            switch (table) {
                case 'event':
                    var temp = connection.query('INSERT INTO event \
                    (eventName, earliestDirectEvidence, earliestIndirectEvidence, boundaryStart, boundaryEnd, category)\
                    VALUES (?, ?, ?, ?, ?, ?)', data, function(err,result){
                        connection.release();
                        if(result)
                            callback(err, result.insertId);
                        else
                            callback(err, null);
                    });
                    break;
                case 'text':
                    var temp = connection.query('INSERT INTO text (eventID, type, position, text) VALUES (?, ?, ?, ?)', data, function(err,result){
                        connection.release();
                        callback(err, null);
                    });
                    break;
                case 'sequence':
                        var temp = connection.query('INSERT INTO sequence (sequenceID, eventID) VALUES (?, ?)', data, function(err,result){
                            connection.release();
                            callback(err, null);
                        });
                        break;
                case 'relationship':
                    var temp = connection.query('INSERT INTO relationships (primaryEventID, secondaryEventID, precondition) VALUES (?, ?, ?)', data, function(err,result){
                        connection.release();
                        if(result)
                            callback(err, result.insertId);
                        else
                            callback(err, null);
                    });
                    break;
                case 'media':
                    var temp = connection.query('INSERT INTO media (mediaPath, MediaDescription, type, eventID) VALUES (?, ?, ?, ?)', data, function(err,result){
                        connection.release();
                        if(result)
                            callback(err, result.insertId);
                        else
                            callback(err, null);
                    });
                    break;
                case 'category':
                    var temp = connection.query('INSERT INTO category (categoryName) VALUES (?)', data, function(err,result){
                        connection.release();
                        if(result)
                            callback(err, result.insertId);
                        else
                            callback(err, null);
                    });
                    break;
                case 'user':
                    var temp = connection.query('INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', data, function(err,user){
                        connection.release();
                        if(user) {
                            console.log('Inserted into table user successfully. Inserted ID: ' + user.insertId);
                            var dbRes = new Array();
                            dbRes['userID'] = user.insertId;
                            callback(err, dbRes);
                        }
                        else
                            callback(err, null);
                    });
                    break;
                default:
                    connection.release();
                    callback('Table Not Found', null);
            }
        }
    });
};
exports.removeMedia = function removeMedia(value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('DELETE FROM media WHERE mediaID = ?',value ,function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res[0]);
            });
    });
};
exports.removeRelation = function removeRelation(value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('DELETE FROM relationships WHERE relationshipID = ?',value ,function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res[0]);
            });
    });
};
exports.removeCategory = function removeCategory(table, key, value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('UPDATE event SET category=1 WHERE category = ?', value ,function (err, res) {

                if(err)
                    callback(err, null);
                else
                    connection.query('DELETE FROM category WHERE categoryID = ?', value ,function (err, res) {
                            connection.release();
                        if(err)
                            callback(err, null);
                        else

                            callback(err, 1);
                    });
            });
    });
};
exports.removeEvent = function removeEvent(value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{

                connection.query('DELETE FROM media WHERE eventID = ?', value ,function (err, res) {
                    if(err)
                        callback(err, null);
                });
                connection.query('DELETE FROM relationships WHERE primaryEventID = ?', value ,function (err, res) {
                    if(err)
                        callback(err, null);
                });
                connection.query('DELETE FROM event WHERE eventID = ?', value ,function (err, res) {
                    if(err)
                        callback(err, null);
                });
                connection.query('DELETE FROM text WHERE eventID = ?', value ,function (err, res) {
                    if(err)
                        callback(err, null);
                });
                connection.release();
        }
    });
};
exports.removeText = function removeText(data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{

            connection.query('DELETE FROM text WHERE eventID = ?', data ,function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res);
            });
        }
    });
}
exports.removeSequence = function removeSequence(data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{

            connection.query('DELETE FROM sequence WHERE sequenceID = ? AND eventID = ?', data ,function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res);
            });
        }
    });
}
exports.editRow = function editRow(table, key, data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{
            switch (table) {
                case 'event':
                    connection.query('UPDATE event SET eventName = ? WHERE eventID = ?', [data[0], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET earliestDirectEvidence = ? WHERE eventID = ?', [data[1], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET earliestIndirectEvidence = ? WHERE eventID = ?', [data[2], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET boundaryStart = ? WHERE eventID = ?', [data[3], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET boundaryEnd = ? WHERE eventID = ?', [data[4], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET category = ? WHERE eventID = ?', [data[5], key], function (err, res) {if(err)callback(err, null);});
                    connection.release();
                    break;
                case 'media':
                    connection.query('UPDATE media SET mediaPath = ? WHERE mediaID = ?', [data[0], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE media SET mediaDescription = ? WHERE mediaID = ?', [data[1], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE media SET type = ? WHERE mediaID = ?', [data[2], key], function (err, res) {if(err)callback(err, null);});
                    connection.release();
                    break;
                case 'category':
                    connection.query('UPDATE category SET categoryName = ? WHERE categoryID = ?', [data, key], function (err, res) {if(err)callback(err, null);});
                    connection.release();
                    break;
                default:
                    callback(1, null);
            }
            callback(null, 1);
        }
    });
};
exports.getUser = function getUser(data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{
            var result = connection.query('SELECT * FROM user WHERE email = ?', data, function(err,user){
                if(user) {
                    callback(err, user[0]);
                }
                else {
                    console.log('Code ' + err.code + ': Error adding data to user table.');
                    callback(err, null);
                }
            });
            // close connection with database
            connection.release();
        }
    });
};
exports.getEvent = function getEvent(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM event WHERE eventID= ? ', eventID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(null, res);
            });
    });
}
exports.getText = function getText(eventID, type, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT text FROM text WHERE eventID= ? AND type = ? ORDER BY position ASC', [eventID, type], function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(null, res);
            });
    });
}
exports.getSequence = function getSequence(sequenceID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM sequence WHERE sequenceID = ?', sequenceID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(null, res);
            });
    });
}
exports.getSequences = function getSequences(callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM sequence', function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(null, res);
            });
    });
}
exports.getMedia = function getMedia(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM media WHERE eventID=?', eventID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res);
            });
    });
}
exports.getRelations = function getRelations(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM relationships WHERE primaryEventID=?', eventID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res);
            });
    });
}
exports.getCategory = function getCategory(categoryID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM category WHERE categoryID=?', categoryID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res);
            });
    });
}
exports.getCategories = function getCategories(callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM category ORDER BY categoryName', function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res);
            });
    });
}
exports.getAllRelationData = function getAllRelationData(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT r.precondition, e.eventID, e.eventName, e.earliestDirectEvidence, e.earliestIndirectEvidence, e.boundaryStart, e.boundaryEnd FROM relationships r INNER JOIN event e ON r.secondaryEventID = e.eventID WHERE primaryEventID=?', eventID, function(err,res){
                if(err)
                    callback(err, null);
                else{
                    results = res;
                    var result = connection.query('SELECT eventID, eventName, earliestDirectEvidence, earliestIndirectEvidence, boundaryStart, boundaryEnd FROM event WHERE eventID=?', eventID, function(err,res){
                        connection.release();
                        if(err)
                            callback(err, null);
                        else{
                            results.push(res[0]);
                            callback(err, results);
                        }
                    });
                }
            });
    });
}
exports.getNamesandIDs = function getNamesandIDs(callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query( 'SELECT eventID,eventName,category FROM event ORDER BY eventName', function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    callback(err, res);
            });
    });
}
