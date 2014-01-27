define(['eve',  'shapeEditor/editable/shape', 'shapeEditor/point', 'shapeEditor/polygon', 'shapeEditor/special/handle'], function (eve, EditableShape, Point, Polygon, Handle) {

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
        for(var i = 0; i < pointsCount; i++) {
            var point = points[i];
            pointsDistanceMap[point.id] = Point.calculateDistance(point.x, point.y, x, y);
        }

        // combine points into pairs:
        for(var j = 1; j < pointsCount; j++) {
            pointPairs.push([ points[j-1], points[j] ]);
        }
        // ... and don't forget to add pair from lastPoint and firstPoint:
        pointPairs.push([ points[pointsCount - 1], points[0] ]);

        var nearestPointPairIndex = 0,
            minDistance = 0;

        for(var k = 0; k < pointPairs.length; k++) {
            var point1 = pointPairs[k][0],
                point2 = pointPairs[k][1],
                distance = pointsDistanceMap[point1.id] + pointsDistanceMap[point2.id];

            if (distance <= minDistance) {
                minDistance = distance;
                nearestPointPairIndex = k;
            }
        }

        return pointPairs[nearestPointPairIndex][0].id;
    };

    EditablePolygon.prototype.insertPoint = function(x, y) {
        var pointId = findNearestPoint.call(this, x, y);
        this.polygon.insertPointAfter(pointId, x, y);
    };

    EditablePolygon.prototype.removePoint = function(pointId) {

        this.polygon.removePoint(pointId);

        for(var i = 0; i < this.resizeHandles.length; i++) {
            var handle = this.resizeHandles[i];

            if (handle.attachmentPoint.id == pointId) {
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

            eve.on(['handle', 'dragProcess', handle.id].join('.'), function(dx, dy, x, y, domEvent) {
                self.resize(point.id, x, y);
            });

            eve.on(['handle', 'dragEnd', handle.id].join('.'), function() {
                eve(['editableShape', 'resizeEnd', self.id].join('.'), self, arguments);
            });

            eve.on(['handle', 'click', handle.id].join('.'), function() {
                eve(['editableShape', 'handleClick', self.id].join('.'), self, handle);
            });

            self.resizeHandles.push(handle);
        };

        for(var i = 0; i < this.polygon.points.length; i++) {
            onAddPointEventCallback(this.polygon.points[i]);
        }

        eve.on(['polygon', 'addPoint', this.polygon.id].join('.'), function(point) {
            onAddPointEventCallback(point);

            eve(['editableShape', 'addPoint', self.id].join('.'), self, point);
        });

        eve.on(['polygon', 'removePoint', this.polygon.id].join('.'), function() {
            eve(['editableShape', 'removePoint', self.id].join('.'), self);
        });

        eve.on(['shape', 'click', this.polygon.id].join('.'), function() {
            eve(['editableShape', 'click', self.id].join('.'), self, arguments);
        });

        eve.on(['shape', 'dragEnd', this.polygon.id].join('.'), function() {
            eve(['editableShape', 'dragEnd', self.id].join('.'), self, arguments);
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