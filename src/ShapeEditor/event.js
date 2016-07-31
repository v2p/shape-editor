define([
    'eve'
], function (
    eve
) {
    /**
     * @param {Array} route
     * @returns {string}
     */
    function routeToEventName(route) {
        return route.join('.');
    }

    return {
        /**
         * @param {Array} route
         * @param callback
         */
        on: function(route, callback) {
            eve.on(routeToEventName(route), callback);
        },
        /**
         * @param {Array} route
         */
        off: function(route) {
            return eve.off(routeToEventName(route));
        },
        fire: function() {
            var a = [].slice.call(arguments);
            a[0] = routeToEventName(a[0]);
            eve.apply(null, a);
        }
    };
});