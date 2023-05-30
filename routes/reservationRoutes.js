const express = require('express');
const router = express.Router()
const requireAuth = require('../middleware/authMiddleware.js');
const {
    registerReservation,
     getReservation,

} = require('../controllers/reservationController');
const protect = require('../middleware/authMiddleware.js');
//const protect = require('../middleware/authMiddleware.js')


router.route('/reservation')
.post(protect,registerReservation)
.get(getReservation)   


module.exports = router