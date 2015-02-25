/// <reference path="c:\training\pluralsight\bootstrap-angularjs\mymessageboard\mymessageboard.tests\scripts\jasmine.js" />
/// <reference path="../../mymessageboard/scripts/angular.min.js" />
/// <reference path="../../mymessageboard/scripts/angular-route.min.js" />
/// <reference path="../../mymessageboard/scripts/angular-mocks.js" />
/// <reference path="../../mymessageboard/js/app.js" />
/// <reference path="../../mymessageboard/js/home-index.js" />

describe("home-index Tests->", function () {

    beforeEach(function () {
        module("HomeIndex");
    });

    var $httpBackend;

    beforeEach(inject(function ($injector) {

        $httpBackend = $injector.get("$httpBackend");

        $httpBackend.when("GET", "/api/v1/topics?includeReplies=true")
          .respond([
            {
                title: "first title",
                body: "some body",
                id: 1,
                created: "20050401"
            },
            {
                title: "second title",
                body: "some body",
                id: 1,
                created: "20050401"
            },
            {
                title: "third title",
                body: "some body",
                id: 1,
                created: "20050401"
            },
          ]);

    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("dataService->", function () {

        it("can load topics", inject(function (dataService) {

            expect(dataService.topics).toEqual([]);

            $httpBackend.expectGET("/api/v1/topics?includeReplies=true");
            dataService.getTopics();
            $httpBackend.flush();
            expect(dataService.topics.length).toBeGreaterThan(0);
            expect(dataService.topics.length).toEqual(3);

        }));

    });

    describe("TopicsController->", function () {

        it("load data", inject(function ($controller, $http, dataService) {

            var theScope = {};

            $httpBackend.expectGET("/api/v1/topics?includeReplies=true");

            var ctrl = $controller("TopicsController", {
                $scope: theScope, 
                $http: $http,
                dataService: dataService
            });

            $httpBackend.flush();

            expect(ctrl).not.toBeNull();
            expect(theScope.data).toBeDefined();
        }));

    });

});