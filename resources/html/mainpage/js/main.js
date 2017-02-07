// Event Listeners
createArrays();
$(document).ready(function() {
    initCanvas();
});
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
            var relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
            // Unselect
            if($(this).hasClass('adaptation-item-selected') && relationsObj[$(this).attr('id')] !== undefined){
                $(this).removeClass('adaptation-item-selected').addClass('adaptation-item-unselected');
                //TODO remove empirical boxes
                removeHypoAdaptation($(this).attr('id'), function(eid){
                    removeAdaption(eid, function(){});
                });
            }
            // Select
            else if($(this).hasClass('adaptation-item-unselected') && relationsObj[$(this).attr('id')] === undefined){
                $(this).removeClass('adaptation-item-unselected').addClass('adaptation-item-selected');
                getAdaption($(this).attr('id'), function(eid){
                    addHypoAdaptation(eid);
                    //TODO Add empirical boxes
                });
            }
        });

        callback();
    });
}
function getAdaption(eventID, callback){
    serverPost({action:"s", eventid:eventID}, function(data, status){
        var obj = JSON.parse(data);
        var adaptArray = JSON.parse(sessionStorage.getItem("adaptArray"));
        var adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
        var relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
        var empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));
        relationsObj[eventID] = [];
        obj.forEach(function(item){
            if(adaptObj[item.eventID] === undefined){
                adaptObj[item.eventID] = [item.eventName, (item.earliestDirectEvidence > 0)?item.earliestDirectEvidence : item.earliestindirectEvidence, item.boundaryStart, item.boundaryEnd, 0];
                adaptArray.push(item.eventID);
            }
            else{
                adaptObj[item.eventID][4]++;
            }

            if(item.eventID != eventID){
                relationsObj[eventID].push([item.eventID, item.precondition]);
            }
            else{
                empiricalTable.push([eventID, item.eventName, (item.earliestDirectEvidence > 0)?item.earliestDirectEvidence : item.earliestindirectEvidence]);
            }
        });
        adaptArray.sort();
        empiricalTable.sort();
        sessionStorage.setItem("adaptArray", JSON.stringify(adaptArray));
        sessionStorage.setItem("adaptObj", JSON.stringify(adaptObj));
        sessionStorage.setItem("relationsObj", JSON.stringify(relationsObj));
        sessionStorage.setItem("empiricalTable", JSON.stringify(empiricalTable));
        callback(eventID);
    });
}
function removeAdaption(eventID, callback){
    var adaptArray = JSON.parse(sessionStorage.getItem("adaptArray"));
    var adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
    var relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
    var empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));
    for(var i = 0; i < empiricalTable.length; i++){
        if(empiricalTable[i][0] === eventID){
            empiricalTable.splice(i, 1);
            i = empiricalTable.length;
        }
    }
    for(var i = 0; i < empiricalTable.length; i++){
        if(empiricalTable[i][0] === eventID){
            empiricalTable.splice(i, 1);
            i = empiricalTable.length;
        }
    }
    relationsObj[eventID].forEach(function(item){
        if (adaptObj[item[0]][4] === 0) {
            delete adaptObj[item[0]];
            for(var i = 0; i < adaptArray.length; i++){
                if(adaptArray[i] === item[0]){
                    adaptArray.splice(i, 1);
                    i = adaptArray.length;
                }
            }
        }
        else {
            adaptObj[item[0]][4]--;
        }
    });
    delete relationsObj[eventID];

    if (adaptObj[eventID][4] === 0) {
        delete adaptObj[eventID];
        for(var i = 0; i < adaptArray.length; i++){
            if(adaptArray[i] == eventID){
                adaptArray.splice(i, 1);
                i = adaptArray.length;
            }
        }
    }
    else {
        adaptObj[eventID][4]--;
    }

    sessionStorage.setItem("adaptArray", JSON.stringify(adaptArray));
    sessionStorage.setItem("adaptObj", JSON.stringify(adaptObj));
    sessionStorage.setItem("relationsObj", JSON.stringify(relationsObj));
    sessionStorage.setItem("empiricalTable", JSON.stringify(empiricalTable));
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
        sessionStorage.setItem("adaptArray", "[]"); // [eventID, eventID, ...] sortedArray
        sessionStorage.setItem("adaptObj", "{}"); // {eventID:[eventName, earliestDirectEvidence, start, end, count],[],[]....} obj
        sessionStorage.setItem("relationsObj", "{}"); // {eventID:[{id:relationID,precondition:precondition}],....} obj
        sessionStorage.setItem("empiricalTable", "[]"); // [[eventID, eventName, earliestDirectEvidence],[],[]....] array
        sessionStorage.setItem("empiricalBox", "[]"); // [[x,y,length,height,text[],eventID], .....] array sorted
        sessionStorage.setItem("boxLocation", "[]"); // [[x,y,length,height,text[],eventID], .....] array sorted
    }
    else{
        console.log("Sorry! No Web Storage support..");
        window.location = '/error';
    }
}
