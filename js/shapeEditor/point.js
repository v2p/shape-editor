define(['eve'], function (eve) {

    /**
     * @param x
     * @param y
     * @constructor
     */
    function Point(x, y) {
        this.id = Point._id++;

        this.set(x, y);
    }

    Point._id = 0;

    /**
     * @param x
     * @param y
     */
    Point.prototype.set = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        eve(['point', 'set', this.id].join('.'), this, x, y);
    };

    /**
     * @param {Number} [dx]
     * @param {Number} [dy]
     */
    Point.prototype.move = function(dx, dy) {
        this.x += dx || 0;
        this.y += dy || 0;

        eve(['point', 'move', this.id].join('.'), this, dx, dy, this.x, this.y);
    };

    return Point;
});