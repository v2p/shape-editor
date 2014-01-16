define(['eve', 'shapeEditor/point', 'shapeEditor/shape'], function (eve, Point, Shape) {

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
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy, x, y, domEvent) {
            var validX = Math.min(
                Math.max(x, this.radius),
                this.raphaelPaper.width - this.radius
            );

            var validY = Math.min(
                Math.max(y, this.radius),
                this.raphaelPaper.height - this.radius
            );

            this.setCoords(validX, validY);
        });
    };

    Circle.prototype.resize = function(radius) {
        Shape.prototype.resize.apply(this, arguments);

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

    return Circle;
});