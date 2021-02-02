module.exports = {
	'options': {
		'sitename': 'SuperServer',
		'sitedesc': 'Сайт проекта SuperServer Minecraft донат',
		'sitekeys': 'SuperServer, Minecraft, донат, donate, qexy, autodonate',
		'items': [
			{
				'title': 'VIP',
				'price': 50,
				'command': 'give 5'
			},
			{
				'title': 'Premium',
				'price': 100,
				'command': 'give premium'
			},
			{
				'title': 'Admin',
				'price': 150,
				'command': 'give admin'
			}
		],
		'fakeip': 'play.super-server.net'
	},
	'stats': {
		'ip': 'mc.hypixel.net',
		'port': 25565,
		'method': 'ping', // ping | query | bedrock | full
		'log': false,
		'expire': 3000
	},
	'rcon': {
		'host': '127.0.0.1',
		'port': 25575,
		'password': '123456'
	},
	'unitpay': {
		'public': '9965-988e3',
		'private': '83273696b92ef6ed2c1536b9d3028c56',
		'domain': 'unitpay.money',
		'ip': ['31.186.100.49', '178.132.203.105', '52.29.152.23', '52.19.56.234', '127.0.0.1', '::ffff:127.0.0.1']
	},
	'server': {
		'host': 'localhost',
		'port': 8000,
		'io_cors_origin': 'http://localhost:4200'
	},
	'mongodb': {
		'host': 'mongodb://localhost:27017/website'
	}
};