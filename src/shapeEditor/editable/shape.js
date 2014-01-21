define(['eve'], function (eve) {

    function EditableShape() {}

    EditableShape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;
        this.init();
    };

    EditableShape.prototype.init = function() {};

    EditableShape.prototype.resize = function() {};

    EditableShape.prototype.updateKeyPoints = function() {};

    EditableShape.prototype.removeFromPaper = function() {};

    EditableShape.prototype.getData = function() {};

    return EditableShape;
});