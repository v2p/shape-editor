define(['eve',  'shapeEditor/editable/shape', 'shapeEditor/point', 'shapeEditor/circle', 'shapeEditor/special/handle'], function (eve, EditableShape, Point, Circle, Handle) {

    /**
     * @param x
     * @param y
     * @param radius
     * @constructor
     */
    function EditableCircle(x, y, radius) {
        this.circle = new Circle(x, y, radius);
        this.syncWithCircle();

        this.keyPoints = {
            left: new Point(),
            top: new Point(),
            right: new Point(),
            bottom: new Point()
        };

        this.resizeHandlers = [
            new Handle(this.keyPoints.left, 'x'),
            new Handle(this.keyPoints.top, 'y'),
            new Handle(this.keyPoints.right, 'x'),
            new Handle(this.keyPoints.bottom, 'y')
        ];

        EditableShape.apply(this, arguments);
    }

    EditableCircle.prototype = new EditableShape();
    EditableCircle.prototype.constructor = EditableCircle;

    EditableCircle.MIN_RADIUS = 7;

    EditableCircle.prototype.syncWithCircle = function() {
        this.id = this.circle.id;
        this.radius = this.circle.radius;
        this.centerPoint = this.circle.centerPoint;
    };

    EditableCircle.prototype.updateKeyPoints = function() {
        EditableShape.prototype.updateKeyPoints.apply(this, arguments);

        this.syncWithCircle();

        this.keyPoints.left.setCoords(this.centerPoint.x - this.radius, this.centerPoint.y);
        this.keyPoints.top.setCoords(this.centerPoint.x, this.centerPoint.y - this.radius);
        this.keyPoints.right.setCoords(this.centerPoint.x + this.radius, this.centerPoint.y);
        this.keyPoints.bottom.setCoords(this.centerPoint.x, this.centerPoint.y + this.radius);
    };

    EditableCircle.prototype.init = function() {
        // TODO think about refactoring
        this.circle.addOnRaphaelPaper(this.raphaelPaper);
        this.updateKeyPoints();

        EditableShape.prototype.init.apply(this, arguments);

        var self = this;
        var resizeDispatcher = function(dx, dy, x, y) {
            self.resize(Point.calculateDistance(x, y, this.centerPoint.x, this.centerPoint.y));
        };

        for (var i = 0; i < this.resizeHandlers.length; i++) {
            this.resizeHandlers[i].addOnRaphaelPaper(this.raphaelPaper);

            eve.on(['handler', 'dragProcess', this.resizeHandlers[i].id].join('.'), function() {
                resizeDispatcher.apply(self, arguments);
            });

            eve.on(['handler', 'dragEnd', this.resizeHandlers[i].id].join('.'), function() {
                eve(['editableShape', 'resizeEnd', self.id].join('.'), self, arguments);
            });
        }

        // TODO probably better to listen circle's events
        eve.on(['point', 'setCoords', self.centerPoint.id].join('.'), function() {
            self.updateKeyPoints();
        });

        eve.on(['shape', 'click', this.id].join('.'), function() {
            eve(['editableShape', 'click', self.id].join('.'), self, arguments);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function() {
            eve(['editableShape', 'dragEnd', self.id].join('.'), self, arguments);
        });
    };

    EditableCircle.prototype.resize = function(radius) {
        EditableShape.prototype.resize.apply(this, arguments);

        radius = Math.max(radius, EditableCircle.MIN_RADIUS);
        this.circle.resize(radius);

        this.updateKeyPoints();
    };

    EditableCircle.prototype.removeFromPaper = function() {
        EditableShape.prototype.removeFromPaper.apply(this, arguments);

        for (var i = 0; i < this.resizeHandlers.length; i++) {
            this.resizeHandlers[i].removeFromPaper();
        }

        eve.off(['editableShape', 'click', this.id].join('.'));
    };

    EditableCircle.prototype.getData = function() {
        return this.circle.getData();
    };

    return EditableCircle;
});