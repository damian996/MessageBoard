/// <reference path="c:\training\pluralsight\bootstrap-angularjs\mymessageboard\mymessageboard.tests\scripts\jasmine.js" />
/// <reference path="../../mymessageboard/js/myapp.js" />

describe("myapp tests -->", function () {

    it("isDebug", function () {
        expect(app.isDebug).toEqual(true);
    });

    it("log", function () {
        expect(app.log).toBeDefined();
        app.log("testing");
    });
});