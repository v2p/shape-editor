define(['eve',  'shapeEditor/editable/shape', 'shapeEditor/point', 'shapeEditor/polygon', 'shapeEditor/special/handle'], function (eve, EditableShape, Point, Polygon, Handle) {

    /**
     * @param {Array} [pointsData]
     * @constructor
     */
    function EditablePolygon(pointsData) {
        this.polygon = new Polygon(pointsData || []);

        EditableShape.call(this);
    }

    EditablePolygon.prototype = new EditableShape();
    EditablePolygon.prototype.constructor = EditablePolygon;

    EditablePolygon.prototype.updateKeyPoints = function() {
        EditableShape.prototype.updateKeyPoints.apply(this, arguments);
    };

    EditablePolygon.prototype.resize = function() {
        this.updateKeyPoints();
    };

    EditablePolygon.prototype.init = function() {
        EditableShape.prototype.init.apply(this, arguments);


    };

    EditableRectangle.prototype.removeFromPaper = function() {
        EditableShape.prototype.removeFromPaper.apply(this, arguments);
    };

    EditableRectangle.prototype.getData = function() {

    };

    return EditablePolygon;
});