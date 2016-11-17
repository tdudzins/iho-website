var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 100,
    host            : '127.0.0.1',
    user            : 'tdudzins',
    password        : 'Password',
    database        : 'ihotestdatabase',
    port            : '3300'
});

// Admin functions

/**
* Inserts a row to the table of choice in the dataBase
* @param {string} table is the table the row is being added to
* @param {object} data the data object being added to the table in the required format
* @param {function} callback is the callback function to be run when complete
*/
exports.addRow = function addRow(table, data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{
            switch (table) {
                case 'event':
                    var temp = connection.query('INSERT INTO event \
                    (eventName, description, earliestDirectEvidence, earliestIndirectEvidence, boundaryStart, boundaryEnd, reference, comments, category)\
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data, function(err,result){
                        var temp = result.insertId;
                        connection.release();
                        if(result)
                            callback(err, temp);
                        else
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

/**
* Removes a row from the table
* @param {string} table is the name of the table that the row is in
* @param {string} key the primary key name in the table
* @param {string} value the value of the primary key
* @param {function} callback is the callback function to be run when complete
*/
exports.removeRow = function removeRow(table, key, value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('DELETE FROM ? WHERE ? = ?',[table, key, value] ,function (err, res) {
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res[0]);
            });
    });
};

/**
* Removes a row from the table
* @param {string} table is the name of the table that the row is in
* @param {string} key the primary key name in the table
* @param {string} value the value of the primary key
* @param {function} callback is the callback function to be run when complete
*/
exports.removeCategory = function removeCategory(table, key, value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('UPDATE event SET category=1 WHERE category = ?', value ,function (err, res) {
                connection.release();
                if(err)
                    callback(err, null);
                else
                    removeRow(table, key, value, callback);
            });
    });
};

/**
* Removes a event and all related content from the database
* @param {string} key the primary key name in the event table
* @param {function} callback is the callback function to be run when complete
*/
exports.removeEvent = function removeEvent(value, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
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
            connection.release();
    });
};

/**
* Edits a row in the table
* @param {string} table is the name of the table that the row is in
* @param {string} key the primary key name in the table
* @param {string} value the value of the primary key
* @param {string} data is an array of values to be changed formated like 'id='vlaue',id='vlaue''
* @param {function} callback is the callback function to be run when complete
*/
exports.editRow = function editRow(table, key, data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else{
            switch (table) {
                case 'event':
                    connection.query('UPDATE event SET eventName = ? WHERE eventID = ?', [data[0], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET description = ? WHERE eventID = ?', [data[1], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET earliestDirectEvidence = ? WHERE eventID = ?', [data[2], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET earliestIndirectEvidence = ? WHERE eventID = ?', [data[3], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET boundaryStart = ? WHERE eventID = ?', [data[4], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET reference = ? WHERE eventID = ?', [data[5], key], function (err, res) {if(err)callback(err, null);});
                    connection.query('UPDATE event SET comments = ? WHERE eventID = ?', [data[6], key], function (err, res) {if(err)callback(err, null);});
                    //connection.query('UPDATE event SET category = ? WHERE eventID = ?', [data[7], key], function (err, res) {if(err)callback(err, null);});
                    connection.release();
                    break;
                default:

                callback(null, 1);
            }
        }
    });
};

/**
* Inserts a row to the user table in the dataBase
* @param {object} data the data object being added to the user table in the required format (firstName, lastName, email, password)
* @return error and array containing any attributes that should be sent back to the callback function.
*/
exports.getUser = function getUser(data, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);

        var result = connection.query('SELECT * FROM user WHERE email = ?', data, function(err,user){
            if(user) {
                callback(err, user[0]);
            }
            else {
                console.log('Code ' + err.code + ': Error adding data to user table.');
                callback(err, null)
            }
        });
        // close connection with database
        connection.release();
    });
};


// Get data by eventID

/**
* Queries the database by the eventID and gets all the data associated with the event
* @param {int} eventID the eventID for the required data
* @param {function} callback is the callback function to be run when complete
*/
exports.getEvent = function getEvent(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM event WHERE eventID=?', eventID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res);
            });
    });
}

/**
* Queries the database by the eventID and gets all the media associated with the event
* @param {int} eventID the eventID for the required data
* @return returns an array
*/
exports.getMedia = function getMedia(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM media WHERE eventID=?', eventID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res);
            });
    });
}

/**
* Queries the database by the eventID and gets all the relation entries associated with the eventID
* @param {int} eventID the eventID for the required data
* @param {function} callback is the callback function to be run when complete
*/
exports.getRelations = function getRelations(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM relationships WHERE primaryEventID=?', eventID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res);
            });
    });
}

/**
* Queries the database by the categoryID
* @param {int} categoryID the categoryID for the required data
* @param {function} callback is the callback function to be run when complete
*/
exports.getCategory = function getCategory(categoryID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM category WHERE categoryID=?', categoryID, function (err, res) {
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res);
            });
    });
}


// General Searches

/**
* Inserts a row to the user table in the dataBase
* @param {string} table the table name
* @param {string} col the column
* @param {string} term a single word to search for
* @return error and array containing any attributes that should be sent back to the callback function.
*/
exports.getData = function getData(table, col, term, callback) {
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);

        var result = connection.query('SELECT * FROM ? WHERE ? LIKE ?', [table, col, term], function(err,user){
            if(user) {
                callback(err, user[0]);
            }
            else {
                console.log('Code ' + err.code + ': Error adding data to user table.');
                callback(err, null)
            }
        });
        // close connection with database
        connection.release();
    });
};


// Premade searches

/**
* Queries the database by the categoryID and returns it in abc order
* @param {int} categoryID the categoryID for the required data
* @param {function} callback is the callback function to be run when complete
*/
exports.getCategories = function getCategories(callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT * FROM category ORDER BY categoryName', function (err, res) {
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res);
            });
    });
}

/**
* Queries the relation table for primaryEventID by the eventID given. It then returns
* all the data from the event table joined with the data from the relation table to
* provide all the data needed for loading preconditions and relations in the timeline.
* @param {int} eventID the eventID for the required data
* @return returns an array
*/
exports.getAllRelationData = function getAllRelationData(eventID, callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query('SELECT r.secondaryEventID, r.precondition, e.* FROM relationships r INER JOIN event e ON r.secondaryEventID = e.eventID WHERE primaryEventID = ?', eventID, function(err,res){
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res);
            });
    });
}

/**
* Queries the database for all the eventID and the eventName
* @param {function} callback is the callback function to be run when complete
* returns all the data in an array of objects {eventID:1, eventName:'Name'},{}...
*/
exports.getNamesandIDs = function getNamesandIDs(callback){
    pool.getConnection(function(err,connection){
        if (err) callback(err, null);
        else
            var result = connection.query( 'SELECT eventID,eventName,category FROM event ORDER BY eventName', function (err, res) {
                connection.release();
                if(err)
                    callback(err, null)
                else
                    callback(err, res);
            });
    });
}
