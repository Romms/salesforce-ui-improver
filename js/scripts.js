"use strict";

var salesforceuiimprover_scripts = {
    show1000PerPage: function () {
        var utils = {
            getLsrFromUrl: function (url) {
                var matches = url.match(/(%3A|[&?])lsr=([0-9]*)/);
                if (matches) {
                    return +matches[2];
                }
            },
            getRowsperpageFromUrl: function (url) {
                var rowsperpage_matches = url.match(/((%3A|[&?])rowsperpage)=([0-9]*)/);
                if (rowsperpage_matches) {
                    return +rowsperpage_matches[3];
                }
            }
        };


        var nextOrPrevPage = $('.bNext > .withFilter > .next, .listElementBottomNav > .bNext > .next');
        nextOrPrevPage.each(function () {
            var $this = $(this);

            var $prev_link = $this.children('a:eq(0)');
            var $next_link = $this.children('a:eq(1)');

            if ('Next Page>' === $prev_link.text()) {
                $prev_link = $this.children('empty');
                $next_link = $this.children('a:eq(0)');
            }

            console.log($prev_link.text());
            console.log($next_link.text());

            if ($prev_link.length > 0 || $next_link.length > 0) {

                var prev_lsr = undefined;
                var next_lsr = undefined;
                var url;

                if ($prev_link.length) {
                    url = $prev_link.attr('href');
                    prev_lsr = utils.getLsrFromUrl(url);
                }

                if ($next_link.length) {
                    url = $next_link.attr('href');
                    next_lsr = utils.getLsrFromUrl(url);
                }

                var current_rowsperpage = utils.getRowsperpageFromUrl(url);

                console.log('Counters:');

                console.log('current_rowsperpage : ' + current_rowsperpage);
                console.log('prev_lsr : ' + prev_lsr);
                console.log('next_lsr : ' + next_lsr);

                if (undefined !== prev_lsr || undefined !== next_lsr) {

                    var current_lsr = 0;
                    if (undefined !== prev_lsr && undefined !== next_lsr) {
                        var middle = Math.round((prev_lsr + next_lsr) / 2);
                        current_lsr = prev_lsr + middle;

                        if (undefined === current_rowsperpage) {
                            current_rowsperpage = middle;
                        }
                    } else {
                        if (undefined === prev_lsr) {
                            current_lsr = 0;

                            if (undefined === current_rowsperpage) {
                                current_rowsperpage = next_lsr;
                            }
                        } else { // next_lsr === undefined
                            if (undefined !== current_rowsperpage) {
                                current_lsr = prev_lsr + current_rowsperpage;
                            } else {
                                current_lsr = prev_lsr;
                            }
                        }
                    }

                    if (0 > current_lsr) {
                        current_lsr = 0;
                    }
                    if (undefined === current_rowsperpage) {
                        current_rowsperpage = 250;
                    }

                    console.log('Counters:');

                    console.log('current_rowsperpage : ' + current_rowsperpage);
                    console.log('prev_lsr : ' + prev_lsr);
                    console.log('next_lsr : ' + next_lsr);

                    console.log('current_lsr : ' + current_lsr);


                    if (1000 == current_rowsperpage) {
                        $this.prepend('<span>Showing 1000 records per page</span>&nbsp;|&nbsp;');
                    } else {

                        // Add rowsperpage
                        url = url.replace(/([&?]([^&]*)%3Alsr)=[0-9]*/g, "$1&$2%3Arowsperpage=0"); // If delimeter - %3A
                        url = url.replace(/(&lsr=[0-9]*)/g, "$1&rowsperpage=0");                   // If delimeter - &

                        // Chnage lsr & rowsperpage
                        url = url.replace(/((%3A|[&?])rowsperpage)=[0-9]*/g, "$1=1000");
                        url = url.replace(/((%3A|[&?])lsr)=[0-9]*/g, "$1=" + current_lsr);

                        $this.prepend('<a href="' + url + '">Show 1000 records per page</a>&nbsp;|&nbsp;');
                    }
                }
            }
        });

        var fewerMore = $('.bPageBlock .pbBody > .fewerMore');
        if (fewerMore.length) {

            fewerMore.each(function () {
                var $this = $(this);
                var message;

                var $fewer;
                var $more;

                var fewerRowsperpage;

                if ($this.find('a img.fewerArrow').length) {
                    $fewer = $this.find('a img.fewerArrow').parent();
                    fewerRowsperpage = utils.getRowsperpageFromUrl($fewer.attr('href'));
                }

                if ($this.find('a img.moreArrow').length) {
                    $more = $this.find('a img.moreArrow').parent();
                }

                if ($fewer && fewerRowsperpage == 990) {
                    message = '<span style="color:grey;">Showing 1000 records per page</span>';
                }

                if (!message) {
                    if ($more) {
                        var url = $more.attr('href');
                        url = url.replace(/((%3A|[&?])rowsperpage)=[0-9]*/g, "$1=1000");
                        message = '<a href="' + url + '">Show 1000 records per page</a>';
                    }
                }

                if (!message) {
                    message = '<span style="color:grey;">No possibility show more records</span>';
                }

                if (message) {
                    $this.append('<br/>'+message);
                }
            });
        }

    },

    showLineNumbersInTables: function () {
        var $bodyCell = $('#bodyCell');

        $bodyCell.find('table.list > tbody').each(function () {
            var index = 1;
            $(this).children('tr:not(.headerRow)').children('*:first-child').each(function () {
                $(this).attr('line-number', index);
                index++;
            });
        });

        $bodyCell.find('table.list > thead, table.list > tbody').children('tr.headerRow').children('th:first-child').each(function () {
            $(this).attr('line-number', '#');
        });
    },

    checkAllCheckboxes : function () {
        function recheckHeaderCheckbox(index) {
            index = +index;
            var $checkboxes = $('.addcheckboxes-container input[type=checkbox][addcheckboxes-colindex=' + index + ']');
            $checkboxes.each(function(){
                var $this = $(this);
                var checkedCount = 0;
                var uncheckedCount = 0;

                $this
                    .closest('table')
                    .find('input.addcheckboxes-target[type=checkbox][addcheckboxes-colindex=' + index + ']')
                    .not('[disabled]')
                    .not('[disabled="*"]')
                    .each(function(){
                        var $this = $(this);
                        var isChecked = $this.is(':checked');

                        if (true === isChecked) {
                            checkedCount++;
                        } else {
                            uncheckedCount++;
                        }

                    });

                if (1 <= checkedCount && 0 === uncheckedCount) {
                    $this.prop('checked', true);
                } else {
                    $this.prop('checked', false);
                }

            });

        }

        function generateHeaderCheckbox(index, disabled) {
            var $container = $('<span/>').addClass('addcheckboxes-container');
            if (true === disabled) {
                $container.addClass('addcheckboxes-container-disabled', true);
            }

            var $checkbox = $('<input/>');
            $checkbox.attr('type', 'checkbox');
            $checkbox.attr('addcheckboxes-colindex', index);
            $checkbox.attr('title', 'Check/Uncheck All Checkboxes');
            if (true === disabled) {
                $checkbox.prop('disabled', true);
            }
            $checkbox.change(function(){
                var $this = $(this);
                var index = +$this.attr('addcheckboxes-colindex');
                var needChecked = $this.is(':checked');
                $this
                    .closest('table')
                    .find('input.addcheckboxes-target[type=checkbox][addcheckboxes-colindex=' + index + ']')
                    .not('[disabled]')
                    .not('[disabled="*"]')
                    .each(function(){
                        var $this = $(this);
                        var isChecked = $this.is(':checked');
                        if ((needChecked && !isChecked) || (!needChecked && isChecked)) {
                            $this.click();
                        }
                    });
            });

            var $tip = $('<span/>').addClass('addcheckboxes-reset');
            var $tip_link = $('<a/>');
            $tip_link.text('Reset');
            $tip_link.attr('href', 'javascript:void(0)');
            $tip_link.attr('title', 'Restore the initial values');
            $tip_link.click(function(){
                var $this = $(this);
                var $container = $this.closest('.addcheckboxes-container');
                var $checkbox = $container.find('input[type=checkbox]');
                var index = +$checkbox.attr('addcheckboxes-colindex');

                $this
                    .closest('table')
                    .find('input.addcheckboxes-target[type=checkbox][addcheckboxes-colindex=' + index + ']')
                    .not('[disabled]')
                    .not('[disabled="*"]')
                    .each(function(){
                        $this = $(this);
                        var needChecked = true;

                        var resetvalue = $this.attr('addcheckboxes-resetvalue');
                        if (!resetvalue || resetvalue == 'false') {
                            needChecked = false;
                        }

                        var isChecked = $this.is(':checked');
                        if ((needChecked && !isChecked) || (!needChecked && isChecked)) {
                            $this.click();
                        }
                    });
            });



            $tip.append($tip_link);

            $container.append($checkbox);
            $container.append($tip);

            return $container;
        }

        $('#bodyCell').find('table').has('td > input[type=checkbox]').each(function(){
            var $table = $(this);
            var $trHeader;
            var cols = {};
            var disabledCount = {};

            var $tds;
            if (0 !== $table.children('tbody').length) {
                $tds = $table.children('tbody').children('tr').children('td');
            } else {
                $tds = $table.children('tr').children('td');
            }

            $tds.children('input[type=checkbox]').each(function(){
                var $this = $(this);
                var $td = $this.parent();
                var index = $td.index();
                var checked = $this.is(':checked');

                $this.addClass('addcheckboxes-target');
                $this.attr('addcheckboxes-resetvalue', checked);
                $this.attr('addcheckboxes-colindex', index);
                $this.on('change', function (){
                    recheckHeaderCheckbox(index);
                });

                if (undefined === cols[index]) {
                    cols[index] = 0;
                }

                if (undefined === disabledCount[index]) {
                    disabledCount[index] = 0;
                }

                if ($this.is(':disabled')) {
                    disabledCount[index]++;
                }
                cols[index]++;
            });

            if ($table.children('thead')) {
                $trHeader = $table.children('thead').children('tr:first');
            } else {
                var $firtTrInTbody;

                if ($table.children('tbody')) {
                    $firtTrInTbody = $table.children('tbody').children('tr:first');
                } else {
                    $firtTrInTbody = $table.children('tr:first');
                }

                if (0 === $firtTrInTbody.children('td').length) {
                    $trHeader = $firtTrInTbody;
                }
            }

            if (undefined !== $trHeader && 0 !== $trHeader.length) {
                $.each(cols, function( key, value ) {
                    var index = key;
                    var $th = $($trHeader.children().get(index));
                    var disabled = false;
                    if (value == disabledCount[index])  {
                        disabled = true;
                    }

                    var $deepestElem = $th;
                    while ($deepestElem.children(':first').length > 0) {
                        $deepestElem = $deepestElem.children(':first');
                    }

                    $deepestElem.prepend(generateHeaderCheckbox(index, disabled));
                    recheckHeaderCheckbox(index);
                });
            }
        });        
    }
};