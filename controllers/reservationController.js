const asyncHandler = require('express-async-handler')
const Reservation = require('../models/reservationModel.js')
const User = require('../models/userModel.js');
const protect = require('../models/userModel.js');

const userId = User._id;


// @desc    Register reservation
// @route   POST /api/reservation
// @access  Public

const registerReservation = asyncHandler(async (req, res,next) => {
   console.log(userId)
  
   const user = await User.findById(userId);
  // reservation.user.name = user.name;
   //reservation.user.email = user.email;
    const {  start_time, end_time, location } = req.body;
  
    if (!start_time || !end_time) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
        });
    }
  
    const reservation = new Reservation({
        user,
    
      start_time,
      end_time,
      //location
    })

    reservation.save(function (err, reservation) {
        //console.log("sc")
        if (err) return next(err);
        res.status(201).json({
          success: true,
          msg: ' save reservation '
        });
      });
  
   /* reservation.save((err, reservation) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to save reservation' });
      }
  
      return res.status(201).json(savedReservation);
    });*/
  });


  const getReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.find({})
    res.json(reservation)
  })


  module.exports = {
    registerReservation,
    getReservation,
  
  
  }