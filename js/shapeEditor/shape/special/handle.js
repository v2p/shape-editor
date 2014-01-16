define(['eve', 'shapeEditor/point', 'shapeEditor/shape'], function (eve, Point, Shape) {

    /**
     * @param {Shape} parentShape
     * @param {Point} attachmentPoint
     * @param {'x'|'y'} [axisRestriction]
     * @constructor
     */
    function Handle(parentShape, attachmentPoint, axisRestriction) {
        /**
         * @type {Shape}
         */
        this.parentShape = parentShape;

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

    Handle.prototype.getRaphaelElementAttributes = function() {
        var parentAttributes = Shape.prototype.getRaphaelElementAttributes.apply(this, arguments);

        delete parentAttributes['fill-opacity'];

        return parentAttributes;
    };

    Handle.prototype.initRaphaelElement = function(raphaelElement) {
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

        eve.on(['shape', 'dragProcess', this.id].join('.'), function(dx, dy, x, y, domEvent) {
            var self = this;

            if (self.axisRestriction == 'x') {
                dy = 0;
                y = self.attachmentPoint.y;
            }

            if (self.axisRestriction == 'y') {
                dx = 0;
                x = self.attachmentPoint.x;
            }

            eve(['handler', 'dragProcess', self.id].join('.'), self, dx, dy, x, y, domEvent);
        });

        eve.on(['shape', 'dragStart', this.id].join('.'), function(x, y, domEvent) {
            var self = this;

            eve(['handler', 'dragStart', this.id].join('.'), self, x, y, domEvent);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(x, y, domEvent) {
            var self = this;

            eve(['handler', 'dragEnd', self.id].join('.'), self, x, y, domEvent);
        });

        eve.on(['point', 'setCoords', this.attachmentPoint.id].join('.'), function(x, y) {
            self.raphaelElement.attr({cx: x, cy: y});
        });
    };

    return Handle;
});