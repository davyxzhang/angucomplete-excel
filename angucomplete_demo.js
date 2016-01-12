(function () {
    'use strict';

    angular.module('app', ['app.directives.angucomplete-excel'])
        .controller('DemoCtrl', DemoCtrl);

    DemoCtrl.$inject = ["$scope"];
    function DemoCtrl($scope) {
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
            headers: [
                "Title",
                "InternationalRevenue",
                "DomesticRevenue"
            ],
            data: [
                {Title: "16 Blocks", InternationalRevenue: 28769580, DomesticRevenue: 36895141},
                {Title: "17 Again", InternationalRevenue: 72100407, DomesticRevenue: 64167069},
                {Title: "ATL", InternationalRevenue: 0, DomesticRevenue: 21170563},
                {Title: "A Mighty Wind", InternationalRevenue: 969240, DomesticRevenue: 17781006},
                {Title: "A Time to Kill", InternationalRevenue: 43500000, DomesticRevenue: 108766007},
                {Title: "American Outlaws", InternationalRevenue: 336123, DomesticRevenue: 13342790},
                {Title: "Angel Eyes", InternationalRevenue: 5541388, DomesticRevenue: 24174218},
                {Title: "Appaloosa", InternationalRevenue: 7454457, DomesticRevenue: 20211394},
                {Title: "Argo", InternationalRevenue: 96300000, DomesticRevenue: 136025000},
                {Title: "Arthur", InternationalRevenue: 12700000, DomesticRevenue: 33035397},
                {Title: "Chill Factor", InternationalRevenue: 0, DomesticRevenue: 11263966},
                {Title: "Collateral Damage", InternationalRevenue: 38305176, DomesticRevenue: 40077257},
                {Title: "Contagion", InternationalRevenue: 59800000, DomesticRevenue: 75658097},
                {Title: "Edge of Darkness", InternationalRevenue: 37810239, DomesticRevenue: 43313890},
                {Title: "Extremely Loud and Incredibly Close", InternationalRevenue: 16000000, DomesticRevenue: 31847881},
                {Title: "Final Destination 5", InternationalRevenue: 115300000, DomesticRevenue: 42587643},
                {Title: "Friday the 13th", InternationalRevenue: 26377032, DomesticRevenue: 65002019},
                {Title: "Get Carter", InternationalRevenue: 4445811, DomesticRevenue: 14967182},
                {Title: "Gods and Generals", InternationalRevenue: 41002, DomesticRevenue: 12882934},
                {Title: "Gravity", InternationalRevenue: 431000000, DomesticRevenue: 268167000},
                {Title: "Green Lantern", InternationalRevenue: 103250000, DomesticRevenue: 116601172},
                {Title: "Harry Potter and the Deathly Hallows Part 1", InternationalRevenue: 660416406, DomesticRevenue: 295983305},
                {Title: "Her", InternationalRevenue: 0, DomesticRevenue: 23249000},
                {Title: "Inception", InternationalRevenue: 532956569, DomesticRevenue: 292576195},
                {Title: "Inkheart", InternationalRevenue: 45146937, DomesticRevenue: 17303424},
                {Title: "Jack Frost", InternationalRevenue: 0, DomesticRevenue: 34562556}
            ]
        };
        this.mathOperation = "";
        this.columnName = "TotalRevenue";


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

                this.tableData.headers.push(this.columnName);
                this.tableData.data.push({});
                this.tableData.data.pop();
            } catch (err) {
                //if we catch an error, we'll roll back to original data
                this.tableData = angular.copy(originalTableData);
                alert("An error occurred during evaluation: " + err.message);
            }
        };
    }
})();