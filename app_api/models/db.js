var mongoose = require('mongoose');
require('./locations');


var dbURI = 'mongodb://127.0.0.1:27017/Loc8r';
mongoose.connect(dbURI);

//event on connect
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
//event on error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
//event on disconnection with mango
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
})

// to get the event of nodemon restart and close mango connection
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
//to get the event when app terminiated and close mango coonnection
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});
//for heroku 
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

// close mango connection
var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};