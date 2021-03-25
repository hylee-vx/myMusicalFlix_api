const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  ReleaseYear: { type: Date, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Directors: [
    {
      Name: String,
      Bio: String,
      BirthYear: Date,
      DeathYear: Date,
      ImagePath: String,
    },
  ],
  Actors: [
    {
      Name: String,
      Bio: String,
      BirthYear: Date,
      DeathYear: Date,
      ImagePath: String,
    },
  ],
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  DateOfBirth: Date,
  FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

userSchema.statics.hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
