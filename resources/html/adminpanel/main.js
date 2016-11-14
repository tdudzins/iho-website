// gets all the event data and adds it to the list on the left
function loadEventList() {
    $.post("/datafromserver", {action:"t"}, function(data, status) {
        var obj = JSON.parse(data);
        $("#adaptation-items").empty();
        obj.forEach(function(item){
            $("#adaptation-items").append("<li id=\"" + item.eventID + "\" class=\"adpt-unfocused\" >"+ item.eventName + "</li>");
        });
        $("li.adpt-unfocused").click(function(){
            $("li.adpt-focused").removeClass("adpt-focused").addClass("adpt-unfocused");
            $(this).removeClass("adpt-unfocused").addClass("adpt-focused");
            updateDiscription($(this).attr("id"));
        });
    })
    .fail(function(response) {
        console.log("Failed to load data");
        window.location = "/error";
    });
}

function updateDiscription(eID) {
    $.post("/datafromserver", {action:"q", table:"event", eventid: eID}, function(data, status) {
        var obj = JSON.parse(data);
        console.log(data);
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
    if (id === 'none') {
        $("li.active").removeClass("active").addClass("tab-content");
    }
    else{
        $('#'+id).removeClass("tab-content").addClass("active");
        $("li.active").removeClass("active").addClass("tab-content");
        switch (id) {
            case 'tab-description':

                break;
            case 'tab-media':

                break;
            case 'tab-relations':

                break;
            default:

        }
    }
}

$("#adaptation-items").ready(loadEventList);

$("#tabs").ready(function(){
    $("li.tab-content").click(function(){
        tabConfig($(this).attr("id"));
    });
    tabConfig("none");
});
