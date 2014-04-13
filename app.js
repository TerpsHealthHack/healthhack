var mail = require("nodemailer").mail
 , express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io').listen(server)
 , MongoClient = require('mongodb').MongoClient;

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/public'));
app.get('/:file', function (req, res) {
    var file = req.params.file;

    res.sendfile('public/' + file + '.html');

});
var mongoURL = process.env.MONGOHQ_URL;


io.sockets.on('connection', function (socket) {
	MongoClient.connect(mongoURL, function(err, db) {
	  if(!err) {
	    console.log("Connected to MongoDB");
	  } 
	  socket.on('query', function(query) {
		var patients = db.collection('patients');
		patients.find({'fname' : query.fname, 'lname' : query.lname}).toArray(function(err, items) {
			socket.emit('query-response', items);
		});

	  });
	});
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