require(['jasmine', 'jasmine-html'], function (jasmine) {
    var jasmineEnv = jasmine.getEnv();

    jasmineEnv.updateInterval = 1000;
    jasmineEnv.addReporter(new jasmine.HtmlReporter());

    var specs = [];

    specs.push('spec/shapeEditor/editable/EditableCircle');
    specs.push('spec/shapeEditor/editable/EditableRectangle');

    (function execJasmine() {
        require(specs, function() {
            jasmineEnv.execute();
        });
    })();
});