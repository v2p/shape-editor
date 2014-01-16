define(['eve', 'shapeEditor/shape/editable/circle'/*, 'shapeEditor/editableShape/editableRectangle'*/], function (eve, EditableCircle, EditableRectangle) {
    return function(raphaelPaper) {

        var c = new EditableCircle(70, 20, 10);
        c.addOnRaphaelPaper(raphaelPaper);

        var c2 = new EditableCircle(50, 40, 10);
        c2.addOnRaphaelPaper(raphaelPaper);

        /*var r = new EditableRectangle(90, 90, 20, 30);
        r.addOnRaphaelPaper(raphaelPaper);*/
    }
});