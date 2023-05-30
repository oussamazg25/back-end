const express = require('express');
const connectDB = require('./config/db');
const formData = require('express-form-data');

require('colors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes.js');

const reservationRoutes = require('./routes/reservationRoutes.js');



const morgan = require('morgan');
const { forgotPassword } = require('./controllers/userController');



connectDB();

const app = express();

app.use(formData.parse());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));




app.use('/api/users', userRoutes);

app.use('/api/users', reservationRoutes);
app.use('/api/users',forgotPassword);

app.get('*', function(req, res){
  res.status(404).json({
    msg: "Api path not found."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red,
  ),
);



// hosted server https://news-app-native.herokuapp.com/