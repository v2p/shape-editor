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

        },
        top: function(dx, dy, x, y) {

        },
        rightTop: function(dx, dy, x, y) {

        },
        right: function(dx, dy, x, y) {

        },
        rightBottom: function(dx, dy, x, y) {
            this.resize(this.topLeftPoint.x, this.topLeftPoint.y, this.width + dx, this.height + dy);
            this.setKeyPoints();
        },
        bottom: function(dx, dy, x, y) {

        },
        leftTop: function(dx, dy, x, y) {

        },
        bottomLeft: function(dx, dy, x, y) {

        },
        left: function(dx, dy, x, y) {

        }
    };

    EditableRectangle.prototype.initRaphaelElement = function(raphaelElement) {
        Rectangle.prototype.initRaphaelElement.apply(this, arguments);

        this.setKeyPoints();

        var self = this;

        var handleElement = null;
        var resizeDispatcher = null;

        for (var i = 0; i < this.resizeHandlersConfig.length; i++) {
            handleElement = this.resizeHandlersConfig[i][0];
            resizeDispatcher = this.resizeHandlersConfig[i][1];

            handleElement.addOnRaphaelPaper(this.raphaelPaper);

            eve.on(['handler', 'dragProcess', handleElement.id].join('.'), function() {
                resizeDispatcher.apply(self, arguments);
            });
        }

        eve.on(['point', 'setCoords', self.topLeftPoint.id].join('.'), function() {
            self.setKeyPoints();
        });
    };

    return EditableRectangle;
});