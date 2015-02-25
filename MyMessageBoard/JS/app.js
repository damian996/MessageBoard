(function () {
    var homeIndexModule = angular.module("HomeIndex", ['ngRoute']);

    homeIndexModule.config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "TopicsController",
            templateUrl: "/Templates/TopicsView.html"
        });

        $routeProvider.when("/newmessage", {
            controller: "NewTopicController",
            templateUrl: "/Templates/NewTopicView.html"
        });

        $routeProvider.when("/message/:id", {
            controller: "SingleTopicController",
            templateUrl: "/Templates/SingleTopicView.html"
        });

        $routeProvider.otherwise({ redirectTo: "/" });
    }]);
}());