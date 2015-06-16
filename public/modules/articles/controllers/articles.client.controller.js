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
				content: this.content,
				photo_url: ""
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
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
					$scope.onFileSelect($scope.files);
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

		$rootScope.$on('uploads', function(event, data){
			if(data[$scope.folders].msg !== 'error'){
				$scope.article.photo_url = data[$scope.folders].msg;
				var article = $scope.article;
					article.$update(function() {
						$location.path('articles/' + article._id);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
				});
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
		$scope.FileSelect = function($file){
			$scope.files = $file;
			console.log($file);
		};

        $scope.onFileSelect = function ($files) {
            $scope.files = $files;
            $scope.upload = [];
            $scope.folders = "articles";
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                file.progress = parseInt(0);
                FileUpload.upload(file, i, $scope.folders, $scope.upload);
                // (function (file, i) {
                //     $http.get('/aws/s3Policy?mimeType='+ file.type+'&folder=articles').success(function(response) {
                //         var s3Params = response;
                //         $scope.photo_url= 'https://' + $rootScope.config.awsConfig.bucket + '.s3.amazonaws.com/articles/'+file.name;
                //         $scope.upload[i] = $upload.upload({
                //             url: 'https://' + $rootScope.config.awsConfig.bucket + '.s3.amazonaws.com/',
                //             method: 'POST',
                //             transformRequest: function (data, headersGetter) {
                //                 //Headers change here
                //                 var headers = headersGetter();
                //                 delete headers['Authorization'];
                //                 return data;
                //             },
                //             data: {
                //                 'key' : 'articles/' + file.name,
                //                 'acl' : 'public-read',
                //                 'Content-Type' : file.type,
                //                 'AWSAccessKeyId': s3Params.AWSAccessKeyId,
                //                 'success_action_status' : '201',
                //                 'Policy' : s3Params.s3Policy,
                //                 'Signature' : s3Params.s3Signature
                //             },
                //             file: file,
                //         });
                //         $scope.upload[i]
                //         .then(function(response) {
                //             file.progress = parseInt(100);
                //             if (response.status === 201) {
                //             	console.log(response);
                //             	$scope.photo_url;
                //                 // var data = xml2json.parser(response.data),
                //                 // parsedData;
                //                 // parsedData = {
                //                 //     location: data.postresponse.location,
                //                 //     bucket: data.postresponse.bucket,
                //                 //     key: data.postresponse.key,
                //                 //     etag: data.postresponse.etag
                //                 // };
                //                 // $scope.imageUploads.push(parsedData);

                //             } else {
                //                  "error";
                //             }
                //         }, null, function(evt) {
                        	
                //         	console.log(evt);
                //             file.progress =  parseInt(100.0 * evt.loaded / evt.total);
                //         });
                //     });
                // }(file, i));
            }
        };
	}
]);