var mail = require("nodemailer").mail
 , express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/public'));

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