const express = require('express');
const app = express();
const config = require('../config');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	cors: {
		origin: config.server.io_cors_origin,
		methods: ["GET", "POST"],
		credentials: true
	}
});

module.exports = { io: io, http: http, app: app, express: express };