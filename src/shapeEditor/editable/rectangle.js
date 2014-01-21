define(['eve', 'shapeEditor/editable/shape', 'shapeEditor/point', 'shapeEditor/rectangle', 'shapeEditor/special/handle'], function (eve, EditableShape, Point, Rectangle, Handle) {

    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @constructor
     */
    function EditableRectangle(x, y, width, height) {
        this.rectangle = new Rectangle(x, y, width, height);

        this.keyPoints = {
            leftTop: new Point(),
            top: new Point(),
            rightTop: new Point(),
            right: new Point(),
            rightBottom: new Point(),
            bottom: new Point(),
            bottomLeft: new Point(),
            left: new Point()
        };

        this.resizeHandlersConfig = [
            [new Handle(this.keyPoints.leftTop), this.resizeDispatchers.leftTop],
            [new Handle(this.keyPoints.top, 'y'), this.resizeDispatchers.top],
            [new Handle(this.keyPoints.rightTop), this.resizeDispatchers.rightTop],
            [new Handle(this.keyPoints.right, 'x'), this.resizeDispatchers.right],
            [new Handle(this.keyPoints.rightBottom), this.resizeDispatchers.rightBottom],
            [new Handle(this.keyPoints.bottom, 'y'), this.resizeDispatchers.bottom],
            [new Handle(this.keyPoints.bottomLeft), this.resizeDispatchers.bottomLeft],
            [new Handle(this.keyPoints.left, 'x'), this.resizeDispatchers.left]
        ];

        this.updateKeyPoints();

        EditableShape.apply(this, arguments);
    }

    EditableRectangle.prototype = new EditableShape();
    EditableRectangle.prototype.constructor = EditableRectangle;

    EditableRectangle.MIN_WIDTH = 12;
    EditableRectangle.MIN_HEIGHT = 12;

    EditableRectangle.prototype.updateKeyPoints = function() {
        var topLeftPoint = this.rectangle.topLeftPoint,
            width = this.rectangle.width,
            height = this.rectangle.height;

        this.keyPoints.leftTop.setCoords(topLeftPoint.x, topLeftPoint.y);
        this.keyPoints.top.setCoords(topLeftPoint.x + width / 2, topLeftPoint.y);
        this.keyPoints.rightTop.setCoords(topLeftPoint.x + width, topLeftPoint.y);
        this.keyPoints.right.setCoords(topLeftPoint.x + width, topLeftPoint.y + height / 2);
        this.keyPoints.rightBottom.setCoords(topLeftPoint.x + width, topLeftPoint.y + height);
        this.keyPoints.bottom.setCoords(topLeftPoint.x + width / 2, topLeftPoint.y + height);
        this.keyPoints.bottomLeft.setCoords(topLeftPoint.x, topLeftPoint.y + height);
        this.keyPoints.left.setCoords(topLeftPoint.x, topLeftPoint.y + height / 2);
    };

    EditableRectangle.prototype.resizeDispatchers = {
        leftTop: function(dx, dy, x, y) {
            x = Math.max(0, Math.min(x, this.rectangle.topLeftPoint.x + this.rectangle.width - EditableRectangle.MIN_WIDTH));
            y = Math.max(0, Math.min(y, this.rectangle.topLeftPoint.y + this.rectangle.height - EditableRectangle.MIN_HEIGHT));

            this.rectangle.resize(x, y, this.rectangle.width - (x - this.rectangle.topLeftPoint.x), this.rectangle.height - (y - this.rectangle.topLeftPoint.y));
        },
        top: function(dx, dy, x, y) {
            y = Math.max(0, Math.min(y, this.rectangle.topLeftPoint.y + this.rectangle.height - EditableRectangle.MIN_HEIGHT));

            this.rectangle.resize(this.rectangle.topLeftPoint.x, y, this.rectangle.width, this.rectangle.height - (y - this.rectangle.topLeftPoint.y));
        },
        rightTop: function(dx, dy, x, y) {
            x = Math.min(x, this.raphaelPaper.width);
            y = Math.max(0, Math.min(y, this.rectangle.topLeftPoint.y + this.rectangle.height - EditableRectangle.MIN_HEIGHT));

            this.rectangle.resize(this.rectangle.topLeftPoint.x, y, x - this.rectangle.topLeftPoint.x, this.rectangle.height - (y - this.rectangle.topLeftPoint.y));
        },
        right: function(dx, dy, x, y) {
            x = Math.min(x, this.raphaelPaper.width);

            this.resize(this.rectangle.topLeftPoint.x, this.rectangle.topLeftPoint.y, x - this.rectangle.topLeftPoint.x, this.rectangle.height);
        },
        rightBottom: function(dx, dy, x, y) {
            x = Math.min(x, this.raphaelPaper.width);
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(this.rectangle.topLeftPoint.x, this.rectangle.topLeftPoint.y, x - this.rectangle.topLeftPoint.x, y - this.rectangle.topLeftPoint.y);
        },
        bottom: function(dx, dy, x, y) {
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(this.rectangle.topLeftPoint.x, this.rectangle.topLeftPoint.y, this.rectangle.width, y - this.rectangle.topLeftPoint.y);
        },
        bottomLeft: function(dx, dy, x, y) {
            x = Math.max(0, Math.min(x, this.rectangle.topLeftPoint.x + this.rectangle.width - EditableRectangle.MIN_WIDTH));
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(x, this.rectangle.topLeftPoint.y, this.rectangle.width - (x - this.rectangle.topLeftPoint.x), y - this.rectangle.topLeftPoint.y);
        },
        left: function(dx, dy, x, y) {
            x = Math.max(0, Math.min(x, this.rectangle.topLeftPoint.x + this.rectangle.width - EditableRectangle.MIN_WIDTH));

            this.resize(x, this.rectangle.topLeftPoint.y, this.rectangle.width - (x - this.rectangle.topLeftPoint.x), this.rectangle.height);
        }
    };

    EditableRectangle.prototype.resize = function(x, y, width, height) {
        width = Math.max(width, EditableRectangle.MIN_WIDTH);
        height = Math.max(height, EditableRectangle.MIN_HEIGHT);

        this.rectangle.resize(x, y, width, height);
        this.updateKeyPoints();
    };

    EditableRectangle.prototype.init = function() {
        EditableShape.prototype.init.apply(this, arguments);

        this.rectangle.addOnRaphaelPaper(this.raphaelPaper);

        var self = this;
        for (var i = 0; i < this.resizeHandlersConfig.length; i++) {
            var handleElement = this.resizeHandlersConfig[i][0],
            resizeDispatcher = this.resizeHandlersConfig[i][1];

            handleElement.addOnRaphaelPaper(this.raphaelPaper);

            eve.on(['handler', 'dragProcess', handleElement.id].join('.'), (function() {
                var dispatcherClosure = resizeDispatcher;

                return function() {
                    dispatcherClosure.apply(self, arguments);
                }
            })());

            eve.on(['handler', 'dragEnd', handleElement.id].join('.'), function() {
                eve(['editableShape', 'resizeEnd', self.id].join('.'), self, arguments);
            });
        }

        eve.on(['point', 'setCoords', this.rectangle.topLeftPoint.id].join('.'), function() {
            self.updateKeyPoints();
        });

        eve.on(['shape', 'click', this.id].join('.'), function() {
            eve(['editableShape', 'click', self.id].join('.'), self, arguments);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function() {
            eve(['editableShape', 'dragEnd', self.id].join('.'), self, arguments);
        });
    };

    EditableRectangle.prototype.removeFromPaper = function() {
        EditableShape.prototype.removeFromPaper.apply(this, arguments);

        for (var i = 0; i < this.resizeHandlersConfig.length; i++) {
            this.resizeHandlersConfig[i][0].removeFromPaper();
        }

        eve.off(['editableShape', 'click', this.id].join('.'));
    };

    EditableRectangle.prototype.getData = function() {
        return this.rectangle.getData();
    };

    return EditableRectangle;
});