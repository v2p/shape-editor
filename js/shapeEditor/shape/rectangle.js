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

    Rectangle.prototype.createRaphaelElement = function() {
        return this.raphaelPaper.rect(this.topLeftPoint.x, this.topLeftPoint.y, this.width, this.height);
    };

    Rectangle.prototype.initRaphaelElement = function(raphaelElement) {
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        eve.on(['shape', 'dragStart', this.id].join('.'), function(x, y, domEvent) {
            this._tempPointX = this.topLeftPoint.x;
            this._tempPointY = this.topLeftPoint.y;
        });

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy, x, y, domEvent) {
            var validX = Math.min(
                Math.max(this._tempPointX + dx, 0),
                this.raphaelPaper.width - this.width
            );

            var validY = Math.min(
                Math.max(this._tempPointY + dy, 0),
                this.raphaelPaper.height - this.height
            );

            this.setCoords(validX, validY);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(x, y, domEvent) {
            delete this._tempPointX;
            delete this._tempPointY;
        });
    };

    Rectangle.prototype.resize = function(x, y, width, height) {
        Shape.prototype.resize.apply(this, arguments);

        console.log(arguments);
        this.width = width;
        this.height = height;
        this.topLeftPoint.setCoords(x, y);

        this.raphaelElement.attr({
            x: x,
            y: y,
            width: width,
            height: height
        });
    };

    Rectangle.prototype.setCoords = function(x, y) {
        Shape.prototype.setCoords.apply(this, arguments);

        this.raphaelElement.attr({x: x, y: y});
        this.topLeftPoint.setCoords(x, y);
    };

    return Rectangle;
});