define(['eve', 'shapeEditor/editable/circle', 'shapeEditor/editable/rectangle'], function (eve, EditableCircle, EditableRectangle) {

    var createShape = function(shapeObject) {
        shapeObject.addOnRaphaelPaper(this.raphaelPaper);

        this.eventHandlers.onShapeCreate && this.eventHandlers.onShapeCreate.call(this, shapeObject);

        return shapeObject;
    };

    return function(raphaelPaper, eventHandlers) {
        var self = this;

        self.raphaelPaper = raphaelPaper;
        self.eventHandlers = eventHandlers || {};

        self.createCircle = function(x, y, radius) {
            return createShape.call(self, new EditableCircle(x, y, radius));
        };

        self.createRectangle = function(x, y, width, height) {
            return createShape.call(self, new EditableRectangle(x, y, width, height));
        };

        self.removeShape = function(shapeObject) {
            shapeObject.removeFromPaper();
        };

        eve.on(['editableShape', 'click', '*'].join('.'), function() {
            var shapeObject = this;

            self.eventHandlers.onShapeClick && self.eventHandlers.onShapeClick.call(self, shapeObject);
        });

        eve.on(['editableShape', 'dragEnd', '*'].join('.'), function() {
            var shapeObject = this;

            self.eventHandlers.onShapeDrag && self.eventHandlers.onShapeDrag.call(self, shapeObject);
        });

        eve.on(['editableShape', 'resizeEnd', '*'].join('.'), function() {
            var shapeObject = this;

            self.eventHandlers.onShapeResize && self.eventHandlers.onShapeResize.call(self, shapeObject);
        });

        return self;
    }
});