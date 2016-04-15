$(function() {
    initListeners();
});

function initListeners() {
    $('.addForm')
        .form({
            fields: {
              feedUrl   : 'url',
              feedName  : ['empty', 'regExp[/[a-zA-Z0-9]/]']
            },
            onSuccess: function(event, fields) {
                submitForm(this, true);
                event.preventDefault();
            }
        });
    $('.removeForm')
        .form({
            onSuccess: function(event, fields) {
                submitForm(this, false);
                event.preventDefault();
            }
        });
}

function addListener() {
    $('.removeForm:last')
        .form({
            onSuccess: function(event, fields) {
                submitForm(this, false);
                event.preventDefault();
            }
        });
}

function getFieldValue(element, fieldId) {
    return $(element).form('get field', fieldId).val();
}

function submitForm(element, isAdd) {
    var formData = {
        url   : getFieldValue(element, 'feedUrl'),
        name  : getFieldValue(element, 'feedName'),
        id    : $(element).attr('id')
    };
    disableButtons();
    var button = $(element).find('.ui.submit.button');
    button.addClass('loading');
    var url = isAdd ? '/feed/add' : 'feed/delete';
    var callback = isAdd ? onFeedAdded : onFeedRemoved;
    $.ajax({ type: 'POST', url: url, data: formData, success: callback });
}

function disableButtons() {
    $('.ui.relaxed.items').find('.submit.button').addClass('disabled');
}

function enableButtons() {
    $('.ui.relaxed.items').find('.submit.button').removeClass('loading disabled');
}

function onFeedAdded(response) {
    enableButtons();
    var result = jQuery.parseJSON( response );
    if (result.success) {
        var addForm = $('.addForm');
        
        var newForm;
        if (!$('.removeForm').length) {
            addNewForm();
            newForm = $('.removeForm');
        } else {
            newForm = $('.removeForm:last').clone();
        }
        newForm.attr('id', result.id);
        newForm.find('#feedUrl').val(addForm.find('#feedUrl').val())
        newForm.find('#feedName').val(addForm.find('#feedName').val());
        newForm.insertBefore($('.addForm'));
        addListener();
        
        addForm.form('clear');
        addForm.form('reset');
    } else {
        // TODO error handling
    }
}

function addNewForm() {
    $('.ui.relaxed.items').prepend('<div class="ui form removeForm">\
                        <div class="fields">\
                            <div class="ten wide disabled field">\
                                <input type="text" name="feedUrl" id="feedUrl" value="">\
                            </div>\
                            <div class="five wide disabled field">\
                                <input type="text" name="feedName" id="feedName" value="">\
                            </div>\
                            <div class="one wide ui submit animated button">\
                                <div class="hidden content">Remove</div>\
                                <div class="visible content">\
                                    <i class="remove icon"></i>\
                                </div>\
                            </div>\
                        </div>\
                    </div>');
    
}

function onFeedRemoved(response) {
    enableButtons();
    var result = jQuery.parseJSON( response );
    if (result.success) {
        var form = $('#' + result.id);
        if (form.length) {
            form.remove();
        }
    } else {
        // TODO error handling
    }
}