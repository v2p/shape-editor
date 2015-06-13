define([
    'eve'
    , 'shapeEditor/point'
    , 'shapeEditor/shape'
], function (
    eve
    , Point
    , Shape
) {
    "use strict";

    /**
     * @param {Point} attachmentPoint
     * @param {'x'|'y'} [axisRestriction]
     * @constructor
     */
    function Handle(attachmentPoint, axisRestriction) {
        /**
         * @type {Point}
         */
        this.attachmentPoint = attachmentPoint;

        this.axisRestriction = axisRestriction || false;

        this.radius = 4;

        Shape.call(this);
    }

    Handle.prototype = new Shape();
    Handle.prototype.constructor = Handle;

    Handle.prototype.createRaphaelElement = function() {
        return this.raphaelPaper.circle(this.attachmentPoint.x, this.attachmentPoint.y, this.radius);
    };

    Handle.prototype.getDefaultStyle = function() {
        var parentAttributes = Shape.prototype.getDefaultStyle.apply(this, arguments);

        delete parentAttributes['fill-opacity'];

        return parentAttributes;
    };

    Handle.prototype.initRaphaelElement = function() {
        Shape.prototype.initRaphaelElement.apply(this, arguments);
        var self = this;

        // small animation on hover:
        self.raphaelElement.hover(
            function() {
                this.animate({r: self.radius + 1}, 150);
            },
            function() {
                this.animate({r: self.radius}, 150);
            }
        );

        eve.on(['shape', 'dragProcess', self.id].join('.'), function(dx, dy, x, y, domEvent) {

            if (self.axisRestriction === 'x') {
                dy = 0;
            }

            if (self.axisRestriction === 'y') {
                dx = 0;
            }

            x = self._tempPointX + dx;
            y = self._tempPointY + dy;

            eve(['handle', 'dragProcess', self.id].join('.'), self, dx, dy, x, y, domEvent);
        });

        eve.on(['shape', 'dragStart', self.id].join('.'), function(x, y, domEvent) {
            self._tempPointX = self.attachmentPoint.x;
            self._tempPointY = self.attachmentPoint.y;

            eve(['handle', 'dragStart', self.id].join('.'), self, x, y, domEvent);
        });

        eve.on(['shape', 'dragEnd', self.id].join('.'), function(x, y, domEvent) {
            delete self._tempPointX;
            delete self._tempPointY;

            eve(['handle', 'dragEnd', self.id].join('.'), self, x, y, domEvent);
        });

        eve.on(['shape', 'click', self.id].join('.'), function() {
            eve(['handle', 'click', self.id].join('.'), self, arguments);
        });

        eve.on(['point', 'setCoords', self.attachmentPoint.id].join('.'), function(x, y) {
            self.raphaelElement.attr({cx: x, cy: y});
        });
    };

    Handle.prototype.removeFromPaper = function() {
        Shape.prototype.removeFromPaper.apply(this, arguments);

        this.attachmentPoint.remove();

        eve.off(['handle', 'dragProcess', this.id].join('.'));
        eve.off(['handle', 'dragStart', this.id].join('.'));
        eve.off(['handle', 'dragEnd', this.id].join('.'));
    };

    Handle.prototype.show = function() {
        this.raphaelElement.show();
    };

    Handle.prototype.hide = function() {
        this.raphaelElement.hide();
    };

    return Handle;
});
