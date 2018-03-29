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
      controller: 'searchArticles'
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
myBlogArticles.controller('mainController', function ($scope, $http, $routeParams, $cookies) {
  $scope.formData = {}
  $scope.articles = {}
  console.log("$cookies.get('login') = " + $cookies.get('login'))
  if ($cookies.get('login') == null) {
    console.log('login is null')
    $cookies.put('login', false)
  }
  $scope.login = $cookies.get('login')
  $scope.user_id = $cookies.get('user_id')
  $scope.NoBadWord = true
  $scope.checkboxModel = {
    title: false,
    author: false,
    content: false,
    anonymous: false
  }
  $scope.target = {
    title: $cookies.get('title'),
    author: $cookies.get('author'),
    content: $cookies.get('content')
  }
  // when submitting the add form, send the text to the node API
  $scope.postArticle = function () {
    var title = document.getElementById('post_title').value
    var author = document.getElementById('post_author').value
    var content = document.getElementById('post_content').value
    $scope.formData.title = title
    $scope.formData.author = author
    $scope.formData.content = content
    $scope.NoBadWord = NoBadWord($scope)
    if ($scope.NoBadWord) {
      console.log('$cookies.get(user_id) = ' + $cookies.get('user_id'))
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
  }
  var count = 0
  $scope.anonymous = function () {
    console.log('count before = ', count)
    if (count === 0) {
      $scope.formData.author = 'Anonymous'
      $scope.checkboxModel.anonymous = true
      count = (count + 1) % 2
    } else {
      $scope.formData.author = ''
      $scope.checkboxModel.anonymous = false
      count = (count + 1) % 2
    }
    console.log('count after = ', count)
  }
  $scope.editArticle = function () {
    $scope.NoBadWord = NoBadWord($scope)
    if ($scope.NoBadWord) {
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

  $scope.searchArticles = function () {
    $cookies.put('title', document.getElementById('article_title').value)
    $cookies.put('author', document.getElementById('article_author').value)
    $cookies.put('content', document.getElementById('article_content').value)
    var locHref = location.href
    console.log('this.locHerf = ', location.href)
    console.log('tString(locHref).indexOf(search) = ', String(locHref).indexOf('search'))
    if (String(locHref).indexOf('search') === -1) {
      console.log('direct to search')
      window.location.assign('http://localhost:8080/#/searchArticles')
    } else {
      console.log('reload search')
      location.reload()
    }
  }
  $scope.signIn = function () {
    console.log('$scope.formData.user_name = ' + $scope.formData.user_name)
    $http.post('/signIn', $scope.formData)
      .success(function (data) {
        $scope.formData = {}
        console.log('data.length = ' + data.length)
        if (data.length === 1) {
          $cookies.put('login', true)
          console.log('logIn.login = ' + $cookies.get('login'))
          $cookies.put('user_id', data[0]._id)
          window.location.assign('http://localhost:8080/#/users/' + $cookies.get('user_id'))
          console.log('$cookies.get(user_id) = ' + $cookies.get('user_id'))
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
          $cookies.put('user_id', data[0]._id)
          window.location.assign('http://localhost:8080/#/users/' + $cookies.get('user_id'))
          $cookies.put('login', true)
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
    $cookies.put('login', false)
    $cookies.put('user_id', 0)
    $cookies.get('login')
    console.log('when logout login = ' + $cookies.get('login'))
    console.log('$scope.login = ' + $scope.login)
    window.location.assign('http://localhost:8080')
  }
})
  .controller('articlesController', function ($scope, $http, $cookies) {
    var locHref = location.href
    if (String(locHref).indexOf('search') === -1) {
      console.log('direct to search')
      $scope.search = false
    }
    $scope.login = $cookies.get('login')
    console.log('$cookies.get(user_id) = ' + $cookies.get('user_id'))
    console.log('in articles controller')
    console.log('login = ' + $cookies.get('login'))
    $scope.user_id = $cookies.get('user_id')
    $http.get('/articles')
      .success(function (data) {
        $scope.articles = data
        var i
        for (i = 0; i < $scope.articles.length; i++) {
          $scope.articles[i].pDate = new Date($scope.articles[i].pDate).toLocaleString()
        }
        $scope.formData = {}
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  })
  .controller('detailController', function ($scope, $http, $routeParams, $cookies) {
    $scope.login = $cookies.get('login')
    console.log('$routeParams.id = ' + $routeParams.id)
    $scope.user_id = $cookies.get('$routeParams.id')
    $http.get('/articles/' + $routeParams.id, $scope.formData)
      .success(function (data) {
        $scope.article = data[0]
        console.log('$scope.article.mDate.toLocaleString()' + $scope.article.mDate.toLocaleString())
        $scope.article.mDate = new Date($scope.article.mDate).toLocaleString()
        $scope.article.pDate = new Date($scope.article.pDate).toLocaleString()
        $scope.formData = {}
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  })
  .controller('editController', function ($scope, $http, $routeParams, $cookies) {
    $scope.login = $cookies.get('login')
    console.log('$routeParams.id = ' + $routeParams.id)
    $scope.user_id = $cookies.get('user_id')
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
  .controller('accountController', function ($scope, $http, $routeParams, $cookies) {
    $scope.login = $cookies.get('login')
    $scope.user_id = $cookies.get('user_id')
    console.log('$cookies.get(login) = ' + typeof $cookies.get('login'))
    console.log('$scope.login = ' + typeof $scope.login)
    $scope.count = 0
    $scope.pwd = false
    $scope.showpwd = function () {
      if ($scope.count % 2 === 1) {
        $scope.pwd = true
      } else {
        $scope.pwd = false
      }
      console.log('pwd = ' + $scope.pwd)
      $scope.count = ($scope.count + 1) % 2
    }
    console.log('pwd = ' + $scope.pwd)
    $http.get('/users/' + $routeParams.id)
      .success(function (data) {
        $scope.user = data[0]
        $scope.pwd = 'click to show password'
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
    $scope.formData.title = ''
    $scope.formData.author = ''
    $scope.formData.content = ''
    $scope.formData.user_id = $cookies.get('user_id')
    $http.post('/searchArticles', $scope.formData)
      .success(function (data) {
        $scope.articles = data
        $scope.formData = {}
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  })
  .controller('searchArticles', function ($scope, $http, $cookies) {
    var locHref = location.href
    if (String(locHref).indexOf('search') !== -1) {
      console.log('direct to search')
      $scope.search = true
    }
    if ($cookies.get('title') === '') {
      console.log('$cookies.get(title) = null ')
      $scope.formData.title = ''
    } else {
      console.log('$cookies.get(title) != null ')
      $scope.formData.title = $cookies.get('title')
    }
    console.log('$cookies.get(author) = ', $cookies.get('author'))
    if ($cookies.get('author') === '') {
      console.log('$cookies.get(author) = null')
      $scope.formData.author = ''
    } else {
      $scope.formData.author = $cookies.get('author')
    }
    if ($cookies.get('content') === '') {
      console.log('$cookies.get(content) = null ')
      $scope.formData.content = ''
    } else {
      $scope.formData.content = $cookies.get('content')
    }
    $scope.formData.user_id = ''
    $http.post('/searchArticles', $scope.formData)
      .success(function (data) {
        $scope.articles = data
        $scope.formData = {}
        $cookies.put('title', '')
        $cookies.put('author', '')
        $cookies.put('content', '')
        console.log(data)
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  })

function NoBadWord ($scope) {
  var badWord = [ ' 幹你娘 ', ' 操機歪 ', ' 你娘被狗幹 ', ' 你爸幹死狗 ', ' 你母啊大懶趴 ', ' 你爸操機歪 ', ' 水雞 ㄇㄞ ', ' 哭爸 ', ' 哭母 ', ' 哭腰 ', ' 哭餐 ', ' 狗母養的 ', ' 破麻 ', ' 看三小 ', ' 你娘卡好 ', ' 婊仔子 ', ' 幹 ', ' 操你媽的 ', ' you idiot ', ' what are you fxxk doing ', ' you are a jerk ', ' bullshit ', ' bitch ', ' you bastard ' ]
  var s = $scope.formData.content
  s = ' ' + s + ' '
  s = s.toLowerCase()
  var i = 0
  var symbol = ['\`', '~', '!', '@', '#', '$', '%', '(', ')', '-', '_', '^', '&', '*', '+', '=', '\\', '[', ']', '|', '\"', '\'', '\,', '[', ']', '{', '}', ':', ';', '?', '/', '.', ',', '>', '<', '！', '？', '（', '）', '『', '』', '「', '」', '“', '：', '；', '/', '，', '《', '、', '〈', '。', '⋯', '・', '》', '〉']
  for (i = 0; i < symbol.length; i++) {
    s = s.replace(symbol[i], ' ')
  }
  console.log('s = ', s)
  for (i = 0; i < badWord.length; i++) {
    if (s.indexOf(badWord[i]) !== -1) {
      return false
    }
  }
  return true
}
