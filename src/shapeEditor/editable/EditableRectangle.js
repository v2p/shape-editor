define([
    'eve'
    , './EditableShape'

    , '../Point'
    , '../Rectangle'
    , '../special/Handle'
], function (
    eve
    , EditableShape

    , Point
    , Rectangle
    , Handle
) {
    "use strict";

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

        var resizeHandles = [
            new Handle(this.keyPoints.leftTop),
            new Handle(this.keyPoints.top, 'y'),
            new Handle(this.keyPoints.rightTop),
            new Handle(this.keyPoints.right, 'x'),
            new Handle(this.keyPoints.rightBottom),
            new Handle(this.keyPoints.bottom, 'y'),
            new Handle(this.keyPoints.bottomLeft),
            new Handle(this.keyPoints.left, 'x')
        ];

        // mapping (by array indexes) between handle and related resizeDispatcher:
        this.resizeDispatchersMap = [
            this.resizeDispatchers.leftTop,
            this.resizeDispatchers.top,
            this.resizeDispatchers.rightTop,
            this.resizeDispatchers.right,
            this.resizeDispatchers.rightBottom,
            this.resizeDispatchers.bottom,
            this.resizeDispatchers.bottomLeft,
            this.resizeDispatchers.left
        ];

        this.updateKeyPoints();

        EditableShape.call(this, resizeHandles);
    }

    EditableRectangle.prototype = new EditableShape();
    EditableRectangle.prototype.constructor = EditableRectangle;

    EditableRectangle.MIN_WIDTH = 12;
    EditableRectangle.MIN_HEIGHT = 12;

    EditableRectangle.prototype.updateKeyPoints = function() {
        EditableShape.prototype.updateKeyPoints.apply(this, arguments);

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
            var topLeftPoint = this.rectangle.topLeftPoint,
                width = this.rectangle.width,
                height = this.rectangle.height;

            x = Math.max(0, Math.min(x, topLeftPoint.x + width - EditableRectangle.MIN_WIDTH));
            y = Math.max(0, Math.min(y, topLeftPoint.y + height - EditableRectangle.MIN_HEIGHT));

            this.rectangle.resize(x, y, width - (x - topLeftPoint.x), height - (y - topLeftPoint.y));
        },
        top: function(dx, dy, x, y) {
            var topLeftPoint = this.rectangle.topLeftPoint,
                height = this.rectangle.height,
                width = this.rectangle.width;

            y = Math.max(0, Math.min(y, topLeftPoint.y + height - EditableRectangle.MIN_HEIGHT));

            this.rectangle.resize(topLeftPoint.x, y, width, height - (y - topLeftPoint.y));
        },
        rightTop: function(dx, dy, x, y) {
            var topLeftPoint = this.rectangle.topLeftPoint,
                height = this.rectangle.height;

            x = Math.min(x, this.raphaelPaper.width);
            y = Math.max(0, Math.min(y, topLeftPoint.y + height - EditableRectangle.MIN_HEIGHT));

            this.rectangle.resize(topLeftPoint.x, y, x - topLeftPoint.x, height - (y - topLeftPoint.y));
        },
        right: function(dx, dy, x/*, y*/) {
            var topLeftPoint = this.rectangle.topLeftPoint,
                height = this.rectangle.height;

            x = Math.min(x, this.raphaelPaper.width);

            this.resize(topLeftPoint.x, topLeftPoint.y, x - topLeftPoint.x, height);
        },
        rightBottom: function(dx, dy, x, y) {
            var topLeftPoint = this.rectangle.topLeftPoint;

            x = Math.min(x, this.raphaelPaper.width);
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(topLeftPoint.x, topLeftPoint.y, x - topLeftPoint.x, y - topLeftPoint.y);
        },
        bottom: function(dx, dy, x, y) {
            var topLeftPoint = this.rectangle.topLeftPoint,
                width = this.rectangle.width;

            y = Math.min(y, this.raphaelPaper.height);

            this.resize(topLeftPoint.x, topLeftPoint.y, width, y - topLeftPoint.y);
        },
        bottomLeft: function(dx, dy, x, y) {
            var topLeftPoint = this.rectangle.topLeftPoint,
                width = this.rectangle.width;

            x = Math.max(0, Math.min(x, topLeftPoint.x + width - EditableRectangle.MIN_WIDTH));
            y = Math.min(y, this.raphaelPaper.height);

            this.resize(x, topLeftPoint.y, width - (x - topLeftPoint.x), y - topLeftPoint.y);
        },
        left: function(dx, dy, x/*, y*/) {
            var topLeftPoint = this.rectangle.topLeftPoint,
                width = this.rectangle.width,
                height = this.rectangle.height;

            x = Math.max(0, Math.min(x, topLeftPoint.x + width - EditableRectangle.MIN_WIDTH));

            this.resize(x, topLeftPoint.y, width - (x - topLeftPoint.x), height);
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
        for (var i = 0; i < this.resizeHandles.length; i++) {
            var handleElement = this.resizeHandles[i],
            resizeDispatcher = this.resizeDispatchersMap[i];

            handleElement.addOnRaphaelPaper(this.raphaelPaper);

            eve.on(['handle', 'dragProcess', handleElement.id].join('.'), (function() {
                var dispatcherInClosure = resizeDispatcher;

                return function() {
                    dispatcherInClosure.apply(self, arguments);
                }
            })());

            eve.on(['handle', 'dragEnd', handleElement.id].join('.'), function() {
                eve(['editableShape', 'resizeEnd', self.id].join('.'), self, arguments);
            });

            eve.on(['handle', 'click', handleElement.id].join('.'), (function() {
                var handleElementInClosure = handleElement;

                return function() {
                    eve(['editableShape', 'handleClick', self.id].join('.'), self, handleElementInClosure);
                }
            })());
        }

        eve.on(['point', 'setCoords', this.rectangle.topLeftPoint.id].join('.'), function() {
            self.updateKeyPoints();
        });

        eve.on(['shape', 'click', this.rectangle.id].join('.'), function() {
            eve(['editableShape', 'click', self.id].join('.'), self, arguments);
        });

        eve.on(['shape', 'dragEnd', this.rectangle.id].join('.'), function() {
            eve(['editableShape', 'dragEnd', self.id].join('.'), self, arguments);
        });
    };

    EditableRectangle.prototype.removeFromPaper = function() {
        EditableShape.prototype.removeFromPaper.apply(this, arguments);

        this.rectangle.removeFromPaper();
    };

    EditableRectangle.prototype.getData = function() {
        return this.rectangle.getData();
    };

    EditableRectangle.prototype.getPath = function() {
        return this.rectangle.getPath();
    };

    EditableRectangle.prototype.getBBox = function() {
        return this.rectangle.getBBox();
    };

    EditableRectangle.prototype.setStyle = function(styleConfig) {
        EditableShape.prototype.setStyle.apply(this, arguments);

        var shapeStyle = styleConfig.shape || {};
        this.rectangle.setStyle(shapeStyle);
    };

    EditableRectangle.prototype.resetStyle = function() {
        EditableShape.prototype.resetStyle.apply(this, arguments);

        this.rectangle.resetStyle();
    };

    return EditableRectangle;
});
