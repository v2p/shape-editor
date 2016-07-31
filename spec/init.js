require(['jasmine', 'jasmine-html'], function (jasmine) {
    var jasmineEnv = jasmine.getEnv();

    jasmineEnv.updateInterval = 1000;
    jasmineEnv.addReporter(new jasmine.HtmlReporter());

    var specs = [];

    specs.push('spec/ShapeEditor/Editable/EditableCircle');
    specs.push('spec/ShapeEditor/Editable/EditableRectangle');

    (function execJasmine() {
        require(specs, function() {
            jasmineEnv.execute();
        });
    })();
});