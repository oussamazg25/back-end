const express = require('express');
const router = express.Router()
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addToFav,
  getFavorites,
  removeFavorite,
  resetPassword,
  checkFavExistsOrNot,
  forgotPassword
} = require('../controllers/userController');

const protect = require('../middleware/authMiddleware.js')

router.route('/').post(registerUser).get(protect, getUsers)
router.route('/login').post(authUser)


router.route('/profile')
    .put(protect,updateUserProfile)
    .get(protect,getUserProfile)

//router.route('/profile/password/reset').post(protect ,resetPassword);
router.route('/resetPassword')
.post(resetPassword)
//.get(protect,resetPassword)


router.route('/forgotPassword')
.post(forgotPassword)

/*router
  .route('/:id')
//   .delete(protect, deleteUser)
  .get(getUserById)*/
//   .put(protect, updateUser)

//router.route('/servation',)
/*router.route('/addToFav/:newsId').put(protect, addToFav)
router.route('/getFavOfUser/all').get(protect, getFavorites)

router.route('/checkExists/fav/:newsId').get(protect, checkFavExistsOrNot)*/

module.exports = router