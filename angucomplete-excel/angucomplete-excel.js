/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 * Customized by Davy Zhang
 */
(function () {
    "use strict";
    angular.module('app.directives.angucomplete-excel', [] )
        .directive('angucomplete', angucomplete);

    angucomplete.$inject = ["$parse", "$http", "$sce", "$timeout"];

    function angucomplete ($parse, $http, $sce, $timeout) {
        angucompleteLink.$inject = ["scope", "ele", "attrs"];
        return {
            restrict: 'EA',
            scope: {
                "id": "@id",
                "placeholder": "@placeholder",
                "selectedObject": "=selectedobject",
                "url": "@url",
                "dataField": "@datafield",
                "titleField": "@titlefield",
                "descriptionField": "@descriptionfield",
                "imageField": "@imagefield",
                "imageUri": "@imageuri",
                "inputClass": "@inputclass",
                "userPause": "@pause",
                "localData": "=localdata",
                "searchFields": "@searchfields",
                "minLengthUser": "@minlength",
                "matchClass": "@matchclass",
                "userReturnFirst": "@returnfirst",
                "searchStr": "=mathoperation"
            },
            link: angucompleteLink,
            templateUrl: "angucomplete-excel/angucomplete-excel.html"
        };

        function angucompleteLink(scope, elem, attrs) {
            scope.lastSearchTerm = null;
            scope.currentIndex = null;
            scope.justChanged = false;
            scope.searchTimer = null;
            scope.hideTimer = null;
            scope.searching = false;
            scope.pause = 500;
            scope.minLength = 3;
            scope.searchStr = null;
            scope.returnFirst = false;
            scope.newSearch = "";
            var completeStr = "",
                element,
                caretPos = 0,
                previousStr,
                searchedStr,
                previousCaret = 0;

            if (scope.minLengthUser && scope.minLengthUser != "") {
                scope.minLength = scope.minLengthUser;
            }

            if (scope.userPause) {
                scope.pause = scope.userPause;
            }

            if(scope.userReturnFirst) {
                scope.returnFirst = scope.userReturnFirst;
            }

            var isNewSearchNeeded = function(newTerm, oldTerm) {
                return newTerm.length >= scope.minLength && newTerm != oldTerm
            };

            //filtered/matches results
            scope.processResults = function(responseData, str) {
                if (responseData && responseData.length > 0) {
                    scope.results = [];

                    var titleFields = [];
                    if (scope.titleField && scope.titleField != "") {
                        titleFields = scope.titleField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = [];

                        for (var t = 0; t < titleFields.length; t++) {
                            titleCode.push(responseData[i][titleFields[t]]);
                        }

                        var description = "";
                        if (scope.descriptionField) {
                            description = responseData[i][scope.descriptionField];
                        }

                        var imageUri = "";
                        if (scope.imageUri) {
                            imageUri = scope.imageUri;
                        }

                        var image = "";
                        if (scope.imageField) {
                            image = imageUri + responseData[i][scope.imageField];
                        }

                        var text = titleCode.join(' ');
                        if (scope.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, '<span class="'+ scope.matchClass +'">'+ strPart +'</span>'));
                        }

                        var resultRow = {
                            title: text,
                            description: description,
                            image: image,
                            originalObject: responseData[i]
                        };

                        scope.results[scope.results.length] = resultRow;
                    }
                    //default to hover over first item
                    if(scope.results.length > 0) {
                        scope.hoverRow(0);
                    }

                } else {
                    scope.results = [];
                }
            };

            scope.searchTimerComplete = function(str) {
                // Begin the search
                if (str.length >= scope.minLength) {
                    if (scope.localData) {
                        var searchFields = scope.searchFields.split(",");
                        var matches = [];

                        for (var i = 0; i < scope.localData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = scope.localData[i];
                            }
                        }

                        scope.searching = false;
                        scope.processResults(matches, str);
                    } else {
                        $http.get(scope.url + str, {}).
                            success(function(responseData, status, headers, config) {
                                scope.searching = false;
                                scope.processResults(((scope.dataField) ? responseData[scope.dataField] : responseData ), str);
                            }).
                            error(function(data, status, headers, config) {
                                console.log("error");
                            });
                    }
                }
            };

            scope.hideResults = function() {
                scope.hideTimer = $timeout(function() {
                    scope.newSearch = "";
                    if(element) {
                        completeStr = element.value;
                    }
                    scope.showDropdown = false;
                }, scope.pause);
            };

            scope.resetHideResults = function() {
                if(scope.hideTimer) {
                    $timeout.cancel(scope.hideTimer);
                }
            };

            scope.hoverRow = function(index) {
                scope.currentIndex = index;
            };

            scope.keyPressed = function(event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if((event.which > 96 && event.which < 123) || (event.which > 47 && event.which < 58) || (event.which > 64 && event.which < 91) || (event.which === 189)) {
                        if(event.which !== 189) {
                            scope.newSearch += String.fromCharCode(event.keyCode);
                        } else {
                            //need to manually set because String.fromCharCode will return the wrong char
                            scope.newSearch += "_";
                        }
                    }

                    if (!scope.newSearch || scope.newSearch == "") {
                        scope.showDropdown = false;
                        scope.lastSearchTerm = null
                    } else if (isNewSearchNeeded(scope.newSearch, scope.lastSearchTerm)) {
                        //scope.lastSearchTerm = scope.newSearch;
                        scope.showDropdown = true;
                        scope.currentIndex = -1;
                        scope.results = [];

                        if (scope.searchTimer) {
                            $timeout.cancel(scope.searchTimer);
                        }

                        scope.searching = true;

                        scope.searchTimer = $timeout(function() {
                            scope.searchTimerComplete(scope.newSearch);
                        }, scope.pause);
                    }
                } else {
                    event.preventDefault();
                }

                if(event.which !== 9) {
                    previousCaret = getCaret(element);
                }
            };

            scope.selectResult = function(result) {
                if (scope.matchClass) {
                    result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                }

                insertText(result);
                caretPos = getCaret(element);
                previousStr = result.title;
                searchedStr = scope.newSearch;
                scope.searchStr = completeStr;
                scope.selectedObject = result;
                scope.showDropdown = false;
                scope.results = [];
                scope.newSearch = "";

                //timeout for the ngmodel to update then grab the values, set focus and caret
                $timeout(function(){
                    setCaretPosition(result);
                });
            };

            scope.checkCaretPosition = function () {
                if(element) {
                    if (previousCaret + 1 !== getCaret(element)) {
                        scope.newSearch = "";
                        completeStr = element.value;
                        scope.showDropdown = false;
                    }
                }
            };

            var inputField = elem.find('textarea');
            inputField.on("keyup", scope.keyPressed);

            //for special characters and non-input buttons
            elem.on("keyup", function (event) {
                var currentCaretPos, strLeft, strRight;
                //TODO if statement for DEL button which does the opposite direction of delete as backspace
                if(event.which === 8) {//backspace
                    scope.selectedObject = null;
                    if(scope.newSearch.length !== 0) {
                        scope.newSearch = scope.newSearch.replace(scope.newSearch.charAt(scope.newSearch.length - 1), "");
                    } else {
                        currentCaretPos = getCaret(element);
                        strLeft = element.value.substr(0, currentCaretPos);
                        strRight = element.value.substr(currentCaretPos, element.value.length);
                        completeStr = strLeft.substr(0, currentCaretPos) + strRight;

                        scope.showDropdown = false;
                    }
                } else if (event.which === 46) { //Delete btn
                    scope.selectedObject = null;
                    currentCaretPos = getCaret(element);
                    strLeft = element.value.substr(0, currentCaretPos);
                    strRight = element.value.substr(currentCaretPos, element.value.length);
                    completeStr = strLeft + strRight.substr(currentCaretPos + 1, element.value.length);
                    //if()
                }else if(event.which === 27 || (event.which === 110 || event.which === 190) || (event.which === 107 || event.which === 187)
                    || (event.which === 109 || event.which === 189) || (event.which === 56 || event.which === 106) || (event.which === 111 || event.which === 191)
                    || event.which === 54 || event.which === 188 || event.which === 32 || event.which === 57 || event.which === 48) {

                    //add it to the caret position
                    completeStr = element.value.substr(0, element.value.length);

                    scope.newSearch = "";
                    scope.showDropdown = false;
                } else if(event.which == 55) { //&
                    if (scope.currentIndex >= 1) {
                        scope.currentIndex --;
                        scope.$apply();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                } else if (event.which == 13) { //return [enter]
                    if(scope.returnFirst && scope.currentIndex === -1 && scope.results.length > 0) {
                        scope.currentIndex = 0;
                    }
                    if (scope.results && scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                        $timeout(function() {
                            scope.selectResult(scope.results[scope.currentIndex]);
                        });
                        scope.$apply();
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        scope.results = [];
                        scope.$apply();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }  else if(event.which == 38) {
                    if (scope.currentIndex >= 1) {
                        scope.currentIndex --;
                        scope.$apply();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                } else if(event.which === 40) {
                    if (scope.results && (scope.currentIndex + 1) < scope.results.length) {
                        scope.currentIndex ++;
                        scope.$apply();
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    scope.$apply();
                }
            });

            //keydown to prevent default for up/down directions and enter BEFORE they take action
            elem.on("keydown", function (event) {
                if(!element) {
                    element = document.getElementById(scope.id+"_value")
                }

                if (event.which === 38 || event.which === 40 || event.which === 13) {
                    event.preventDefault();
                }

                if((event.which > 96 && event.which < 123) || (event.which > 47 && event.which < 58) || (event.which > 64 && event.which < 91) || (event.which === 189)) {
                    //if user has highlighted text, then it needs to be replaced
                    if(element.selectionStart !== element.selectionEnd) {
                        var tempLeftStr = completeStr.substring(0, element.selectionStart);
                        var tempHighlighted = completeStr.substring(element.selectionStart, element.selectionEnd);
                        var tempRightStr = completeStr.substring(element.selectionEnd, completeStr.length);

                        completeStr = tempLeftStr + tempRightStr;
                    }
                }
            });

            //get where the cursor is
            function getCaret(el) {
                if (el.selectionStart) {
                    return el.selectionStart;
                } else if (document.selection) {
                    el.focus();

                    var r = document.selection.createRange();
                    if (r == null) {
                        return 0;
                    }

                    var re = el.createTextRange(),
                        rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);

                    return rc.text.length;
                }
                return 0;
            }

            //insert the new text into cursor position
            function insertText(selected) {
                var currentPos = getCaret(element);
                currentPos = currentPos - scope.newSearch.length;

                var strLeft = completeStr.substring(0, currentPos);
                var strMiddle = selected.title;
                var strRight = completeStr.substring(currentPos, element.value.length);
                completeStr = strLeft + strMiddle + strRight;
            }

            function setCaretPosition(selected) {
                //if it's a function, we want to put the caret inside the parentheses else put it at the end of the insert
                if(selected.originalObject && selected.originalObject.type === 'function') {
                    caretPos = caretPos+(previousStr.length-(searchedStr.length+1));
                } else {
                    caretPos = caretPos+(previousStr.length-(searchedStr.length));
                }

                if (element.setSelectionRange) {
                    element.focus();
                    element.setSelectionRange(caretPos, caretPos);
                } else if (element.createTextRange) {
                    var range = element.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', caretPos);
                    range.moveStart('character', caretPos);
                    range.select();
                }
            }
        }
    }
})(); //end of IIFE
