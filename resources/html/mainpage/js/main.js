// Global Variables
var side_nav_stored = "";

// Event Listeners
$(document).ready(function() {
    createArrays();
    serverPost({action:'w'} ,function(data, status){
        var obj = JSON.parse(data);
        var currentSequence = '';
        var sequenceObj = {};
        var sequenceCheckObj = {};
        $('#sequence-items').empty();
        obj.forEach(function(item){
            if(currentSequence != item.sequenceID){
                currentSequence = item.sequenceID;
                sequenceObj[item.sequenceID] = [];
            }
            sequenceObj[item.sequenceID].push(item.eventID);
            sequenceCheckObj[item.eventID] = item.sequenceID;
        });
        sessionStorage.setItem("sequenceObj", sequenceObj);
        sessionStorage.setItem("sequenceCheckObj", sequenceCheckObj);
    });
    initStorage();
    initCanvas(1);
    initSlidePanels();
});
$(window).resize(function(){
    if($('#side-nav-toggle').find('img').attr('src') == '/resources/html/mainpage/img/arrow_open.png'){
        var side_nav_width = -1 * ( 25 + parseInt($("#side-nav-panel").css('width')));
        $("#side-nav-panel").css('margin-left', (side_nav_width + "px"));
    }
    initCanvas(1);
    redrawHypo(0);
    redrawEmpir(0);
    drawLines(0);
});
$('#side-nav').ready(function(){
    setupSideNav(function(){});
});

// Functions
function setupSideNav(callback) {
    var categoryArr = [];
    var categoryObj = {};
    var sideHTML = '';
    serverPost({action:'v'}, function(data, status){
        serverPost({action:'t'}, function(data2, status2){
            var obj = JSON.parse(data);
            obj.forEach(function(item){
                categoryObj[item.categoryID] = [item.categoryName,[]];
                categoryArr.push(item.categoryID);
            });
            obj = JSON.parse(data2);
            obj.forEach(function(item){
                categoryObj[item.category][1].push([item.eventName, item.eventID])
            });
            $('#adaptation-items-div').empty();
            categoryArr.forEach(function(item){
                sideHTML += '<div id="' + item + '" class="category"><span class="category-span">' + categoryObj[item][0].toUpperCase() + '</span><div class="category-pic"><img src="/resources/html/mainpage/img/list_plus.png" class="category-right"></div></div>'
                sideHTML += '<div id="' + item +'-adaptation-container" class="adaptation-container"><ul class="adaptation-items">';
                categoryObj[item][1].forEach(function(item2){
                    sideHTML += '<li id="' + item2[1] + '" class="adaptation-item-selected"><img src="/resources/html/mainpage/img/unselected.png" class="adaptation-pic"><span class="adaptation-span">' + item2[0].toUpperCase() + '</span></li>'
                });
                sideHTML += '</ul>';
                $('#adaptation-items-div').append(sideHTML);
                sideHTML = '';
            });


            $('li.adaptation-item-selected').click(function(){
                var relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
                // Unselect
                if($(this).hasClass('adaptation-item-selected') && relationsObj[$(this).attr('id')] !== undefined){
                    $(this).children('img').attr('src', '/resources/html/mainpage/img/unselected.png');
                    //TODO remove empirical boxes
                    removeAdaption($(this).attr('id'), function(eid){
                        removeHypoAdaptation(eid, function(){});
                        removeEmpirAdaptation(eid, function(){});
                    });
                }
                // Select
                else if($(this).hasClass('adaptation-item-selected') && relationsObj[$(this).attr('id')] === undefined){
                    $(this).children('img').attr('src', '/resources/html/mainpage/img/selected.png');
                    getAdaption($(this).attr('id'), function(eid){
                        addHypoAdaptation(eid);
                        addEmpirAdaptation(eid);
                    });
                }
            });

            $('div.category').click(function(){
                if($(this).find('img').attr('src') == '/resources/html/mainpage/img/list_plus.png'){
                    $(this).find('img').attr('src', '/resources/html/mainpage/img/list_minus.png');
                    $('#' + $(this).attr('id') + '-adaptation-container').slideDown(200);
                }
                // Select
                else if($(this).find('img').attr('src') == '/resources/html/mainpage/img/list_minus.png'){
                    $(this).find('img').attr('src', '/resources/html/mainpage/img/list_plus.png');
                    $('#' + $(this).attr('id') + '-adaptation-container').slideUp(200);
                }
            });
            categoryArr.forEach(function(item){
                $('#' + item + '-adaptation-container').slideUp(0);
            });
            callback();
        });
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
                adaptObj[item.eventID] = [item.eventName, (item.earliestDirectEvidence > 0)?item.earliestDirectEvidence : item.earliestIndirectEvidence, item.boundaryStart, item.boundaryEnd, 0, 0, 0, item.earliestDirectEvidence, item.earliestIndirectEvidence];
                adaptArray.push(item.eventID);
            }
            else{
                adaptObj[item.eventID][4]++;
            }

            if(item.eventID != eventID){
                relationsObj[eventID].push([item.eventID, item.precondition]);
            }
            else{
                empiricalTable.push([eventID, item.eventName, (item.earliestDirectEvidence > 0)?item.earliestDirectEvidence : item.earliestIndirectEvidence]);
            }
        });
        obj.forEach(function(item2){
            if(relationsObj[eventID].find(function(item3){return item3[0] == item2.eventID;})){
                if(adaptObj[item2.eventID][1] > adaptObj[eventID][1])
                    adaptObj[eventID][5]++;
                else
                    adaptObj[eventID][6]++;
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
        adaptObj[eventID][5] = 0;
        adaptObj[eventID][6] = 0;
    }

    sessionStorage.setItem("adaptArray", JSON.stringify(adaptArray));
    sessionStorage.setItem("adaptObj", JSON.stringify(adaptObj));
    sessionStorage.setItem("relationsObj", JSON.stringify(relationsObj));
    sessionStorage.setItem("empiricalTable", JSON.stringify(empiricalTable));
    callback(eventID);
}
function getAdaptionInfo(eventID, callback){
    var dataObj = {};
    var obj;
    serverPost({action:"q", table:'media', eventid:eventID},function(data, status){
        obj = JSON.parse(data);
        dataObj.media = obj;
        serverPost({action:"q", table:'text', type:'descript', eventid:eventID},function(data, status){
            obj = JSON.parse(data);
            dataObj.description = obj;
            serverPost({action:"q", table:'text', type:'referenc', eventid:eventID},function(data, status){
                obj = JSON.parse(data);
                dataObj.reference = obj;
                callback(dataObj);
            });

        });
    });
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
        sessionStorage.setItem("adaptObj", "{}"); // {eventID:[eventName, earliestDirectEvidence, start, end, count, Left, Right, ],[],[]....} obj
        sessionStorage.setItem("relationsObj", "{}"); // {eventID:[{id:relationID,precondition:precondition}],....} obj
        sessionStorage.setItem("empiricalTable", "[]"); // [[eventID, eventName, earliestDirectEvidence],[],[]....] array
        sessionStorage.setItem("empiricalBox", "[]"); // [[x,y,length,height,text[],eventID], .....] array sorted
        sessionStorage.setItem("boxLocation", "[]"); // [[x,y,length,height,text[],eventID], .....] array sorted
        sessionStorage.setItem("sequenceObj", "{}"); // [[x,y,length,height,text[],eventID], .....] array sorted
        sessionStorage.setItem("sequenceCheckObj", "{}"); // [[x,y,length,height,text[],eventID], .....] array sorted
    }
    else{
        console.log("Sorry! No Web Storage support..");
        window.location = '/error';
    }
}

function initSlidePanels() {
    var side_nav_width = -1 * ( 25 + parseInt($("#side-nav-panel").css('width')));
    $("#side-nav-toggle").html(`<img src="/resources/html/mainpage/img/arrow_open.png" style="height:100%;width:100%;">`);
    $("#about-page-clickable").click(function(){
        if ($(this).hasClass("active")) {
            $("#about-page-clickable").html(`<span id="about-page-toggle">ABOUT IHO PROJECT</span>
            <img src="/resources/html/mainpage/img/about_plus.png" class="about-page-pic">`);
            $("#about-page-panel").slideToggle("slow");
        }
        else {
            $("#about-page-clickable").html(`<span id="about-page-toggle">ABOUT IHO PROJECT</span>
            <img src="/resources/html/mainpage/img/about_minus.png" class="about-page-pic">`);
            $("#about-page-panel").slideToggle("slow");
        }
        $(this).toggleClass("active");
    });

    $("#side-nav-toggle").click(function () {
        if(!$('#side-nav-info').length){
            if ($(this).hasClass("active")) {
                $("#side-nav-toggle").html(`<img src="/resources/html/mainpage/img/arrow_open.png" style="height:100%;width:100%;">`);
                side_nav_width = -1 * (25 + parseInt($("#side-nav-panel").css('width')));
                $("#side-nav-panel").animate({marginLeft: side_nav_width + "px"}, 300);
            }
            else {
                $("#side-nav-toggle").html(`<img src="/resources/html/mainpage/img/arrow_close.png" style="height:100%;width:100%;">`);
                $("#side-nav-panel").animate({marginLeft: "0px"}, 300);
            }
            $(this).toggleClass("active");
        }
        else {
            closeInfoPanel();
        }
    });
}

function openInfoPanel(eventID) {
    if (!$('#side-nav-info').length){
        side_nav_width = -1 * (25 + parseInt($("#side-nav-panel").css('width')));
        $("#side-nav-panel").animate({marginLeft: side_nav_width + "px"}, 300, function(){
            // Create the Info Panel
            $("#side-nav-toggle").css("background","linear-gradient(to right, rgba(78,92,104,1), rgba(111,130,145,1))");
            $("#side-nav").append(info_panel_main);
            $("#side-info-title").html(adaptObj[eventID][0].trim().toUpperCase());

            var ede = adaptObj[eventID][7];
            var eie = adaptObj[eventID][8];
            if (ede == -1) {
                ede = "N/A";
            }
            else if (ede >= 1000000) {
                ede = ede / 1000000;
                ede = ede + " Ma"
            }
            else {
                ede = ede / 1000;
                ede = ede + " Ka"
            }
            if (eie == -1) {
                eie = "N/A";
            }
            else if (eie >= 1000000) {
                eie = eie / 1000000;
                eie = eie + " Ma"
            }
            else {
                eie = eie / 1000;
                eie = eie + " Ka"
            }
            $("#ede-data").html(ede);
            $("#eie-data").html(eie);

            getAdaptionInfo(eventID,function(item){
                $("#adaptation-description-data").append(item.description.substr(item.description.indexOf("<body>"),item.description.lastIndexOf("</body>")));
                $("#adaptation-reference-data").append(item.reference.substr(item.reference.indexOf("<body>"),item.reference.lastIndexOf("</body>")));
                var pictureArr = [];
                var videoArr = [];
                var otherArr = [];
                for(var i=0; i < item.media.length; i++) {
                    if(item.media[i].type == 1 || item.media[i].type == 2) {
                        pictureArr.push(item.media[i]);
                    }
                    else if(item.media[i].type == 3) {
                        videoArr.push(item.media[i]);
                    }
                    else if(item.media[i].type == 4) {
                        otherArr.push(item.media[i]);
                    }

                }
                console.log(item.media);
                $("#media-list-div").append(info_panel_pictures_container);
                $("#media-list-picture").append("");
            });

            $("#side-nav-toggle").html(`<img src="/resources/html/mainpage/img/arrow_close.png" style="height:100%;width:100%;">`);
            $("#side-nav-info").animate({marginLeft: "0px"}, 300);
            $("#side-nav-toggle").toggleClass("active");

        });
    }
}

function closeInfoPanel() {
    if($('#side-nav-info').length){
        $("#side-nav-toggle").html(`<img src="/resources/html/mainpage/img/arrow_open.png" style="height:100%;width:100%;">`);
        side_nav_width = -1 * (25 + parseInt($("#side-nav-info").css('width')));
        $("#side-nav-info").animate({marginLeft: side_nav_width + "px"}, 300, function(){
            // Restore Adaptations Panel
            $("#side-nav-info").remove();
            $("#side-nav-toggle").css("background","linear-gradient(to right, rgba(58,92,113,1), rgba(69,106,131,1))");
            side_nav_width = -1 * (25 + parseInt($("#side-nav-panel").css('width')));
            $("#side-nav-panel").css("marginLeft", side_nav_width+"px");
        });
    }
}

var toggle_bar = `
<div id="side-nav-bar">
    <div id="side-nav-toggle" class=""><img src="/resources/html/mainpage/img/arrow_open.png" style="height:100%;width:100%;"></div>
</div>`;

var info_panel_main = `
<div id="side-nav-info">
<div id="side-info-title">
</div>
<div id="information-panel-div">
<div id="info-ede" class="adapt-attr">
<div class="title">Earliest Direct Evidence:</div>
<div id="ede-data" class="data"></div>
</div>
<div id="info-eie" class="adapt-attr">
<div class="title">Earliest Indirect Evidence:</div>
<div id="eie-data" class="data"></div>
</div>
<div id="info-desc">
<div class="title">Description:</div>
</div>
<div id="adaptation-description-data">
</div>
<div id="info-ref">
<div class="title">References:</div>
</div>
<div id="adaptation-reference-data">
</div>
<div id="info-media">
<div class="title">Media:</div>
</div>
<div id="media-list-div">
</div>
</div>
</div>`;

var info_panel_pictures_container = `
<div id="picture-container" class="media-type">Pictures</div>
<ul id="media-list-picture" class="media-list">
</ul>`;

var info_panel_pictures_item = `
<li class="media-item">
    <img class="media-thumbnail" src="">
</li>`;

var info_panel_videos_container = `
<div id="video-container" class="media-type">Videos</div>
<ul id="media-list-video" class="media-list">
</ul>`;

var info_panel_videos_item = `
<li class="media-item">
    <img class="media-thumbnail" src="">
</li>`;

var info_panel_audio_container = `
<div id="audio-container" class="media-type">Audio</div>
<ul id="media-list-audio" class="media-list">
</ul>`;

var info_panel_audio_item = `
<li class="media-item">
    <img class="media-thumbnail" src="">
</li>`;
