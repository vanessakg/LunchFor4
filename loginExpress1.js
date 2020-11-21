var express = require('express');
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');

var con = mysql.createConnection({
   host: "45.55.136.114",
   user: "lunch44g4",
   password: "group4four",
   database: "lunch44g4"
});

app.set('view engine', 'pug' );
app.use( express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/LFFstart', function(req, res){
    res.render('loginTest1')
});
app.get('/LFFcreate', function(req, res){
    res.render('createGroup')
});
app.get('/LFFjoin', function(req, res){
    res.render('joinGroup')
});
<<<<<<< Updated upstream
app.listen(3333);
=======
app.get('/LFFpostLogin', function(req, res){
    res.render('postLogin')
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.post('/groupCreated', function(req, res){
    console.log(req.body);

    var sql = "INSERT INTO GroupInfo(time, location, groupCode, date) VALUES ('"+req.body.time+"','"+req.body.location+"','"+req.body.groupCode+"','"+req.body.gDate+"')";
    con.query(sql, function(err){
        if(err) throw err;
        console.log("record inserted!");  
    });
    res.send("Your information has been submitted.")
    
});

//app.post('/joinGroup', function(req, res){    
//});
module.exports = con;
app.listen(3333); 
>>>>>>> Stashed changes
