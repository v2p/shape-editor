define(['eve', 'shapeEditor/editable/circle', 'shapeEditor/editable/rectangle', 'shapeEditor/editable/polygon'], function (eve, EditableCircle, EditableRectangle, EditablePolygon) {

    var createShape = function(shapeObject) {
        shapeObject.addOnRaphaelPaper(this.raphaelPaper);

        this.eventHandlers.onShapeCreate && this.eventHandlers.onShapeCreate.call(this, shapeObject);

        bindEventHandlers.call(this, shapeObject);

        return shapeObject;
    };

    var bindEventHandlers = function(shapeObject) {
        var self = this;

        eve.on(['editableShape', 'click', shapeObject.id].join('.'), function() {
            var shapeObject = this;

            self.eventHandlers.onShapeClick && self.eventHandlers.onShapeClick.call(self, shapeObject);
        });

        eve.on(['editableShape', 'dragEnd', shapeObject.id].join('.'), function() {
            var shapeObject = this;

            self.eventHandlers.onShapeDrag && self.eventHandlers.onShapeDrag.call(self, shapeObject);
        });

        eve.on(['editableShape', 'resizeEnd', shapeObject.id].join('.'), function() {
            var shapeObject = this;

            self.eventHandlers.onShapeResize && self.eventHandlers.onShapeResize.call(self, shapeObject);
        });
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

        self.createPolygon = function(points) {
            var polygon = createShape.call(self, new EditablePolygon(points));

            eve.on(['polygon', 'handleClick', polygon.id].join('.'), function(handle) {
                self.eventHandlers.onPolygonShapePointClick && self.eventHandlers.onPolygonShapePointClick.call(self, polygon, handle.attachmentPoint);
            });

            return polygon;
        };

        /**
         * @param {EditablePolygon} shapeObj
         * @param x
         * @param y
         */
        self.addPointToShape = function(shapeObj, x, y) {
            shapeObj.insertPoint(x, y);
        };

        /**
         * @param {EditablePolygon} shapeObj
         * @param {Point} point
         */
        self.removePointFromShape = function(shapeObj, point) {
            shapeObj.removePoint(point.id);
        };

        self.canModifyShapePoints = function(shapeObj) {
            return shapeObj instanceof EditablePolygon;
        };

        self.removeShape = function(shapeObject) {
            shapeObject.removeFromPaper();
        };

        return self;
    }
});