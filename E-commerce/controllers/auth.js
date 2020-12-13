
const User = require('../models/user');

const nodemailer = require('nodemailer');

const sendMailer = require('nodemailer-sendgrid-transport');

const crypto = require('crypto');

const { validationResult } = require('express-validator/check'); 

const transporter = nodemailer.createTransport(sendMailer({
    auth : { 
     api_key:'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'
     }
 }));
const bcrypt = require('bcryptjs')
exports.getLogin =(req,res,next)=>{
    let message = req.flash('error');
    console.log(' message'+ message)
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login',{
        path:'/login',
        pagetitle:'Login',
        isAuth:false,
        errorMessage: message
    });

} 

exports.postLogin = (req,res,next)=>{
    // req.login = true;
    email = req.body.email;
    password = req.body.password ; 

    
    User.findOne({email:email})
    .then(user=>{
        if(!user){

            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        else{
            bcrypt.compare(password,user.password)
            .then(doMatch=>{
                if(doMatch){
                    req.session.login = true;
                    req.session.user = user ; 
                    res.setHeader('Set-Cookie','LogIn=true');
                    res.redirect('/');
                }
                else
                { 
                    req.flash('error', 'Invalid email or password.');
                    return res.redirect('/login');
                }
            })
        }
    })


    
}

exports.getSignUp = (req,res,next)=>{
    let message = req.flash('error');
    // console.log(' message'+ message)
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    req.flash('error')
    res.render('auth/signup',{
        path:'/signup',
        pagetitle:'Signup',
        isAuth:req.login,
        errorMessage: message,
        oldInput:{
            email:'',
            password:'',
            confirmPassword:''
        }
    }) ; 
   
}

exports.postSignUp=(req,res,next)=>{
    username = req.body.email; 
    password = req.body.password;
    confirmPassword = req.body.confirmPassword; 
    errors = validationResult(req);
    // console.log(errors.array())
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup',{
            path:'/signup',
            pagetitle:'Signup',
            isAuth:req.login,
            errorMessage: errors.array()[0].msg,
            oldInput:{
                email:username ,
                password:password,
                confirmPassword:confirmPassword
            }
        });
    }

    return bcrypt.hash(password,12)
    .then(hashedPassword=>{
        const user = new User({
            password: hashedPassword,
            email:username,
            resetToken:'',
            resetTokenExpire:'',
            cart:{items:[]}
        });
        return user.save();
    }).catch(err=>{
        console.log(err)
    })
    .then(result=>{
        res.redirect('/login');
        return transporter.sendMail({
            to:username,
            from:'snabil084@gmail.com',
            subject:'SignUp Succeeded',
            html:'<h1> You Successfully sign up !</h1>'
        }).catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err);
    })

}
exports.postLogout =(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    })
}

exports.getReset =(req,res,next) => {
    let message = req.flash('error');
    // console.log(' message'+ message)
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset',{
        path:'/reset',
        pagetitle:'Reset Password',
        isAuth:req.login,
        errorMessage:message
    }); 
}

exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return redirect('/reset'); 
        }
        const token = buffer.toString('hex'); 
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.flash('error', 'Email Not Found! ');
                return res.redirect('/reset');
            }
            user.resetToken = token ; 
            user.resetTokenExpire = Date.now() +3600000 ; 
            return user.save() ; 
        })
        .then(result=>{
            res.redirect('/');
            return transporter.sendMail({
                to:req.body.email ,
                from:'snabil084@gmail.com',
                subject:'Password Reset',
                html:` <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
             `
            }).catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err);
        })
    })
}


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } })
      .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/new-password', {
          path: '/new-password',
          pagetitle: 'New Password',
          errorMessage: message,
          isAuth:req.login,
          userId: user._id.toString()
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

exports.postNewPassword = (req,res,next)=>{
    const userId = req.body.userId ;
    const newPass = req.body.password;
    let resetUser ; 
    console.log(userId);
    User.findOne({
        _id:userId
    }).then(user=>{
        resetUser = user ; 
        return bcrypt.hash(newPass,12); 
    }).then(password =>{
        resetUser.password = password ;
        resetUser.resetToken = undefined ; 
        resetUser.resetTokenExpire = undefined ; 
        return resetUser.save()
    }).then(result=>{
        res.redirect('/login'); 
    }).catch(err=>{
        console.log(err);
    });
}