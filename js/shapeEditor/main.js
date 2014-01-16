define(['shapeEditor/shape/editable/circle'/*, 'shapeEditor/editableShape/editableRectangle'*/], function (EditableCircle, EditableRectangle) {
    return function(raphaelPaper) {

        var c = new EditableCircle(raphaelPaper, 70, 20, 10);
        var c2 = new EditableCircle(raphaelPaper, 50, 40, 10);

        /*var r = new EditableRectangle(90, 90, 20, 30);
        r.addOnRaphaelPaper(raphaelPaper);*/
    }
});