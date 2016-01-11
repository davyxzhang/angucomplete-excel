(function () {
    'use strict';

    angular.module('app', ['app.directives.angucomplete-excel'])
        .controller('DemoCtrl', DemoCtrl);

    function DemoCtrl() {
        //search items provided to autocomplete-excel; matching values will be displayed as user types
        this.searchList = [
            {abb: 'acos', name: 'acos()', type: 'function'},
            {abb: 'acot', name: 'acot()', type: 'function'},
            {abb: 'acsc', name: 'acsc()', type: 'function'},
            {abb: 'asec', name: 'asec()', type: 'function'},
            {abb: 'asin', name: 'asin()', type: 'function'},
            {abb: 'atan', name: 'atan()', type: 'function'},
            {abb: 'cos', name: 'cos()', type: 'function'},
            {abb: 'cot', name: 'cot()', type: 'function'},
            {abb: 'csc', name: 'csc()', type: 'function'},
            {abb: 'sec', name: 'sec()', type: 'function'},
            {abb: 'sin', name: 'sin()', type: 'function'},
            {abb: 'tan', name: 'tan()', type: 'function'},
            {abb: 'abs', name: 'abs()', type: 'function'},
            {abb: 'ceil', name: 'ceil()', type: 'function'},
            {abb: 'exp', name: 'exp()', type: 'function'},
            {abb: 'floor', name: 'floor()', type: 'function'},
            {abb: 'ln', name: 'ln()', type: 'function'},
            {abb: 'log', name: 'log()', type: 'function'},
            {abb: 'mod', name: 'mod()', type: 'function'},
            {abb: 'round', name: 'round()', type: 'function'},
            {abb: 'sign', name: 'sign()', type: 'function'},
            {abb: 'sqrt', name: 'sqrt()', type: 'function'},
            {abb: 'max', name: 'max()', type: 'function'},
            {abb: 'mean', name: 'mean()', type: 'function'},
            {abb: 'median', name: 'median()', type: 'function'},
            {abb: 'min', name: 'min()', type: 'function'},
            {abb: 'prod', name: 'prod()', type: 'function'},
            {abb: 'std', name: 'std()', type: 'function'},
            {abb: 'sum', name: 'sum()', type: 'function'},
            {abb: 'var', name: 'var()', type: 'function'},
            {abb: 'Title', name: 'Title', type: 'string'},
            {abb: 'InternationalRevenue', name: 'InternationalRevenue', type: 'string'},
            {abb: 'DomesticRevenue', name: 'DomesticRevenue', type: 'string'}
        ];
    }
})();