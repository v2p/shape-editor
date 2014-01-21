define(['jasmine', 'eve',  'shapeEditor/point', 'shapeEditor/circle', 'shapeEditor/special/handle'], function (jasmine, eve, Point, Circle, Handle) {

    describe("Editable Circle", function () {
        var editableCircle;

        beforeEach(function() {
            editableCircle = new Circle(1, 2, 3);
        });

        it("ID should be defined", function () {
            expect(editableCircle.id).toBeDefined();
        });

        it("centerPoint should be Point", function () {
            expect(editableCircle.centerPoint).toEqual(jasmine.any(Point));
        });

        it("centerPoint should be correct", function () {
            expect(editableCircle.centerPoint.x).toEqual(1);
            expect(editableCircle.centerPoint.y).toEqual(2);
        });

        it("radius should be correct", function () {
            expect(editableCircle.radius).toEqual(3);
        });

        it("should have getData method", function () {
            expect(editableCircle.getData).toBeDefined();
        });

        it("should have addOnRaphaelPaper method", function () {
            expect(editableCircle.addOnRaphaelPaper).toBeDefined();
        });

        it("should have removeFromPaper method", function () {
            expect(editableCircle.removeFromPaper).toBeDefined();
        });
    });

});