var express = require('express');
var app = express();

app.set('view engine', 'pug' );
app.use( express.static('public'))

app.get('/LFFstart', function(req, res){
    res.render('loginTest1')
});
app.listen(3000);