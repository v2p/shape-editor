define(['eve',  'shapeEditor/point', 'shapeEditor/shape/circle', 'shapeEditor/shape/special/handle'], function (eve, Point, Circle, Handle) {

    /**
     * @param x
     * @param y
     * @param radius
     * @constructor
     */
    function EditableCircle(x, y, radius) {
        this.keyPoints = {
            left: new Point(),
            top: new Point(),
            right: new Point(),
            bottom: new Point()
        };

        this.resizeHandlers = [
            new Handle(this, this.keyPoints.left, 'x'),
            new Handle(this, this.keyPoints.top, 'y'),
            new Handle(this, this.keyPoints.right, 'x'),
            new Handle(this, this.keyPoints.bottom, 'y')
        ];

        Circle.apply(this, arguments);
    }

    EditableCircle.prototype = new Circle();
    EditableCircle.prototype.constructor = EditableCircle;

    EditableCircle.prototype.setKeyPoints = function() {
        this.keyPoints.left.setCoords(this.centerPoint.x - this.radius, this.centerPoint.y);
        this.keyPoints.top.setCoords(this.centerPoint.x, this.centerPoint.y - this.radius);
        this.keyPoints.right.setCoords(this.centerPoint.x + this.radius, this.centerPoint.y);
        this.keyPoints.bottom.setCoords(this.centerPoint.x, this.centerPoint.y + this.radius);
    };

    EditableCircle.prototype.initRaphaelElement = function(raphaelElement) {
        Circle.prototype.initRaphaelElement.apply(this, arguments);

        this.setKeyPoints();

        var self = this;
        var resizeDispatcher = function(dx, dy, x, y) {
            self.resize(
                Math.sqrt(Math.pow(x - this.centerPoint.x, 2) + Math.pow(y - this.centerPoint.y, 2))
            );

            self.setKeyPoints();
        };

        for (var i = 0; i < this.resizeHandlers.length; i++) {
            this.resizeHandlers[i].addOnRaphaelPaper(this.raphaelPaper);

            eve.on(['handler', 'dragProcess', this.resizeHandlers[i].id].join('.'), function() {
                resizeDispatcher.apply(self, arguments);
            });
        }

        eve.on(['point', 'setCoords', self.centerPoint.id].join('.'), function() {
            self.setKeyPoints();
        });
    };

    return EditableCircle;
});