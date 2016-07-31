require(['raphael', 'ShapeEditor/main'], function (Raphael, ShapeEditor) {

    var shapeEditor = new ShapeEditor(Raphael('paper-container'), {
        onShapeClick: function(shape) {},

        onShapeCreate: function(shape) {},

        onShapeDrag: function(shape) {
            showShapeIntersections.apply(this);
        },

        onShapeResize: function(shape) {
            showShapeIntersections.apply(this);
        },

        onShapeHandleClick: function(shape, handle) {
            if (!handle.__selected) {
                handle.setStyle({fill: 'red'});
                handle.__selected = true;
            } else {
                //this.removePointFromShape(shape, handle.attachmentPoint);
            }
        },

        onShapeAddPoint: function(shape, point) {},

        onShapeRemovePoint: function(shape) {}
    });

    function showShapeIntersections() {
        this.findAllIntersectedShapes();
    }

    shapeEditor.createRectangle(5, 5, 20, 20);
    shapeEditor.createRectangle(25, 25, 20, 20);
    shapeEditor.createCircle(12, 12, 10);
    shapeEditor.createCircle(72, 12, 10);

    var polygon = shapeEditor.createPolygon([{x: 140, y: 140}, {x: 170, y: 170}, {x: 140, y: 170}]);

    shapeEditor.addPointToShape(polygon, 1, 1);
    shapeEditor.addPointToShape(polygon, 30, 10);
    shapeEditor.addPointToShape(polygon, 20, 80);

    document.getElementById('paper-container').addEventListener('click', function(event) {
        var x = event.clientX,
            y = event.clientY;

        //shapeEditor.addPointToShape(polygon, x, y);
    });
});
