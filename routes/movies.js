const express = require('express');
const passport = require('passport');

const { MovieModel } = require('../models.js')

const router = express.Router();

//gets list of all movies
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    MovieModel.find()
      .then(movies => {
        res.json(movies);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//gets data about a specific movie by title
router.get(
  '/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    MovieModel.findOne({ Title: req.params.Title })
      .then(movie => {
        res.json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//gets data about a specific genre by genre name
router.get(
  '/genre/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    MovieModel.findOne({ 'Genre.Name': req.params.Name })
      .then(movie => {
        res.json(movie.Genre);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//gets data about a specific genre; search by movie title
router.get(
  '/:Title/genre',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    MovieModel.findOne({ Title: req.params.Title })
      .then(movie => {
        res.json(movie.Genre);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//gets data about a specific director by name
router.get(
  '/directors/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    MovieModel.findOne({ 'Directors.Name': req.params.Name })
      .then(movie => {
        let directorData = movie.Directors.find(
          ({ Name }) => Name === req.params.Name
        );
        res.json(directorData);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//gets data about a specific actor by name
router.get(
  '/actors/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    MovieModel.findOne({ 'Actors.Name': req.params.Name })
      .then(movie => {
        let actorData = movie.Actors.find(
          ({ Name }) => Name === req.params.Name
        );
        res.json(actorData);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);  

module.exports = router;
