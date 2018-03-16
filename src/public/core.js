var myBlogArticles = angular.module('myBlogArticles', [])

function mainController ($scope, $http) {
  $scope.formData = {}
  // when landing on the page, get all todos and show them
  $scope.submit = true
  $scope.detail = false
  $scope.edit = false
  $scope.content_article = "content"
  $scope.title_article = "title"
  $http.get('/articles')
    .success(function (data) {
      $scope.articles = data
      console.log(data)
    })
    .error(function (data) {
      console.log('Error: ' + data)
    })
  $scope.getArticles = function () {
    $scope.content_article = "content"
    $scope.title_article = "title"
    $http.get('/articles')
      .success(function (data) {
        $scope.submit = true
        $scope.detail = false
        $scope.edit = false
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
        $scope.detail = true
        $scope.submit = false
        $scope.formData = {}
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.turnToEdit = function(){
      $scope.edit = true
      $scope.formData.title = $scope.title_article
      $scope.formData.content = $scope.content_article
  }

  $scope.editArticle = function () {
    $http.put('/articles/' + $scope.id_article + '/edit', $scope.formData)
      .success(function (data) {
        $scope.edit = false
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
        if ($scope.detail) {
          $scope.detail = false
        }
        if (!$scope.submit) {
          $scope.submit = true
        }
        console.log(data)
        window.location.assign('http://localhost:8080')
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
}
