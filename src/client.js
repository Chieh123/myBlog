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
// create Todo and send back all todos after creation
app.post('/postArticle', function (req, res) {
  request.post({url: serverurl + '/postArticle?title=' + encodeURI(req.body.title) + '&author=' + encodeURI(req.body.author) + '&content=' + encodeURI(req.body.content)}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})
// update specific article
app.put('/articles/:article_id/edit', function (req, res) {
  request.put({url: serverurl + '/articles/' + req.params.article_id + '/edit?title=' + encodeURI(req.body.title) + '&content=' + encodeURI(req.body.content)}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})
// delete a todo
app.delete('/articles/:article_id/delete', function (req, res) {
  request.delete({url: serverurl + '/articles/' + req.params.article_id + '/delete'}, function (error, httpResponse, body) {
    if (error) {
      return console.error('upload failed:', error)
    }
    res.send(body)
  })
})

app.listen(8080)
console.log('App listening on port 8080')
