var mail = require("nodemailer").mail
 , express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io').listen(server)
 , MongoClient = require('mongodb').MongoClient;

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/public'));

var mongoURL = process.env.MONGOHQ_URL;

MongoClient.connect(mongoURL, function(err, db) {
  if(!err) {
    console.log("Connected to MongoDB");
  } 
  var patients = db.collection('patients');
  patients.find({'fname' : 'Sally', 'lname' : 'Jones'}).toArray(function(err, items) {
  	console.log(items);
  });

});


io.sockets.on('connection', function (socket) {
    socket.on('send email', function(email) {
        // mail({
        //     from: "TerpsHackIt@umd.edu", 
        //     to: email.toEmail, 
        //     subject: "HERE'S YOUR SCORE!", 
        //     text: "Your depression numba is: " + email.healthScore
        // });
    });
    socket.emit('connected');
});