function loadEventList() {
    $.post("/datafromserver", {action:"t"}, function(data, status) {
        var obj = JSON.parse(data);
        $("#adaptation-items").empty();
        obj.forEach(function(item){
            $("#adaptation-items").append("<li id=\"" + item.eventID + "\" class=\"adpt-unfocused\" >"+ item.eventName + "</li>");
        });
        setEventListners();
    })
    .fail(function(response) {
        console.log("Failed to load data");
        window.location = "/error";
    });

}
function setEventListners() {
    $("li.adpt-unfocused").click(function(){
        $("li.adpt-focused").removeClass("adpt-focused").addClass("adpt-unfocused");
        $(this).removeClass("adpt-unfocused").addClass("adpt-focused");
        setEventListners();
    });
}

$("#adaptation-items").ready(loadEventList);
