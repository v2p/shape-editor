define(['eve'], function (eve) {

    /**
     * @param x
     * @param y
     * @constructor
     */
    function Point(x, y) {
        this.id = Point._id++;

        this.setCoords(x, y);
    }

    Point._id = 0;

    Point.calculateDistance = function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    /**
     * @param x
     * @param y
     */
    Point.prototype.setCoords = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        eve(['point', 'setCoords', this.id].join('.'), this, this.x, this.y);
    };

    /**
     * @param {Number} [dx]
     * @param {Number} [dy]
     */
    Point.prototype.move = function(dx, dy) {
        this.setCoords(this.x + dx, this.y + dy);

        eve(['point', 'move', this.id].join('.'), this, dx, dy, this.x, this.y);
    };

    Point.prototype.remove = function() {
        eve.off(['point', 'setCoords', this.id].join('.'));
        eve.off(['point', 'move', this.id].join('.'));
    };

    return Point;
});