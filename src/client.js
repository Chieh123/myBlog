var express = require('express')
var app = express()
var path = require('path')
const request = require('request')
const serverurl = 'http://localhost:8200'
app.configure(function () {
  // set the static files location /public/img will be /img for users
  app.use(express.static(path.join(__dirname, '/public')))
  // log every request to the console
  app.use(express.logger('dev'))
  // pull information from html in POST
  app.use(express.urlencoded())
  app.use(express.json())
})

app.get('/articles', function (req, res) {
  request.get({url: serverurl + '/articles'}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})
// get specific article
app.get('/articles/:article_id', function (req, res) {
  request.get({url: serverurl + '/articles/' + req.params.article_id}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})
// searchArticles
app.post('/searchArticles', function (req, res) {
  console.log('app.put search')
  console.log('req.body.title = ' + req.body.title)
  console.log('req.body = ' + req.body)

  request.post({url: serverurl + '/articles/search' + '?title=' + encodeURI(req.body.title) + '&author=' + encodeURI(req.body.author) + '&content=' + encodeURI(req.body.content)}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    console.log('body = ' + body)
    res.send(body)
  })
})
// create Todo and send back all todos after creation
app.post('/postArticle/:user_id', function (req, res) {
  request.post({url: serverurl + '/postArticle/' + req.params.user_id + '?title=' + encodeURI(req.body.title) + '&author=' + encodeURI(req.body.author) + '&content=' + encodeURI(req.body.content)}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})
// update specific article
app.put('/articles/:article_id/edit', function (req, res) {
  console.log('app.put edit')
  request.put({url: serverurl + '/articles/' + req.params.article_id + '/edit/' + req.query.user_id + '?title=' + encodeURI(req.body.title) + '&content=' + encodeURI(req.body.content)}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})
// delete a todo
app.delete('/articles/:article_id/delete', function (req, res) {
  request.delete({ url: serverurl + '/articles/' + req.params.article_id + '/delete/' + req.query.user_id }, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})
// create an Account
app.post('/signUp', function (req, res) {
  console.log('in client sign up')
  console.log('req.body.user_name = ' + req.body.user_name)
  console.log('req.body.user_password = ' + req.body.user_password)
  request.post({ url: serverurl + '/signUp?userName=' + req.body.user_name + '&userPassword=' + req.body.user_password }, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    req.body.signup = true
    console.log(body)
    res.send(body)
  })
})
app.post('/signIn', function (req, res) {
  console.log('in client sign in')
  console.log('req.body.user_name = ' + req.body.user_name)
  console.log('req.body.user_password = ' + req.body.user_password)
  request.get({ url: serverurl + '/signIn?userName=' + req.body.user_name + '&userPassword=' + req.body.user_password }, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    console.log('client log in')
    res.send(body)
  })
})
app.get('/usernameAvailable/:user_name', function (req, res) {
  console.log('req.params.user_name = ' + req.params.user_name)
  request.get({url: serverurl + '/usernameAvailable?userName=' + req.params.user_name}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    //    console.log(body)
    res.send(body)
  })
})
app.get('/users/:id', function (req, res) {
  request.get({url: serverurl + '/users/' + req.params.id}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})

app.listen(8080)
console.log('App listening on port 8080')
