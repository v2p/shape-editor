define(['jasmine', 'eve',  'shapeEditor/point', 'shapeEditor/shape/rectangle', 'shapeEditor/shape/special/handle'], function (jasmine, eve, Point, Rectangle, Handle) {

    describe("Editable Rectangle", function () {
        var editableRectangle;

        beforeEach(function() {
            editableRectangle = new Rectangle(1, 2, 3, 4);
        });

        it("shape ID should be defined", function () {
            expect(editableRectangle.id).toBeDefined();
        });

        it("topLeftPoint should be Point", function () {
            expect(editableRectangle.topLeftPoint).toEqual(jasmine.any(Point));
        });

        it("topLeftPoint should be correct", function () {
            expect(editableRectangle.topLeftPoint.x).toEqual(1);
            expect(editableRectangle.topLeftPoint.y).toEqual(2);
        });

        it("width should be correct", function () {
            expect(editableRectangle.width).toEqual(3);
        });

        it("height should be correct", function () {
            expect(editableRectangle.height).toEqual(4);
        });

    });

});
