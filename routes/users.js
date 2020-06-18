const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const passport = require('passport')

// Login page 
router.get('/login', (req, res) => res.render('login'))

// Register page 
router.get('/register', (req, res) => res.render('register'))

// Registering
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    // Password confirmation
    if (password !== password2) {
        res.render('register', {error: 'Passwords must match', name, email, password, password2})
    } else {
        User.findOne({ email: email })
            .then( user => {
                if (user) {
                    res.render('register', {error: 'Email is already registered', name, email, password, password2})
                } else {
                    const newUser = new User({name, email, password})
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw err
                        newUser.password = hash
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    }))
                }
            })
    }

})

//Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/tasks',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
module.exports = router