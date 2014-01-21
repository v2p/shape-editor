define(['jasmine', 'shapeEditor/editable/rectangle'], function (jasmine, EditableRectangle) {

    describe("Editable Rectangle public interface", function () {
        var editableRectangle;

        beforeEach(function() {
            editableRectangle = new EditableRectangle(1, 2, 3, 4);
        });

        it("should have getData method", function () {
            expect(editableRectangle.getData).toBeDefined();
        });

        it("getData should return correct info", function () {
            expect(editableRectangle.getData()).toEqual({
                x: 1,
                y: 2,
                width: 3,
                height: 4
            });
        });

        it("should have addOnRaphaelPaper method", function () {
            expect(editableRectangle.addOnRaphaelPaper).toBeDefined();
        });

        it("should have removeFromPaper method", function () {
            expect(editableRectangle.removeFromPaper).toBeDefined();
        });
    });

});
