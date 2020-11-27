const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const app = express();
const Movies = Models.Movie,
    Users = Models.User;

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
            res.status(201).json(movies);
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

//gets data about a specific genre; search by genre name
app.get('/movies/:name/genre', (req, res) => {
    //    res.json(movies.find((movie) => {
    //        return movie.genre === req.params.genre
    //    }));
    res.send('Successful GET request returning data on genre "Biopic"');
});

//gets data about a specific genre; search by movie title
app.get('/movies/:title/genre', (req, res) => {
    let movie = movies.find((movie) => {
        return movie.title === req.params.title
    });

    let genre = movie.genre;

    if (movie) {
        let movieSnapshot = [movie.title, movie.releaseYear, movie.imageURL];
        let movieSnapshotGenre = movieSnapshot.concat(genre);
        res.json(movieSnapshotGenre);
    }
});

//gets data about a specific director by name
app.get('/movies/directors/:name', (req, res) => {
    //    res.json(movies.directors.find((movie) => {
    //        return movie.director.name === req.params.name
    //    }));
    res.send('Successful GET request returning data on director "Gene Kelly"');
});

//gets data about a specific actor by name
app.get('/movies/actors/:name', (req, res) => {
    res.send('Successful GET request returning data on actor "Judy Garland"');
});

//allows new user to register
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.username && !newUser.password && !newUser.email) {
        const message = 'Please fill in all fields';
    } else {
        newUser.id = uuid.v4();
        //        users.push(newUser);
        res.status(201).send(newUser)
    }
});

//gets data about a specific user account
app.get('/users/:username', (req, res) => {
    //    res.json(users.find((user) => {
    //        return user.username === req.params.username
    //    }));
    res.send('Successful GET request returning data for username "barbrastreisand"');
});

//Allows user to update user info
app.put('/users/:username', (req, res) => {
    //    let user = users.find((user) => {
    //        return user.username === req.params.username
    //    });

    //can't figure out the next bit! 
    //forEach() loop to check each property in user object?
    //if/else statement within the loop - if new value different to what is on database, replace with new value; else keep existing value

    res.send('Successful PUT request updating values for username "barbrastreisand"');
});

//Allows user to add movie to list of favourites
app.post('/users/:username/favorites/:movieID', (req, res) => {
    res.send('Successful POST request adding movie "Funny Girl" to list of favourites');
});

//Allows user to remove movie from list of favourites
app.delete('/users/:username/favorites/:movieID', (req, res) => {
    res.send('Successful DELETE request removing movie "Funny Girl" from list of favourites');
});

//Allows existing user to deregister
app.delete('/users/:username', (req, res) => {
    //    let user = users.find((user) => {
    //        return user.username === req.params.username
    //    });

    //    if (user) {
    //        users = users.filter((obj) => {
    //            return obj.id !== req.params.id
    //        });
    //        res.status(201).send('The user account ' + req.params.username + ' was successfully deleted from myMusicalFlix.')
    //    }
    res.send('The user account "barbrastreisand" was successfully deleted from myMusicalFlix.');
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