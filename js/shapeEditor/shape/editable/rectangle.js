define(['eve',  'shapeEditor/point', 'shapeEditor/shape/rectangle', 'shapeEditor/shape/special/handle'], function (eve, Point, Rectangle, Handle) {

    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @constructor
     */
    function EditableRectangle(x, y, width, height) {
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

        Rectangle.apply(this, arguments);
    }

    EditableRectangle.prototype = new Rectangle();
    EditableRectangle.prototype.constructor = EditableRectangle;

    EditableRectangle.MIN_WIDTH = 12;
    EditableRectangle.MIN_HEIGHT = 12;

    EditableRectangle.prototype.setKeyPoints = function() {
        this.keyPoints.leftTop.setCoords(this.topLeftPoint.x, this.topLeftPoint.y);
        this.keyPoints.top.setCoords(this.topLeftPoint.x + this.width / 2, this.topLeftPoint.y);
        this.keyPoints.rightTop.setCoords(this.topLeftPoint.x + this.width, this.topLeftPoint.y);
        this.keyPoints.right.setCoords(this.topLeftPoint.x + this.width, this.topLeftPoint.y + this.height / 2);
        this.keyPoints.rightBottom.setCoords(this.topLeftPoint.x + this.width, this.topLeftPoint.y + this.height);
        this.keyPoints.bottom.setCoords(this.topLeftPoint.x + this.width / 2, this.topLeftPoint.y + this.height);
        this.keyPoints.bottomLeft.setCoords(this.topLeftPoint.x, this.topLeftPoint.y + this.height);
        this.keyPoints.left.setCoords(this.topLeftPoint.x, this.topLeftPoint.y + this.height / 2);
    };

    EditableRectangle.prototype.resizeDispatchers = {
        leftTop: function(dx, dy, x, y) {
            x = Math.max(0, Math.min(x, this.topLeftPoint.x + this.width - EditableRectangle.MIN_WIDTH));
            y = Math.max(0, Math.min(y, this.topLeftPoint.y + this.height - EditableRectangle.MIN_HEIGHT));

            this.resize(x, y, this.width - (x - this.topLeftPoint.x), this.height - (y - this.topLeftPoint.y));
        },
        top: function(dx, dy, x, y) {
            y = Math.max(0, Math.min(y, this.topLeftPoint.y + this.height - EditableRectangle.MIN_HEIGHT));

            this.resize(this.topLeftPoint.x, y, this.width, this.height - (y - this.topLeftPoint.y));
        },
        rightTop: function(dx, dy, x, y) {
            x = Math.min(x, this.raphaelPaper.width);
            y = Math.max(0, Math.min(y, this.topLeftPoint.y + this.height - EditableRectangle.MIN_HEIGHT));

            this.resize(this.topLeftPoint.x, y, x - this.topLeftPoint.x, this.height - (y - this.topLeftPoint.y));
        },
        right: function(dx, dy, x, y) {
            x = Math.min(x, this.raphaelPaper.width);

            this.resize(this.topLeftPoint.x, this.topLeftPoint.y, x - this.topLeftPoint.x, this.height);
        },
        rightBottom: function(dx, dy, x, y) {
            x = Math.min(x, this.raphaelPaper.width);
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(this.topLeftPoint.x, this.topLeftPoint.y, x - this.topLeftPoint.x, y - this.topLeftPoint.y);
        },
        bottom: function(dx, dy, x, y) {
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(this.topLeftPoint.x, this.topLeftPoint.y, this.width, y - this.topLeftPoint.y);
        },
        bottomLeft: function(dx, dy, x, y) {
            x = Math.max(0, Math.min(x, this.topLeftPoint.x + this.width - EditableRectangle.MIN_WIDTH));
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(x, this.topLeftPoint.y, this.width - (x - this.topLeftPoint.x), y - this.topLeftPoint.y);
        },
        left: function(dx, dy, x, y) {
            x = Math.max(0, Math.min(x, this.topLeftPoint.x + this.width - EditableRectangle.MIN_WIDTH));

            this.resize(x, this.topLeftPoint.y, this.width - (x - this.topLeftPoint.x), this.height);
        }
    };

    EditableRectangle.prototype.resize = function(x, y, width, height) {
        width = Math.max(width, EditableRectangle.MIN_WIDTH);
        height = Math.max(height, EditableRectangle.MIN_HEIGHT);

        Rectangle.prototype.resize.call(this, x, y, width, height);

        this.setKeyPoints(); // TODO move to eve
    };

    EditableRectangle.prototype.initRaphaelElement = function(raphaelElement) {
        Rectangle.prototype.initRaphaelElement.apply(this, arguments);

        this.setKeyPoints();

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
        }

        eve.on(['point', 'setCoords', self.topLeftPoint.id].join('.'), function() {
            self.setKeyPoints();
        });
    };

    return EditableRectangle;
});