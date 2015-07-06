'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$rootScope', '$http', '$upload', 'Authentication', 'Articles', 'FileUpload',
	function($scope, $stateParams, $location, $rootScope, $http, $upload, Authentication, Articles, FileUpload) {
		$scope.authentication = Authentication;

		// Create new Article
		$scope.create = function() {
			// Create new Article object
			$scope.submitted = true;
			var article = new Articles({
				title: this.title,
				photo_url: ""
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				// Clear form fields
				$scope.title = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			$scope.submitted = true;
			if($scope.articleForm.$valid){
				if($scope.files){
					$scope.onFileSelect($scope.files, 'article', $scope.updatePhoto);
					$scope.uploading = true;
				}else{
					var article = $scope.article;
					article.$update(function() {
						$location.path('articles/' + article._id);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
			}	
		};

		$scope.updatePhoto = function(url){
			$scope.article.photo_url = url;
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$rootScope.$on('uploads', function(event, data){
			var uploadStatus = data[$scope.folders].msg;
            if(uploadStatus !== 'error'){
                data[$scope.folders].callback(uploadStatus);
            }
		});

		// Find a list of Articles
		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		// Find existing Article
		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};

		//file upload

        $scope.onFileSelect = function ($files, folder, callback) {
            $scope.upload = [];
            $scope.folders = folder;
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                file.progress = parseInt(0);
                FileUpload.upload(file, i, $scope.folders, $scope.upload, callback);
            }
        };
	}
]);