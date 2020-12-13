const express = require('express');

const router = express.Router();

authController = require('../controllers/auth'); 

const bcrypt = require('bcryptjs');

const User = require('../models/user'); 

const {check , body } = require('express-validator/check'); 

router.get('/login',authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/signup',authController.getSignUp);

router.post('/signup',
[
check('email').
isEmail().
withMessage('Please Enter invalid Email ! ')
.custom((value, { req }) => {
   
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject(
          'E-Mail exists already, please pick a different one.'
        );
      }
    });
  }),

body('password','Please Enter A password at least 6 characters with only number and text .  ')
 .isLength({min:6})
 .isAlphanumeric(),

body('confirmPassword').custom((value,{req})=>{
    if(value!==req.body.password){
        throw new Error('Two Password Not match !'); 
    }
    return true 
})
] ,
authController.postSignUp);

router.get('/logout',authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/newPassword',authController.postNewPassword);
module.exports = router;