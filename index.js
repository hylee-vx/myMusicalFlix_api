const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const Movies = Models.Movie,
    Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myMusicalFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

//return static files
app.use(express.static('public'));

//GET requests
//welcome message on homepage
app.get('/', (req, res) => {
    res.send('Welcome to myMusicalFlix!');
});

//gets list of all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//gets data about a specific movie by title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//gets data about a specific genre; search by movie title
app.get('/movies/:Title/genre', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie.Genre.Name + ': ' + movie.Genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//gets data about a specific director by name
app.get('/movies/directors/:Name', (req, res) => {
    Movies.findOne({ 'Directors.Name': req.params.Name })
        .then((movie) => {
            let directorData = movie.Directors.find(({ Name }) =>
                Name === req.params.Name);
            res.json(directorData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//gets data about a specific actor by name
app.get('/movies/actors/:Name', (req, res) => {
    Movies.findOne({ 'Actors.Name': req.params.Name })
        .then((movie) => {
            let actorData = movie.Actors.find(({ Name }) =>
                Name === req.params.Name);
            res.json(actorData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//allows new user to register
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthdate: req.body.Birthdate
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).send('Error: ' + err);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//gets data about a specific user account
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Allows user to update user info
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username },
        {
            $set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthdate: req.body.Birthdate
            }
        },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

//Allows user to add movie to list of favourites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username },
        {
            $push:
                { FavouriteMovies: req.params.MovieID }
        },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

//Allows user to remove movie from list of favourites
app.put('/users/:Username/Movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username },
        {
            $pull:
                { FavouriteMovies: req.params.MovieID }
        },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

//Allows existing user to deregister
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke');
});

//listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});