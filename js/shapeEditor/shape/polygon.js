define(['shapeEditor/point', 'shapeEditor/shape'], function (Point, Shape) {

    /**
     * @param arg
     * @constructor
     */
    function Polygon(arg) {
        var data = arg || {};

        Shape.call(this);
    }

    Polygon.prototype = new Shape();
    Polygon.prototype.constructor = Polygon;

    return Polygon;
});