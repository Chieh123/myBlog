
var myBlogArticles = angular.module('myBlogArticles', ["ngRoute"])

myBlogArticles.config(function($routeProvider){
	$routeProvider
  .when("/", {
      redirectTo: '/articles', pathMatch: 'full'
  })
  .when("/articles", {
      templateUrl : "home.html",
      controller : 'mainController'
  })
  .when("/articles/:id", {
      templateUrl : "detail.html"
  })
  .when("/postArticle", {
      templateUrl : 'post.html',
      controller : 'mainController'
  })
});

myBlogArticles.controller('mainController', function($scope, $http){
//function mainController ($scope, $http) {
  $scope.formData = {}
  // when landing on the page, get all todos and show them
  $scope.content_article = 'content'
  $scope.title_article = 'title'
  $http.get('/articles')
    .success(function (data) {
      $scope.articles = data
      console.log(data)
    })
    .error(function (data) {
      console.log('Error: ' + data)
    })
  $scope.getArticles = function () {
    $scope.content_article = 'content'
    $scope.title_article = 'title'
    $http.get('/articles')
      .success(function (data) {
        $scope.formData = {}
        $scope.articles = data
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
  // when submitting the add form, send the text to the node API
  $scope.postArticle = function () {
    $http.post('/postArticle', $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        $scope.articles = data
        console.log(data)
        window.location.assign('http://localhost:8080')
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
  // show specific article
  $scope.specificArticle = function (id, title, content) {
    $scope.id_article = id
    $scope.content_article = content
    $scope.title_article = title
    console.log(title)
    $http.get('/articles/' + id, $scope.formData)
      .success(function (data) {
        $scope.articles = data
        $scope.formData = {}
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
  $scope.getArticle = function () {
    console.log(title)
    $http.get('/articles/' + $scope.id_article, $scope.formData)
      .success(function (data) {
        $scope.articles = data
        $scope.formData = {}
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.turnToEdit = function () {
    $scope.formData.title = $scope.title_article
    $scope.formData.content = $scope.content_article
  }

  $scope.editArticle = function () {
    $http.put('/articles/' + $scope.id_article + '/edit', $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        $scope.articles = data
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.deleteArticle = function (id) {
    $http.delete('/articles/' + id + '/delete')
      .success(function (data) {
        $scope.articles = data
        console.log(data)
        window.location.assign('http://localhost:8080')
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
//}
})
