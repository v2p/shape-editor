define(['eve', 'shapeEditor/shape/editable/circle', 'shapeEditor/shape/editable/rectangle'], function (eve, EditableCircle, EditableRectangle) {

    var createShape = function(shapeObject) {
        shapeObject.addOnRaphaelPaper(this.raphaelPaper);

        this.eventHandlers.onShapeCreate && this.eventHandlers.onShapeCreate.call(this, shapeObject);
    };

    return function(raphaelPaper, eventHandlers) {
        var self = this;

        self.raphaelPaper = raphaelPaper;
        self.eventHandlers = eventHandlers || {};

        self.createCircle = function(x, y) {
            createShape.call(self, new EditableCircle(x, y, 10));
        };

        self.createRectangle = function(x, y) {
            createShape.call(self, new EditableRectangle(x, y, 20, 20));
        };

        self.removeShape = function(shapeObject) {
            shapeObject.removeFromPaper();
        };

        eve.on(['editableShape', 'click', '*'].join('.'), function() {
            var shapeObject = this;

            self.eventHandlers.onShapeClick && self.eventHandlers.onShapeClick.call(self, shapeObject);
        });

        return self;
    }
});