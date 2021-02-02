/*const express = require('express');
const app = express();*/
const server = require('./models/server');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const path = require('path');

const routesHttp = require('./routes-http');
const routesSockets = require('./routes-sockets');

mongoose.set('useFindAndModify', false);

mongoose.connect(config.mongodb.host, {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
	if(err){
		console.log('Error connection to Mongodb');
		console.error(err);
	}
});

mongoose.connection.on('connected', function(){
	console.log("MongoDB has connected");
});

mongoose.connection.on('error', function(){
	console.log("Error connection with MongoDB");
});

server.app.use(cors());
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());
server.app.use(server.express.static(path.join(__dirname, '../public'), { index: false }));
server.app.set('views', path.join(__dirname, '../views'));
server.app.engine('html', require('ejs').renderFile);
server.app.set('view engine', 'html');

server.app.use('/', routesHttp);

routesSockets();

server.http.listen(config.server.port, config.server.host, function(){
	console.log('Server running on port: '+config.server.port);
});

module.exports = server.app;