const config = require('../../config');
const payments = require('../../models/payments/payment');

module.exports.pay = function(socket){
	return function(data, callback){
		if(typeof data != 'object' || typeof data.login != 'string' || typeof data.item_id != 'number' || typeof data.accept != 'boolean'){
			return callback('Неверный формат данных', 'Ошибка!');
		}

		if(typeof config.options.items[data.item_id] == 'undefined'){
			return callback('Привилегия указана неверно', 'Ошибка!');
		}

		if(!/^[a-z0-9_]{3,16}$/i.test(data.login)){
			return callback('Необходимо указать корректный никнейм игрока, состоящий от 3 до 16 символов (a-zA-Z0-9)', 'Внимание!');
		}

		if(!data.accept){
			return callback('Чтобы приобрести привилегии на сайте, необходимо принять правила сайта', 'Внимание!');
		}

		let item = config.options.items[data.item_id];

		if(typeof item == 'undefined'){
			return callback('Выбранная привилегия недоступна', 'Ошибка!');
		}

		let payment = new payments({
			item_id: data.item_id,
			sum: item.price,
			player: data.login
		});

		payments.insert(payment, function(err, pay){
			if(err){
				return callback('Произошла ошибка баз данных. Обратитесь к администрации', 'Ошибка!');
			}else{
				let desc = 'Покупка привилегии "'+item.title+'" на сайте';

				let sign = payments.unitpay.sign(pay._id, pay.sum, desc);

				let url = 'https://'+config.unitpay.domain+'/pay/'+config.unitpay.public+'/card?sum='+pay.sum+'&account='+pay._id+'&desc='+desc+'&signature='+sign;

				return callback(url, 'OK', true);
			}
		});
	}
};

module.exports.last = function (callback){

	payments.selectLast(9, function(err, data){
		callback(err, data);
	});
};