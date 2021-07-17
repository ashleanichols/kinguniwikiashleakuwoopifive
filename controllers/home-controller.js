const Article = require('../models/Article')

module.exports.index = (req, res) => {
  Article
    .find()
    .sort('-creationDate')
    .limit(3)
    .populate('edits')
    .then(articles => {
      if (!articles || articles.length === 0) {
        res.render('home/index')
        return
      }

      let latestArticle = articles[0]
      let latestEdit = latestArticle.edits.sort((a, b) => b.creationDate - a.creationDate)[0]

      res.render('home/index', {
        latest: {
          title: latestArticle.title,
          content: latestEdit.content.split(' ').slice(0, 50).join(' ') + '...',
          id: latestArticle.id
        },
        recent: articles
      })
    })
}
