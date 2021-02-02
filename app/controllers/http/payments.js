const config = require('../../config');
const payments = require('../../models/payments/payment');
const util = require('minecraft-server-util');
const server = require('../../models/server');

module.exports.unitpay = function(req, res){
	let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	if(config.unitpay.ip.indexOf(ip) === -1){
		return res.send(payments.unitpay.response('Access denied!'+ip));
	}

	if(req.query.method != 'check' && req.query.method != 'pay'){
		return res.send(payments.unitpay.response('Invalid method'));
	}

	if(typeof req.query.params != 'object' || typeof req.query.params.signature != 'string'){
		return res.send(payments.unitpay.response('Invalid params'));
	}

	if(typeof req.query.params.account != 'string'){
		return res.send(payments.unitpay.response('Invalid account id'));
	}

	let sign = req.query.params.signature;

	payments.selectByID(req.query.params.account, function(err, payment){
		if(err || payment.status ==  1){
			return res.send(payments.unitpay.response('Payment not found'));
		}

		if(req.query.params.orderSum != payment.sum || req.query.params.orderCurrency != 'RUB'){
			return res.send(payments.unitpay.response('Invalid sum'));
		}

		if(sign !== payments.unitpay.sign(req.query.params, req.query.method)){
			return res.send(payments.unitpay.response('Invalid signature'));
		}

		let time = new Date();

		// check
		if(req.query.method == 'check'){

			// No need wait a promise. It's just a check
			payments.updateByID(payment._id, {status: 2, response: JSON.stringify(req.query), date_update: time}, function(e, data){
				if(e){
					console.error(e);
					console.log('Warning! Can\'t update check payment '+payment._id);
				}
			});

			return res.send(payments.unitpay.response('Success check', true));
		}

		let item = config.options.items[payment.item_id];

		if(typeof item == 'undefined'){
			return res.send(payments.unitpay.response('Invalid item'));
		}

		payments.updateByID(payment._id, {status: 1, response: JSON.stringify(req.query), date_update: time}, function(e, data){
			if(e){
				console.error(e);
				console.log('Warning! Can\'t update pay payment '+payment._id);

				return res.send(payments.unitpay.response('Error connection to database. Contact with administration'));
			}

			server.io.emit('last-broadcast', {
				item_id: payment.item_id,
				player: payment.player,
				date_create: payment.date_create,
				date_update: payment.date_update
			});

			let client = new util.RCON(config.rcon.host, { port: config.rcon.port, enableSRV: false, timeout: 3000, password: config.rcon.password});

			client.on('output', function(message){
				console.log(message)
			});

			client.connect().then(async () => {
					await client.run(item.command.replace('{PLAYER}', payment.player));

					client.close();

					res.send(payments.unitpay.response('Success payment', true));
				}).catch((error) => {
					console.error(error);

					res.send(payments.unitpay.response('Invalid payment'));
				});
		});
	});
};