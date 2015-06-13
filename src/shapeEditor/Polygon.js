define([
    'eve'
    , './Point'
    , './Shape'
], function (
    eve
    , Point
    , Shape
) {
    "use strict";

    function findPointIndexByPointId(pointId, points) {
        var index = 0;
        for (var i = 0; i < points.length; i++) {
            if (points[i].id === pointId) {
                index = i;
                break;
            }
        }

        return index;
    }

    /**
     * @param {Array} pointsData
     * @constructor
     */
    function Polygon(pointsData) {
        /**
         * @type {Point[]}
         */
        this.points = [];

        var initPointsData = pointsData || [];
        for(var i = 0; i < initPointsData.length; i++) {
            this.pushPoint(initPointsData[i].x, initPointsData[i].y);
        }

        Shape.apply(this, arguments);
    }

    Polygon.prototype = new Shape();
    Polygon.prototype.constructor = Polygon;

    Polygon.prototype.insertPointAfter = function(afterPointId, x, y) {
        var point = new Point(x, y),
            insertIndex = findPointIndexByPointId(afterPointId, this.points);

        this.points.splice(insertIndex, 0, point);

        eve(['polygon', 'addPoint', this.id].join('.'), this, point);
    };

    Polygon.prototype.removePoint = function(pointId) {
        var removeIndex = findPointIndexByPointId(pointId, this.points);

        this.points.splice(removeIndex, 1);
        this.redraw();

        eve(['polygon', 'removePoint', this.id].join('.'), this);
    };

    Polygon.prototype.pushPoint = function(x, y) {
        var point = new Point(x, y);
        this.points.push(point);

        eve(['polygon', 'addPoint', this.id].join('.'), this, point);
    };

    /**
     * @see http://raphaeljs.com/reference.html#Paper.path
     * @param {Point[]} points
     * @returns {string} For example, M50,50L70,70L70,40L50,50Z
     */
    var buildPathString = function(points) {
        var coordPairs = [];
        for(var i = 0; i < points.length; i++) {
            coordPairs.push(points[i].x + ',' + points[i].y);
        }

        return 'M' + (coordPairs.join('L')) + 'Z';
    };

    /**
     * @param id
     * @returns {Point|boolean}
     */
    Polygon.prototype.getPointById = function(id) {
        for(var i = 0; i < this.points.length; i++) {
            if (this.points[i].id === id) {
                return this.points[i];
            }
        }

        return false;
    };

    Polygon.prototype.createRaphaelElement = function() {
        return this.raphaelPaper.path( buildPathString(this.points) );
    };

    Polygon.prototype.initRaphaelElement = function() {
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        eve.on(['shape', 'dragStart', this.id].join('.'), function(/*x, y, domEvent*/) {
            var self = this;
            var polygonBoundingBox = self.getBBox();

            self._tempPointX = polygonBoundingBox.x;
            self._tempPointY = polygonBoundingBox.y;
            self._tempWidth = polygonBoundingBox.width;
            self._tempHeight = polygonBoundingBox.height;
        });

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy/*, x, y, domEvent*/) {
            var self = this;

            var validX = Math.min(
                Math.max(0, self._tempPointX + dx), this.raphaelPaper.width - self._tempWidth
            );

            var validY = Math.min(
                Math.max(0, self._tempPointY + dy), this.raphaelPaper.height - self._tempHeight
            );

            self.setCoords(validX, validY);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(/*x, y, domEvent*/) {
            var self = this;

            delete self._tempPointX;
            delete self._tempPointY;
            delete self._tempWidth;
            delete self._tempHeight;
        });

        eve.on(['polygon', 'addPoint', this.id].join('.'), function() {
            var self = this;
            self.redraw();
        });
    };

    Polygon.prototype.redraw = function() {
        this.raphaelElement.attr({
            path: buildPathString(this.points)
        });
    };

    Polygon.prototype.resize = function(pointId, x, y) {
        Shape.prototype.resize.apply(this, arguments);

        var validX = Math.min(
            Math.max(0, x), this.raphaelPaper.width
        );

        var validY = Math.min(
            Math.max(0, y), this.raphaelPaper.height
        );

        var pointToMove = this.getPointById(pointId);

        if (pointToMove) {
            pointToMove.setCoords(validX, validY);

            this.redraw();
        }
    };

    Polygon.prototype.setCoords = function(x, y) {
        Shape.prototype.setCoords.apply(this, arguments);

        var polygonBoundingBox = this.getBBox();

        var dx = x - polygonBoundingBox.x,
            dy = y - polygonBoundingBox.y;

        for(var i = 0; i < this.points.length; i++) {
            this.points[i].move(dx, dy);
        }

        this.redraw();
    };

    Polygon.prototype.removeFromPaper = function() {
        Shape.prototype.removeFromPaper.apply(this, arguments);

        for(var i = 0; i < this.points.length; i++) {
            this.points[i].remove();
        }
    };

    Polygon.prototype.getData = function() {
        var result = [];

        for(var i = 0; i < this.points.length; i++) {
            result.push({
                x: this.points[i].x,
                y: this.points[i].y
            });
        }

        return result;
    };

    /**
     * Fix for IE, where Raphael's bbox doesn't work as expected
     */
    Polygon.prototype.getBBox = function() {
        var firstPoint = this.points[0],
            minX = firstPoint.x,
            minY = firstPoint.y,
            maxX = firstPoint.x,
            maxY = firstPoint.y;

        for (var i = 1; i < this.points.length; i++) {
            var point = this.points[i],
                pointX = point.x,
                pointY = point.y;

            if (pointX < minX) {
                minX = pointX;
            }

            if (pointY < minY) {
                minY = pointY;
            }

            if (pointX > maxX) {
                maxX = pointX;
            }

            if (pointY > maxY) {
                maxY = pointY;
            }
        }

        return {
            x: minX,
            y: minY,

            x2: maxX,
            y2: maxY,

            width: maxX - minX,
            height: maxY - minY
        };
    };

    return Polygon;
});
