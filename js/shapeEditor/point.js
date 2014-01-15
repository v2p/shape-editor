define(function () {

    /**
     * @param x
     * @param y
     * @constructor
     */
    function Point(x, y) {
        this.set(x, y);
    }

    /**
     * TODO do we really need it?
     *
     * @param x
     * @param y
     */
    Point.prototype.set = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    /**
     * @param {Number} [dx]
     * @param {Number} [dy]
     */
    Point.prototype.move = function(dx, dy) {
        this.x += dx || 0;
        this.y += dy || 0;
    };

    return Point;
});