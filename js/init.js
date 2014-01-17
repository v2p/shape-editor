define(['raphael', 'shapeEditor/main'], function (Raphael, ShapeEditor) {

    var shapeEditor = new ShapeEditor(Raphael('paper-container'), {
        onShapeClick: function(shape) {
            this.removeShape(shape);
        },

        onShapeCreate: function(shape) {
            console.log(shape);
        }
    });

    shapeEditor.createRectangle(5, 5);
    shapeEditor.createCircle(12, 12);
});
