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

        onShapeHandleClick: function(shape, handle) {
            if (!handle.__selected) {
                handle.setStyle({fill: 'red'});
                handle.__selected = true;
            } else {
                //this.removePointFromShape(shape, handle.attachmentPoint);
            }
        },

        onShapeAddPoint: function(shape, point) {
            console.log('point added');
        },

        onShapeRemovePoint: function(shape) {
            console.log('point removed');
        }
    });

    function showShapeIntersections() {
        var shapes = this.findAllIntersectedShapes();
        //console.log(shapes.length);
    }

/*    shapeEditor.createRectangle(5, 5, 20, 20);
    shapeEditor.createRectangle(25, 25, 20, 20);
    shapeEditor.createCircle(12, 12, 10);
    shapeEditor.createCircle(72, 12, 10);*/

    var polygon = shapeEditor.createPolygon([{x: 140, y: 140}, {x: 170, y: 170}, {x: 140, y: 170}]);

    /*shapeEditor.addPointToShape(polygon, 1, 1);
    shapeEditor.addPointToShape(polygon, 30, 10);
    shapeEditor.addPointToShape(polygon, 20, 80);*/

    document.getElementById('paper-container').addEventListener('click', function(event) {
        var x = event.clientX,
            y = event.clientY;

        shapeEditor.addPointToShape(polygon, x, y);
    });
});
