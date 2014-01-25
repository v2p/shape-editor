require(['raphael', 'shapeEditor/main'], function (Raphael, ShapeEditor) {

    var shapeEditor = new ShapeEditor(Raphael('paper-container'), {
        onShapeClick: function(shape) {
            //console.log('Click: ');
            //console.log(shape);
        },

        onShapeCreate: function(shape) {
            console.log('Create: ');
            console.log(shape);
        },

        onShapeDrag: function(shape) {
            //console.log('Drag: ');
            //console.log(shape);

            showShapeIntersections.apply(this);
        },

        onShapeResize: function(shape) {
            //console.log('Resize: ');
            //console.log(shape);
            showShapeIntersections.apply(this);
        },

        onPolygonShapePointClick: function(polygonShape, point) {
            //this.removePointFromShape(polygonShape, point);
        }
    });

    function showShapeIntersections() {
        var shapes = this.findIntersectedShapes();
        console.log(shapes.length);
    }

    shapeEditor.createRectangle(5, 5, 20, 20);
    shapeEditor.createRectangle(25, 25, 20, 20);
    shapeEditor.createCircle(12, 12, 10);
    shapeEditor.createCircle(72, 12, 10);

    var polygon = shapeEditor.createPolygon([{x: 40, y: 40}, {x: 70, y: 70}, {x: 40, y: 70}]);

    shapeEditor.addPointToShape(polygon, 1, 1);
    shapeEditor.addPointToShape(polygon, 30, 10);
    shapeEditor.addPointToShape(polygon, 20, 80);
});
