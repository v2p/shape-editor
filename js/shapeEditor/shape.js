define(['eve'], function (eve) {

    /**
     * @constructor
     */
    function Shape() {
        this.id = null;
        this.raphaelPaper = null;
        this.raphaelElement = null;
    }

    Shape.STROKE_WIDTH = 2;

    Shape.prototype.getRaphaelElementAttributes = function() {
        return {
            fill: '#fff',
            'fill-opacity': 0.5,
            'stroke-width': Shape.STROKE_WIDTH,
            stroke: '#000'
        };
    };

    Shape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;
        this.raphaelElement = this.createRaphaelElement();

        this.initRaphaelElement();
    };

    Shape.prototype.createRaphaelElement = function() {};

    Shape.prototype.initRaphaelElement = function() {
        var self = this;

        this.id = this.raphaelElement.id;
        this.raphaelElement.attr(this.getRaphaelElementAttributes());

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

    return Shape;
});