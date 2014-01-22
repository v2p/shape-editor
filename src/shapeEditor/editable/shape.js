define(['eve'], function (eve) {

    /**
     * @param {Handle[]} [resizeHandles]
     * @constructor
     */
    function EditableShape(resizeHandles) {
        this.id = EditableShape._id++;

        /**
         * @type {Handle[]}
         */
        this.resizeHandles = resizeHandles || [];
    }

    EditableShape._id = 0;

    EditableShape.prototype.addOnRaphaelPaper = function(raphaelPaper) {
        this.raphaelPaper = raphaelPaper;

        this.init();
    };

    EditableShape.prototype.init = function() {};

    EditableShape.prototype.updateKeyPoints = function() {};

    EditableShape.prototype.removeFromPaper = function() {
        for (var i = 0; i < this.resizeHandles.length; i++) {
            this.resizeHandles[i].removeFromPaper();
        }

        eve.off(['editableShape', 'click', this.id].join('.'));
        eve.off(['editableShape', 'dragEnd', this.id].join('.'));
    };

    EditableShape.prototype.getData = function() {};

    EditableShape.prototype.hideResizeHandles = function() {
        for(var i = 0; i < this.resizeHandles.length; i++) {
            this.resizeHandles[i].hide();
        }
    };

    EditableShape.prototype.showResizeHandles = function() {
        for(var i = 0; i < this.resizeHandles.length; i++) {
            this.resizeHandles[i].show();
        }
    };

    return EditableShape;
});