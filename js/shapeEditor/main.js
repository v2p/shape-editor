define(['shapeEditor/shape/circle', 'shapeEditor/shape/rectangle'], function (Circle, Rectangle) {
    return function(raphaelPaper) {

        var c = new Circle(70, 20, 100);
        c.addOnRaphaelPaper(raphaelPaper);

        var r = new Rectangle(90, 90, 20, 30);
        r.addOnRaphaelPaper(raphaelPaper);
    }
});