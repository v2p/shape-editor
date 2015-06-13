define([
    'eve'
], function (
    eve
) {
    "use strict";

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

    EditableShape.prototype.getPath = function() {};
    EditableShape.prototype.getBBox = function() {};

    EditableShape.prototype.setStyle = function(styleConfig) {
        var handleStyle = styleConfig.handle || null;

        for(var i = 0; i < this.resizeHandles.length; i++) {
            this.resizeHandles[i].setStyle(handleStyle);
        }
    };

    EditableShape.prototype.resetStyle = function() {
        for(var i = 0; i < this.resizeHandles.length; i++) {
            this.resizeHandles[i].resetStyle();
        }
    };

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
