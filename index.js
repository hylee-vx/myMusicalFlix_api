const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

//return static files
app.use(express.static('public'));

let movies = [
    {
        title: 'Singin\' In The Rain',
        releaseYear: 1952,
        description: 'A swashbuckling star of the silent movie era falls for an aspiring actress as Hollywood grapples with the advent of talking pictures.',
        genre: 'Romantic Comedy',
        director: ['Gene Kelly', 'Stanley Donen'],
        imageURL: 'https://www.imdb.com/title/tt0045152/mediaviewer/rm2462632960'
    },
    {
        title: 'The Greatest Showman',
        releaseYear: 2017,
        description: 'Inspired by the life of PT Barnum and Barnum\'s American Museum, a visionary rises from nothing to create a spectacle that becomes a worldwide sensation.',
        genre: 'Biopic',
        director: 'Michael Gracey',
        imageURL: 'https://www.imdb.com/title/tt1485796/mediaviewer/rm956976896'
    },
    {
        title: 'Funny Girl',
        releaseYear: 1968,
        description: 'Based on the life and career of Fanny Brice, Barbra Streisand portrays her rise to fame with the Ziegfeld Follies and her stormy relationship with entrepreneur and gambler Nick Arnstein.',
        genre: 'Biopic',
        director: 'William Wyler',
        imageURL: 'https://www.imdb.com/title/tt0062994/mediaviewer/rm4117314048'
    },
    {
        title: 'Funny Face',
        releaseYear: 1957,
        description: 'An impromptu fashion shoot at a bookstore brings about a new fashion model discovery in the shop clerk.',
        genre: 'Romantic Comedy',
        director: 'Stanley Donen',
        imageURL: 'https://www.imdb.com/title/tt0050419/mediaviewer/rm3913898752'
    },
    {
        title: 'Meet Me In St. Louis',
        releaseYear: 1944,
        description: 'In the year leading up to the 1904 St. Louis World\'s Fair, the four Smith daughters learn lessons about life and love, even as they prepare for a reluctant move to New York.',
        genre: 'Romantic Comedy',
        director: 'Vincente Minnelli',
        imageURL: 'https://www.imdb.com/title/tt0037059/mediaviewer/rm276993536'
    }
]

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
    res.json(movies.directors.find((movie) => {
        return movie.director.name === req.params.name
    }));
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
    res.json(users.find((user) => {
        return user.username === req.params.username
    }));
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
app.post('users/:username/favorites/:movieID', (req, res) => {
    res.send('Successful POST request adding movie "Funny Girl" to list of favourites');
});

//Allows user to remove movie from list of favourites
app.delete('users/:username/favorites/:movieID', (req, res) => {
    res.send('Successful DELETE request removing movie "Funny Girl" from list of favourites');
});

//Allows existing user to deregister
app.delete('users/:username', (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.username
    });

    if (user) {
        users = users.filter((obj) => {
            return obj.id !== req.params.id
        });
        res.status(201).send('The user account ' + req.params.username + ' was successfully deleted from myMusicalFlix.')
    }
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