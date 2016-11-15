// gets all the event data and adds it to the list on the left
function getEventList(listID, callback) {
    $.post('/datafromserver', {action:'t'}, function(data, status) {
        var obj = JSON.parse(data);
        if(listID == 'adaptation-items'){
            $('#adaptation-items').empty();
            obj.forEach(function(item){
                $('#adaptation-items').append('<li id=\'' + item.eventID + '\' class=\'adpt-unfocused\' >'+ item.eventName + '</li>');
            });
            $('li.adpt-unfocused').click(function(){
                if($('#editsaveButton').val() !== 'Save'){
                    $('li.adpt-focused').removeClass('adpt-focused').addClass('adpt-unfocused');
                    $(this).removeClass('adpt-unfocused').addClass('adpt-focused');
                    loadDiscription($(this).attr('id'));
                    tabConfig('tab-description');
                }
            });
            callback();
        }
        else {
            $('#relations-items').empty();
            obj.forEach(function(item){
                $('#relations-items').append('<li id=\'' + item.eventID + '\' class=\'relations-unfocused\' >'+ item.eventName + '</li>');
            });
            $('li.relations-unfocused').click(function(){
                $('li.relations-focused').removeClass('relations-focused').addClass('relations-unfocused');
                $(this).removeClass('relations-unfocused').addClass('relations-focused');
            });
            callback();
        }
    })
    .fail(function(response) {
        console.log('Failed to load data');
        window.location = '/error';
    });
}

function deleteEvent(eventID, eventName){
    if (confirm('Are you sure you want to delete: ' + eventName) == true){
        $.post('/datatoserver', {action:'d', table:'event', value: eventID}, function(data, status) {

        })
        .fail(function(response) {
            console.log('Failed to load data');
            window.location = '/error';
        });
        getEventList('adaptation-items', function(){

            });
    }
}

function loadDiscription(eID) {
    $.post('/datafromserver', {action:'q', table:'event', eventid: eID}, function(data, status) {
        var obj = JSON.parse(data);
        $('#adaptationName').val(obj[0].eventName);
        $('#earliestDirectEvidence').val((obj[0].earliestDirectEvidence > 1000000)? obj[0].earliestDirectEvidence / 1000000: obj[0].earliestDirectEvidence / 1000);
        $('#earliestDirectEvidence-units').val((obj[0].earliestDirectEvidence > 1000000)? 'Ma': 'Ka' );
        $('#earliestIndirectEvidence').val((obj[0].earliestIndirectEvidence > 1000000)? obj[0].earliestIndirectEvidence / 1000000: obj[0].earliestIndirectEvidence / 1000);
        $('#earliestIndirectEvidence-units').val((obj[0].earliestIndirectEvidence > 1000000)? 'Ma': 'Ka' );
        $('#ageBoundaryStart').val((obj[0].boundaryStart > 1000000)? obj[0].boundaryStart / 1000000: obj[0].boundaryStart / 1000);
        $('#ageBoundaryStart-units').val((obj[0].boundaryStart > 1000000)? 'Ma': 'Ka' );
        $('#ageBoundaryEnd').val((obj[0].boundaryEnd > 1000000)? obj[0].boundaryEnd / 1000000: obj[0].boundaryEnd / 1000);
        $('#ageBoundaryEnd-units').val((obj[0].boundaryEnd > 1000000)? 'Ma': 'Ka' );
        $('#adaptation-category-combo').val(obj[0].category);
        $('#adaptationDescription').val(obj[0].description);
        $('#adaptationComments').val(obj[0].comments);
        $('#adaptationReferences').val(obj[0].reference);
    })
    .fail(function(response) {
        console.log('Failed to load data');
        window.location = '/error';
    });

}

function searchUI(listID, searchString) {
    $('#'+listID).children().each(function(){
        if(!$(this).text().toLowerCase().includes(searchString.trim().toLowerCase()))
            $(this).remove();
    });

}

function tabConfig(id) {
    $('li.active').removeClass('active').addClass('nonactive');
    $('#'+id).removeClass('nonactive').addClass('active');
    switch (id) {
        case 'firstLoad':
            $('#information-container').empty();
            $('#information-container').append(firstLoadPane);
            break;
        case 'create-description':
            $('#tab-description').removeClass('nonactive').addClass('active');
            $('li.adpt-focused').removeClass('adpt-focused').addClass('adpt-unfocused');
            $('#information-container').empty();
            $('#information-container').append(descriptionPane);
            $('#editsaveButton').val('Save');
            break;
        case 'tab-description':
            $('#information-container').empty();
            $('#information-container').append(descriptionPane);
            loadDiscription($('li.adpt-focused').attr('id'));
            disableEditing(id);
            break;
        case 'tab-media':
            $('#information-container').empty();
            $('#information-container').append(mediaPane);

            break;
        case 'tab-relations':
            $('#information-container').empty();
            $('#information-container').append(relationsPane);

            break;
        default:

    }
}

function enableEditing(id) {
    switch (id) {
        case 'tab-description':
            $('#adaptationName').prop('disabled', false);
            $('#earliestDirectEvidence').prop('disabled', false);
            $('#earliestDirectEvidence-units').prop('disabled', false);
            $('#earliestIndirectEvidence').prop('disabled', false);
            $('#earliestIndirectEvidence-units').prop('disabled', false);
            $('#ageBoundaryStart').prop('disabled', false);
            $('#ageBoundaryStart-units').prop('disabled', false);
            $('#ageBoundaryEnd').prop('disabled', false);
            $('#ageBoundaryEnd-units').prop('disabled', false);
            $('#adaptation-category-combo').prop('disabled', false);
            $('#adaptationDescription').prop('disabled', false);
            $('#adaptationComments').prop('disabled', false);
            $('#adaptationReferences').prop('disabled', false);
            break;
        case 'tab-media':


            break;
        case 'tab-relations':

            break;
        default:

    }
}

function disableEditing(id) {
    switch (id) {
        case 'tab-description':
            $('#adaptationName').prop('disabled', true);
            $('#earliestDirectEvidence').prop('disabled', true);
            $('#earliestDirectEvidence-units').prop('disabled', true);
            $('#earliestIndirectEvidence').prop('disabled', true);
            $('#earliestIndirectEvidence-units').prop('disabled', true);
            $('#ageBoundaryStart').prop('disabled', true);
            $('#ageBoundaryStart-units').prop('disabled', true);
            $('#ageBoundaryEnd').prop('disabled', true);
            $('#ageBoundaryEnd-units').prop('disabled', true);
            $('#adaptation-category-combo').prop('disabled', true);
            $('#adaptationDescription').prop('disabled', true);
            $('#adaptationComments').prop('disabled', true);
            $('#adaptationReferences').prop('disabled', true);
            break;
        case 'tab-media':


            break;
        case 'tab-relations':

            break;
        default:

    }
}


// Inital page loading
$('#adaptation-items').ready(function(){
    getEventList('adaptation-items', function(){

    });
});
$('#information-container').ready(function(){tabConfig('firstLoad');});
$('#tabs').ready(function(){
    $('li.nonactive').click(function(){
        if($('li.adpt-focused').attr('id'))
            tabConfig($(this).attr('id'));
    });
});
$('#mainsearchbutton').ready(function() {
    $('#mainsearchbutton').click(function(){
        if($('#editsaveButton').val() !== 'Save'){
            tabConfig('firstLoad');
            getEventList('adaptation-items', function(){
            if ($('#mainsearchbar-text').val() != '')
                searchUI('adaptation-items', $('#mainsearchbar-text').val());
            });
        }
    });
});
$('#deleteAdaptationButton').ready(function(){
    $('#deleteAdaptationButton').click(function(){
        if ($('li.adpt-focused').attr('id')){
            deleteEvent($('li.adpt-focused').attr('id'), $('li.adpt-focused').text());
        }
    });
});
$('#createAdaptationButton').ready(function(){
    $('#createAdaptationButton').click(function(){
        if($('#editsaveButton').val() !== 'Save'){
            tabConfig('create-description');
            enableEditing('tab-description');
            $('#save-edit-container').append('<input id="cancleButton" class="editsaveButton" value="Cancle" type="submit">');
            $('#cancleButton').click(function(){
                if (confirm('Are you sure you want to discard changes?') == true) {
                    tabConfig('firstLoad');
                    disableEditing('tab-description');
                    $('#editsaveButton').val('Edit');
                    $('#cancleButton').remove();
                }
            });
        }
    });
});


//for (var i = 0; i < 500; i++) {
//    $.post('/datatoserver', {action:'c', table:'event', data:['event'+i, 'description', 10000000, 15000000, 5000000,
//        20000000, 'reference', 'comments', 1]}, function(data, status) {});
//}
