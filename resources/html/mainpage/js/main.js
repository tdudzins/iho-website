// Event Listeners
createArrays();
$(document).ready(function() {
     initCanvas(1);
     initSlidePanels();
});
$(window).resize(function(){
     initCanvas(1);
     redrawHypo(0);
     redrawLines(0);
});
$('#side-nav').ready(function(){
    setupSideNav(function(){

    });
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
                    removeHypoAdaptation($(this).attr('id'), function(eid){
                        removeAdaption(eid, function(){});
                    });
                }
                // Select
                else if($(this).hasClass('adaptation-item-selected') && relationsObj[$(this).attr('id')] === undefined){
                    $(this).children('img').attr('src', '/resources/html/mainpage/img/selected.png');
                    getAdaption($(this).attr('id'), function(eid){
                        addHypoAdaptation(eid);
                        //TODO Add empirical boxes
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

function initSlidePanels() {
     var side_nav_open = false;
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
          if ($(this).hasClass("active")) {
               $("#side-nav-panel").animate({marginLeft: side_nav_width + "px"}, 300);
               $("#side-nav-toggle").html(`<img src="/resources/html/mainpage/img/arrow_open.png" style="height:100%;width:100%;">`);
          } else {
               $("#side-nav-panel").animate({marginLeft: "0px"}, 300);
               $("#side-nav-toggle").html(`<img src="/resources/html/mainpage/img/arrow_close.png" style="height:100%;width:100%;">`);
          }
          $(this).toggleClass("active");
     });
}
