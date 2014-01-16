define(['eve'], function (eve) {

    /**
     * @param raphaelPaper
     * @constructor
     */
    function Shape(raphaelPaper) {
        this.id = null;
        this.raphaelPaper = raphaelPaper || null;
        this.raphaelElement = null;

        if (this.raphaelPaper) {
            this.addOnRaphaelPaper();
        }
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

    Shape.prototype.addOnRaphaelPaper = function() {};

    Shape.prototype.resize = function() {
        eve(['shape', 'resize', this.id].join('.'), this, arguments);
    };

    return Shape;
});