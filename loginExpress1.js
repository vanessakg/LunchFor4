var express = require('express');
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
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
app.get('/LFFpostLogin', function(req, res){
    res.render('postLogin')
});
app.get('/LFFcreateMember', function(req, res){
    res.render('accountCreate')
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
    res.send("Your information has been submitted: " + "\nTIME: " + req.body.time + "GROUP CODE: " +
    req.body.groupCode + "DATE: " + req.body.gDate); 

    const message = {
        from: 'lunch4four@aurora.edu', 
        to: '0772a8d93c-cc7bce@inbox.mailtrap.io',
        subject: 'Information about your Lunch4Four Monthly Meeting',
        text: `Here is your group information: Group Code:${req.body.groupCode}, Time:${req.body.time}, Location${req.body.location},  Date:${req.body.gDate}` 
    };
    
    transporter.sendMail(message, function(err, info){
        if(err){
            console.log(err)
        }else {
            console.log(info)
            var sql2 = "SELECT * FROM Member order by rand() LIMIT 4";
            con.query(sql2, function(err, rows){
                if(err){
                    console.log(err)
                    return;
                }
                rows.forEach(function(result){
                    console.log(result.fName, result.lName, result.email, result.au_id);
                });
            });
        }
    });
});

app.post('/memberCreated', function(req, res){
    console.log(req.body);
    var sql = "INSERT INTO Member(fName, lName, email, phoneNum, au_id, Affiliation) VALUES ('"+req.body.fName+"', '"+req.body.lName+"', '"+req.body.email+"', '"+req.body.phoneNum+"', '"+req.body.au_id+"', '"+req.body.Affiliation+"')";
    con.query(sql, function(err){
        if(err) throw err;
        console.log("Member updated");
    })

    res.render('postLogin');
});

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "65a2c5760d7b03",
      pass: "16a9c595af29ae"
    }
  });


//login to mailtrap.io
// email: vanessagill94@hotmail.com
// pw: lunch4four!

//This syntax sends out email every 4th of month
// cron.schedule('0 0 4 * *', () => {
//     if(error){
//         console.log(error);
//     } else{
//         console.log('Email sent: ' + info.response);
//     }
// });
//app.post('/joinGroup', function(req, res){    
//});
module.exports = con;
app.listen(3333); 