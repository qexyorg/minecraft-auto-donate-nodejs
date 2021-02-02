const controller = require('../../controllers/sockets/payments');

module.exports = function(socket){

	//controller.last

	controller.last(function(err, data){
		if(err){
			data = [];
			console.error(err);
		}

		socket.emit('last', data);
	});

	socket.on('pay', controller.pay(socket));

};