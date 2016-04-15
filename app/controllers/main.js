var mongoose = require('mongoose');
var User = mongoose.model('user');
var YQL = require('yql');
var baseApiUrl = 'select title, pubDate, description, link from rss where url in ';

module.exports = function (app) {
  
  // client-side implementation
  app.get('/', isLoggedIn, function (req, res) {
    var feedUrl = getApiUrl(req, res);
    res.render('feed', { user : req.user, page_name : 'main', url : encodeURIComponent(feedUrl) });
  });
  
  // server-side implementation
  app.get('/server', isLoggedIn, function (req, res) {
    var url = getApiUrl(req, res);
    getAndSendFeed(url, req, res);
  });

  app.get('/preferences', isLoggedIn, function (req, res, next) {
    res.render('preferences', { user : req.user, page_name : 'pref' });
  });
  
  app.post('/feed/add', isLoggedIn, function (req, res, next) {
    var user = req.user;
    var data = req.body;
    var uniqueId = findUniqueId(data.name, user);
    var icon = parseFavicon(req.url);
    var feed = {
      id: uniqueId,
      url: data.url,
      name: data.name,
      icon: icon
    };
    var response;
    User.update(
      { _id : user._id },
      {$push: {"feeds": feed}},
      function(err, model) {
        if (err) {
          console.log(err);
          response = {
            status  : 200,
            id      : uniqueId,
            success : false
          };
        } else {
          response = {
            status  : 200,
            id      : uniqueId,
            success : true
          };
        }
        res.end(JSON.stringify(response));
    });
  });
  
  app.post('/feed/delete', isLoggedIn, function (req, res, next) {
    var user = req.user;
    var data = req.body;
    var response;
    User.update(
      { _id : user._id },
      {$pull: { feeds: { id : data.id } } },
      function(err, model) {
        if (err) {
          console.log(err);
          response = {
            status  : 200,
            id      : data.id,
            success : false
          };
        } else {
          response = {
            status  : 200,
            id      : data.id,
            success : true
          };
        }
        res.end(JSON.stringify(response));
    });
  });

};

function findUniqueId(name, user) {
  var shortName = name.replace(/\s+/g, '').substr(0, 20);
  var generatedName = shortName;
  var counter = 2;
  var iter = 0;
  while (iter < user.feeds.length) {
    if (generatedName === user.feeds[iter].id) {
      generatedName = shortName + counter;
      counter++;
      iter = 0;
    } else {
      iter++;
    }
  }
  return generatedName;
}

function parseFavicon(url) {
  return null;
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/signin');
}

function getApiUrl(req, res) {
  console.log('get all feeds');
  var user = req.user;
  var id = req.query.feed;
  var feedUrl = '';
  if (id) {
    for (var i = 0; i < user.feeds.length; i++) {
      if (user.feeds[i].id === id) {
        feedUrl = "'" + user.feeds[i].url + "'";
      }
    }
  } else {
    for (var i = 0; i < user.feeds.length; i++) {
      feedUrl += "'" + user.feeds[i].url + "'";
      if (i != user.feeds.length - 1 && user.feeds.length != 1) {
        feedUrl += ', ';
      }
    }
  }
  return baseApiUrl + '(' + feedUrl + ')' + ' | sort(field="pubDate") | reverse()';
}

function getAndSendFeed(url, req, res) {
  console.log('YQL request: \n' + url);
  var query = new YQL(url);
  query.exec(function(err, data) {
    if (err) {
      return null;
    }
    var result = data.query.results.item;
    res.render('feed_server', { user : req.user, page_name : 'main', feeds : result });
  });
}