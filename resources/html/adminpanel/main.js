function loadEventList() {
    $.post("/datafromserver", {action:"t"}, function(data, status) {
        var obj = JSON.parse(data);
        $("#adaptation-items").empty();
        obj.forEach(function(item){
            $("#adaptation-items").append("<li id=\"" + item.eventID + "\" class=\"adpt-unfocused\" >"+ item.eventName + "</li>");
        });
        setAdptEventListners();
    })
    .fail(function(response) {
        console.log("Failed to load data");
        window.location = "/error";
    });
}
function setAdptEventListners() {
    $("li.adpt-unfocused").click(function(){
        $("li.adpt-focused").removeClass("adpt-focused").addClass("adpt-unfocused");
        $(this).removeClass("adpt-unfocused").addClass("adpt-focused");
        updateDiscription($(this).attr("id"));
        setAdptEventListners();
    });
}

function updateDiscription(eID) {
    $.post("/datafromserver", {action:"q", table:"event", eventid: eID.toFixed(0)}, function(data, status) {
        var obj = JSON.parse(data);

        $("#adaptation-items").empty();
        obj.forEach(function(item){
            $("#adaptation-items").append("<li id=\"" + item.eventID + "\" class=\"adpt-unfocused\" >"+ item.eventName + "</li>");
        });
        setAdptEventListners();
    })
    .fail(function(response) {
        console.log("Failed to load data");
        window.location = "/error";
    });

}

$("#adaptation-items").ready(loadEventList);
