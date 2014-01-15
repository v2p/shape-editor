define(function () {

    /**
     * @constructor
     */
    function Shape() {
        this.raphaelPaper = null;
        this.raphaelElement = null;
    }

    Shape.prototype.initRaphaelElement = function(raphaelElement) {
        var self = this;

        // make element draggable:
        raphaelElement.drag(
            function(dx, dy, x, y, domEvent) {
                self.raphaelElementDragProcess(dx, dy, x, y, domEvent);
            },
            function(x, y, domEvent) {
                self.raphaelElementDragStart(x, y, domEvent);
            },
            function(x, y, domEvent) {
                self.raphaelElementDragEnd(x, y, domEvent);
            }
        );
    };

    Shape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;
    };

    Shape.prototype.raphaelElementDragProcess = function(dx, dy, x, y, domEvent) {};
    Shape.prototype.raphaelElementDragStart = function(x, y, domEvent) {};
    Shape.prototype.raphaelElementDragEnd = function(x, y, domEvent) {};

    return Shape;
});