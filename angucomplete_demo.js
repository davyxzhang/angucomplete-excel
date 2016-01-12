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

        this.tableData = {
            headers: ["Title", "InternationalRevenue", "DomesticRevenue"],
            data: [{Title: "test", InternationalRevenue: 10, DomesticRevenue: 10}]
        };
        this.mathOperation = "";
        this.columnName = "NewColumn";


        this.accept = function () {
            console.log("test button");
            var i,
                mathResult,
                originalTableData = angular.copy(this.tableData);

            //we want to catch errors if any comes up from math evaluation
            try {
                //if user thinks our operation works like excel and start with '=' then we'll just remove it and then pass to math.js
                if(this.mathOperation.charAt(0) === "=") {
                    this.mathOperation = this.mathOperation.substring(1, this.mathOperation.length);
                }

                for (i = 0; i < this.tableData.data.length; i++) {
                    mathResult = math.eval(this.mathOperation, this.tableData.data[i]);
                    this.tableData.data[i][this.columnName] = mathResult;
                }

                this.tableData.headers.push({"title": $scope.columnName, "type": "calculated"});

                //close the modal if success
                $modalInstance.close(superTableData);
            } catch (err) {
                //if we catch an error, we'll roll back to original data
                superTableData = angular.copy(originalSuperTableData);
                $rootScope.$emit("activeAlert", "An error occurred during evaluation: " + err.message, "dangerous", 3500);
            }
        };
    }
})();