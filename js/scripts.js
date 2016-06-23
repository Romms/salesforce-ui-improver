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

        var links = $('.bPageBlock .pbBody > .fewerMore a:first-child');
        if (links.length) {

            links.each(function () {
                var $this = $(this);
                var url = $this.attr('href');
                var rowsperpage = utils.getRowsperpageFromUrl(url);
                if (undefined !== rowsperpage) {
                    if (
                        (990 == rowsperpage && $this.find('.fewerArrow').length) ||
                        (1010 == rowsperpage && $this.find('.moreArrow').length)
                    ) {
                        $this.parent().append('<br/><span style="color:grey;">Showing 1000 records per page</span>');
                    } else {
                        url = url.replace(/((%3A|[&?])rowsperpage)=[0-9]*/g, "$1=1000");
                        $this.parent().append('<br/><a href="' + url + '">Show 1000 records per page</a>');
                    }
                }
            });
        }
    },

    showLineNumbersInTables: function () {
        var $bodyCell = $('#bodyCell');
        $bodyCell.find('table.list > thead, table.list > tbody').children('tr.headerRow').children('th:first-child').each(function () {
            $(this).attr('line-number', '#');
        });

        $bodyCell.find('table.list > tbody').each(function () {
            var index = 1;
            $(this).children('tr:not(.headerRow)').children('td:first-child').each(function () {
                $(this).attr('line-number', index);
                index++;
            });
        });
    }
};