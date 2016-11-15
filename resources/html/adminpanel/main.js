// gets all the event data and adds it to the list on the left
function getEventList(listID, callback) {
    $.post("/datafromserver", {action:"t"}, function(data, status) {
        var obj = JSON.parse(data);
        var htmlString = '';
        if(listID == "adaptation-items"){
            $("#adaptation-items").empty();
            obj.forEach(function(item){
                $("#adaptation-items").append("<li id=\"" + item.eventID + "\" class=\"adpt-unfocused\" >"+ item.eventName + "</li>");
            });
            $("li.adpt-unfocused").click(function(){
                $("li.adpt-focused").removeClass("adpt-focused").addClass("adpt-unfocused");
                $(this).removeClass("adpt-unfocused").addClass("adpt-focused");
                loadDiscription($(this).attr("id"));
                tabConfig("tab-description");
            });
            callback();
        }
        else {
            $("#relations-items").empty();
            obj.forEach(function(item){
                $("#relations-items").append("<li id=\"" + item.eventID + "\" class=\"relations-unfocused\" >"+ item.eventName + "</li>");
            });
            $("li.relations-unfocused").click(function(){
                $("li.relations-focused").removeClass("relations-focused").addClass("relations-unfocused");
                $(this).removeClass("relations-unfocused").addClass("relations-focused");
            });
            callback();
        }
    })
    .fail(function(response) {
        console.log("Failed to load data");
        window.location = "/error";
    });
}

function loadDiscription(eID) {
    $.post("/datafromserver", {action:"q", table:"event", eventid: eID}, function(data, status) {
        var obj = JSON.parse(data);
        $("#adaptationName").val(obj[0].eventName);
        $("#earliestDirectEvidence").val((obj[0].earliestDirectEvidence > 1000000)? obj[0].earliestDirectEvidence / 1000000: obj[0].earliestDirectEvidence / 1000);
        $("#earliestDirectEvidence-units").val((obj[0].earliestDirectEvidence > 1000000)? "Ma": "Ka" );
        $("#earliestIndirectEvidence").val((obj[0].earliestIndirectEvidence > 1000000)? obj[0].earliestIndirectEvidence / 1000000: obj[0].earliestIndirectEvidence / 1000);
        $("#earliestIndirectEvidence-units").val((obj[0].earliestIndirectEvidence > 1000000)? "Ma": "Ka" );
        $("#ageBoundaryStart").val((obj[0].boundaryStart > 1000000)? obj[0].boundaryStart / 1000000: obj[0].boundaryStart / 1000);
        $("#ageBoundaryStart-units").val((obj[0].boundaryStart > 1000000)? "Ma": "Ka" );
        $("#ageBoundaryEnd").val((obj[0].boundaryEnd > 1000000)? obj[0].boundaryEnd / 1000000: obj[0].boundaryEnd / 1000);
        $("#ageBoundaryEnd-units").val((obj[0].boundaryEnd > 1000000)? "Ma": "Ka" );
        $("#adaptationCategory").val(obj[0].category);
        $("#adaptationDescription").val(obj[0].description);
        $("#adaptationComments").val(obj[0].comments);
        $("#adaptationReferences").val(obj[0].reference);
    })
    .fail(function(response) {
        console.log("Failed to load data");
        window.location = "/error";
    });

}

function tabConfig(id) {
    $("li.active").removeClass("active").addClass("nonactive");
    $('#'+id).removeClass("nonactive").addClass("active");
    switch (id) {
        case 'firstLoad':
            $("#information-container").empty();
            $("#information-container").append(firstLoadPane);
            break;
        case 'tab-description':
            $("#information-container").empty();
            $("#information-container").append(descriptionPane);
            loadDiscription($("li.adpt-focused").attr("id"));
            break;
        case 'tab-media':
            $("#information-container").empty();
            $("#information-container").append(mediaPane);

            break;
        case 'tab-relations':
            $("#information-container").empty();
            $("#information-container").append(relationsPane);

            break;
        default:

    }
}

function searchUI(listID, searchString) {
    $("#"+listID).children().each(function(){
        if(!$(this).text().toLowerCase().includes(searchString.trim().toLowerCase()))
            $(this).remove();
    });

}

// Inital page loading
$("#adaptation-items").ready(function(){
    getEventList("adaptation-items", function(){

    });
});
$("#information-container").ready(function(){tabConfig("firstLoad");});
$("#tabs").ready(function(){
    $("li.nonactive").click(function(){
        if($("li.adpt-focused").attr("id"))
            tabConfig($(this).attr("id"));
    });
});
$("#mainsearchbutton").ready(function() {
    $("#mainsearchbutton").click(function(){
        tabConfig("firstLoad");
        getEventList("adaptation-items", function(){
        if ($("#mainsearchbar-text").val() != "")
            searchUI("adaptation-items", $("#mainsearchbar-text").val());
        });
    });
});
