const config = require('../../config');
const server = require('../../models/server');
const online = require('../../models/stats/online');

let onlineTimeout = function(time){
	setTimeout(function(){

		online.stats(function(err, res){
			if(err){
				if(config.stats.log){ console.log("\x1b[34m", "[STATS] Server "+config.stats.ip+config.stats.port+" is offline", "\x1b[0m"); }
				if(config.stats.log){ console.log("\x1b[41m", err, "\x1b[0m"); }
			}else{
				if(config.stats.log){ console.log("\x1b[34m", "[STATS] Server "+config.stats.ip+config.stats.port+" is online", "\x1b[0m"); }
				let online = typeof res != 'object' || typeof res.onlinePlayers == 'undefined' ? 0 : res.onlinePlayers;
				server.io.emit('online', online);
			}
			onlineTimeout(config.stats.expire);
		});

	}, time)
};

onlineTimeout(100);

module.exports.get = function (callback){
	// resolved
};