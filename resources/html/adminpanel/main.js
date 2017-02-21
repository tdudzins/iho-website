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
                if(!$(this).hasClass('adpt-focused')){
                    if($('#editsaveButton').val() == 'Edit'){
                        $('li.adpt-focused').removeClass('adpt-focused').addClass('adpt-unfocused');
                        $(this).removeClass('adpt-unfocused').addClass('adpt-focused');
                        tabConfig('tab-description');
                    }
                }
            });
            callback();
        }
        else {
            $('#relations-items').empty();
            obj.forEach(function(item){
                $('#relations-items').append('<li id=\'r' + item.eventID + '\' class=\'relations-unfocused\' >'+ item.eventName + '</li>');
            });
            $('li.relations-unfocused').click(function(){
                if($('#editsaveButton').val() == 'Done'){
                    $('li.preconditions-focused').removeClass('preconditions-focused').addClass('preconditions-unfocused');
                    $('li.relationships-focused').removeClass('relationships-focused').addClass('relationships-unfocused');
                    $('li.relations-focused').removeClass('relations-focused').addClass('relations-unfocused');
                    $(this).removeClass('relations-unfocused').addClass('relations-focused');
                }
            });
            callback();
        }
    })
    .fail(function(response) {
        console.log('Error: getEventList');
        window.location = '/error';
    });
}

function deleteEvent(eventID, eventName){
    if (confirm('Are you sure you want to delete: ' + eventName) == true){
        $.post('/datatoserver', {action:'d', table:'event', value: eventID}, function(data, status) {

        })
        .fail(function(response) {
            console.log('Error: deleteMedia');
            window.location = '/error';
        });
        getEventList('adaptation-items', function(){});
    }
}

function deleteMedia(mediaID, mediaDis){
    if (confirm('Are you sure you want to delete: ' + mediaDis) == true){
        $.post('/datatoserver', {action:'d', table:'media', value: mediaID, filepath: $('#embedded-link').val()}, function(data, status) {
            loadMedia($('li.adpt-focused').attr('id'), function(){
                loadMedia($('li.adpt-focused').attr('id'), function(){});
            });
        })
        .fail(function(response) {
            console.log('Error: deleteMedia');
            window.location = '/error';
        });
        tabConfig('tab-media');
    }
}

function deleteCategory(){
    if (confirm('Are you sure you want to category: ' + $('li.category-focused').text()) == true){
        $.post('/datatoserver', {action:'d', table:'category', value: $('li.category-focused').attr('id')}, function(data, status) {
            loadCategories(function(){});

        })
        .fail(function(response) {
            console.log('Error: deleteCategory');
            window.location = '/error';
        });
        $('#category').val('');
    }
}

function deleteRelation(){
    if($('li.preconditions-focused').attr('id')){
        $.post('/datatoserver', {action:'d', table:'relationships', value: $('li.preconditions-focused').attr('id')}, function(data, status) {
            getEventList('relations-items', function(){
                loadRelations($('li.adpt-focused').attr('id'));
            });
        })
        .fail(function(response) {
            console.log('Error: deleteRelation');
            window.location = '/error';
        });
    }
    else if ($('li.relationships-focused').attr('id')) {
        $.post('/datatoserver', {action:'d', table:'relationships', value: $('li.relationships-focused').attr('id')}, function(data, status) {
            getEventList('relations-items', function(){
                loadRelations($('li.adpt-focused').attr('id'));
            });
        })
        .fail(function(response) {
            console.log('Error: deleteRelation');
            window.location = '/error';
        });
    }
}

function loadDiscription(eID) {

    tinymce.init({
        selector: 'textarea',
        browser_spellcheck : true,
        plugins: [
            "advlist autolink link lists print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks fullscreen insertdatetime nonbreaking",
            "contextmenu directionality textcolor paste fullpage textcolor colorpicker textpattern"
        ],
        menubar: false,
        toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink  | insertdatetime preview | forecolor backcolor",
        toolbar3: "hr removeformat | subscript superscript | print fullscreen | ltr rtl | spellchecker"
    });
    $.post('/datafromserver', {action:'q', table:'event', eventid:eID}, function(data, status) {
        var obj = JSON.parse(data);

        $('#adaptationName').val(obj[0].eventName);
        if (obj[0].earliestDirectEvidence !== -1){
            $('#earliestDirectEvidence').val((obj[0].earliestDirectEvidence >= 1000000)? (obj[0].earliestDirectEvidence / 1000000): (obj[0].earliestDirectEvidence / 1000));
            $('#earliestDirectEvidence-units').val((obj[0].earliestDirectEvidence >= 1000000)? 'Ma': 'Ka' );
        }
        if (obj[0].earliestIndirectEvidence !== -1){
            $('#earliestIndirectEvidence').val((obj[0].earliestIndirectEvidence >= 1000000)? (obj[0].earliestIndirectEvidence / 1000000): (obj[0].earliestIndirectEvidence / 1000));
            $('#earliestIndirectEvidence-units').val((obj[0].earliestIndirectEvidence >= 1000000)? 'Ma': 'Ka' );
        }
        $('#ageBoundaryStart').val((obj[0].boundaryStart >= 1000000)? (obj[0].boundaryStart / 1000000): (obj[0].boundaryStart / 1000));
        $('#ageBoundaryStart-units').val((obj[0].boundaryStart >= 1000000)? 'Ma': 'Ka' );
        $('#ageBoundaryEnd').val((obj[0].boundaryEnd >= 1000000)? (obj[0].boundaryEnd / 1000000): (obj[0].boundaryEnd / 1000));
        $('#ageBoundaryEnd-units').val((obj[0].boundaryEnd >= 1000000)? 'Ma': 'Ka' );
        $('#adaptation-category-combo').val(obj[0].category);
    }).fail(function(response) {
        console.log('Error: loadDiscription');
        window.location = '/error';
    });
    $.post('/datafromserver', {action:'q', table:'text', eventid:eID, type:'comments'}, function(data, status) {
        var obj = JSON.parse(data);
        if(data !== '""')
            tinyMCE.get('adaptationComments').setContent(obj);
    }).fail(function(response) {
        console.log('Error: loadDiscription');
        window.location = '/error';
    });
    $.post('/datafromserver', {action:'q', table:'text', eventid:eID, type:'descript'}, function(data, status) {
        var obj = JSON.parse(data);
        if(data !== '""')
            tinyMCE.get('adaptationDescription').setContent(obj);
    }).fail(function(response) {
        console.log('Error: loadDiscription');
        window.location = '/error';
    });
    $.post('/datafromserver', {action:'q', table:'text', eventid:eID, type:'referenc'}, function(data, status) {
        var obj = JSON.parse(data);
        if(data !== '""')
            tinyMCE.get('adaptationReferences').setContent(obj);
    }).fail(function(response) {
        console.log('Error: loadDiscription');
        window.location = '/error';
    });
}

function loadMedia(eID, callback) {
    postFromServer({action:'q', table:'media', eventid:eID} ,function(data, status){
        var obj = JSON.parse(data);
        $('#media-items').empty();
        obj.forEach(function(item){
            $('#media-items').append('<li id=\'' + item.mediaID + '\' class=\'media-unfocused\' >'+ item.mediaDescription + '</li>');
        });
        $('li.media-unfocused').click(function(){
            if($('#editsaveButton').val() == 'Edit'){
                $('li.media-focused').removeClass('media-focused').addClass('media-unfocused');
                $(this).removeClass('media-unfocused').addClass('media-focused');
                loadMediaContent($(this).attr('id'));
            }
        });
        callback();
    });
}

function loadMediaContent(mID) {
    postFromServer({action:'q', table:'media', eventid:$('li.adpt-focused').attr('id')} ,function(data, status){
        var obj = JSON.parse(data);
        obj.forEach(function(item){
            if(item.mediaID == mID){
                $('#mediaDescription').val(item.mediaDescription);
                $('#media-type-combo').val(item.type);
                $('#embedded-link').val(item.mediaPath);
                $(mID).removeClass('media-unfocused').addClass('media-focused');
                if(item.type == 1 || item.type == 2) {
                    $("#image-preview").empty();
                    $("#image-preview").append("<img src=" + item.mediaPath + " class='image-preview'>");
                }
                else if(item.type == 3) {
                    $("#image-preview").empty();
                    $("#image-preview").append(item.mediaPath);
                }
            }
        });
    });
}

function loadRelations(eID){
    postFromServer({action:'q', table:'relationships', eventid: eID}, function(data, status){
        var obj = JSON.parse(data);
        $('#preconditions-items').empty();
        $('#relationships-items').empty();
        $('#r'+$('li.adpt-focused').attr('id')).remove();
        obj.forEach(function(item){
            if(item.precondition == 1)
                $('#preconditions-items').append('<li id=\'' + item.relationshipID + '\' class=\'preconditions-unfocused\' >'+ $('#r'+item.secondaryEventID).text() + '</li>');
            else if(item.precondition == 0)
                $('#relationships-items').append('<li id=\'' + item.relationshipID + '\' class=\'relationships-unfocused\' >'+  $('#r'+item.secondaryEventID).text() + '</li>');
            $('#r'+item.secondaryEventID).remove();
        });
        $('li.relationships-unfocused').click(function(){
            if($('#editsaveButton').val() !== 'Edit'){
                $('li.preconditions-focused').removeClass('preconditions-focused').addClass('preconditions-unfocused');
                $('li.relationships-focused').removeClass('relationships-focused').addClass('relationships-unfocused');
                $('li.relations-focused').removeClass('relations-focused').addClass('relations-unfocused');
                $(this).removeClass('relationships-unfocused').addClass('relationships-focused');
            }
        });
        $('li.preconditions-unfocused').click(function(){
            if($('#editsaveButton').val() !== 'Edit'){
                $('li.preconditions-focused').removeClass('preconditions-focused').addClass('preconditions-unfocused');
                $('li.relationships-focused').removeClass('relationships-focused').addClass('relationships-unfocused');
                $('li.relations-focused').removeClass('relations-focused').addClass('relations-unfocused');
                $(this).removeClass('preconditions-unfocused').addClass('preconditions-focused');
            }
        });
    });
}

function loadCategories(callback) {
    postFromServer({action:'v'} ,function(data, status){
        var obj = JSON.parse(data);
        $('#category-items').empty();
        obj.forEach(function(item){
            if(item.categoryID != 1)
                $('#category-items').append('<li id=\'' + item.categoryID + '\' class=\'category-unfocused\' >'+ item.categoryName + '</li>');
        });
        $('li.category-unfocused').click(function(){
            if($('#editsaveButton').val() == 'Done'){
                $('li.category-focused').removeClass('category-focused').addClass('category-unfocused');
                $(this).removeClass('category-unfocused').addClass('category-focused');
                $('#category').val($(this).text());
            }
        });
        callback();
    });
}

function addRelationship() {
    if($('li.relations-focused').attr('id')){
        var obj = new Array();
        obj.push(Number($('li.adpt-focused').attr('id')));
        obj.push(Number($('li.relations-focused').attr('id').substr(1)));
        obj.push(0);
        postToServer({action:'c', table:'relationship', data:obj}, function(data, status){
            getEventList('relations-items', function(){
                loadRelations($('li.adpt-focused').attr('id'));
            });
        });
    }
}

function addPrecondition() {
    if($('li.relations-focused').attr('id')){
        var obj = new Array();
        obj.push(Number($('li.adpt-focused').attr('id')));
        obj.push(Number($('li.relations-focused').attr('id').substr(1)));
        obj.push(1);
        postToServer({action:'c', table:'relationship', data:obj}, function(data, status){
            getEventList('relations-items', function(){
                loadRelations($('li.adpt-focused').attr('id'));
            });
        });
    }
}

function loadCategoriesDrop(callback) {
    postFromServer({action:'v'}, function(data, status){
        var obj = JSON.parse(data);
        obj.forEach(function(item){
            $('#adaptation-category-combo').append('<option value=\'' + item.categoryID + '\' >'+ item.categoryName + '</option>');
        });
        callback();
    });
}

function searchUI(listID, searchString) {
    $('#'+listID).children().each(function(){
        if(!$(this).text().toLowerCase().includes(searchString.trim().toLowerCase()))
            $(this).remove();
    });
}

function searchUIID(listID, searchID) {
    $('#'+listID).children().each(function(){
        if($(this).attr('id') != searchID)
            $(this).remove();
    });
}

function tabConfig(id) {
    if(tinymce.editors.length > 0)
        tinymce.remove('textarea');
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
            //if(tinymce.editors.length > 0)
            //    tinymce.remove('textarea');
            tinymce.init({
                selector: 'textarea',
                browser_spellcheck : true,
                plugins: [
                    "advlist autolink link lists print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks fullscreen insertdatetime nonbreaking",
                    "contextmenu directionality textcolor paste fullpage textcolor colorpicker textpattern"
                ],
                menubar: false,
                toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink  | insertdatetime preview | forecolor backcolor",
                toolbar3: "hr removeformat | subscript superscript | print fullscreen | ltr rtl | spellchecker"
            });
            loadCategoriesDrop(function(){
                    $('#adaptation-category-combo').val(1);
            });
            break;
        case 'tab-description':
            $('#information-container').empty();
            $('#information-container').append(descriptionPane);

            loadCategoriesDrop(function(){
                if($('li.adpt-focused').attr('id'))
                    loadDiscription($('li.adpt-focused').attr('id'));
                disableEditing(id);
                setupEditButton(id);
            });
            break;
        case 'tab-media':
            $('#information-container').empty();
            $('#information-container').append(mediaPane);
            loadMedia($('li.adpt-focused').attr('id'), function(){});
            disableEditing(id);
            setupEditButton(id);
            $('#addMediaButton').click(function(){
                if($('#editsaveButton').val() == 'Edit')
                    setupEditButton('create-media');
            });
            $('#removeMediaButton').click(function(){
                if ($('li.media-focused').attr('id') && $('#editsaveButton').val() == 'Edit')
                    deleteMedia($('li.media-focused').attr('id'), $('li.media-focused').text());
            });
            $("#media-type-combo").change(function(){
                switch ($('#media-type-combo').val()){
                    case '0':
                        $('#embedded-link').prop('disabled', true);
                        $('#upload-file').prop('disabled', true);
                        break;
                    case '1':
                        $('#embedded-link').prop('disabled', true);
                        $('#upload-file').prop('disabled', false);
                        break;
                    default:
                        $('#embedded-link').prop('disabled', false);
                        $('#upload-file').prop('disabled', true);
                }
            });
            break;
        case 'tab-relations':
            $('#information-container').empty();
            $('#information-container').append(relationsPane);
            getEventList('relations-items', function(){
                loadRelations($('li.adpt-focused').attr('id'));
            });
            $('#relations-searchbutton').click(function(){
                getEventList('relations-items', function(){
                    $('#r'+$('li.adpt-focused').attr('id')).remove();
                    loadRelations($('li.adpt-focused').attr('id'));
                    if ($('#relations-searchbar-text').val() != '')
                        searchUI('relations-items', $('#relations-searchbar-text').val());
                });
            });
            $('#add-to-preconditions').click(function(){
                addPrecondition();
            });
            $('#add-to-relationships').click(function(){
                addRelationship();
            });
            $('#remove-from-list').click(function(){
                deleteRelation();
            });
            disableEditing(id);
            setupEditButton(id);

            break;
        case 'category':
            $('#information-container').empty();
            $('#information-container').append(categoryPane);
            loadCategories(function(){});
            $('li.adpt-focused').removeClass('adpt-focused').addClass('adpt-unfocused');
            $('#editsaveButton').val('Done');
            $('#editsaveButton').click(function(){
                tabConfig('firstLoad');
            });
            $('#addCategoryButton').click(function(){
                $('li.category-focused').removeClass('category-focused').addClass('category-unfocused');
                $('#category').val('');
                $('#updateCategoryButton').val('Save');
            });
            $('#removeCategoryButton').click(function(){
                deleteCategory();
            });
            $('#updateCategoryButton').click(function(){
                if($('#updateCategoryButton').val() == 'Save'){
                    saveValues('category');
                    $('#updateCategoryButton').val('Update');
                    loadCategories(function(){
                        loadCategories(function(){
                            $($('li.category-unfocused').contains($('#category').val())).removeClass('category-unfocused').addClass('category-focused');

                        });
                    });
                }
                if($('#updateCategoryButton').val() == 'Update')
                    updateValues('category');
                    $('#category').val('');
                    loadCategories(function(){
                        $($('li.category-unfocused').contains($('#category').val())).removeClass('category-unfocused').addClass('category-focused');
                    });
            });


            break;
        case 'sequence':
            $('#information-container').empty();
            $('#information-container').append(sequencePane);
            loadCategories(function(){});
            $('li.adpt-focused').removeClass('adpt-focused').addClass('adpt-unfocused');
            $('#editsaveButton').val('Done');
            $('#editsaveButton').click(function(){
                tabConfig('firstLoad');
            });
            $('#addsequenceButton').click(function(){
                $('li.sequence-focused').removeClass('sequence-focused').addClass('sequence-unfocused');
                $('#sequence').val('');
                $('#updatesequenceButton').val('Save');
            });
            $('#removesequenceButton').click(function(){
                deletesequence();
            });
            $('#updatesequenceButton').click(function(){
                if($('#updatesequenceButton').val() == 'Save'){
                    saveValues('sequence');
                    $('#updatesequenceButton').val('Update');
                    loadCategories(function(){
                        loadCategories(function(){
                            $($('li.sequence-unfocused').contains($('#sequence').val())).removeClass('sequence-unfocused').addClass('sequence-focused');

                        });
                    });
                }
                if($('#updatesequenceButton').val() == 'Update')
                    updateValues('sequence');
                    $('#sequence').val('');
                    loadCategories(function(){
                        $($('li.sequence-unfocused').contains($('#sequence').val())).removeClass('sequence-unfocused').addClass('sequence-focused');
                    });
            });


            break;
        default:
            console.log('Error: tabConfig');
            window.location = '/error';
    }
}

function setupEditButton(id) {
    switch (id) {
        case 'create-description':
            $('#save-edit-container').append(cancelButton);
            $('#editsaveButton').val('Save');
            $('#cancelButton').click(function(){
                if (confirm('Are you sure you want to discard changes?') == true) {
                    tabConfig('firstLoad');
                    disableEditing('tab-description');
                    $('#editsaveButton').val('Edit');
                    $('#cancelButton').remove();
                }
            });
            $('#editsaveButton').click(function(){
                if(dataCheck('tab-description')){
                    saveValues('tab-description', function(data, status){
                        getEventList('adaptation-items', function(){
                            searchUIID('adaptation-items', data);
                            $('#' + data).removeClass('adpt-unfocused').addClass('adpt-focused');
                            tabConfig('tab-description');
                        });

                    });
                    disableEditing('tab-description');
                    $('#editsaveButton').val('Edit');
                    $('#cancelButton').remove();
                }
            });
            break;
        case 'tab-description':
            $('#editsaveButton').click(function(){
                if($('#editsaveButton').val() == 'Edit'){
                    $('#save-edit-container').append(cancelButton);
                    $('#editsaveButton').val('Save');
                    enableEditing('tab-description');
                    $('#cancelButton').click(function(){
                        if (confirm('Are you sure you want to discard changes?') == true)
                            tabConfig('tab-description');
                    });
                }
                else{
                    if(dataCheck('tab-description')){
                        var tempId = $('li.adpt-focused').attr('id');
                        updateValues('tab-description', function(data, status){});
                        tabConfig('tab-description');
                        getEventList('adaptation-items', function(){
                            $('#' + tempId).removeClass('adpt-unfocused').addClass('adpt-focused');
                            loadDiscription(tempId);
                        });
                    }
                }
            });
            break;
        case 'create-media':
            $('#save-edit-container').append(cancelButton);
            $('#cancelButton').click(function(){
                if (confirm('Are you sure you want to discard changes?') == true)
                    tabConfig('tab-media');
            });
            $('#editsaveButton').click(function(){
                if(dataCheck('tab-media')){
                    $('#cancelButton').remove();
                    $('#editsaveButton').val('Edit');
                    disableEditing('tab-media');
                    $('#editsaveButton').off('click');
                    if($('#media-type-combo').val() == 1){
                        var fd = new FormData();
                        fd.append("picture", $("#upload-file")[0].files[0]);
                        $.ajax({
                            url: "upload",
                            type: "POST",
                            data: fd,
                            contentType: false,
                            processData: false,
                            success: function (data, status) {
                                console.log(status);
                                if(status === 'success'){
                                    $('#embedded-link').val(data.replace(/"/g,''));
                                    saveValues('tab-media', function(data, status){
                                        setupEditButton('tab-media');
                                        loadMedia($('li.adpt-focused').attr('id'), function(){$('#' + data).removeClass('media-unfocused').addClass('media-focused');});
                                        loadMediaContent(data);
                                    });
                                }
                                else{
                                    alert("Upload Failed");
                                }
                            }
                        });
                    }
                    else{
                        saveValues('tab-media', function(data, status){
                            setupEditButton('tab-media');
                            loadMedia($('li.adpt-focused').attr('id'), function(){
                                $('#' + data).removeClass('media-unfocused').addClass('media-focused');
                            });
                            loadMediaContent(data);
                        });
                    }
                }
            });
            $('#editsaveButton').val('Save');
            $('#mediaDescription').val('');
            $('#media-type-combo').val(0);
            $('#embedded-link').val('');
            $('li.media-focused').removeClass('media-focused').addClass('media-unfocused');
            $("#image-preview").empty();
            enableEditing('tab-media');
            break;
        case 'tab-media':
            $('#editsaveButton').click(function(){
                if($('#editsaveButton').val() == 'Edit' && $('li.media-focused').attr('id')){
                    $('#save-edit-container').append(cancelButton);
                    $('#editsaveButton').val('Save');
                    if($('#media-type-combo').val() == 1)
                        enableEditing('tab-media-upload');
                    else
                        enableEditing('tab-media');
                    $('#cancelButton').click(function(){
                        if (confirm('Are you sure you want to discard changes?') == true){
                            $('#cancelButton').remove();
                            $('#editsaveButton').val('Edit');
                            disableEditing('tab-media');
                            loadMediaContent($('li.media-focused').attr('id'));
                        }
                    });
                }
                else if ($('#editsaveButton').val() !== 'Edit' && $('li.media-focused').attr('id')){
                    if(dataCheck('tab-media')){
                        $('#cancelButton').remove();
                        $('#editsaveButton').val('Edit');
                        disableEditing('tab-media');
                        var tempId = $('li.media-focused').attr('id');

                        if($('#media-type-combo').val() == 1 && $("#upload-file")[0].files[0] != undefined){
                            var fd = new FormData();
                            fd.append("picture", $("#upload-file")[0].files[0]);
                            $.ajax({
                                url: "upload",
                                type: "POST",
                                data: fd,
                                contentType: false,
                                processData: false,
                                success: function (data, status) {
                                    console.log(status);
                                    if(status === 'success'){
                                        $('#embedded-link').val(data.replace(/"/g,''));
                                        updateValues('tab-media', function(data, status){
                                            loadMediaContent(tempId);
                                            loadMedia($('li.adpt-focused').attr('id'), function(){
                                                $('#'+tempId).removeClass('media-unfocused').addClass('media-focused');
                                            });
                                        });
                                    }
                                    else{
                                        alert("Upload Failed");
                                    }
                                }
                            });
                        }
                        else{
                            updateValues('tab-media', function(data, status){
                                loadMediaContent(tempId);
                                loadMedia($('li.adpt-focused').attr('id'), function(){
                                    $('#'+tempId).removeClass('media-unfocused').addClass('media-focused');
                                });
                            });
                        }
                    }
                }
            });
            break;
        case 'tab-relations':
            $('#editsaveButton').click(function(){
                if($('#editsaveButton').val() !== 'Done'){
                    $('#editsaveButton').val('Done');
                    enableEditing('tab-relations');
                }
                else{
                    if(dataCheck('tab-relations')){
                        $('#editsaveButton').val('Edit');
                        disableEditing('tab-relations');
                        $('li.preconditions-focused').removeClass('preconditions-focused').addClass('preconditions-unfocused');
                        $('li.relationships-focused').removeClass('relationships-focused').addClass('relationships-unfocused');
                        $('li.relations-focused').removeClass('relations-focused').addClass('relations-unfocused');
                    }
                }
            });
            break;
        default:
            console.log('Error: setupEditButton');
            window.location = '/error';
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
            tinyMCE.get('adaptationComments').getBody().setAttribute('contenteditable', true);
            tinyMCE.get('adaptationDescription').getBody().setAttribute('contenteditable', true);
            tinyMCE.get('adaptationReferences').getBody().setAttribute('contenteditable', true);
            break;
        case 'tab-media':

            $('#mediaDescription').prop('disabled', false);
            $('#embedded-link').prop('disabled', false);
            $('#media-type-combo').prop('disabled', false);

            break;
        case 'tab-media-upload':
            $('#mediaDescription').prop('disabled', false);
            break;
        case 'tab-relations':
            $('#add-to-preconditions').prop('disabled', false);
            $('#add-to-relationships').prop('disabled', false);
            $('#remove-from-list').prop('disabled', false);
            break;
        default:
            console.log('Error: enableEditing');
            window.location = '/error';
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
            tinyMCE.get('adaptationComments').getBody().setAttribute('contenteditable', false);
            tinyMCE.get('adaptationDescription').getBody().setAttribute('contenteditable', false);
            tinyMCE.get('adaptationReferences').getBody().setAttribute('contenteditable', false);
            break;
        case 'tab-media':
            $('#mediaDescription').prop('disabled', true);
            $('#media-type-combo').prop('disabled', true);
            $('#embedded-link').prop('disabled', true);
            $('#upload-file').prop('disabled', true);
            break;
        case 'tab-relations':
            $('#add-to-preconditions').prop('disabled', true);
            $('#add-to-relationships').prop('disabled', true);
            $('#remove-from-list').prop('disabled', true);

            break;
        default:
            console.log('Error: disableEditing');
            window.location = '/error';
    }
}

function dataCheck(id) {
    switch (id) {
        case 'tab-description':
            if(!$('#adaptationName').val()){
                alert('You need to add an Adaptation Name.');
                return false;
            }
            else if(!$('#earliestDirectEvidence').val() && !$('#earliestIndirectEvidence').val()){
                alert('You need to add Earliest Direct Evidence or Earliest Indirect Evidence.');
                return false;
            }
            else if(isNaN(Number( $('#earliestDirectEvidence').val())) || isNaN(Number($('#earliestIndirectEvidence').val()))){
                alert('Earliest Direct Evidence or Earliest Indirect Evidence must be a number.');
                return false;
            }
            else if(!$('#ageBoundaryStart').val()){
                alert('You need to add Age Boundary Start.');
                return false;
            }
            else if(isNaN(Number($('#ageBoundaryStart').val()))){
                alert('Age Boundary Start must be a number.');
                return false;
            }
            else if(!$('#ageBoundaryEnd').val()){
                alert('You need to add Age Boundary End.');
                return false;
            }
            else if(isNaN(Number($('#ageBoundaryEnd').val()))){
                alert('Age Boundary End must be a number.');
                return false;
            }
            else
                return true;
            break;
        case 'tab-media':
            if(!$('#mediaDescription').val()){
                alert('You need to add a Media Description.');
                return false;
            }
            else if($('#media-type-combo').val() == 0){
                alert('You need to select a Media Type.');
                return false;
            }
            else if(!$('#embedded-link').val() && $('#media-type-combo').val() > 1){
                alert('You need to add an Embedded Link');
                return false;
            }
            else if(!$('#upload-file').val() && $('#media-type-combo').val() < 1){
                alert('You need to Upload a File');
                return false;
            }
            else{
                return true;
            }
            break;
        case 'tab-relations':
            return true;
            break;
        default:
            console.log('Error: dataCheck');
            return false;
    }
}

function saveValues(id, callback) {
    var obj = new Array();
    switch (id) {
        case 'tab-description':
            obj.push($('#adaptationName').val());
            if (!Number($('#earliestDirectEvidence').val()))
                obj.push(-1);
            else
                obj.push(Number($('#earliestDirectEvidence').val())*(($('#earliestDirectEvidence-units').val() == 'Ma')? 1000000: 1000));
            if (!Number($('#earliestIndirectEvidence').val()))
                obj.push(-1);
            else
                obj.push(Number($('#earliestIndirectEvidence').val())*(($('#earliestIndirectEvidence-units').val() == 'Ma')? 1000000: 1000))
            obj.push(Number($('#ageBoundaryStart').val())*(($('#ageBoundaryStart-units').val() == 'Ma')? 1000000: 1000));
            obj.push(Number($('#ageBoundaryEnd').val())*(($('#ageBoundaryEnd-units').val() == 'Ma')? 1000000: 1000));
            obj.push($('#adaptation-category-combo').val());
            obj.push(tinyMCE.get('adaptationDescription').getContent());
            obj.push(tinyMCE.get('adaptationReferences').getContent());
            obj.push(tinyMCE.get('adaptationComments').getContent());
            postToServer({action:'c', table:'event', data:obj}, callback);
            break;
        case 'tab-media':
            obj.push($('#embedded-link').val());
            obj.push($('#mediaDescription').val());
            obj.push($('#media-type-combo').val());
            obj.push($('li.adpt-focused').attr('id'));
            postToServer({action:'c', table:'media', data:obj}, callback);
            break;
        case 'category':
            postToServer({action:'c', table:'category', data:$('#category').val()}, callback);
            $('#category').val('');
            break;
        default:
            console.log('Error: saveValues');
            window.location = '/error';
    }
}

function updateValues(id, callback) {
    var obj = new Array();
    switch (id) {
        case 'tab-description':
            obj.push($('#adaptationName').val());
            if (!Number($('#earliestDirectEvidence').val()))
                obj.push(-1);
            else
                obj.push(Number($('#earliestDirectEvidence').val())*(($('#earliestDirectEvidence-units').val() == 'Ma')? 1000000: 1000));
            if (!Number($('#earliestIndirectEvidence').val()))
                obj.push(-1);
            else
                obj.push(Number($('#earliestIndirectEvidence').val())*(($('#earliestIndirectEvidence-units').val() == 'Ma')? 1000000: 1000))
            obj.push(Number($('#ageBoundaryStart').val())*(($('#ageBoundaryStart-units').val() == 'Ma')? 1000000: 1000));
            obj.push(Number($('#ageBoundaryEnd').val())*(($('#ageBoundaryEnd-units').val() == 'Ma')? 1000000: 1000));
            obj.push($('#adaptation-category-combo').val());
            obj.push(tinyMCE.get('adaptationDescription').getContent());
            obj.push(tinyMCE.get('adaptationReferences').getContent());
            obj.push(tinyMCE.get('adaptationComments').getContent());
            postToServer({action:'u', table:'event', key:$('li.adpt-focused').attr('id'), data:obj}, callback);
            break;
        case 'tab-media':
            obj.push($('#embedded-link').val());
            obj.push($('#mediaDescription').val());
            obj.push($('#media-type-combo').val());
            postToServer({action:'u', table:'media', key:$('li.media-focused').attr('id'), data:obj}, callback);

            break;
        case 'category':
            postToServer({action:'u', table:'category', key:$('li.category-focused').attr('id'), data:$('#category').val()}, callback);
            break;
        default:
            console.log('Error: updateValues');
            window.location = '/error';
    }
}

function postToServer(object, callback) {
    $.post('/datatoserver', object, function(data, status){callback(data, status);})
    .fail(function(response) {
        console.log('Error: postToServer');
        window.location = '/error';
    });
}
function postFromServer(object, callback) {
    $.post('/datafromserver', object, function(data, status){callback(data, status);})
    .fail(function(response) {
        console.log('Error: postFromServer');
        window.location = '/error';
    });
}

// Inital page loading
$('#adaptation-items').ready(function(){
    getEventList('adaptation-items', function(){});
});
$('#information-container').ready(function(){tabConfig('firstLoad');});
$('#tabs').ready(function(){
    $('li.nonactive').click(function(){
        if(!$(this).hasClass('active')){
            if($('li.adpt-focused').attr('id') && $('#editsaveButton').val() == 'Edit'){
                tabConfig($(this).attr('id'));
            }
        }
    });
});
$('#mainsearchbutton').ready(function() {
    $('#mainsearchbutton').click(function(){
        if($('#editsaveButton').val() == 'Edit'){
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
        if ($('li.adpt-focused').attr('id') && $('#editsaveButton').val() == 'Edit'){
            deleteEvent($('li.adpt-focused').attr('id'), $('li.adpt-focused').text());
            getEventList('adaptation-items', function(){
                getEventList('adaptation-items', function(){});
            });
            tabConfig('firstLoad');
        }
    });
});
$('#createAdaptationButton').ready(function(){
    $('#createAdaptationButton').click(function(){
        if($('#editsaveButton').val() == 'Edit'){
            tabConfig('create-description');
            enableEditing('tab-description');
            setupEditButton('create-description');
        }
    });
});
$('#category-button').ready(function(){
    $('#category-button').click(function(){
        if($('#editsaveButton').val() == 'Edit'){
            tabConfig('category');
        }
    });
});
$('#sequence-button').ready(function(){
    $('#sequence-button').click(function(){
        if($('#editsaveButton').val() == 'Edit'){
            tabConfig('sequence');
        }
    });
});
