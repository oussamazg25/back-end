const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken.js')
const User = require('../models/registerModel.js')
//const bcrypt = require("bcryptjs")
//var mailer = require('../utils/mailer');
const nodemailer=require('nodemailer');
const { generateOtp,verifyOtp } = require('../utils/otp.js');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: 'belbahimen@gmail.com',
    pass: 'aaklujxrtectdlwe',
  },
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  

 /* const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.mot_de_passe)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
*/



  const email = req.body.email
    const mot_de_passe = req.body.mot_de_passe

    //find user exist or not
    User.findOne({ email})
        .then(user => {
            //if user not exist than return status 400
            if (!user) 
            return res.status(400).json({ msg: "User not exist" });

            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, data) => {
                //if error than throw error
                if (err) return err

                //if both match than you can do anything
                if (data) {
                    return res.status(200).json({ 
                    msg: "Login success",
                    token: generateToken(user._id),
                   
                   })
                 
                } else {
                    return res.status(401).json({ msg: "Invalid credencial" })
                }
              })

            })
  
 /* const { email, mot_de_passe } = req.body;

  const user = await User.findOne({ email })
  //const Voiture = await User.findOne({ email })
  if (user && (await bcrypt.compare(mot_de_passe,user.mot_de_passe))) {
  //if (user && (await user.comparePassword(mot_de_passe))) {
    res.json({
      _id: user._id,
      nom: user.nom,
      num_tel:user.num_tel,
      email: user.email,
     
      voiture:user.voiture.matricule,
      
      token: generateToken(user._id),
   
    })
  } else {
    res.status(401).json({
      success: false,
      msg: 'not defined user'
    })
  }*/
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
 // console.log(req.body)

  const { nom, email,num_tel,mot_de_passe,matricule,categorie } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    return res.status(400).json({
      success: false,
      msg: 'Entered email id already registered with us. Login to continue'
    })
  }
  

  const user = new User({
    nom,
    email,
    num_tel,
    mot_de_passe,
    voiture:
    {
      matricule,
      categorie,
    }
  })



    // save user object
    user.save(function (err, user) {
      if (err) return next(err);
          res.status(201).json({
            success: true,
            msg: 'Account Created Sucessfully. Please log in.'
          });
        
      });
      
  
})



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      nom: user.nom,
      email: user.email,
      num_tel:user.num_tel,
      matricule:user.voiture.matricule,
      categorie:user.voiture.categorie,
      otp: user.otp
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.nom = req.body.nom || user.nom;
    user.email = req.body.email || user.email;
    user.num_tel = req.body.num_tel || user.num_tel;
    user.voiture.matricule = req.body.matricule || user.voiture.matricule;
    user.voiture.categorie = req.body.categorie || user.voiture.categorie;

    if (req.body.mot_de_passe) {
      user.mot_de_passe = req.body.mot_de_passe
    }

    const updatedUser = await user.save()

   
    res.status(201).json({
      success: true,
      msg: 'Account is updated'
    });
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})


const forgotPassword = asyncHandler(async(req,res) => {

  
  try{
    
    crypto.randomBytes(32,(error,buffer)=>{
      //console.log('test');
      if(error){
        console.log(error.message);
      }else{
        const token=buffer.toString('hex')
        User.findOne({email: req.body.email}).then(user =>{
          if(!user){
            return res.status(400).json({msg:[{msg:'please enter valid email'}]})

          }
          user.resetToken= token;
          user.expireToken=Date.now()+360000
          user.save().then((result)=>{
            transporter.sendMail({
              
                from: "no-replay@gmail.com",
                to: user.email,
                subject: "Reset password",
                html:`<a href="http://localhost:3000/resetPassword/${token}">to reset password</a>`
            },(error,info)=>{
              if(error){
                res.json(error)
              }else{
                 res.json({msg:'mail send', info})
              }
            })
          })
        })
      }
    })

  }catch(error){
    res.status(500).send('server error')

  }
  
});

const resetPassword = asyncHandler( async (req, res) => {
 
 const newPassword=req.body.mot_de_passe;
 const sendToken=req.body.token;
 User.findOne({resetToken: sendToken,expireToken:{$gt:Date.now()} }).then(user => {
  if(!user){
    return res.status(400).json({msg:[{msg:'try again session expired'}]});
  }
  bcrypt.hash(newPassword,12).then(hashedpassword => {
  user.mot_de_passe=hashedpassword,
  user.resetToken=undefined,
  user.expireToken=undefined,
  user.save().then((user)=>{
    res.json({msg:[{msg:'Password changed'}]});
  })
  })
 })
 
  /*const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }*/
});




module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
//  deleteUser,
  //getUserById,
  //updateUser,
  resetPassword,
  forgotPassword,

}


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
/*const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})*/

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
/*const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})*/

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
/*const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.num_tel=req.body.num_tel || user.num_tel

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      num_tel:updatedUser.num_tel,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})*/


/*const resetPassword = asyncHandler(async(req,res) => {

  // console.log(verifyOtp(req.body.token));
 // console.log(req.body.token)
  res.json({
    token: verifyOtp(req.body.token)
  })
  // const user = await User.findById(req.user._id)
  // const {oldPassword = ''} = req.body;
  // // For old password
  // if (user && (await user.matchPassword(oldPassword))) {
  //   let randomOtp = Math.floor(100000 + Math.random() * 900000);
  //   user.otp = randomOtp;
  //   await user.save();

  //   mailer.send({
  //     to: user.email,
  //     subject: 'Reset your password. ReactNews',
  //     html: `Your otp for reset password is ${randomOtp}`
  //   });

  //   res.status(200).json({
  //     success: true,
  //     msg: 'A Otp has been sent to your registered email address.'
  //   })
  // } else {
  //   res.status(404).json({
  //     success: false,
  //     msg: 'Entered Old Password is Incorrect.'
  //   })
  // }
});*/




/*const resetPassword = asyncHandler( async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});*/
