function loadEventList() {
    $.post("/datafromserver", {action:"t"}, function(data, status) {
        console.log(data);
        var obj = JSON.parse(data);
        $("#adaptation-items").empty();
        obj.forEach(function(item){
            $("#adaptation-items").append("<li id=\"" + item.eventID + ">"+ item.eventName + "</li>");
        });

    })
    .fail(function(response) {
        console.log("Failed to load data");
        window.location = "/error";
    });
}
$("#adaptation-items").ready(loadEventList);
