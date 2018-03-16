var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/myblog')
mongoose.connection.on('error', function (err) {
  console.error('connect fail:' + err)
})

class apiService {
  constructor (req, res) {
    this.req = req
    this.res = res
  }
  getArticles () {
    let self = this
    Article.find(function (err, articles) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(articles)
    })
  };
  getArticle () {
    let self = this
    Article.find({
      _id: self.req.params.article_id
    }, function (err, articles) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(articles)
    })
  };
  postArticle () {
    let self = this
    console.log('self.req.query.title = ' + self.req.query.title)
    let title = self.req.query.title === undefined ? ' ' : self.req.query.title
    Article.create({
      Title: title,
      Author: self.req.query.author,
      Content: self.req.query.content
    }, function (err, todo) {
      if (err) {
        self.res.send(err)
      }
      self.res.send('post success')
    })
  };
  editArticle () {
    let self = this
    Article.update({
      _id: self.req.params.article_id
    }, {
      Title: self.req.query.title,
      Content: self.req.query.content,
      mDate: Date.now()
    }, function (err, todo) {
      if (err) {
        self.res.send(err)
      }
    })
    Article.find({
      _id: self.req.params.article_id
    }, function (err, articles) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(articles)
    })
  }
  deleteArticle () {
    let self = this
    Article.remove({
      _id: self.req.params.article_id
    }, function (err, todo) {
      if (err) {
        self.res.send(err)
      }
      self.res.send('delete success')
    })
  }
}
var Article = mongoose.model('articles', {
  Title: {type: String, default: ' '},
  Author: {type: String, default: ' '},
  Content: {type: String, default: ' '},
  pDate: {type: Date, default: Date.now},
  mDate: {type: Date, default: Date.now}
})
module.exports = apiService
