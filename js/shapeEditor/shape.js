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

    Shape.prototype.initRaphaelElement = function(raphaelElement) {
        var self = this;

        this.id = raphaelElement.id;

        raphaelElement.attr({
            fill: '#fff',
            'fill-opacity': 0.5,
            'stroke-width': Shape.STROKE_WIDTH,
            stroke: '#000'
        });

        /**
         * Make element draggable, @see http://raphaeljs.com/reference.html#Element.drag
         */
        raphaelElement.drag(
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
    };

    Shape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;
    };

    Shape.prototype.resize = function() {
        eve(['shape', 'resize', this.id].join('.'), this, arguments);
    };

    return Shape;
});