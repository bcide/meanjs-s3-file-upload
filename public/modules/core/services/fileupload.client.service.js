'use strict';

//Menu service used for managing  menus
angular.module('core').service('FileUpload', ['$rootScope', '$http', '$upload',

    function($rootScope, $http, $upload) {

        // Upload files to S3
        this.upload = function(file, i, folder, uploads, callback) {
            $http.get('/aws/s3Policy?mimeType='+ file.type + '&folder=' + folder).success(function(response) {
                        var s3Params = response;
                        var photo_url= 'https://' + $rootScope.config.awsConfig.bucket + '.s3.amazonaws.com/'+folder+'/'+file.name;
                        uploads[i] = $upload.upload({
                            url: 'https://' + $rootScope.config.awsConfig.bucket + '.s3.amazonaws.com/',
                            method: 'POST',
                            transformRequest: function (data, headersGetter) {
                                //Headers change here
                                var headers = headersGetter();
                                delete headers['Authorization'];
                                return data;
                            },
                            data: {
                                'key' : folder + '/' +file.name,
                                'acl' : 'public-read',
                                'Content-Type' : file.type,
                                'AWSAccessKeyId': s3Params.AWSAccessKeyId,
                                'success_action_status' : '201',
                                'Policy' : s3Params.s3Policy,
                                'Signature' : s3Params.s3Signature
                            },
                            file: file,
                        });
                        uploads[i]
                        .then(function(response) {
                            file.progress = parseInt(100);
                            var msg= "";
                            console.log(response);
                            if (response.status === 201) {
                                console.log(response);
                                msg = photo_url;


                            } else {
                                msg = "error";

                            }
                            var msgs = {};
                            msgs[folder] = {'i':i, 'msg' :msg, 'callback': callback};
                            $rootScope.$broadcast('uploads', msgs);
                            console.log(folder);
                            console.log(msgs);

                        }, null, function(evt) {

                            console.log(evt);
                            file.progress =  parseInt(100.0 * evt.loaded / evt.total);
                        });
            });
        };




    }
]);
