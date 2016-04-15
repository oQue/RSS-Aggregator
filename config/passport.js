var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField   : 'login',
        passwordField   : 'password',
        passReqToCallback : true
    },
    function(req, login, password, done) {
        process.nextTick(function() {
            User.findOne({ 'login' :  login }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'Login is already used'));
                } else {
                    var newUser = new User();
                    newUser.login = login;
                    newUser.password = newUser.generateHash(password);
                    newUser.email = req.body.email;
                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'login',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, login, password, done) {
        User.findOne({ 'login' :  login }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found'));
            }
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password'));
            }
            return done(null, user);
        });

    }));
    
};