const home = require('./home-controller')
const users = require('./users-controller')
const articles = require('./articles-controller')
const admin = require('./admin-controller')
const error = require('./error-controller')

module.exports = {
  home: home,
  users: users,
  articles: articles,
  admin: admin,
  error: error
}
