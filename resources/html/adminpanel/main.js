function loadEventList() {
    $.post("/datafromserver", {action:"t"}, function(data, status) {
        console.log(data);
        var obj = JSON.parse(data);
    })
    .fail(function(response) {
        console.log("Failed to load data");
        //window.location = "/error";
    });
}
$.post("/datatoserver",
{action:"c",
 table:"event", data:["e2","text", 1000000, 100000000, 123, 1234, "reference", "comments", 1]}, function(data, status) {
    console.log(data);
})
.fail(function(response) {
    console.log("Failed to load data");
    //window.location = "/error";
});
$("#adaptation-items").ready(loadEventList);
