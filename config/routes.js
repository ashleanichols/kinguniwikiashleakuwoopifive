const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/articles/all', controllers.articles.all)
  app.get('/articles/read/:articleId', controllers.articles.read)
  app.get('/articles/latest', controllers.articles.getLatest)
  app.post('/articles/search', controllers.articles.search)

  app.get('/users/register', auth.isAnonymous, controllers.users.registerGet)
  app.post('/users/register', auth.isAnonymous, controllers.users.registerPost)
  app.get('/users/login', auth.isAnonymous, controllers.users.loginGet)
  app.post('/users/login', auth.isAnonymous, controllers.users.loginPost)

  app.get('/articles/create', auth.isAuthenticated, controllers.articles.createView)
  app.post('/articles/create', auth.isAuthenticated, controllers.articles.create)
  app.get('/articles/edit/:articleId', auth.isAuthenticated, controllers.articles.editView)
  app.post('/articles/edit/:articleId', auth.isAuthenticated, controllers.articles.edit)
  app.get('/articles/history/:articleId', auth.isAuthenticated, controllers.articles.articleHistory)
  app.get('/articles/history/read/:editId', auth.isAuthenticated, controllers.articles.readArticleEdit)
  app.get('/users/logout', auth.isAuthenticated, controllers.users.logout)

  app.get('/admin/article/lock/:articleId', auth.isAdmin, controllers.admin.lock)
  app.get('/admin/article/unlock/:articleId', auth.isAdmin, controllers.admin.unlock)

  app.all('*', controllers.error)
}
