define(['shapeEditor/point', 'shapeEditor/shape'], function (Point, Shape) {

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

        Shape.call(this);
    }

    Circle.prototype = new Shape();
    Circle.prototype.constructor = Circle;

    Circle.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        Shape.prototype.addOnRaphaelPaper.apply(this, arguments);

        this.raphaelElement = this.raphaelPaper.circle(this.centerPoint.x, this.centerPoint.y, this.radius);

        this.initRaphaelElement(this.raphaelElement);

        return this.raphaelElement;
    };

    Circle.prototype.initRaphaelElement = function(raphaelElement) {
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        raphaelElement.attr({
            fill: 'red'
        });
    };

    Circle.prototype.raphaelElementDragProcess = function(dx, dy) {
        // TODO we can increase performance here
        this.raphaelElement.attr({
            cx: Math.min(
                Math.max(this.centerPoint.x + dx, this.radius),
                this.raphaelPaper.width - this.radius
            ),
            cy: Math.min(
                Math.max(this.centerPoint.y + dy, this.radius),
                this.raphaelPaper.height - this.radius
            )
        });
    };

    Circle.prototype.raphaelElementDragEnd = function() {
        this.centerPoint.set(
            this.raphaelElement.attr('cx'),
            this.raphaelElement.attr('cy')
        );
    };

    return Circle;
});