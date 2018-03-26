
var myBlogArticles = angular.module('myBlogArticles', ['ngRoute', 'ngCookies'])
myBlogArticles.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/articles', prefix: 'full'
    })
    .when('/articles', {
      templateUrl: 'home.html',
      controller: 'articlesController'
    })
    .when('/articles/:id', {
      templateUrl: 'detail.html',
      controller: 'detailController'
    })
    .when('/postArticle', {
      templateUrl: 'post.html',
      controller: 'mainController'
    })
    .when('/articles/:id/edit', {
      templateUrl: 'edit.html',
      controller: 'editController'
    })
    .when('/signIn', {
      templateUrl: 'signIn.html',
      controller: 'mainController'
    })
    .when('/signUp', {
      templateUrl: 'signUp.html',
      controller: 'mainController'
    })
    .when('/users/:id', {
      templateUrl: 'account.html',
      controller: 'accountController'
    })
    .otherwise({
      templateUrl: 'home.html',
      controller: 'articlesController'
    })
})
myBlogArticles.service('logIn', function ($cookies) {
  this.login = $cookies.get('login')
  this.user_id = $cookies.get('user_id')
  $cookies.put('user_id', '0000');
  $cookies.put('user_id', false);
})
myBlogArticles.controller('mainController', function ($scope, $http, $routeParams, logIn,$cookies) {
  $scope.formData = {}
  $scope.user_id = logIn.user_id
  $scope.login = $cookies.get('login',logIn.login)
  // when landing on the page, get all todos and show them
  $scope.content_article = 'content'
  $scope.title_article = 'title'
  // when submitting the add form, send the text to the node API
  $scope.postArticle = function () {
    $http.post('/postArticle/' + $scope.user_id, $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        $scope.articles = data
        console.log(data)
        window.location.assign('http://localhost:8080/#/articles')
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
  $scope.editArticle = function () {
    $http.put('/articles/' + $routeParams.id + '/edit?user_id=' + logIn.user_id, $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        $scope.articles = data
        console.log('edit' + data)
        console.log($routeParams.id)
        window.location.assign('http://localhost:8080/#/articles/' + $routeParams.id)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.deleteArticle = function (id) {
    console.log(logIn.user_id)
    $http.delete('/articles/' + id + '/delete?user_id=' + logIn.user_id)
      .success(function (data) {
        $scope.articles = data
        console.log(data)
        window.location.assign('http://localhost:8080/#/articles')
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.signIn = function () {
    console.log('$scope.formData.user_name = ' + $scope.formData.user_name)
    $http.post('/signIn', $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        console.log('data.length = ' + data.length)
        if (data.length === 1) {
          logIn.user_id = data[0]._id
          $cookies.put('login', true);
          console.log('logIn.login = ' + $cookies.get('login'))
          window.location.assign('http://localhost:8080/#/users/' + logIn.user_id)
          console.log(logIn.user_id)
        }
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.signUp = function () {
    $http.post('/signUp', $scope.formData)
      .success(function (data) {
        console.log('data = ' + data)
        $scope.formData = {}
        console.log('data.length' + data.length)
        if (data.length === 1) {
          logIn.user_id = data[0]._id
          window.location.assign('http://localhost:8080/#/users/' + logIn.user_id)
          $cookies.put('login', true);
        } else {
          console.log('the account name is not unique')
        }
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
  $scope.logOut = function () {
    $cookies.put('login', false);
    $cookies.get('login');
    console.log('when logout login = ' + $cookies.get('login'))
    console.log('$scope.login = ' + $scope.login)
    //window.location.assign('http://localhost:8080')
  }
})
  .controller('articlesController', function ($scope, $http, logIn, $cookies) {
    $scope.login = $cookies.get('login')
    console.log('in articles controller')
    console.log('login = ' + $cookies.get('login'))
    $http.get('/articles')
      .success(function (data) {
        $scope.articles = data
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  })
  .controller('detailController', function ($scope, $http, $routeParams, logIn, $cookies) {
    $scope.login = $cookies.get('login')
    console.log('$routeParams.id = ' + $routeParams.id)
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
  .controller('editController', function ($scope, $http, $routeParams, logIn, $cookies ) {
    $scope.login = $cookies.get('login')
    console.log('$routeParams.id = ' + $routeParams.id)
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
  .controller('accountController', function ($scope, $http, $routeParams, logIn, $cookies) {
    $scope.login = $cookies.get('login')
    console.log('$cookies.get(login) = ' + typeof $cookies.get('login'))
    console.log('$scope.login = ' + typeof $scope.login)
    $http.get('/users/' + $routeParams.id)
      .success(function (data) {
        $scope.user = data[0]
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  })
