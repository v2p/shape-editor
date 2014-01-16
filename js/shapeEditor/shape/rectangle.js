define(['eve', 'shapeEditor/point', 'shapeEditor/shape'], function (eve, Point, Shape) {

    /**
     * @param x
     * @param y
     * @param {Number} width
     * @param {Number} height
     * @constructor
     */
    function Rectangle(x, y, width, height) {
        /**
         * @type {Point}
         */
        this.topLeftPoint = new Point(x || 0, y || 0);

        /**
         * @type {Number}
         */
        this.width = width;

        /**
         * @type {Number}
         */
        this.height = height;

        Shape.apply(this, arguments);
    }

    Rectangle.prototype = new Shape();
    Rectangle.prototype.constructor = Rectangle;

    Rectangle.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        Shape.prototype.addOnRaphaelPaper.apply(this, arguments);

        this.raphaelElement = this.raphaelPaper.rect(this.topLeftPoint.x, this.topLeftPoint.y, this.width, this.height);

        this.initRaphaelElement(this.raphaelElement);
    };

    Rectangle.prototype.initRaphaelElement = function(raphaelElement) {
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy, x, y, domEvent) {
            this.raphaelElement.attr({
                x: Math.min(
                    Math.max(this.topLeftPoint.x + dx, 0),
                    this.raphaelPaper.width - this.width
                ),
                y: Math.min(
                    Math.max(this.topLeftPoint.y + dy, 0),
                    this.raphaelPaper.height - this.height
                )
            });
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(x, y, domEvent) {
            this.topLeftPoint.set(
                this.raphaelElement.attr('x'),
                this.raphaelElement.attr('y')
            );
        });
    };

    return Rectangle;
});