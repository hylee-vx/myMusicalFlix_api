const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const { UserModel } = require('../models.js')

const router = express.Router();

const jwtSecret = 'your_jwt_secret'; //must be same key used in JWTStrategy in passport.js
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //username encoded in JWT
        expiresIn: '7d', //token expires in 7 days
        algorithm: 'HS256' //algorithm used to 'sign'/encode values of the JWT
    });
}

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
});

//allows new user to register
router.post(
  '/',
  //validation logic for request
  [
    check('Username', 'Username is required').not().isEmpty(),
    check('Username', 'Username must be at least 5 characters').isLength({
      min: 5,
    }),
    check(
      'Username',
      'Username can only contain letters or numbers'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password must be at least 8 characters').isLength({
      min: 8,
    }),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    //checks validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = UserModel.hashPassword(req.body.Password);
    UserModel.findOne({ Username: req.body.Username })
      .then(user => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          UserModel.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate,
          })
            .then(user => {
              res.status(201).json(user);
            })
            .catch(err => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// //gets data about a specific user account
// //needs separate JWT to ensure users only have access to their own account
// router.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Users.findOne({ Username: req.params.Username })
//         .then((user) => {
//             res.json(user);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
// });

//Allows user to update user info
router.put(
  '/:Username',
  passport.authenticate('jwt', { session: false }),
  //validation logic for request
  [
    check('Username', 'Username is required').not().isEmpty(),
    check('Username', 'Username must be at least 5 characters').isLength({
      min: 5,
    }),
    check(
      'Username',
      'Username can only contain letters or numbers'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password must be at least 8 characters').isLength({
      min: 8,
    }),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    //checks validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = UserModel.hashPassword(req.body.Password);
    UserModel.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthdate: req.body.Birthdate,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allows user to add movie to list of favourites
router.post(
  '/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    UserModel.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavouriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allows user to remove movie from list of favourites
router.put(
  '/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    UserModel.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavouriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allows existing user to deregister
router.delete(
  '/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    UserModel.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

module.exports = router;
