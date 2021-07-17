const Article = require('../models/Article')
const Edit = require('../models/Edit')
const errorHandler = require('../utilities/error-handler')

module.exports.createView = (req, res) => {
  res.render('articles/create')
}

module.exports.create = (req, res) => {
  let {title, content} = req.body

  if (!title || !content) {
    res.render('articles/create', {
      error: 'Please fill all fields.',
      title,
      content
    })
    return
  }

  Article
    .create({title})
    .then(article => {
      let editObj = {
        author: req.user._id,
        article: article._id,
        content
      }

      Edit
        .create(editObj)
        .then(edit => {
          let edits = article.edits
          edits.push(edit._id)
          article.edits = edits
          article
            .save()
            .then(() => {
              res.redirect('/')
            })
            .catch((error) => {
              console.log(error)
              res.render('articles/create', {
                error: 'Something went wrong :( Try again.'
              })
            })
        })
        .catch((err) => {
          res.render('articles/create', {
            error: errorHandler.handleMongooseError(err),
            title,
            content
          })
        })
    })
    .catch((err) => {
      res.render('articles/create', {
        error: errorHandler.handleMongooseError(err),
        title,
        content
      })
    })
}

module.exports.all = (req, res) => {
  Article
    .find()
    .sort('title')
    .then(articles => {
      res.render('articles/all', {articles})
    })
}

module.exports.read = (req, res) => {
  let articleId = req.params.articleId
  Article
    .findById(articleId)
    .populate('edits')
    .then(article => {
      if (!article) {
        res.render('articles/article', {
          error: 'Article not found.'
        })
        return
      }

      let edits = article.edits
      edits = edits.sort((a, b) => b.creationDate - a.creationDate)
      let content = edits[0].content
      article.paragraphs = content.split('\n\r\n')
      res.render('articles/article', article)
    })
    .catch(() => {
      res.render('articles/article', {
        error: 'Article not found.'
      })
    })
}

module.exports.getLatest = (req, res) => {
  Article
    .find()
    .sort('-creationDate')
    .limit(1)
    .populate('edits')
    .then(articles => {
      if (!articles || articles.length === 0) {
        res.render('articles/article', {
          error: 'Article not found.'
        })
        return
      }

      let article = articles[0]
      let edits = article.edits
      edits = edits.sort((a, b) => b.creationDate - a.creationDate)
      let content = edits[0].content
      article.paragraphs = content.split('\n\r\n')
      res.render('articles/article', article)
    })
    .catch(() => {
      res.render('articles/article', {
        error: 'Article not found.'
      })
    })
}

module.exports.editView = (req, res) => {
  let articleId = req.params.articleId
  Article
    .findById(articleId)
    .populate('edits')
    .then(article => {
      if (!article) {
        res.render('articles/edit', {
          error: 'Article not found.'
        })
        return
      }

      if (article.lockedStatus) {
        if (!res.locals.admin) {
          res.render('articles/edit', {
            error: 'You are not allowed to edit this article.'
          })
          return
        }
      }

      let edits = article.edits
      edits = edits.sort((a, b) => b.creationDate - a.creationDate)
      article.content = edits[0].content
      res.render('articles/edit', article)
    })
    .catch(() => {
      res.render('articles/edit', {
        error: 'Article not found.'
      })
    })
}

module.exports.edit = (req, res) => {
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

      if (article.lockedStatus) {
        if (!res.locals.admin) {
          res.render('articles/edit', {
            error: 'You are not allowed to edit this article.'
          })
          return
        }
      }

      let content = req.body.content.trim()
      if (!content || content.length === 0) {
        res.render('articles/edit', {
          error: 'The article should have content.'
        })
        return
      }

      let editObj = {
        author: req.user._id,
        article: articleId,
        content
      }

      Edit
        .create(editObj)
        .then(edit => {
          let currentEdits = article.edits
          currentEdits.push(edit._id)
          article.edits = currentEdits
          article
            .save()
            .then(() => {
              res.redirect(`/articles/read/${articleId}`)
            })
            .catch(() => {
              res.render('articles/edit', {
                error: 'Something went wrong :( Try again later.'
              })
            })
        })
        .catch(() => {
          res.render('articles/edit', {
            error: 'Something went wrong :( Try again later.'
          })
        })
    })
    .catch(() => {
      res.render('articles/edit', {
        error: 'Article not found.'
      })
    })
}

module.exports.articleHistory = (req, res) => {
  let articleId = req.params.articleId
  Article
    .findById(articleId)
    .populate({
      path: 'edits',
      populate: {
        path: 'author',
        model: 'User'
      }
    })
    .then(article => {
      if (!article) {
        res.render('articles/history', {
          error: 'Article not found.'
        })
        return
      }

      res.render('articles/history', {
        title: article.title,
        edits: article.edits.sort((a, b) => b.creationDate - a.creationDate)
      })
    })
    .catch(() => {
      res.render('articles/history', {
        error: 'Article not found.'
      })
    })
}

module.exports.readArticleEdit = (req, res) => {
  let editId = req.params.editId
  Edit
    .findById(editId)
    .populate('article')
    .then(edit => {
      if (!edit) {
        res.render('articles/article', {
          error: 'Article edit not found.'
        })
        return
      }

      let paragraphs = edit.content.split('\n\r\n')

      res.render('articles/article', {
        title: edit.article.title,
        id: edit.article.id,
        paragraphs
      })
    })
    .catch((error) => {
      console.log(error)
      res.render('articles/article', {
        error: 'Article edit not found.'
      })
    })
}

module.exports.search = (req, res) => {
  let searchTerm = req.body.text
  Article
    .find()
    .then(articles => {
      let filtered = articles.filter(a => a.title.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      res.render('articles/search', {
        searchTerm: searchTerm,
        articles: filtered
      })
    })
}
