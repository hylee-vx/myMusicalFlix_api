const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

//return static files
app.use(express.static('public'));

//GET requests
//welcome message on homepage
app.get('/', (req, res) => {
    res.send('Welcome to myMusicalFlix!');
});

//gets list of all movies
app.get('/movies', (req, res) => {
    res.send('Successful GET request returning data on all movies');
});

//gets list of a specific movie by title
app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning data on the movie "Singin\' In The Rain"');
});

//gets data about a specific genre; search by genre name
app.get('/movies/genre/:type', (req, res) => {
    res.send('Successful GET request returning data on the genre "Romantic Comedy"');
});

//gets data about a specific genre; search by movie title
app.get('/movies/genre/:title', (req, res) => {
    res.send('Successful GET request returning data on the genre of the movie "Singin\' In The Rain");
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