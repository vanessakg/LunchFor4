var mysql = require("mysql");
var bodyParser = require('body-parser');
var con = mysql.createConnection({
   host: "45.55.136.114",
   user: "lunch44g4",
   password: "group4four",
   database: "lunch44g4"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});



module.exports = con;