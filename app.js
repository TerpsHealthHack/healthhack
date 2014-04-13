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
	eventEmitter.on('alertadmins', function() {
		if(socket)
			socket.emit('patientupdate','HEHEHEHEHHEHENEW PATIENT');

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
<<<<<<< HEAD
    socket.on('send email', function(email) {
        // mail({
        //     from: "TerpsHackIt@umd.edu", 
        //     to: email.toEmail, 
        //     subject: "HERE'S YOUR SCORE!", 
        //     text: "Your depression numba is: " + email.healthScore
        // });
    });

    socket.on('submit-to-doc', function(query) {
    	eventEmitter.emit('alertadmins');
    });

=======
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
>>>>>>> 4fe0d41f9fb2119eac3390a0320203778bf87800
    socket.emit('connected');






});

<<<<<<< HEAD
=======
    // ADMIN PAGE HANDLING ------------------------------
    /*
    http://stackoverflow.com/questions/8812505/working-with-routes-in-express-js-and-socket-io-and-maybe-node-in-general
    */
    io.of('/admin').on('connection',function(socket) {
    	socket.emit('connected','ITWORKS');

    });
>>>>>>> 4fe0d41f9fb2119eac3390a0320203778bf87800
