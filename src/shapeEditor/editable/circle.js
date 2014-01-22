define(['eve',  'shapeEditor/editable/shape', 'shapeEditor/point', 'shapeEditor/circle', 'shapeEditor/special/handle'], function (eve, EditableShape, Point, Circle, Handle) {

    /**
     * @param x
     * @param y
     * @param radius
     * @constructor
     */
    function EditableCircle(x, y, radius) {
        this.circle = new Circle(x, y, radius);

        this.keyPoints = {
            left: new Point(),
            top: new Point(),
            right: new Point(),
            bottom: new Point()
        };

        var resizeHandles = [
            new Handle(this.keyPoints.left, 'x'),
            new Handle(this.keyPoints.top, 'y'),
            new Handle(this.keyPoints.right, 'x'),
            new Handle(this.keyPoints.bottom, 'y')
        ];

        this.updateKeyPoints();

        EditableShape.call(this, resizeHandles);
    }

    EditableCircle.prototype = new EditableShape();
    EditableCircle.prototype.constructor = EditableCircle;

    EditableCircle.MIN_RADIUS = 7;

    EditableCircle.prototype.updateKeyPoints = function() {
        EditableShape.prototype.updateKeyPoints.apply(this, arguments);

        var centerPoint = this.circle.centerPoint,
            radius = this.circle.radius;

        this.keyPoints.left.setCoords(centerPoint.x - radius, centerPoint.y);
        this.keyPoints.top.setCoords(centerPoint.x, centerPoint.y - radius);
        this.keyPoints.right.setCoords(centerPoint.x + radius, centerPoint.y);
        this.keyPoints.bottom.setCoords(centerPoint.x, centerPoint.y + radius);
    };

    var resizeDispatcher = function(dx, dy, x, y) {
        var radius = Point.calculateDistance(x, y, this.circle.centerPoint.x, this.circle.centerPoint.y);

        this.circle.resize(
            Math.max(radius, EditableCircle.MIN_RADIUS)
        );

        this.updateKeyPoints();
    };

    EditableCircle.prototype.init = function() {
        EditableShape.prototype.init.apply(this, arguments);

        this.circle.addOnRaphaelPaper(this.raphaelPaper);

        var self = this;
        for (var i = 0; i < this.resizeHandles.length; i++) {
            var resizeHandle = this.resizeHandles[i];

            resizeHandle.addOnRaphaelPaper(this.raphaelPaper);

            eve.on(['handle', 'dragProcess', resizeHandle.id].join('.'), function() {
                resizeDispatcher.apply(self, arguments);
            });

            eve.on(['handle', 'dragEnd', resizeHandle.id].join('.'), function() {
                eve(['editableShape', 'resizeEnd', self.id].join('.'), self, arguments);
            });
        }

        // work with centerPoint's event faster than with circle's event:
        eve.on(['point', 'setCoords', this.circle.centerPoint.id].join('.'), function() {
            self.updateKeyPoints();
        });

        eve.on(['shape', 'click', this.circle.id].join('.'), function() {
            eve(['editableShape', 'click', self.id].join('.'), self, arguments);
        });

        eve.on(['shape', 'dragEnd', this.circle.id].join('.'), function() {
            eve(['editableShape', 'dragEnd', self.id].join('.'), self, arguments);
        });
    };

    EditableCircle.prototype.removeFromPaper = function() {
        EditableShape.prototype.removeFromPaper.apply(this, arguments);

        this.circle.removeFromPaper();
    };

    EditableCircle.prototype.getData = function() {
        return this.circle.getData();
    };

    return EditableCircle;
});