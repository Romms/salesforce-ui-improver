"use strict";

(function(){
    console.log('Salesforce UI Improver running');
    load_options();

    function exec_scripts(options) {
        if (undefined !== salesforceuiimprover_scripts) {
            if (true === options.show1000PerPage) {
                document.documentElement.classList.add('salesforceuiimprover-enabledScript-' + 'show1000PerPage');
                salesforceuiimprover_scripts.show1000PerPage();
            }
            if (true === options.showLineNumbersInTables) {
                document.documentElement.classList.add('salesforceuiimprover-enabledScript-' + 'showLineNumbersInTables');
                salesforceuiimprover_scripts.showLineNumbersInTables();
            }
            if (true === options.checkAllCheckboxes) {
                document.documentElement.classList.add('salesforceuiimprover-enabledScript-' + 'checkAllCheckboxes');
                salesforceuiimprover_scripts.checkAllCheckboxes();
            }

            if (true === options.showFieldApiNames) {
                document.documentElement.classList.add('salesforceuiimprover-enabledScript-' + 'showFieldApiNames');
                salesforceuiimprover_scripts.showFieldApiNames();
            }
        }
    }

    function load_options() {

        chrome.storage.sync.get({
            show1000PerPage: true,
            showLineNumbersInTables: true,
            checkAllCheckboxes: true,
            showFieldApiNames: true
        }, function(items) {
            var options = $.extend(options, items);
            exec_scripts(options);
        });
    }


})();
