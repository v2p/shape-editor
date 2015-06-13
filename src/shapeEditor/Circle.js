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

    /**
     * @param x
     * @param y
     * @param radius
     * @constructor
     */
    function Circle(x, y, radius) {
        /**
         * @type {Point}
         */
        this.centerPoint = new Point(x || 0, y || 0);

        /**
         * @type {Number}
         */
        this.radius = radius || 0;

        Shape.apply(this, arguments);
    }

    Circle.prototype = new Shape();
    Circle.prototype.constructor = Circle;

    Circle.prototype.createRaphaelElement = function() {
        return this.raphaelPaper.circle(this.centerPoint.x, this.centerPoint.y, this.radius);
    };

    Circle.prototype.initRaphaelElement = function() {
        var self = this;
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        eve.on(['shape', 'dragStart', this.id].join('.'), function(/*x, y, domEvent*/) {
            self._tempPointX = self.centerPoint.x;
            self._tempPointY = self.centerPoint.y;
        });

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy/*, x, y, domEvent*/) {
            var validX = Math.min(
                Math.max(self._tempPointX + dx, self.radius),
                self.raphaelPaper.width - self.radius
            );

            var validY = Math.min(
                Math.max(self._tempPointY + dy, self.radius),
                self.raphaelPaper.height - self.radius
            );

            self.setCoords(validX, validY);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(/*x, y, domEvent*/) {
            delete self._tempPointX;
            delete self._tempPointY;
        });
    };

    Circle.prototype.resize = function(radius) {
        Shape.prototype.resize.apply(this, arguments);

        var centerX = this.centerPoint.x,
            centerY = this.centerPoint.y,
            maxX = this.raphaelPaper.width,
            maxY = this.raphaelPaper.height,

            maxRadius1 = Point.calculateDistance(centerX, centerY, 0, centerY),
            maxRadius2 = Point.calculateDistance(centerX, centerY, centerX, maxY),
            maxRadius3 = Point.calculateDistance(centerX, centerY, maxX, centerY),
            maxRadius4 = Point.calculateDistance(centerX, centerY, centerX, 0);

        radius = Math.min(radius, maxRadius1, maxRadius2, maxRadius3, maxRadius4);

        this.radius = radius;
        this.raphaelElement.attr({
            r: radius
        });
    };

    Circle.prototype.setCoords = function(x, y) {
        Shape.prototype.setCoords.apply(this, arguments);

        this.raphaelElement.attr({cx: x, cy: y});
        this.centerPoint.setCoords(x, y);
    };

    Circle.prototype.removeFromPaper = function() {
        Shape.prototype.removeFromPaper.apply(this, arguments);

        this.centerPoint.remove();
    };

    Circle.prototype.getData = function() {
        return {
            x: this.centerPoint.x,
            y: this.centerPoint.y,
            radius: this.radius
        };
    };

    return Circle;
});
