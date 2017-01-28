// Event Listeners
$('#adaptation-items').ready(function(){
    getEventList(function(){});
});

// Functions
function getEventList(callback) {
    $.post('/datafromserver', {action:'t'}, function(data, status) {
        var obj = JSON.parse(data);
        $('#adaptation-items').empty();
        obj.forEach(function(item){
            $('#adaptation-items').append('<li id=\'' + item.eventID + '\' class=\'adaptation-item-unselected\' >'+ item.eventName + '</li>');
        });
        $('li.adaptation-item-unselected').click(function(){

        });
        callback();
    })
    .fail(function(response){
        console.log('Error: getEventList');
    });
}

function postFromServer(object, callback) {
    $.post('/datafromserver', object, function(data, status){callback(data, status);})
    .fail(function(response) {
        console.log('Error: postFromServer');
        window.location = '/error';
    });
}

function getEventandRelations(eventID){

}
