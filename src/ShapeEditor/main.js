define([
    'raphael'
    , './event'
    , './Editable/EditableCircle'
    , './Editable/EditableRectangle'
    , './Editable/EditablePolygon'
], function (
    Raphael
    , event
    , EditableCircle
    , EditableRectangle
    , EditablePolygon
) {
    "use strict";

    function bindEventHandlers(shapeObject) {
        var self = this;

        event.on(['editableShape', 'click', shapeObject.id], function () {
            var targetShapeObject = this;

            if (self.eventHandlers.onShapeClick) {
                self.eventHandlers.onShapeClick.call(self, targetShapeObject);
            }
        });

        event.on(['editableShape', 'dragEnd', shapeObject.id], function () {
            var targetShapeObject = this;

            if (self.eventHandlers.onShapeDrag) {
                self.eventHandlers.onShapeDrag.call(self, targetShapeObject);
            }
        });

        event.on(['editableShape', 'resizeEnd', shapeObject.id], function () {
            var targetShapeObject = this;

            if (self.eventHandlers.onShapeResize) {
                self.eventHandlers.onShapeResize.call(self, targetShapeObject);
            }
        });

        event.on(['editableShape', 'handleClick', shapeObject.id], function (handle) {
            if (self.eventHandlers.onShapeHandleClick) {
                self.eventHandlers.onShapeHandleClick.call(self, shapeObject, handle);
            }
        });

        event.on(['editableShape', 'addPoint', shapeObject.id], function (point) {
            if (self.eventHandlers.onShapeAddPoint) {
                self.eventHandlers.onShapeAddPoint.call(self, shapeObject, point);
            }
        });

        event.on(['editableShape', 'removePoint', shapeObject.id], function () {
            if (self.eventHandlers.onShapeRemovePoint) {
                self.eventHandlers.onShapeRemovePoint.call(self, shapeObject);
            }
        });
    }

    /**
     * @param {EditableShape} shapeObject
     * @returns {EditableShape}
     */
    function createShape(shapeObject) {
        shapeObject.addOnRaphaelPaper(this.raphaelPaper);

        this.shapesCollection[shapeObject.id] = shapeObject;

        if (this.eventHandlers.onShapeCreate) {
            this.eventHandlers.onShapeCreate.call(this, shapeObject);
        }

        bindEventHandlers.call(this, shapeObject);

        return shapeObject;
    }

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
            return createShape.call(self, new EditablePolygon(points));
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

        self.isShapesIntersected = function(shape1, shape2) {
            var shape1BBox = shape1.getBBox(),
                shape2BBox = shape2.getBBox();

            // some kind of optimization: if bbox-es aren't intersected, it means that shapes aren't intersected too
            if (!Raphael.isBBoxIntersect(shape1BBox, shape2BBox)) {
                return false;
            }

            // ... if bbox-es can't provide clean answer, we compare paths:
            var shape1Path = shape1.getPath(),
                shape2Path = shape2.getPath();

            var n = Raphael.pathIntersectionNumber(shape1Path, shape2Path);
            if (n > 0) {
                return true;

            } else { // otherwise check some special cases - when one shape is placed inside other:
                if ((Raphael.isPointInsidePath(shape2Path, shape1BBox.x, shape1BBox.y) &&
                    Raphael.isPointInsidePath(shape2Path, shape1BBox.x2, shape1BBox.y2))
                    ||
                    (Raphael.isPointInsidePath(shape1Path, shape2BBox.x, shape2BBox.y) &&
                    Raphael.isPointInsidePath(shape1Path, shape2BBox.x2, shape2BBox.y2)))
                {
                    return true;
                }
            }

            return false;
        };

        /**
         * @param {EditableShape} shapeObject
         * @returns {EditableShape[]}
         */
        self.findIntersectionsWithShape = function(shapeObject) {
            var result = [];

            for (var shapeId in this.shapesCollection) {
                if (!this.shapesCollection.hasOwnProperty(shapeId)) {
                    continue;
                }

                if (shapeId === shapeObject.id) {
                    continue;
                }

                var anotherShape = this.shapesCollection[shapeId];

                if (self.isShapesIntersected(shapeObject, anotherShape)) {
                    result.push(anotherShape);
                }
            }

            return result;
        };

        /**
         * @returns {EditableShape[]}
         */
        self.findAllIntersectedShapes = function() {
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
                    if (id1 === id2) {
                        continue;
                    }

                    // if pair of this shapes is already compared:
                    if (shapeIntersections[id1] && shapeIntersections[id2]) {
                        continue;
                    }

                    var shape1 = this.shapesCollection[id1],
                        shape2 = this.shapesCollection[id2];

                    if (self.isShapesIntersected(shape1, shape2)) {
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
    };
});
