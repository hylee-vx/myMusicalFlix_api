const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topTenFilms = [
    {
        title: 'Singin\' In The Rain',
        director: ['Stanley Donen', 'Gene Kelly'],
        releaseYear: 1952
    },
    {
        title: 'Some Like It Hot',
        director: 'Billy Wilder',
        releaseYear: 1959
    },
    {
        title: 'The Princess Bride',
        director: 'Rob Reiner',
        releaseYear: 1987
    },
    {
        title: 'Fargo',
        director: ['Joel Coen', 'Ethan Coen'],
        releaseYear: 1997
    },
    {
        title: 'The Philadelphia Story',
        director: 'George Cukor',
        releaseYear: 1940
    },
    {
        title: 'The Blues Brothers',
        director: 'John Landis',
        releaseYear: 1980
    },
    {
        title: 'Spirited Away',
        director: 'Hayao Miyazaki',
        releaseYear: 2002
    },
    {
        title: 'Die Hard',
        director: 'John McTiernan',
        releaseYear: 1988
    },
    {
        title: 'Raise The Red Lantern',
        director: 'Zhang Yimou',
        releaseYear: 1992
    },
    {
        title: 'La Haine',
        director: 'Mathieu Kassovitz',
        releaseYear: 1995
    }
];

//return static files
app.use(express.static('public'));

//GET requests
app.get('/movies', (req, res) => {
    res.json(topTenFilms);
});

app.get('/', (req, res) => {
    res.send('Hello and welcome');
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