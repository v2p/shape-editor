define(['jasmine', 'shapeEditor/editable/circle'], function (jasmine, EditableCircle) {

    describe("Editable Circle public interface", function () {
        var editableCircle;

        beforeEach(function() {
            editableCircle = new EditableCircle(1, 2, 3);
        });

        it("should have getData method", function () {
            expect(editableCircle.getData).toBeDefined();
        });

        it("getData should return correct info", function () {
            expect(editableCircle.getData()).toEqual({
                x: 1,
                y: 2,
                radius: 3
            });
        });

        it("should have addOnRaphaelPaper method", function () {
            expect(editableCircle.addOnRaphaelPaper).toBeDefined();
        });

        it("should have removeFromPaper method", function () {
            expect(editableCircle.removeFromPaper).toBeDefined();
        });
    });

});