
var myBlogArticles = angular.module('myBlogArticles', ["ngRoute"])



myBlogArticles.config(function($routeProvider){
	$routeProvider
  .when("/", {
      redirectTo: '/articles', prefix: 'full'
  })
  .when("/articles", {
      templateUrl : "home.html",
      controller : 'articlesController'
  })
  .when("/articles/:id", {
      templateUrl : "detail.html",
      controller : 'detailController'
  })
  .when("/postArticle", {
      templateUrl : 'post.html',
      controller : 'mainController'
  })
  .when("/articles/:id/edit", {
      templateUrl : 'edit.html',
      controller : 'editController'
  })
  .when("/signIn", {
      templateUrl : "signIn.html",
      controller : 'mainController'
  })
  .when("/signUp", {
      templateUrl : "signUp.html",
      controller : 'mainController'
  })
});

myBlogArticles.controller('mainController', function($scope, $http, $routeParams){
  $scope.formData = {}
  // when landing on the page, get all todos and show them
  $scope.login = false
  $scope.content_article = 'content'
  $scope.title_article = 'title'
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
  $scope.editArticle = function () {
    $http.put('/articles/' +$routeParams.id + '/edit', $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        $scope.articles = data
        console.log("edit" + data)
				console.log($routeParams.id)
				window.history.back();
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

  $scope.signIn = function () {
    $http.get('/signIn', $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        $scope.user = data[0]
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.signUp = function () {
    $http.post('/signUp', $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        $scope.user = data[0]
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.logOut = function () {
    $scop.login = false
  }
})
.controller('articlesController', function($scope, $http){
  console.log("in articles controller")
  $http.get('/articles')
    .success(function (data) {
      $scope.articles = data
      console.log(data)
    })
    .error(function (data) {
      console.log('Error: ' + data)
    })
})
.controller('detailController', function($scope, $http, $routeParams){
  console.log("$routeParams.id = " + $routeParams.id)
  $http.get('/articles/' + $routeParams.id, $scope.formData)
    .success(function (data) {
      $scope.article = data[0]
      $scope.formData = {}
      console.log(data)
    })
    .error(function (data) {
      console.log('Error: ' + data)
    })
})
.controller('editController', function($scope, $http, $routeParams){
  console.log("$routeParams.id = " + $routeParams.id)
  $http.get('/articles/' + $routeParams.id, $scope.formData)
    .success(function (data) {
      $scope.article = data[0]
			$scope.formData.content = $scope.article.Content
			$scope.formData.title = $scope.article.Title
      console.log(data)
    })
    .error(function (data) {
      console.log('Error: ' + data)
    })
})
