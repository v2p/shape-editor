require(['../lib/raphael', 'shapeEditor/main'], function (Raphael, ShapeEditor) {

    var shapeEditor = new ShapeEditor(Raphael('paper-container'), {
        onShapeClick: function(shape) {
            console.log('Click: ');
            console.log(shape);
        },

        onShapeCreate: function(shape) {
            console.log('Create: ');
            console.log(shape);
        },

        onShapeDrag: function(shape) {
            console.log('Drag: ');
            console.log(shape);
        },

        onShapeResize: function(shape) {
            console.log('Resize: ');
            console.log(shape);
        }
    });

    shapeEditor.createRectangle(5, 5, 20, 20);
    shapeEditor.createRectangle(25, 25, 20, 20);
    shapeEditor.createCircle(12, 12, 10);
    shapeEditor.createCircle(72, 12, 10);
});
