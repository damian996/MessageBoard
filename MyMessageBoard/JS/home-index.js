//home-index.js
(function () {
    var homeIndexModule = angular.module("HomeIndex");   

    homeIndexModule.factory("dataService", ["$http", "$q", function ($http, $q) {
        
        var _topics = [];
        var _isInit = false;

        var _isReady = function () {
            return _isInit;
        }

        var _getTopics = function () {
            
            var deferred = $q.defer();

            $http.get("api/v1/topics?includeReplies=true")
                   .then(function (response) {
                       angular.copy(response.data, _topics);
                       _isInit = true;
                       deferred.resolve();
                   },
                   function () {
                       //Error
                       deferred.reject();
                   });
            return deferred.promise;
        };

        var _addTopic = function (newTopic) {

            var deferred = $q.defer();

            $http.post("api/v1/topics", newTopic)
                .then(function(result) {
                    //success
                    var addedTopic = result.data;
                    //merge with exisiting list of topics
                    _topics.splice(0, 0, addedTopic);
                    deferred.resolve(addedTopic);
                },
                function () {
                    //error
                    deferred.reject();
                });
            return deferred.promise;
        }

        //this if private function and it is not going to be shared.
        //this is why it wasn't declared as a variable
        function findTopic(id) {
            var found = null;

            $.each(_topics, function (i, item) {
                if (item.id == id) {
                    found = item;
                    return false;
                }
            });

            return found;
        }

        var _getTopicById = function (id) {
            var deferred = $q.defer();

            if (_isReady()) {
                var topic = findTopic(id);
                if (topic) {
                    deferred.resolve(topic);
                }
                else {
                    deferred.reject();
                }
            }
            else {
                _getTopics()
                    .then(function () {
                        var topic = findTopic(id);
                        if (topic) {
                            deferred.resolve(topic);
                        }
                        else {
                            deferred.reject();
                        }
                    },
                    function () {
                        deferred.reject();
                    });
            }

            return deferred.promise;

        }

        var _saveReply = function (topic, newReply) {
            var deferred = $q.defer();

            $http.post("/api/v1/topics/" + topic.id + "/replies", newReply)
                .then(function (result) {
                    if (!topic.replies) topic.replies = [];
                    topic.replies.push(result.data);
                    deferred.resolve(result.data);
                },
                function () {
                    deferred.reject();
                });

            return deferred.promise;
        }

        return {
            topics: _topics,
            getTopics: _getTopics,
            addTopic: _addTopic,
            isReady: _isReady,
            getTopicById: _getTopicById,
            saveReply: _saveReply
        };
    }]);

    var TopicsController = ["$scope", "$http", "dataService", function ($scope, $http, dataService) {          
        $scope.isBusy = false;
        $scope.data = dataService;
        
        if (dataService.isReady() == false) {
            $scope.isBusy = true;
            dataService.getTopics()
            .then(function (data) {
                //success
            },
            function () {
                //error
                alert("Could not load topics");
            })
            .then(function () {
                $scope.isBusy = false;
            });
        }
    }];
        
    var NewTopicController = ["$scope", "$http", "$window", "dataService", function ($scope, $http, $window, dataService) {
        $scope.newTopic = {};

        $scope.save = function () {
            dataService.addTopic($scope.newTopic)
                .then(function () {
                    $window.location = '#/';
                },
                function () {
                    alert("Could not save the new topic!");
                });
        }
    }];

    var SingleTopicController = ["$scope", "dataService", "$window", "$routeParams", function ($scope, dataService, $window, $routeParams) {
        $scope.topic = null;
        $scope.newReply = {};

        dataService.getTopicById($routeParams.id)
            .then(function (topic) {
                $scope.topic = topic;
            },
            function () {
                $window.location = "#/";
            });

        $scope.addReply = function () {
            dataService.saveReply($scope.topic, $scope.newReply)
                .then(function () {
                    $scope.newReply.body = "";
                },
                function () {
                    alert("Could not save the new reply");
                });
        };
    }];

    homeIndexModule.controller("TopicsController", TopicsController);
    homeIndexModule.controller("NewTopicController", NewTopicController);
    homeIndexModule.controller("SingleTopicController", SingleTopicController);
}());
