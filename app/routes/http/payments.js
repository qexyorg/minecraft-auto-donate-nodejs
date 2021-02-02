const express = require('express');
const router = express.Router();

const controller = require('../../controllers/http/payments');

router.get('/unitpay', controller.unitpay);

module.exports = router;