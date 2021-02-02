const config = require('../../config');
const util = require('minecraft-server-util');

module.exports.stats = function(callback){
	let status = { port: config.stats.port, enableSRV: false, timeout: 3000 };

	if(config.stats.method == 'ping'){
		status = util.status(config.stats.ip, status);
	}else if(config.stats.method == 'query'){
		status = util.query(config.stats.ip, status);
	}else if(config.stats.method == 'bedrock'){
		status = util.statusBedrock(config.stats.ip, status);
	}else if(config.stats.method == 'full'){
		status = util.queryFull(config.stats.ip, status);
	}

	status.then((response) => {
		callback(null, response);
	}).catch((error) => {
		callback(error, null);
	});
};