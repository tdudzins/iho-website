// Event Listeners
createArrays();
$('#adaptation-items').ready(function(){
    getEventList(function(){});
});

// Functions

function getEventList(callback) {
    serverPost({action:'t'}, function(data, status){
        var obj = JSON.parse(data);
        $('#adaptation-items').empty();
        obj.forEach(function(item){
            $('#adaptation-items').append('<li id=\'' + item.eventID + '\' class=\'adaptation-item-unselected\' >'+ item.eventName + '</li>');
        });

        $('li.adaptation-item-unselected').click(function(){
            // Unselect
            if($(this).hasClass('adaptation-item-selected')){
                $(this).removeClass('adaptation-item-selected').addClass('adaptation-item-unselected');
                removeAdaption($(this).attr('id'), function(){
                    //TODO call remove from timeline and discard data redraw
                });

            }
            // Select
            else{
                $(this).removeClass('adaptation-item-unselected').addClass('adaptation-item-selected');
                addAdaption($(this).attr('id'), function(){
                    //TODO box creation and data redraw
                });
            }
        });
        callback();
    });
}

function addAdaption(eventID, callback){
    serverPost({action:"s", eventid:eventID}, function(data, status){
        var obj = JSON.parse(data);
        var adaptArray = JSON.parse(sessionStorage.getItem("adaptArray"));
        var adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
        var relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
        var empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));
        obj.forEach(function(item){
            if(adaptObj[item.eventID] === undefined){
                adaptObj[item.eventID] = [item.eventName, item.earliestDirectEvidence, item.boundaryStart, item.boundaryEnd, 0];
            }
            else{
                adaptObj[item.eventID][4]++;
            }
            //add to adaptTable
            //check if precondition array
            //else add to empiricalTable
        });
        sessionStorage.setItem("adaptArray", JSON.stringify(adaptArray));
        sessionStorage.setItem("adaptObj", JSON.stringify(adaptObj));
        sessionStorage.setItem("relationsObj", JSON.stringify(relationsObj));
        sessionStorage.setItem("empiricalTable", JSON.stringify(empiricalTable));
        callback();
    });
}

function removeAdaption(eventID, callback){

    callback();
}

// Server interaction functions
function serverPost(object, callback) {
    $.post('/datafromserver', object, function(data, status){callback(data, status);})
    .fail(function(response) {
        console.log('Error: postFromServer');
    });
}

// Local storage creation
function createArrays() {
    if (typeof(Storage) !== "undefined"){
        sessionStorage.setItem("adaptArray", "[]"); // [[eventID, eventID],[],[]....] sortedArray
        sessionStorage.setItem("adaptObj", "{}"); // {eventID:[eventName, earliestDirectEvidence, start, end, count],[],[]....} obj
        sessionStorage.setItem("relationsObj", "{}"); // {eventID:[{id:relationID,precondition:precondition}],....} obj
        sessionStorage.setItem("empiricalTable", "[]"); // [[eventID, eventName, earliestDirectEvidence],[],[]....] array
        sessionStorage.setItem("empiricalBox", "[]"); // [[x,y,length,height,textsize,text[],eventID], .....] array sorted
        sessionStorage.setItem("boxLocation", "[]"); // [[x,y,length,height,textsize,text[],eventID], .....] array sorted
    }
    else{
        console.log("Sorry! No Web Storage support..");
    }
}
