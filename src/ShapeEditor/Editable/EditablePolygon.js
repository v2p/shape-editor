define([
    '../event'
    , './EditableShape'

    , '../Point'
    , '../Polygon'
    , '../Special/Handle'
], function (
    event
    , EditableShape

    , Point
    , Polygon
    , Handle
) {
    "use strict";

    /**
     * @param {Array} [pointsData]
     * @constructor
     */
    function EditablePolygon(pointsData) {
        this.polygon = new Polygon(pointsData || []);

        EditableShape.call(this);
    }

    EditablePolygon.prototype = new EditableShape();
    EditablePolygon.prototype.constructor = EditablePolygon;

    EditablePolygon.prototype.resize = function(pointId, x, y) {
        this.polygon.resize(pointId, x, y);
    };

    EditablePolygon.prototype.addPoint = function(x, y) {
        this.polygon.pushPoint(x, y);
    };

    var findNearestPoint = function(x, y) {
        var points = this.polygon.points || [],
            pointsCount = points.length,
            pointsDistanceMap = {},
            pointPairs = [];

        // calculate the distance from every point to the specified point (x,y):
        for (var i = 0; i < pointsCount; i++) {
            var point = points[i];
            pointsDistanceMap[point.id] = Point.calculateDistance(point.x, point.y, x, y);
        }

        // combine points into pairs:
        for (var j = 1; j < pointsCount; j++) {
            pointPairs.push([ points[j - 1], points[j] ]);
        }
        // ... and don't forget to add pair from lastPoint and firstPoint:
        pointPairs.push([ points[pointsCount - 1], points[0] ]);

        // now we analyze all point pairs and try to find nearest pair:
        var nearestPointPairIndex, minDistance;
        for (var k = 0; k < pointPairs.length; k++) {
            var point1 = pointPairs[k][0],
                point2 = pointPairs[k][1],
                distance = pointsDistanceMap[point1.id] + pointsDistanceMap[point2.id];

            if (k === 0) { // init nearestPair and minDistance:
                nearestPointPairIndex = 0;
                minDistance = distance;
            }

            if (distance < minDistance) {
                nearestPointPairIndex = k;
                minDistance = distance;
            }
        }

        // analyze nearest pair and choose the closest point:
        var pointCandidate1 = pointPairs[nearestPointPairIndex][0],
            pointCandidate2 = pointPairs[nearestPointPairIndex][1];

        if (pointsDistanceMap[pointCandidate1.id] < pointsDistanceMap[pointCandidate2.id]) {
            return pointCandidate1.id;
        } else {
            return pointCandidate2.id;
        }
    };

    EditablePolygon.prototype.insertPoint = function(x, y) {
        var pointId = findNearestPoint.call(this, x, y);
        this.polygon.insertPointAfter(pointId, x, y);
    };

    EditablePolygon.prototype.removePoint = function(pointId) {

        this.polygon.removePoint(pointId);

        for(var i = 0; i < this.resizeHandles.length; i++) {
            var handle = this.resizeHandles[i];

            if (handle.attachmentPoint.id === pointId) {
                handle.removeFromPaper();
            }
        }
    };

    EditablePolygon.prototype.init = function() {
        EditableShape.prototype.init.apply(this, arguments);

        var self = this;

        this.polygon.addOnRaphaelPaper(this.raphaelPaper);

        var onAddPointEventCallback = function(point) {
            var handle = new Handle(point);
            handle.addOnRaphaelPaper(self.raphaelPaper);

            event.on(['handle', 'dragProcess', handle.id], function(dx, dy, x, y/*, domEvent*/) {
                self.resize(point.id, x, y);
            });

            event.on(['handle', 'dragEnd', handle.id], function() {
                event.fire(['editableShape', 'resizeEnd', self.id], self, arguments);
            });

            event.on(['handle', 'click', handle.id], function() {
                event.fire(['editableShape', 'handleClick', self.id], self, handle);
            });

            self.resizeHandles.push(handle);
        };

        for(var i = 0; i < this.polygon.points.length; i++) {
            onAddPointEventCallback(this.polygon.points[i]);
        }

        event.on(['polygon', 'addPoint', this.polygon.id], function(point) {
            onAddPointEventCallback(point);

            event.fire(['editableShape', 'addPoint', self.id], self, point);
        });

        event.on(['polygon', 'removePoint', this.polygon.id], function() {
            event.fire(['editableShape', 'removePoint', self.id], self);
        });

        event.on(['shape', 'click', this.polygon.id], function() {
            event.fire(['editableShape', 'click', self.id], self, arguments);
        });

        event.on(['shape', 'dragEnd', this.polygon.id], function() {
            event.fire(['editableShape', 'dragEnd', self.id], self, arguments);
        });
    };

    EditablePolygon.prototype.removeFromPaper = function() {
        EditableShape.prototype.removeFromPaper.apply(this, arguments);

        this.polygon.removeFromPaper();
    };

    EditablePolygon.prototype.getData = function() {
        return this.polygon.getData();
    };

    EditablePolygon.prototype.getPath = function() {
        return this.polygon.getPath();
    };

    EditablePolygon.prototype.getBBox = function() {
        return this.polygon.getBBox();
    };

    EditablePolygon.prototype.setStyle = function(styleConfig) {
        EditableShape.prototype.setStyle.apply(this, arguments);

        var shapeStyle = styleConfig.shape || {};
        this.polygon.setStyle(shapeStyle);
    };

    EditablePolygon.prototype.resetStyle = function() {
        EditableShape.prototype.resetStyle.apply(this, arguments);

        this.polygon.resetStyle();
    };

    return EditablePolygon;
});
