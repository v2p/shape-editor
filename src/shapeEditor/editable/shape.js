define(['eve'], function (eve) {

    /**
     * @constructor
     */
    function EditableShape() {
        this.id = EditableShape._id++;
    }

    EditableShape._id = 0;

    EditableShape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;

        this.init();
    };

    EditableShape.prototype.init = function() {};

    EditableShape.prototype.updateKeyPoints = function() {};

    EditableShape.prototype.removeFromPaper = function() {};

    EditableShape.prototype.getData = function() {};

    return EditableShape;
});