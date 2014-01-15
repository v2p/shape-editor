define(['eve'], function (eve) {

    /**
     * @param shapeType
     * @constructor
     */
    function Shape(shapeType) {
        this.shapeType = shapeType;
        this.raphaelPaper = null;
        this.raphaelElement = null;
    }

    Shape.prototype.initRaphaelElement = function(raphaelElement) {
        var self = this;

        // make element draggable:
        raphaelElement.drag(
            function(dx, dy, x, y, domEvent) {
                eve(['shape', self.shapeType, 'dragProcess'].join('.'), self, dx, dy, x, y, domEvent);
            },
            function(x, y, domEvent) {
                eve(['shape', self.shapeType, 'dragStart'].join('.'), self, x, y, domEvent);
            },
            function(x, y, domEvent) {
                eve(['shape', self.shapeType, 'dragEnd'].join('.'), self, x, y, domEvent);
            }
        );
    };

    Shape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;
    };

    return Shape;
});