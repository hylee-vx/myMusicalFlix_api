const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

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
    res.json(movies);
});

//gets data about a specific movie by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title
    }));
});

//gets data about a specific genre; search by genre name
app.get('/movies/:genre', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.genre === req.params.genre
    }));
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
    res.send('Successful GET request returning data on the director "Gene Kelly"');
});

//allows new user to register
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.username && !newUser.password && !newUser.email) {
        const message = 'Please fill in all fields';
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser)
    }
});

//gets data about a specific user account
app.get('/users/:username', (req, res) => {
    res.send('Successful GET request returning data on the user "barbrastreisand"');
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