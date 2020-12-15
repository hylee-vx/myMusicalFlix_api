require('./auth');

const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  cors = require('cors');

const userRoutes = require('./routes/user');
const moviesRoutes = require('./routes/movies');

// connect to MongoDB Atlas database
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors()); //allows requests from all origins

//return static files
app.use(express.static('public'));

//GET requests
//welcome message on homepage
app.get('/', (req, res) => {
  res.send('Welcome to myMusicalFlix!');
});

app.use('/user', userRoutes);
app.use('/movies', moviesRoutes);

//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke');
});

//listen for requests via environment variables
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
