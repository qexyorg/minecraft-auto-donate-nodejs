const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../../config');
const Schema = mongoose.Schema;

const schema = new Schema({
	item_id: {
		type: Number,
		default: -1
	},
	sum: {
		type: Number,
		default: 0
	},
	player: {
		type: String,
		default: ''
	},
	status: {
		type: Number,
		default: 0
	},
	response: {
		type: String,
		default: ''
	},
	date_create: {
		type: Date,
		default: Date.now
	},
	date_update: {
		type: Date,
		default: Date.now
	}
});

const payment = module.exports = mongoose.model('payments', schema);

module.exports.insert = function(schema, callback){
	schema.save(callback);
};

module.exports.selectLast = function(amount, callback){
	payment.find({status: 1}, {_id: 0, sum: 0, status: 0, response: 0, __v: 0}, null, callback).sort({date_update: -1}).limit(amount);
};

module.exports.selectByID = function(id, callback){
	payment.findById(id, callback);
};

module.exports.updateByID = function(id, params, callback){
	payment.findByIdAndUpdate(id, {$set: params}, callback);
};

module.exports.unitpay = {
	keysort: function(obj){
		return Object.keys(obj).sort().reduce(function (result, key) {
			result[key] = obj[key];
			return result;
		}, {});
	},

	response: function(message, success){
		if(typeof success == 'undefined'){
			success = false;
		}

		let name = !success ? "error": "result";

		return  {[name]: {"message": message}};
	},

	sign: function(params, type){
		if(typeof type == 'undefined'){
			type = 'check';
		}

		if(typeof params.sign != 'undefined'){
			delete params.sign;
		}

		if(typeof params.signature != 'undefined'){
			delete params.signature;
		}

		params = this.keysort(params);

		let data = type;

		let items = Object.values(params);

		for(let i = 0; i < items.length; i++) {
			if(typeof items[i] == 'undefined'){ continue; }
			data += '{up}'+items[i];
		}

		return crypto.createHash('sha256').update(data+'{up}'+config.unitpay.private).digest("hex");
	}
};