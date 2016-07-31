define([
    './event'
], function (
    event
) {
    "use strict";

    /**
     * @constructor
     */
    function Shape() {
        this.id = Shape._id++;
        this.raphaelPaper = null;
        this.raphaelElement = null;
    }

    Shape._id = 0;
    Shape.STROKE_WIDTH = 2;

    Shape.prototype.getDefaultStyle = function() {
        return {
            fill: '#fff',
            'fill-opacity': 0.5,
            'stroke-width': Shape.STROKE_WIDTH,
            stroke: '#000'
        };
    };

    Shape.prototype.setStyle = function(config) {
        this.raphaelElement.attr(config);
    };

    Shape.prototype.resetStyle = function() {
        this.setStyle(this.getDefaultStyle());
    };

    Shape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;
        this.raphaelElement = this.createRaphaelElement();

        this.initRaphaelElement();
    };

    Shape.prototype.createRaphaelElement = function() {};

    Shape.prototype.initRaphaelElement = function() {
        var self = this;

        this.resetStyle();

        /**
         * Make element draggable, @see http://raphaeljs.com/reference.html#Element.drag
         */
        this.raphaelElement.drag(
            function(dx, dy, x, y, domEvent) {
                event.fire(['shape', 'dragProcess', self.id], self, dx, dy, x, y, domEvent);
            },
            function(x, y, domEvent) {
                event.fire(['shape', 'dragStart', self.id], self, x, y, domEvent);
            },
            function(x, y, domEvent) {
                event.fire(['shape', 'dragEnd', self.id], self, x, y, domEvent);
            }
        );

        this.raphaelElement.click(function() {
            event.fire(['shape', 'click', self.id], self);
        });
    };

    Shape.prototype.resize = function() {
        event.fire(['shape', 'resize', this.id], this, arguments);
    };

    Shape.prototype.setCoords = function() {
        event.fire(['shape', 'setCoords', this.id], this, arguments);
    };

    Shape.prototype.removeFromPaper = function() {
        this.raphaelElement.remove();

        event.off(['shape', 'dragProcess', this.id]);
        event.off(['shape', 'dragStart', this.id]);
        event.off(['shape', 'dragEnd', this.id]);

        event.off(['shape', 'click', this.id]);
        event.off(['shape', 'resize', this.id]);
        event.off(['shape', 'setCoords', this.id]);
    };

    Shape.prototype.getData = function() {
        return {};
    };

    Shape.prototype.getPath = function() {
        return this.raphaelElement.getPath();
    };

    Shape.prototype.getBBox = function() {
        return this.raphaelElement.getBBox();
    };

    return Shape;
});
