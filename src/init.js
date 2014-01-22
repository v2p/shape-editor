require(['../lib/raphael', 'shapeEditor/main'], function (Raphael, ShapeEditor) {

    var shapeEditor = new ShapeEditor(Raphael('paper-container'), {
        onShapeClick: function(shape) {
            if (shape._selected) {
                shape._selected = false;
                shape.showResizeHandles();
            } else {
                shape._selected = true;
                shape.hideResizeHandles();
            }
        },

        onShapeCreate: function(shape) {},

        onShapeDrag: function(shape) {
            console.log(shape.getData());
        },

        onShapeResize: function(shape) {
            console.log(shape.getData());
        }
    });

    shapeEditor.createRectangle(5, 5, 20, 20);
    shapeEditor.createCircle(12, 12, 10);
});
