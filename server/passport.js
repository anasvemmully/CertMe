var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var bcrypt = require('bcrypt');
module.exports = (passport)=>{
    passport.use( new LocalStrategy(
        ( username , password , done )=>{
          User.findOne({ username : username }, function (err, user) {
            if (err) { return done(err); }
            else if (!user) {
              return done(null, false, { message: 'Invalid Credentials.' });
            }
            bcrypt.compare(password, user.password, function (err, res) {
              if(res == true){
                return done(null, user);
              }
              else{
                return done(null, false, { message: 'Invalid Credentials.' });
              }
            });
          });
        }
    ));

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });
};