const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt');

//SIGN-UP
router.get('/signup', (req, res, next) => {
    res.render('signup')
});
//LOG IN
router.get("/login", (req, res, next) => {
    res.render("login");
  });
//

//SIGN-UP
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    console.log({ username, password });

    if (password.length < 8) {
        res.render('signup', {message: "Your password has to be 8 char min"})
        return
    }
    if (username === '') {
        res.render('signup', { message: 'Your username cannot be empty' });
        return
    }

    User.findOne({username: username})
    .then( userFromDB => {
        if (userFromDB !== null) {
        res.render('signup', { message: 'This username is already taken' });
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);

            User.create( { username: username, password: hash})
            .then(createdUser => {
                req.session.user = createdUser;
                res.redirect('/login')
            })
        }
    })
});
//LOGIN
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
      .then(userFromDB => {
        if (userFromDB === null) {
          res.render('login', { message: 'Invalid credentials' });
          return;
        }
        if (bcrypt.compareSync(password, userFromDB.password)) {
          req.session.user = userFromDB;
          res.redirect('/profile');
        }
      })
  })

module.exports = router;


