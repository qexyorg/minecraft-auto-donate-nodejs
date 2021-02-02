const express = require('express');
const router = express.Router();
const config = require('./config');
const mainRoutes = require('./routes/http/main');
const paymentsRoutes = require('./routes/http/payments');

router.use('/payments', paymentsRoutes);

router.use('/', mainRoutes);

router.use(function(req, res){
	res.status(404).render('404.ejs', {
		config: config.options
	});
});

module.exports = router;