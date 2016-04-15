module.exports = function (app, passport) {
  
  app.get('/signin', isLoggedIn, function (req, res, next) {
    res.render('signin', { message: req.flash('loginMessage') });
  });
  
  app.post('/signin', isLoggedIn, passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/signin',
    failureFlash : true
  }));
  
  app.get('/signup', isLoggedIn, function (req, res, next) {
    res.render('signup', { message: req.flash('signupMessage') });
  });
  
  app.post('/signup', isLoggedIn, passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
  }));
  
  app.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/signin');
  });
  
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    }
      return next();
}