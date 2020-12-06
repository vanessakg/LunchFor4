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

app.set('view engine', 'pug' );
app.use( express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/LFFstart', function(req, res){
    res.render('loginTest1')
});
app.get('/adminLogin', function(req, res){
    res.render('adminLogin')
});
app.get('/admin', function(req, res){
    res.render('admin')
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

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
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

    var sql = "INSERT INTO GroupInfo(time, location, groupCode, date) VALUES ('"+req.body.time+"','"+req.body.location+"','"+req.body.groupCode+"','"+req.body.gDate+"')";
    con.query(sql, function(err){
        if(err) throw err;
        console.log("record inserted!"); 
    });
    res.send("Your information has been submitted: " + "\nTIME: " + req.body.time + "GROUP CODE: " +
    req.body.groupCode + "DATE: " + req.body.gDate); 

    transporter.sendMail(message, function(err, info){
        if(err){
            console.log(err)
        }else {
            console.log(info)
            var sql2 = "SELECT * FROM Member order by rand() LIMIT 2";
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

// app.post('/loginLFF', function(req, res){
//     console.log(body);
//     var sql = "INSERT INTO Member(fName, lName, email, phoneNum, au_id) VALUES ('"+req.body.fName+"', '"+req.body.lName+"', '"+req.body.email+"', '"+req.body.phoneNum+"', '"+req.body.au_id+"')";
//     con.query(sql, function(err){
//         if(err) throw err;
//         console.log("Member updated");
//     })
// })

let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '4ec3e368bdf5e0',
        pass: 'ca40c475b2f8b0'
    }
});

//login to mailtrap.io
// email: vanessagill94@hotmail.com
// pw: lunch4four!
const message = {
    from: 'lunch4four@aurora.edu', 
    to: '0772a8d93c-c06d1a@inbox.mailtrap.io',
    subject: 'Information about your Lunch4Four Monthly Meeting',
    text: 'Thanks for signing up for Lunch4Four!' // Send out groupInfo
};
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