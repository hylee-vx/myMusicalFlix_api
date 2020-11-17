const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

//return static files
app.use(express.static('public'));

//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myMusicalFlix!');
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