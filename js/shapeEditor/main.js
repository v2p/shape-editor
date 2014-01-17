define(['eve', 'shapeEditor/shape/editable/circle', 'shapeEditor/shape/editable/rectangle'], function (eve, EditableCircle, EditableRectangle) {
    return function(raphaelPaper) {
        var self = this;

        self.createCircle = function(x, y) {
            var c = new EditableCircle(x, y, 10);
            c.addOnRaphaelPaper(raphaelPaper);
        };

        self.createRectangle = function(x, y) {
            var r = new EditableRectangle(x, y, 20, 20);
            r.addOnRaphaelPaper(raphaelPaper);
        };

        eve.on(['editableShape', 'click', '*'].join('.'), function() {
            console.log(this);
        });

        return self;
    }
});