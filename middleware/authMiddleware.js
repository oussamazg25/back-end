const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const User = require('../models/registerModel.js')


const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({
        success: false,
        msg: 'Session Expired'
      })
      
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      msg: 'Not authorized, no token'
    })
  }
 /* if (!req.user) {
    return res.status(401).json({ message: 'Vous devez être connecté pour effectuer cette action' });
  }

  // Passer à l'étape suivante du middleware
  next();*/
})

/*const requireAuth = (req, res, next) => {
  // Vérifier si l'utilisateur est authentifié
  if (!req.user) {
    return res.status(401).json({ message: 'Vous devez être connecté pour effectuer cette action' });
  }

  // Passer à l'étape suivante du middleware
  next();
};*/
//module.exports=requireAuth;
module.exports = protect;