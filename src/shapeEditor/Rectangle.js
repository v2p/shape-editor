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

    Rectangle.prototype.initRaphaelElement = function() {
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        eve.on(['shape', 'dragStart', this.id].join('.'), function(/*x, y, domEvent*/) {
            var self = this;
            self._tempPointX = self.topLeftPoint.x;
            self._tempPointY = self.topLeftPoint.y;
        });

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy/*, x, y, domEvent*/) {
            var self = this;

            var validX = Math.min(
                Math.max(self._tempPointX + dx, 0),
                this.raphaelPaper.width - this.width
            );

            var validY = Math.min(
                Math.max(self._tempPointY + dy, 0),
                this.raphaelPaper.height - this.height
            );

            self.setCoords(validX, validY);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(/*x, y, domEvent*/) {
            delete self._tempPointX;
            delete self._tempPointY;
        });
    };

    Rectangle.prototype.resize = function(x, y, width, height) {
        Shape.prototype.resize.apply(this, arguments);

        x = Math.min(Math.max(0, x), this.raphaelPaper.width);
        y = Math.min(Math.max(0, y), this.raphaelPaper.height);
        width = Math.max(0, width);
        height = Math.max(0, height);

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

    Rectangle.prototype.removeFromPaper = function() {
        Shape.prototype.removeFromPaper.apply(this, arguments);

        this.topLeftPoint.remove();
    };

    Rectangle.prototype.getData = function() {
        return {
            x: this.topLeftPoint.x,
            y: this.topLeftPoint.y,
            width: this.width,
            height: this.height
        };
    };

    return Rectangle;
});
