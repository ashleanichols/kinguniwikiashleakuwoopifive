const Article = require('../models/Article')

module.exports.lock = (req, res) => {
  let articleId = req.params.articleId
  Article
    .findById(articleId)
    .then(article => {
      if (!article) {
        res.render('articles/edit', {
          error: 'Article not found.'
        })
        return
      }

      if (article.lockedStatus === false) {
        article.lockedStatus = true
        article
          .save()
          .then(() => {
            res.redirect(`/articles/edit/${articleId}`)
          })
          .catch(() => {
            res.render('articles/edit', {
              error: 'Something went wrong :( Try again.'
            })
          })
      } else {
        res.redirect(`/articles/edit/${articleId}`)
      }
    })
    .catch(() => {
      res.render('articles/edit', {
        error: 'Article not found.'
      })
    })
}

module.exports.unlock = (req, res) => {
  let articleId = req.params.articleId
  Article
    .findById(articleId)
    .then(article => {
      if (!article) {
        res.render('articles/edit', {
          error: 'Article not found.'
        })
        return
      }

      if (article.lockedStatus === true) {
        article.lockedStatus = false
        article
          .save()
          .then(() => {
            res.redirect(`/articles/edit/${articleId}`)
          })
          .catch(() => {
            res.render('articles/edit', {
              error: 'Something went wrong :( Try again.'
            })
          })
      } else {
        res.redirect(`/articles/edit/${articleId}`)
      }
    })
    .catch(() => {
      res.render('articles/edit', {
        error: 'Article not found.'
      })
    })
}
