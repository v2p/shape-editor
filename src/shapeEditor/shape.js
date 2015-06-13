define([
    'eve'
], function (
    eve
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
                eve(['shape', 'dragProcess', self.id].join('.'), self, dx, dy, x, y, domEvent);
            },
            function(x, y, domEvent) {
                eve(['shape', 'dragStart', self.id].join('.'), self, x, y, domEvent);
            },
            function(x, y, domEvent) {
                eve(['shape', 'dragEnd', self.id].join('.'), self, x, y, domEvent);
            }
        );

        this.raphaelElement.click(function() {
            eve(['shape', 'click', self.id].join('.'), self);
        });
    };

    Shape.prototype.resize = function() {
        eve(['shape', 'resize', this.id].join('.'), this, arguments);
    };

    Shape.prototype.setCoords = function() {
        eve(['shape', 'setCoords', this.id].join('.'), this, arguments);
    };

    Shape.prototype.removeFromPaper = function() {
        this.raphaelElement.remove();

        eve.off(['shape', 'dragProcess', this.id].join('.'));
        eve.off(['shape', 'dragStart', this.id].join('.'));
        eve.off(['shape', 'dragEnd', this.id].join('.'));

        eve.off(['shape', 'click', this.id].join('.'));
        eve.off(['shape', 'resize', this.id].join('.'));
        eve.off(['shape', 'setCoords', this.id].join('.'));
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
