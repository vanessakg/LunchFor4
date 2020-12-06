var express = require('express');
var session = require('express-session');
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var path = require('path');
//For scheduling emails every 4th of the Month
//var cron = require('node-cron');

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

app.set('view engine', 'pug' );
app.use( express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

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
app.get('/adminLogin', function(req, res){
    res.render('adminLogin')
});
app.get('/admin', function(req, res){
    res.render('admin')
});
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/adminLogin'));
});
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM Admin WHERE username = "admin" AND password = "root"', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/admin');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
        response.end();
    }
});
app.get('/admin', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome Admin user!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});
app.post('/groupCreated', function(req, res){
    console.log(req.body);

    var sql = "INSERT INTO GroupInfo(time, location, groupCode, date)  \
               VALUES ('"+req.body.time+"','"+req.body.location+"','"+req.body.groupCode+"','"+req.body.gDate+"')";
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
        text: `Here is your group information: Group Code:${req.body.groupCode}, Time:${req.body.time}, Location:${req.body.location},  Date:${req.body.gDate}` 
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
    var sql = "INSERT INTO Member(fName, lName, email, phoneNum, au_id, Affiliation, acc_Activity) VALUES  \
               ('"+req.body.fName+"', '"+req.body.lName+"', '"+req.body.email+"', '"+req.body.phoneNum+"', \
                '"+req.body.au_id+"', '"+req.body.Affiliation+"', '"+req.body.acc_Activity+"')";
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

app.post('/memberCreated', function(req, res){
    console.log(req.body);
    var sql = "UPDATE TABLE Member SET acc_Activity = 'Active' WHERE acc_Activity = 'Inactive'";
    con.query(sql, function(err, result){
        if(err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
});

//Delete member if they want to be inactive..? 
app.delete('/memberCreated', function(req, res){
    var sql = "DELETE Member WHERE acc_Activity = 'Inactive'";
    con.query(sql, function(err, rows){
        if(err) throw err;
        console.log("Deleted successfully: ", rows);
        res.send('Deleted successfully');
    });
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