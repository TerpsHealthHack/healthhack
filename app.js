var mail = require("nodemailer").mail
 , express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io').listen(server)
 , MongoClient = require('mongodb').MongoClient
 , events = require('events');

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/public'));

/*
http://stackoverflow.com/questions/16949807/how-do-i-get-node-js-to-return-pages-without-file-extensions
*/
app.get('/:file', function (req, res) {
    var file = req.params.file;

    res.sendfile('public/' + file + '.html');

});
var mongoURL = process.env.MONGOHQ_URL;

// ADMIN PAGE HANDLING ------------------------------
/*
http://stackoverflow.com/questions/8812505/working-with-routes-in-express-js-and-socket-io-and-maybe-node-in-general
*/
var eventEmitter = new events.EventEmitter();

io.of('/admin').on('connection',function(socket) {
	socket.emit('connected','ITWORKS');
	eventEmitter.on('alertadmins', function(cheapway) {
		if(socket)
			socket.emit('patientupdate',cheapway);

	});
	

});


//user page handling-----------------
io.of('/user').on('connection', function (socket) {
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

    socket.on('submit-to-doc', function(query) {
    	
    	MongoClient.connect(mongoURL, function(err,db) {

    		if(!err) {
    		  console.log("Connected to MongoDB");
    		} 
    		var patients = db.collection('patients');
    		patients.update (
    			{'fname' : query.fname, 'lname' : query.lname},
    			{$set: {'picbase64': query['skinpic']} }, 
    			function(err, result) {if(!err){console.log('pic update success?'); eventEmitter.emit('alertadmins',query['skinpic']);}else console.log('pic update failed :(:(:(');}
    			)
    	})
    });

	socket.on('send-email', function(email) {
	  	console.log(email);
        mail({
            from: "HelpfulDoctor@doctors.edu", 
            to: email.email, 
            subject: "Your Online Waiting Room Results", 
            text: "Hi, " + email.fname + 
            	"! Since your last session, you have updated these symptoms: " + 
            	email.newSymptoms,
            html: "<div style='font-size:20px'><b>Hi, " + email.fname + 
            	"!</b></div><br><br>Since your last session, you have updated these symptoms: <br><br>" + 
            	email.newSymptoms
        });
      });

    socket.emit('connected');
});

