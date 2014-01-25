define(['raphael', 'eve', 'shapeEditor/editable/circle', 'shapeEditor/editable/rectangle', 'shapeEditor/editable/polygon'], function (Raphael, eve, EditableCircle, EditableRectangle, EditablePolygon) {

    /**
     * @param {EditableShape} shapeObject
     * @returns {EditableShape}
     */
    var createShape = function(shapeObject) {
        shapeObject.addOnRaphaelPaper(this.raphaelPaper);

        this.shapesCollection[shapeObject.id] = shapeObject;
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

        /**
         * @type {EditableShape[]}
         */
        self.shapesCollection = {};

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

        /**
         * @param {EditableShape} shapeObject
         */
        self.removeShape = function(shapeObject) {
            delete this.shapesCollection[shapeObject.id];
            shapeObject.removeFromPaper();
        };

        /**
         * @returns {EditableShape[]}
         */
        self.findIntersectedShapes = function() {
            var shapeIntersections = {};

            for (var id1 in this.shapesCollection) {
                if (!this.shapesCollection.hasOwnProperty(id1)) {
                    continue;
                }

                for (var id2 in this.shapesCollection) {
                    if (!this.shapesCollection.hasOwnProperty(id2)) {
                        continue;
                    }

                    // if id's of shapes refers to the same shape:
                    if (id1 == id2) {
                        continue;
                    }

                    // if pair of this shapes is already compared:
                    if (shapeIntersections[id1] && shapeIntersections[id2]) {
                        continue;
                    }

                    var shape1 = this.shapesCollection[id1],
                        shape2 = this.shapesCollection[id2];

                    // some kind of optimization - we don't need to compare paths if even bboxes aren't intersected:
                    if (!Raphael.isBBoxIntersect(shape1.getBBox(), shape2.getBBox())) {
                        continue;
                    }

                    var n = Raphael.pathIntersectionNumber(shape1.getPath(), shape2.getPath());
                    if (n > 0) {
                        shapeIntersections[shape1.id] = true;
                        shapeIntersections[shape2.id] = true;
                    }
                }
            }

            var result = [];
            for (var shapeId in shapeIntersections) {
                if (shapeIntersections.hasOwnProperty(shapeId)) {
                    result.push(this.shapesCollection[shapeId]);
                }
            }

            return result;
        };

        return self;
    }
});