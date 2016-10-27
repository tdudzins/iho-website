var mysql = require("mysql");
var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : '192.232.218.129', //ns6153.hostgator.com
  user            : 'thadyou_backend',
  password        : 'w8ggkSWGaOPI',
  database        : 'thadyoun_ihoTestDB'
});

/*
*
*/
exports.addTuple = function addTuple(data) {

};
/*
*
*/
exports.removeTuple = function removeTuple(data) {

};
/*
*
*/
exports.editTuple = function editTuple(data) {

};
/*
*
*/
exports.queryData = function queryData(queryString) {

};
