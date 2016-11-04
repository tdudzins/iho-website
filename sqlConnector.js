var mysql = require("mysql");
var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : '192.232.218.129', //ns6153.hostgator.com
  user            : 'thadyou_backend',
  password        : 'w8ggkSWGaOPI',
  database        : 'thadyoun_ihoTestDB'
});

/**
 * Inserts a row to the table of choice in the dataBase
 * @param {string} table is the table the row is being added to
 * @param {object} data the data object being added to the table in the required format
 * @return ?
 */
exports.addRow = function addRow(table, data) {
    pool.query('INSERT INTO ? SET ?', [table, data] , function(err,res){
        if(err)
            console.log('Row not added to table: ' + table);
        else
            console.log('Last insert ID:', res.insertId);
    });
};

/**
 * Removes a row from the table
 * @param {string} table is the name of the table that the row is in
 * @param {string} key the primary key name in the table
 * @param {string} value the value of the primary key
 */
exports.removeRow = function removeRow(table, key, value) {
    pool.query('DELETE FROM ? WHERE ? = ?',[table, key, value] ,function (err, res) {
        if(err)
            console.log('Row not removed from table: ' + table);
        else
            console.log('Deleted ' + res.affectedRows + ' rows');
    });
};

/**
 * Edits a row in the table
 * @param {string} table is the name of the table that the row is in
 * @param {string} key the primary key name in the table
 * @param {string} value the value of the primary key
 * @param {string} data is an array of values to be changed formated like 'id="vlaue",id="vlaue"'
 */
exports.editRow = function editRow(table, key, value, data) {
    pool.query('UPDATE ? SET ? Where ? = ?', [table, data, key, value], function (err, res) {
        if(err)
            console.log('Row not updated in table: ' + table);
        else
            console.log('Changed ' + res.changedRows + ' rows');
    });
};

/**
 * Queries the database. This should not be passed queries from the web directly. No blocking of cmds.
 * @param {string} queryString the query wished to be performed on the database
 * @return {array}  returns the query data as an object
 */
exports.queryData = function queryData(queryString) {
    pool.query('?', queryString, function (err, res) {
        if(err){
            console.log(err);
            return '';
        }
        return res;
    });
};

/**
 * Queries the database for all the eventID and the eventName
 * @return returns all the data in an array of objects {eventID:1, eventName:"Name"},{}...
 */
exports.getNamesandIDs = function getNamesandIDs(){
    pool.query('?', 'SELECT eventID,eventName FROM event', function(err,res){
        if(err){
            console.log('Data Not Retrived');
            return '';
        }
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
        if(err){
            console.log('Failed to get event: ' + eventID);
            return '';
        }
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
        if(err){
            console.log('Failed to get media for: ' + eventID);
            return '';
        }
        return res;
    });
}

/**
 * Queries the database by the eventID and gets all the relation entries associated with the eventID
 * @param {int} eventID the eventID for the required data
 * @return returns an array
 */
exports.getRelations = function getRelations(eventID){
    pool.query('SELECT * FROM relationships WHERE eventID=?', eventID, function(err,res){
        if(err){
            console.log('Failed to get relations for: ' + eventID);
            return '';
        }
        return res;
    });
}

/**
 * Queries the relation table for primaryEventID by the eventID given. It then returns
 * all the data from the event table joined with the data from the relation table to
 * provide all the data needed for loading preconditions and relations in the timeline.
 * @param {int} eventID the eventID for the required data
 * @return returns an array
 */
exports.getAllRelationData = function getAllRelationData(eventID){
    pool.query('SELECT r.secondaryEventID, r.precondition, e.* FROM relationships r INER JOIN event e ON r.secondaryEventID = e.eventID WHERE primaryEventID = ?', eventID, function(err,res){
        if(err){
            console.log('Failed to get data for: ' + eventID);
            return '';
        }
        return res;
    });
}
