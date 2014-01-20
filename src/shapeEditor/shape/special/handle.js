define(['eve', 'shapeEditor/point', 'shapeEditor/shape'], function (eve, Point, Shape) {

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
            if (this.axisRestriction == 'x') {
                dy = 0;
            }

            if (this.axisRestriction == 'y') {
                dx = 0;
            }

            x = this._tempPointX + dx;
            y = this._tempPointY + dy;

            eve(['handler', 'dragProcess', this.id].join('.'), this, dx, dy, x, y, domEvent);
        });

        eve.on(['shape', 'dragStart', this.id].join('.'), function(x, y, domEvent) {
            this._tempPointX = this.attachmentPoint.x;
            this._tempPointY = this.attachmentPoint.y;

            eve(['handler', 'dragStart', this.id].join('.'), this, x, y, domEvent);
        });

        eve.on(['shape', 'dragEnd', this.id].join('.'), function(x, y, domEvent) {
            delete this._tempPointX;
            delete this._tempPointY;

            eve(['handler', 'dragEnd', this.id].join('.'), this, x, y, domEvent);
        });

        eve.on(['point', 'setCoords', this.attachmentPoint.id].join('.'), function(x, y) {
            self.raphaelElement.attr({cx: x, cy: y});
        });
    };

    Handle.prototype.removeFromPaper = function() {
        Shape.prototype.removeFromPaper.apply(this, arguments);

        this.attachmentPoint.remove();

        eve.off(['handler', 'dragProcess', this.id].join('.'));
        eve.off(['handler', 'dragStart', this.id].join('.'));
        eve.off(['handler', 'dragEnd', this.id].join('.'));
    };

    return Handle;
});