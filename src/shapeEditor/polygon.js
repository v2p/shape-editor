define(['eve', 'shapeEditor/point', 'shapeEditor/shape'], function (eve, Point, Shape) {

    /**
     * @param {Array} pointsData
     * @constructor
     */
    function Polygon(pointsData) {
        this.points = [];

        for(var i = 0; i < pointsData.length; i++) {
            this.addPoint(pointsData[i].x, pointsData[i].y);
        }

        Shape.apply(this, arguments);
    }

    Polygon.prototype = new Shape();
    Polygon.prototype.constructor = Polygon;

    Polygon.prototype.addPoint = function(x, y) {
        var point = new Point(x, y);
        this.points.push(point);

        eve(['polygon', 'addPoint', this.id].join('.'), self, point);
    };

    Polygon.prototype.createRaphaelElement = function() {
    };

    Polygon.prototype.initRaphaelElement = function() {
        Shape.prototype.initRaphaelElement.apply(this, arguments);

        eve.on(['shape', 'dragStart', this.id].join('.'), function(x, y, domEvent) {
            this._tempPointX = this.centerPoint.x;
            this._tempPointY = this.centerPoint.y;
        });

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy, x, y, domEvent) {
            var validX = Math.min(
                Math.max(this._tempPointX + dx, this.radius),
                this.raphaelPaper.width - this.radius
            );

            var validY = Math.min(
                Math.max(this._tempPointY + dy, this.radius),
                this.raphaelPaper.height - this.radius
            );

            this.setCoords(validX, validY);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(x, y, domEvent) {
            delete this._tempPointX;
            delete this._tempPointY;
        });
    };

    Polygon.prototype.resize = function(radius) {
        Shape.prototype.resize.apply(this, arguments);


    };

    Polygon.prototype.setCoords = function(x, y) {
        Shape.prototype.setCoords.apply(this, arguments);


    };

    Polygon.prototype.removeFromPaper = function() {
        Shape.prototype.removeFromPaper.apply(this, arguments);

    };

    Polygon.prototype.getData = function() {

    };

    return Polygon;
});