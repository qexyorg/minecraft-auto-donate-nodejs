const config = require('./config');
const paymentsRoutes = require('./routes/sockets/payments');
const statsRoutes = require('./routes/sockets/stats');
const server = require('./models/server');

module.exports = function(){
	let clients = 0;

	server.io.on('connection', function(socket) {
		clients++;

		server.io.emit('clients', clients);

		socket.emit('options', config.options);

		paymentsRoutes(socket);
		statsRoutes(socket);

		socket.on('disconnect', function(){
			clients--;

			server.io.emit('clients', clients);
		});
	});
};