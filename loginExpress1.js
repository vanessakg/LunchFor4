var express = require('express');
var app = express();

app.set('view engine', 'pug' );
app.use( express.static('public'));

app.get('/LFFstart', function(req, res){
    res.render('loginTest1')
});
app.get('/LFFcreate', function(req, res){
    res.render('createGroup')
});
app.get('/LFFjoin', function(req, res){
    res.render('joinGroup')
});
app.listen(3333);