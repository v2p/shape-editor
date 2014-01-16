define(['eve',  'shapeEditor/point', 'shapeEditor/shape/circle', 'shapeEditor/shape/special/handle'], function (eve, Point, Circle, Handle) {

    /**
     * @param raphaelPaper
     * @param x
     * @param y
     * @param radius
     * @constructor
     */
    function EditableCircle(raphaelPaper, x, y, radius) {
        this.keyPoints = {
            left: new Point(),
            top: new Point(),
            right: new Point(),
            bottom: new Point()
        };

        Circle.apply(this, arguments);
    }

    EditableCircle.prototype = new Circle();
    EditableCircle.prototype.constructor = EditableCircle;

    EditableCircle.prototype.setKeyPoints = function() {
        this.keyPoints.left.set(this.centerPoint.x - this.radius, this.centerPoint.y);
        this.keyPoints.top.set(this.centerPoint.x, this.centerPoint.y - this.radius);
        this.keyPoints.right.set(this.centerPoint.x + this.radius, this.centerPoint.y);
        this.keyPoints.bottom.set(this.centerPoint.x, this.centerPoint.y + this.radius);
    };

    EditableCircle.prototype.addOnRaphaelPaper = function() {
        Circle.prototype.addOnRaphaelPaper.apply(this, arguments);

        this.setKeyPoints();
        this.resizeHandlers = [
            new Handle(this, this.keyPoints.left, 'x'),
            new Handle(this, this.keyPoints.top, 'y'),
            new Handle(this, this.keyPoints.right, 'x'),
            new Handle(this, this.keyPoints.bottom, 'y')
        ];

        var self = this;
        var resizeDispatcher = function(dx, dy, x, y) {
            self.resize(
                Math.sqrt(Math.pow(x - this.centerPoint.x, 2) + Math.pow(y - this.centerPoint.y, 2))
            );

            self.setKeyPoints();
        };

        for (var i = 0; i < this.resizeHandlers.length; i++) {
            eve.on(['handler', 'dragProcess', this.resizeHandlers[i].id].join('.'), function() {
                resizeDispatcher.apply(self, arguments);
            });
        }
    };

    return EditableCircle;
});