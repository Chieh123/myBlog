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
  // print the article list
  getArticles () {
    console.log('in get articles server_api')
    let self = this
    Article.find(function (err, articles) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(articles)
    })
  };
  // print specific article
  getArticle () {
    let self = this
    Article.find({
      _id: self.req.params.article_id
    }, function (err, article) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(article)
    })
  };
  // search articles
  searchArticles () {
    let self = this
    console.log('decodeURI(self.req.query.title) = ' + decodeURI(self.req.query.title))
    console.log('decodeURI(self.req.query.content) = ' + decodeURI(self.req.query.content))
    console.log('decodeURI(self.req.query.author) = ' + decodeURI(self.req.query.author))
    Article.find({
      Title: { $regex: '.*' + decodeURI(self.req.query.title) + '.*' },
      Author: { $regex: '.*' + decodeURI(self.req.query.author) + '.*' },
      Content: { $regex: '.*' + decodeURI(self.req.query.content) + '.*'}
    }, function (err, articles) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(articles)
    })
  };
  // post article
  postArticle () {
    let self = this
    console.log('self.req.query.title = ' + decodeURI(self.req.query.title))
    console.log('self.req.query.author = ' + decodeURI(self.req.query.author))
    console.log('self.req.query.content = ' + decodeURI(self.req.query.content))
    Article.create({
      Title: decodeURI(self.req.query.title),
      Author: decodeURI(self.req.query.author),
      Content: decodeURI(self.req.query.content),
      user_id: self.req.params.user_id
    }, function (err) {
      if (err) {
        self.res.send(err)
      }
      console.log('success create')
      self.res.send('post success')
    })
  };
  // todo add authorize
  editArticle () {
    let self = this
    console.log('self.req.query.title = ' + decodeURI(self.req.query.title))
    console.log('self.req.query.content = ' + decodeURI(self.req.query.content))
    console.log('self.req.params.article_id = ' + decodeURI(self.req.params.article_id))
    Article.update({
      _id: self.req.params.article_id,
      user_id: self.req.params.user_id
    }, {
      Title: decodeURI(self.req.query.title),
      Content: decodeURI(self.req.query.content),
      mDate: Date.now()
    }, function (err, article) {
      if (err) {
        self.res.send(err)
      }
      console.log('in server edit article = ' + article)
      self.res.send(article)
    })
  }
  // todo
  deleteArticle () {
    let self = this
    Article.remove({
      _id: self.req.params.article_id,
      user_id: self.req.params.user_id
    }, function (err, todo) {
      if (err) {
        self.res.send(err)
      }
      self.res.send('delete success')
    })
  }
  // sugn up
  signUp () {
    let self = this
    console.log('in signUp')
    console.log('self.req.query.userName = ' + self.req.query.userName)
    console.log('self.req.query.userPassword = ' + String(self.req.query.userPassword))
    self.mySignUp()
  }
  createAccount (userName, password) {
    console.log('in createAccount')
    let self = this
    User.create({
      Account: self.req.query.userName,
      Password: String(self.req.query.userPassword)
    }, function (err, user) {
      if (err) {
        self.res.send(err)
      }
      console.log('success create')
      self.signIn()
    })
  }
  // checkAccountName is userName is unique
  mySignUp () {
    console.log('in mySignUp')
    let self = this
    console.log('user_name = ' + self.req.query.userName)
    User.count({
      Account: self.req.query.userName
    }, function (err, c) {
      if (err) {
        self.res.send(err)
      }
      console.log('type of c = ' + typeof c)
      console.log('c = ' + c)
      if (c === 0) {
        self.createAccount()
      } else {
        self.res.send('the user name need to change')
      }
    })
  }
  // sign in
  signIn () {
    console.log('in singIn')
    let self = this
    console.log('type of self.req.query.userName = ' + typeof self.req.query.userName)
    console.log('self.req.query.userPassword = ' + typeof self.req.query.userPassword)
    User.find({
      Account: self.req.query.userName,
      Password: self.req.query.userPassword
    }, function (err, user) {
      if (err) {
        self.res.send(err)
      }
      console.log('login')
      console.log('user = ' + user)
      self.res.send(user)
    })
  }
  // check account unique
  usernameAvailable () {
    console.log('in usernameAvailable')
    let self = this
    console.log('self.req.query.userName = ' + self.req.query.userName)
    User.count({
      Account: self.req.query.userName
    }, function (err, c) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(c)
    })
    self.res.send('cannot find1')
  }

  user () {
    console.log('in user')
    let self = this
    console.log('self.req.params.id = ' + self.req.params.id)
    User.find({
      _id: self.req.params.id
    }, function (err, data) {
      if (err) {
        self.res.send(err)
      }
      self.res.send(data)
    })
  }
}
var Article = mongoose.model('articles', {
  Title: {type: String, default: ' '},
  Author: {type: String, default: ' '},
  Content: {type: String, default: ' '},
  pDate: {type: Date, default: Date.now},
  mDate: {type: Date, default: Date.now},
  user_id: {type: String, default: ' '}
})
var User = mongoose.model('users', {
  Account: {type: String, default: ' '},
  Password: {type: String, default: ' '},
  myDate: {type: Date, default: Date.now}
})
var Command = mongoose.model('commands', {
  User_id: {type: String, default: ' '},
  Article_id: {type: String, default: ' '},
  GivenDate: {type: Date, default: Date.now}
})
module.exports = apiService
