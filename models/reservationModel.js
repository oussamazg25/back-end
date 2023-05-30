const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
   /* user:{
        nom:{
            type:String,
            
        },
        email:{
            type:String,
        }
    },*/
   /* user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },*/
    start_time: {
      type: String,
      required: true
    },
    end_time: {
      type: String,
      required: true
    },
   /* location: {
      type: String,
      required: true
    }*/
  });
  
module.exports= mongoose.model('Reservation',reservationSchema)