// we use this module to load jquery from require js
// just so we can call noConflict.
// 
// hopefully we can refactor the out mootools in the future.
define([], function () {
   return jQuery;
});