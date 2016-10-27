var mysql = require("mysql");
var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : '192.232.218.129', //ns6153.hostgator.com
  user            : 'thadyou_backend',
  password        : 'w8ggkSWGaOPI',
  database        : 'thadyoun_ihoTestDB'
});

/**
 * Inserts a tuple to the table of choice in the dataBase
 * @param {string} table is the table the tuple is being added to
 * @param {object} data the data object being added to the table in the required format
 * @return ?
 */
exports.addRow = function addRow(table, data) {
    pool.query('INSERT INTO ? SET ?', [table, data] , function(err,res){
        if(err)
            console.log('Tuple not added to table: ' + table);
        console.log('Last insert ID:', res.insertId);
    });
};

/**
 * Removes a tuple from the table
 * @param {string} table is the name of the table that the tuple is in
 * @param {string} key the primary key name in the table
 * @param {string} value the value of the primary key
 */
exports.removeRow = function removeRow(table, key, value) {
    pool.query('DELETE FROM ? WHERE ? = ?',[table, key, value] ,function (err, res) {
        if(err)
            console.log('Tuple not removed from table: ' + table);
        console.log('Deleted ' + res.affectedRows + ' rows');
    });
};

/**
 * Edits a tuple in the table
 * @param {string} table is the name of the table that the tuple is in
 * @param {string} key the primary key name in the table
 * @param {string} value the value of the primary key
 * @param {string} data is an array of values to be changed formated like 'id="vlaue",id="vlaue"'
 */
exports.editRow = function editRow(table, key, value, data) {
    pool.query('UPDATE ? SET ? Where ? = ?', [table, data, key, value], function (err, res) {
        if(err)
            console.log('Tuple not updated in table: ' + table);
        console.log('Changed ' + res.changedRows + ' rows');
    });
};

/**
 * Queries the database. This should not be passed queries from the web directly. No blocking of cmds.
 * @param {string} queryString the query wished to be performed on the database
 */
exports.queryData = function queryData(queryString) {
    pool.query('?', queryString, function (err, res) {
        if(err)
            console.log(err);
        console.log(res);
    });
};

/**
 * Queries the database for all the eventID and the eventName
 * @return returns all the data in an array of objects {eventID:1, eventName:"Name"},{}...
 */
exports.getNamesandIDs = function getNamesandIDs(){
    pool.query('?', 'SELECT eventID,eventName FROM event', function(err,res){
        if(err)
            console.log('Tuple not added to table: ' + table);
        console.log('Last insert ID:', res.insertId);
        return res;
    });
}

/**
 * Queries the database by the eventID and gets all the data associated with the event
 * @param {int} eventID the eventID for the required data
 * @return returns an array
 */
exports.getEvent = function getEvent(eventID){
    pool.query('SELECT * FROM event WHERE eventID=?', eventID, function(err,res){
        if(err)
            console.log('Tuple not added to table: ' + table);
        console.log('Last insert ID:', res.insertId);
        return res;
    });
}

/**
 * Queries the database by the eventID and gets all the media associated with the event
 * @param {int} eventID the eventID for the required data
 * @return returns an array
 */
exports.getMedia = function getMedia(eventID){
    pool.query('SELECT * FROM media WHERE eventID=?', eventID, function(err,res){
        if(err)
            console.log('Tuple not added to table: ' + table);
        console.log('Last insert ID:', res.insertId);
        return res;
    });
}

/**
 * Queries the database by the eventID and gets all the data associated with the event
 * @param {int} eventID the eventID for the required data
 * @return returns an array
 */
exports.getEvent = function getNameID(eventID){
    pool.query('SELECT * FROM relation WHERE eventID=?', eventID, function(err,res){
        if(err)
            console.log('Tuple not added to table: ' + table);
        console.log('Last insert ID:', res.insertId);
        return res;
    });
}
