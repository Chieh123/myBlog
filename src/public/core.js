var myBlogArticles = angular.module('myBlogArticles', [])

function mainController ($scope, $http) {
  $scope.formData = {}
  // when landing on the page, get all todos and show them
  $scope.submit = true
  $http.get('/articles')
    .success(function (data) {
      $scope.articles = data
      console.log(data)
    })
    .error(function (data) {
      console.log('Error: ' + data)
    })
  $scope.getArticles = function () {
    $http.get('/articles')
      .success(function (data) {
        $scope.submit = true
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
  $scope.specificArticle = function (id) {
    $http.get('/articles/' + id, $scope.formData)
      .success(function (data) {
        $scope.articles = data
        $scope.edit = true
        $scope.submit = false
        $scope.formData = {}
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }

  $scope.editArticle = function (id) {
    $http.put('/articles/' + id + '/edit', $scope.formData)
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
        if ($scope.edit) {
          $scope.edit = false
        }
        if (!$scope.submit) {
          $scope.edit = true
        }
        console.log(data)
        window.location.assign('http://localhost:8080')
      })
      .error(function (data) {
        console.log('Error: ' + data)
      })
  }
}
