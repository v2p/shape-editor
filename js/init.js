define(['../lib/raphael', 'shapeEditor/main'], function (Raphael, ShapeEditor) {

    var shapeEditor = new ShapeEditor(Raphael('paper-container'), {
        onShapeClick: function(shape) {},

        onShapeCreate: function(shape) {},

        onShapeDrag: function(shape) {
            console.log(shape.getData());
        },

        onShapeResize: function(shape) {
            console.log(shape.getData());
        }
    });

    shapeEditor.createRectangle(5, 5);
    shapeEditor.createCircle(12, 12);
});
