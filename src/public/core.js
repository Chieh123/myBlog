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
    .when('/searchArticles', {
      templateUrl: 'home.html',
      controller: 'mainController'
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
})
myBlogArticles.controller('mainController', function ($scope, $http, $routeParams, logIn,$cookies) {
  $scope.formData = {}
  $scope.login = $cookies.get('login')
  $scope.checkboxModel = {
       title : false,
       author : false,
       content : false
  };
  // when submitting the add form, send the text to the node API
  $scope.postArticle = function () {
    var title = document.getElementById("post_title").value;
    var author = document.getElementById("post_author").value;
    var content = document.getElementById("post_content").value;
    $scope.formData.title = title
    $scope.formData.author = author
    $scope.formData.content = content
    console.log("$cookies.get(user_id) = " + $cookies.get('user_id'))
    $http.post('/postArticle/' + $cookies.get('user_id'), $scope.formData)
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
    $http.put('/articles/' + $routeParams.id + '/edit?user_id=' + $cookies.get('user_id'), $scope.formData)
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
    $http.delete('/articles/' + id + '/delete?user_id=' + $cookies.get('user_id'))
      .success(function (data) {
        $scope.formData = {}
        console.log(data)
        window.location.assign('http://localhost:8080/#/articles')
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.searchArticles = function() {
    var title = document.getElementById("article_title").value;
    var author = document.getElementById("article_author").value;
    var content = document.getElementById("article_content").value;
    $scope.formData.title = title
    $scope.formData.author = author
    $scope.formData.content = content
    console.log("$scope.formData.title = " + $scope.formData.title)
    $http.post('/searchArticles',$scope.formData)
      .success(function (data) {
        $scope.articles = data
        console.log(data)
        window.location.assign('http://localhost:8080/#/searchArticles')
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
          $cookies.put('login', true);
          console.log('logIn.login = ' + $cookies.get('login'))
          $cookies.put('user_id', data[0]._id);
          window.location.assign('http://localhost:8080/#/users/' + $cookies.get('user_id'))
          console.log("$cookies.get(user_id) = " + $cookies.get('user_id'))
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
          $cookies.put('user_id', data[0]._id);
          window.location.assign('http://localhost:8080/#/users/' + $cookies.get('user_id'))
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
    $cookies.put('user_id', 0);
    $cookies.get('login');
    console.log('when logout login = ' + $cookies.get('login'))
    console.log('$scope.login = ' + $scope.login)
    window.location.assign('http://localhost:8080')
  }
})
  .controller('articlesController', function ($scope, $http, logIn, $cookies) {
    $scope.login = $cookies.get('login')
    console.log("$cookies.get(user_id) = " + $cookies.get('user_id'))
    console.log('in articles controller')
    console.log('login = ' + $cookies.get('login'))
    $http.get('/articles')
      .success(function (data) {
        $scope.articles = data
        $scope.formData = {}
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
      $scope.$watch($scope.articles, function(newValue, oldValue) {
        console.log(newValue, oldValue);

      },true);
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
    $scope.count = 0
    $scope.pwd = false
    $scope.showpwd = function(){
      if($scope.count % 2 === 1) {
        $scope.pwd = true
      } else {
        $scope.pwd = false
      }
      console.log("pwd = " + $scope.pwd)
      $scope.count = $scope.count + 1
    }
    console.log("pwd = " + $scope.pwd)
    $http.get('/users/' + $routeParams.id)
      .success(function (data) {
        $scope.user = data[0]
        $scope.pwd = "click to show password"
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  })

myBlogArticles.directive('checkContent', function() {
    return {
        //restrict可以定義directive是A(屬性)或E(元素)或C(類別)或M(備註)，此範例是定義為屬性
        restrict: 'A',
        //link是這個directive 一被執行就做的事情
        //scope和$scope一樣，element 就是你這個 directive 標籤本身物件，attr 就是 標籤內的 屬性
        link: function(scope, element, attr){
            //用$watch去即時監看ngShow2
            scope.$watch(attr.checkContent, function(value){
               //element.css('background-color', value ? '' : 'yellow');
                if(value){
                    //addClass之後，如果沒有remove掉，再加別的class、它會蓋上去
                    element.removeClass( 'click_style');
                }
                else{
                    element.addClass( 'click_style');
                }
            });
        }
    };
});
