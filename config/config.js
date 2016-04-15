var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    port: 3000,
    db: 'mongodb://localhost/workspace-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    port: 3000,
    db: 'mongodb://localhost/workspace-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    port: 3000,
    db: 'mongodb://localhost/workspace-production'
  }
};

module.exports = config[env];
