var express = require('express');

var app = express();
var http = require('http').Server(app);
var cors = require('cors');
var PORT = 3000;

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    methods:"POST, GET, PUT, DELETE, OPTIONS",
    credentials:false,
    maxAge:86400,
    allowedHeaders:"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
}));

// index page
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// orderManagement route Module
var orderManagement = require('./routes/orderManagement.js');
app.use('/orderManagement', orderManagement);

// For missing routes 
app.all('*', function (req, res) {
    res.status(404);
    res.sendFile(__dirname + '/public/404.html');
});

http.listen(PORT, function () {
    console.log('This App just started at ' + PORT);
});