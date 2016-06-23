"use strict";

$(function() {
    restore_options();

    $('input').on('change', function(){
        save_options();
    });
});


// Saves options to chrome.storage
function save_options() {
    var show1000PerPage = ($('input[name="show1000PerPage"]:checked').length > 0) ? true : false;
    var showLineNumbersInTables = ($('input[name="showLineNumbersInTables"]:checked').length > 0) ? true : false;

    chrome.storage.sync.set({
        show1000PerPage: show1000PerPage,
        showLineNumbersInTables: showLineNumbersInTables
    }, function() {
        optionsSaved();
    });
}

// Restores options using the preferences
function restore_options() {
    chrome.storage.sync.get({
        show1000PerPage: true,
        showLineNumbersInTables: true
    }, function(items) {
        $('input[name="show1000PerPage"]').attr('checked', items.show1000PerPage);
        $('input[name="showLineNumbersInTables"]').attr('checked', items.showLineNumbersInTables);
    });
}

function optionsSaved() {
    // Update status to let user know options were saved.
    var $status = $('#status');
    $status.text(' ').stop().slideUp(0);
    $status.text('Please, refresh page to see changes').slideDown(100);
    setTimeout(function() {
        $status.stop().slideUp(100);
    }, 1500);
}