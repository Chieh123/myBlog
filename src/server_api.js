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
  //print the article list
  getArticles () {
    let self = this
    Article.find(function (err, articles) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(articles)
    })
  };
  //print specific article
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
  //todo
  postArticle () {
    let self = this
    console.log('self.req.query.title = ' + decodeURI(self.req.query.title))
    console.log('self.req.query.author = ' + decodeURI(self.req.query.author))
    console.log('self.req.query.content = ' + decodeURI(self.req.query.content))
    Article.create({
      Title: decodeURI(self.req.query.title),
      Author: decodeURI(self.req.query.author),
      Content: decodeURI(self.req.query.content),
    }, function (err) {
      if (err) {
        self.res.send(err)
      }
      console.log("success create")
      self.res.send('post success')
    })
  };
  //todo add authorize
  editArticle () {
    let self = this
    console.log('self.req.query.title = ' + decodeURI(self.req.query.title))
    console.log('self.req.query.content = ' + decodeURI(self.req.query.content))
    Article.update({
      _id: self.req.params.article_id
    }, {
      Title: decodeURI(self.req.query.title),
      Content: decodeURI(self.req.query.content),
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
  //todo
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
  //sugn up
  signUp () {
    let self = this
    console.log('self.req.query.userName = ' + self.req.query.userName)
    console.log('self.req.query.password = ' + self.req.query.password)
    User.create({
      Account: self.req.query.userName,
      Password: self.req.query.password,
    }, function (err) {
      if (err) {
        self.res.send(err)
      }
      console.log("success create")
      self.res.send('post success')
    })
  }
  //checkAccountName is userName is unique
  userNameUnique () {
    let self = this
    console.log('self.req.query.userName = ' + self.req.query.userName)
    User.count({
      Account: self.req.query.userName
    }, function (err, c) {
      if (err) {
        self.res.send(err)
      }
      console.log("c = " + c)
      self.res.json(c)
    })
  }



}
var Article = mongoose.model('articles', {
  Title: {type: String, default: ' '},
  Author: {type: String, default: ' '},
  Content: {type: String, default: ' '},
  pDate: {type: Date, default: Date.now},
  mDate: {type: Date, default: Date.now},
  Authorize: {type: Boolean, default: true},
  password: {type: String, default: '123456'}
})
var User = mongoose.model('users', {
  Account: {type: String, default: ' '},
  Password: {type: String, default: ' '},
  myDate: {type: Date, default: Date.now},
})
var Command = mongoose.model('commands', {
  User_id: {type: String, default: ' '},
  Article_id: {type: String, default: ' '},
  GivenDate: {type: Date, default: Date.now},
})
module.exports = apiService
