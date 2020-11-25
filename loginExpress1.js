var express = require('express');
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');
//var nodemailer = require('nodemailer');
//For scheduling emails every 4th of the Month
//var cron = require('node-cron');

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

app.get('/LFFpostLogin', function(req, res, next){
    res.render('postLogin')
    
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// app.post('/loginLFF', function(req, res){
//     console.log(body);
//     var sql = "INSERT INTO Member(fName, lName, email, phoneNum, au_id) VALUES ('"+req.body.fName+"', '"+req.body.lName+"', '"+req.body.email+"', '"+req.body.phoneNum+"', '"+req.body.au_id+"')";
//     con.query(sql, function(err){
//         if(err) throw err;
//         console.log("Member updated");
//     })
// })

app.post('/groupCreated', function(req, res){
    console.log(req.body);

    var sql = "INSERT INTO GroupInfo(time, location, groupCode, date) VALUES ('"+req.body.time+"','"+req.body.location+"','"+req.body.groupCode+"','"+req.body.gDate+"')";
    con.query(sql, function(err){
        if(err) throw err;
        console.log("record inserted!");  
    });
    res.send("Your information has been submitted: " + "\nTIME: " + req.body.time + "GROUP CODE: " +
    req.body.groupCode + "DATE: " + req.body.gDate); 
});

con.query("SELECT * FROM Member order by rand() LIMIT 2",
function(err, rows){
    if(err){
        console.log(err);
        return;
    }

    rows.forEach(function(result){
        console.log(result.fName, result.lName, result.email, result.au_id);
    });
});


//app.post('/joinGroup', function(req, res){    
//});

//Syntax for sending out email.. need to connect it to a page
//let mailOptions = {
    //from:, //Need to figure out how to make an array of group to send email to
    //to: ,// our email
    //subject: 'Information about your Lunch4Four Monthly Meeting',
    //text: // Send out groupInfo
//};

// let transporter = nodemailer.createTransport({
//     service: 'outlook',
//     auth:{
//         //from email address
//         //from email pw
//     }
// });

//This syntax sends out email every 4th of month
// cron.schedule('0 0 4 * *', () => {
//     if(error){
//         console.log(error);
//     } else{
//         console.log('Email sent: ' + info.response);
//     }
// });
module.exports = con;
app.listen(3333); 

