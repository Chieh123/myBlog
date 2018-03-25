var express = require('express')
var app = express()
var path = require('path')
const ApiService = require('./server_api')

app.configure(function () {
  // set the static files location /public/img will be /img for users
  app.use(express.static(path.join(__dirname, '/public')))
  // log every request to the console
  app.use(express.logger('dev'))
  // pull information from html in POST
  app.use(express.urlencoded())
  app.use(express.json())
})
// get all articles
app.get('/articles', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  console.log('come in the request')
  apiServiceObj.getArticles()
})
// get a specific article
app.get('/articles/:article_id', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.getArticle()
})
// create an article
app.post('/postArticle/:user_id', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.postArticle()
})
// update a specific article
app.put('/articles/:article_id/edit/:user_id', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.editArticle()
})
// delete an article
app.delete('/articles/:article_id/delete/:user_id', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.deleteArticle()
})
// creat an Account
app.post('/signUp', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.signUp()
})
// log in
app.get('/signIn', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.signIn()
})
// check account unique
app.get('/usernameAvailable', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.usernameAvailable()
})
app.get('/users/:id', function (req, res) {
  let apiServiceObj = new ApiService(req, res)
  apiServiceObj.user()
})

app.listen(8200)
console.log('App listening on port 8200')
