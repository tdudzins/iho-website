/************** Canvas Main **************/

/* Canvas Div Dimensions */
var canvas_div_w = canvas_div_h_hypo = canvas_div_h_scroll = canvas_div_h_empir =
canvas1_1_h =  canvas1_234_h = canvas2_12_w =  canvas2_12_h = canvas3_1_h = canvas3_2_h = 0; // empirical Canvas (Layer 2: Connections, Layer 3: Adaptations) height in pixels

// Canvas Drawing Variables
var topcanvas1, topcanvas2, topcanvas3, topcanvas4, topcanvas5, topcanvas6, topcanvas7, topcanvas8, topcanvas9, topcanvas10, topcanvas11, topcanvas12,
topcanvas21, topcanvas22, topcanvas23, topcanvas24, topcanvas25, topcanvas26, topcanvas27, topcanvas28, topcanvas29, topcanvas210, topcanvas211, topcanvas212,
botcanvas1, botcanvas2, botcanvas3, botcanvas4, botcanvas5, botcanvas6, botcanvas7, botcanvas8, botcanvas9, botcanvas10, botcanvas11, botcanvas12,
ctx_top_1, ctx_top_2, ctx_top_3, ctx_top_4, ctx_top_5, ctx_top_6, ctx_top_7, ctx_top_8, ctx_top_9, ctx_top_10, ctx_top_11, ctx_top_12,
ctx_top2_1, ctx_top2_2, ctx_top2_3, ctx_top2_4, ctx_top2_5, ctx_top2_6, ctx_top2_7, ctx_top2_8, ctx_top2_9, ctx_top2_10, ctx_top2_11, ctx_top2_12,
ctx_bot_1, ctx_bot_2, ctx_bot_3, ctx_bot_4, ctx_bot_5, ctx_bot_6, ctx_bot_7, ctx_bot_8, ctx_bot_9, ctx_bot_10, ctx_bot_11, ctx_bot_12,
canvas1_1, canvas2_1, canvas2_2, ctx1_1, ctx2_1, ctx2_2;

// Global Variables
var scroll_ratio = 1.0; // Block/Container ratio in percent
var last_scroll_ratio = 1.0; // Used in redrawHypo
var last_scroll_ratio_lines = 1.0;
var last_scroll_ratio_inc = 1.0;
var last_empir_scroll_ratio = 1.0;
var scroll_position = 0.0; // Block/Container ratio in percent
var last_scroll_position_inc = 1.0;
var scroll_left_handle_x_position = 0;
var scroll_right_handle_x_position = 0;
var minScrollbar = 151;
var scrollRegions = [];
var hypoCanvas = [];
var hypoCanvas2 = [];
var empirCanvas = []; //empirical canvas
var mouseHypoCanvas = [];
var mouse_selected_canvas = 0;
var selected_adaptation = -1;
var draw_start = 0; // Redrawable Area start in pixels
var draw_end = 0; // Redrawable Area start in pixels
var date_start = 12000000; // Earliest date from selected adapations
var date_end = 000000; // Latest date from selected adaptations
var largest_timespan = 12000000; // When user is all the way scaled out, what is the largest amount of time to be viewed
var smallest_timespan = 1000000; // When user is all the way scaled in, what is the smallest amount of time to be viewed
var max_char_per_line = 25; // Used in positionBox
var box_to_box_padding_size = 18;
var empir_box_to_box_padding_size = 5;
var text_in_box_padding_w = std_text_in_box_padding_w = 19;
var text_in_box_padding_h = std_text_in_box_padding_h = 12;
var empir_text_in_box_padding_w = empir_std_text_in_box_padding_w = 19;
var empir_text_in_box_padding_h = empir_std_text_in_box_padding_h = 12;
var hypo_box_font_size = temp_text = last_hypo_font_size = hypo_box_font_size_change = 15;
var empir_box_font_size = empir_temp_text = last_empir_font_size = empir_box_font_size_change = 15;
var scrollbar_font_size = 13;
var increments_font_size = 18;
var hypo_box_font_family = empir_box_font_family = scrollbar_font_family = increments_font_family = "Montserrat";
var increments_font_color = "rgba(68,68,68,1)";
var hypo_box_fill_style_relation = "rgba(111,130,145,1.0)";
var hypo_box_fill_style_empirical = "rgba(6,74,121,1.0)";
var scrollbar_container_fill_style = "rgba(220,220,220,0.3)";
var scrollbar_block_fill_style = "rgba(250,250,250,0.5)";
var scrollbar_handle_fill_style = "rgba(255,255,255,1.0)";
var hypo_timeline_font_color = "rgba(255,255,255,1.0)";
var hypo_box_font_color = "rgba(255,255,255,1.0)";
var scrollbar_font_color = "rgba(255,255,255,1.0)";

var adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
var relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
var boxLocation = JSON.parse(sessionStorage.getItem("boxLocation"));
var adaptArray = JSON.parse(sessionStorage.getItem("adaptArray"));
var empiricalBox = JSON.parse(sessionStorage.getItem("empiricalBox"));
var empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));
var boxLocationObj = {};
var sequenceObj = {};
var sequenceCheckObj = {};
var img = new Image();
img.src = '/resources/html/mainpage/img/information.png';
var timespan;
var dir = 1;
var empir_dir = 1;
var viewable_time;
var left_edge_date;
var right_edge_date;
var bar_mouse_up = 0;

function initStorage(){
    adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
    relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
    boxLocation = JSON.parse(sessionStorage.getItem("boxLocation"));
    adaptArray = JSON.parse(sessionStorage.getItem("adaptArray"));
    sequenceObj = JSON.parse(sessionStorage.getItem("sequenceObj"));
    sequenceCheckObj = JSON.parse(sessionStorage.getItem("sequenceCheckObj"));
    empiricalBox = JSON.parse(sessionStorage.getItem("empiricalBox"));
    empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));
}
function initCanvas(firstRun) {
    scrollRegions = [];
    hypo_box_font_size_change = hypo_box_font_size;
    empir_box_font_size_change = empir_box_font_size;

    // Resize Canvases
    resizeCanvas();

    scroll_left_handle_x_position = canvas2_w * scroll_position;
    scroll_right_handle_x_position = canvas2_w * scroll_ratio + canvas2_w * scroll_position - 2 * canvas2_h * .2;

    var BB = canvas2_2.getBoundingClientRect();
    var offsetX = BB.left;
    var offsetY = BB.top;
    // drag related variables
    var dragok = false;
    var startX;
    var startY;

    // Setup Hypo Canvas' Mouse Listeners
    var dragok3 = false;
    var BB21 = topcanvas1.getBoundingClientRect();
    var offsetX21 = BB21.left;
    var offsetY21 = BB21.top;
    // drag related variables
    var dragok2 = false;
    var startX21;
    var startY21;

    var BB22 = topcanvas2.getBoundingClientRect();
    var offsetX22 = BB22.left;
    var offsetY22 = BB22.top;
    // drag related variables
    var dragok2 = false;
    var startX22;
    var startY22;

    var BB23 = topcanvas3.getBoundingClientRect();
    var offsetX23 = BB23.left;
    var offsetY23 = BB23.top;
    // drag related variables
    var dragok2 = false;
    var startX23;
    var startY23;

    var BB24 = topcanvas4.getBoundingClientRect();
    var offsetX24 = BB24.left;
    var offsetY24 = BB24.top;
    // drag related variables
    var dragok2 = false;
    var startX24;
    var startY24;

    var BB25 = topcanvas5.getBoundingClientRect();
    var offsetX25 = BB25.left;
    var offsetY25 = BB25.top;
    // drag related variables
    var dragok2 = false;
    var startX25;
    var startY25;

    var BB26 = topcanvas6.getBoundingClientRect();
    var offsetX26 = BB26.left;
    var offsetY26 = BB26.top;
    // drag related variables
    var dragok2 = false;
    var startX26;
    var startY26;

    var BB27 = topcanvas7.getBoundingClientRect();
    var offsetX27 = BB27.left;
    var offsetY27 = BB27.top;
    // drag related variables
    var dragok2 = false;
    var startX27;
    var startY27;

    var BB28 = topcanvas8.getBoundingClientRect();
    var offsetX28 = BB28.left;
    var offsetY28 = BB28.top;
    // drag related variables
    var dragok2 = false;
    var startX28;
    var startY28;

    var BB29 = topcanvas9.getBoundingClientRect();
    var offsetX29 = BB29.left;
    var offsetY29 = BB29.top;
    // drag related variables
    var dragok2 = false;
    var startX29;
    var startY29;

    var BB210 = topcanvas10.getBoundingClientRect();
    var offsetX210 = BB210.left;
    var offsetY210 = BB210.top;
    // drag related variables
    var dragok2 = false;
    var startX210;
    var startY210;

    var BB211 = topcanvas11.getBoundingClientRect();
    var offsetX211 = BB211.left;
    var offsetY211 = BB211.top;
    // drag related variables
    var dragok2 = false;
    var startX211;
    var startY211;

    var BB212 = topcanvas12.getBoundingClientRect();
    var offsetX212 = BB212.left;
    var offsetY212 = BB212.top;
    // drag related variables
    var dragok2 = false;
    var startX212;
    var startY212;

    // listen for mouse events
    if(firstRun){
        window.onmouseup = mouseUp;
        window.onmousemove = mouseMove;
        window.ontouchend = mouseUp;
        window.ontouchmove = mouseMove;
        canvas2_2.ontouchstart = scrollbarDown;
        canvas2_2.onmousedown = scrollbarDown;
        topcanvas1.ontouchstart = hypoMouseDown1;
        topcanvas1.onmousedown = hypoMouseDown1;
        topcanvas2.ontouchstart = hypoMouseDown2;
        topcanvas2.onmousedown = hypoMouseDown2;
        topcanvas3.ontouchstart = hypoMouseDown3;
        topcanvas3.onmousedown = hypoMouseDown3;
        topcanvas4.ontouchstart = hypoMouseDown4;
        topcanvas4.onmousedown = hypoMouseDown4;
        topcanvas5.ontouchstart = hypoMouseDown5;
        topcanvas5.onmousedown = hypoMouseDown5;
        topcanvas6.ontouchstart = hypoMouseDown6;
        topcanvas6.onmousedown = hypoMouseDown6;
        topcanvas7.ontouchstart = hypoMouseDown7;
        topcanvas7.onmousedown = hypoMouseDown7;
        topcanvas8.ontouchstart = hypoMouseDown8;
        topcanvas8.onmousedown = hypoMouseDown8;
        topcanvas9.ontouchstart = hypoMouseDown9;
        topcanvas9.onmousedown = hypoMouseDown9;
        topcanvas10.ontouchstart = hypoMouseDown10;
        topcanvas10.onmousedown = hypoMouseDown10;
        topcanvas11.ontouchstart = hypoMouseDown11;
        topcanvas11.onmousedown = hypoMouseDown11;
        topcanvas12.ontouchstart = hypoMouseDown12;
        topcanvas12.onmousedown = hypoMouseDown12;
        mouseHypoCanvas = [topcanvas1,topcanvas2,topcanvas3,topcanvas4,
            topcanvas5,topcanvas6,topcanvas7,topcanvas8,topcanvas9,
            topcanvas10,topcanvas11,topcanvas12];
    }

    // Initialize Scrollbar
    drawScrollbarContainer();
    drawScrollbarBlock(0);
    last_scroll_ratio = scroll_ratio;
    last_scroll_ratio_lines = scroll_ratio;
    last_scroll_ratio_inc = scroll_ratio;

    // handle scrollbar mousedown events
    function scrollbarDown(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX);
            var my=parseInt(e.changedTouches[0].clientY-offsetY);
        }
        else{
            var mx=parseInt(e.clientX-offsetX);
            var my=parseInt(e.clientY-offsetY);
        }
        // test each rect to see if mouse is inside
        dragok=false;

        for (var i=0;i<scrollRegions.length;i++) {
            var r=scrollRegions[i];
            if(mx>r.x && mx<r.x+r.width && my>r.y && my<r.y+r.height) {
                // if yes, set that rects isDragging=true
                dragok=true;
                r.isDragging=true;
            }
        }

        // save the current mouse position
        startX=mx;
        startY=my;
    }

    // handle hypo canvas mousedown events
    function hypoMouseDown1(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX21-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY21);
        }
        else{
            var mx=parseInt(e.clientX-offsetX21-margin_value);
            var my=parseInt(e.clientY-offsetY21);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 0 * canvas_div_w;
        var found = false;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] &&
                my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3] && dragok3 == false && selected_adaptation == -1) {
                dragok3 = true;
                selected_adaptation = adaptArray[i];
                found = true;
                redrawHypo(0);
                drawLines(0);
                console.log("selected a adaptation");
            }
            else if(dragok3 == true && mx + canvas_offset>boxLocationObj[adaptArray[i]][0]+(boxLocationObj[adaptArray[i]][2]-boxLocationObj[adaptArray[i]][3]) && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+(boxLocationObj[adaptArray[i]][2]) &&
                my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3] && selected_adaptation == adaptArray[i]) {
                //clicked on information button
                found = true;
                openInfoPanel(selected_adaptation);
                console.log("information button click");
            }
            else if(dragok3 == true && mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+(boxLocationObj[adaptArray[i]][2]-boxLocationObj[adaptArray[i]][3]) &&
                my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3] && selected_adaptation == adaptArray[i]) {
                //clicked on adaptation and is able to be moved
                dragok2 = true;
                found = true;
                console.log("moving activated");
            }
        }
        if(!found){
            //canvas clicked but no adaptation was clicked
            dragok2 = false;
            dragok3 = false;
            found = false;
            if(selected_adaptation != -1){
                selected_adaptation = -1;
                redrawHypo(0);
            }
            selected_canvas=0;
            closeInfoPanel();
            console.log("reset and return side nav to normal");
        }
        // save the current mouse position
        startX21=mx;
        startY21=my;
    }

    function hypoMouseDown2(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX22-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY22);
        }
        else{
            var mx=parseInt(e.clientX-offsetX22-margin_value);
            var my=parseInt(e.clientY-offsetY22);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 1 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX22=mx;
        startY22=my;
        mouse_selected_canvas = 2;
    }

    function hypoMouseDown3(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX23-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY23);
        }
        else{
            var mx=parseInt(e.clientX-offsetX23-margin_value);
            var my=parseInt(e.clientY-offsetY23);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 2 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX23=mx;
        startY23=my;
        mouse_selected_canvas = 3;
    }

    function hypoMouseDown4(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX24-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY24);
        }
        else{
            var mx=parseInt(e.clientX-offsetX24-margin_value);
            var my=parseInt(e.clientY-offsetY24);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 3 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX24=mx;
        startY24=my;
        mouse_selected_canvas = 4;
    }

    function hypoMouseDown5(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX25-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY25);
        }
        else{
            var mx=parseInt(e.clientX-offsetX25-margin_value);
            var my=parseInt(e.clientY-offsetY25);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 4 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX25=mx;
        startY25=my;
        mouse_selected_canvas = 5;
    }

    function hypoMouseDown6(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX26-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY26);
        }
        else{
            var mx=parseInt(e.clientX-offsetX26-margin_value);
            var my=parseInt(e.clientY-offsetY26);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 5 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX26=mx;
        startY26=my;
        mouse_selected_canvas = 6;
    }

    function hypoMouseDown7(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX27-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY27);
        }
        else{
            var mx=parseInt(e.clientX-offsetX27-margin_value);
            var my=parseInt(e.clientY-offsetY27);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 6 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX27=mx;
        startY27=my;
        mouse_selected_canvas = 7;
    }

    function hypoMouseDown8(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX28-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY28);
        }
        else{
            var mx=parseInt(e.clientX-offsetX28-margin_value);
            var my=parseInt(e.clientY-offsetY28);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 7 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX28=mx;
        startY28=my;
        mouse_selected_canvas = 8;
    }

    function hypoMouseDown9(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX29-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY29);
        }
        else{
            var mx=parseInt(e.clientX-offsetX29-margin_value);
            var my=parseInt(e.clientY-offsetY29);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 8 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX29=mx;
        startY29=my;
        mouse_selected_canvas = 9;
    }

    function hypoMouseDown10(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX210-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY210);
        }
        else{
            var mx=parseInt(e.clientX-offsetX210-margin_value);
            var my=parseInt(e.clientY-offsetY210);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 9 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }
        // save the current mouse position
        startX210=mx;
        startY210=my;
        mouse_selected_canvas = 10;
    }

    function hypoMouseDown11(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX211-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY211);
        }
        else{
            var mx=parseInt(e.clientX-offsetX211-margin_value);
            var my=parseInt(e.clientY-offsetY211);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 10 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }
        // save the current mouse position
        startX211=mx;
        startY211=my;
        mouse_selected_canvas = 11;
    }

    function hypoMouseDown12(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
        var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

        // get the current mouse position
        if(e.clientX == undefined){
            var mx=parseInt(e.changedTouches[0].clientX-offsetX212-margin_value);
            var my=parseInt(e.changedTouches[0].clientY-offsetY212);
        }
        else{
            var mx=parseInt(e.clientX-offsetX212-margin_value);
            var my=parseInt(e.clientY-offsetY212);
        }
        // test each rect to see if mouse is inside
        dragok2=false;
        var canvas_offset = 11 * canvas_div_w;
        for(var i=0;i<adaptArray.length;i++){
            if(mx + canvas_offset>boxLocationObj[adaptArray[i]][0] && mx + canvas_offset<boxLocationObj[adaptArray[i]][0]+boxLocationObj[adaptArray[i]][2] && my>boxLocationObj[adaptArray[i]][1] && my<boxLocationObj[adaptArray[i]][1]+boxLocationObj[adaptArray[i]][3]) {
                dragok2=true;
                selected_adaptation = adaptArray[i];
            }
        }

        // save the current mouse position
        startX212=mx;
        startY212=my;
        mouse_selected_canvas = 12;
    }

    // handle mouseup events
    function mouseUp(e) {
        // tell the browser we're handling this mouse event

        e.preventDefault();
        e.stopPropagation();

        if(bar_mouse_up) {
            redrawHypo(0);
            drawLines(0);
            drawScrollbarBlock(0);
            redrawEmpir(0);
            bar_mouse_up = 0;
        }

        // clear all the dragging flags
        dragok = false;
        for (var i=0;i<scrollRegions.length;i++) {
            scrollRegions[i].isDragging=false;
        }
        dragok2 = false;
    }

    // handle mouse moves
    function mouseMove(e) {

        // if we're dragging anything...
        if(dragok) {
            // tell the browser we're handling this mouse event
            e.preventDefault();
            e.stopPropagation();

            // get the current mouse position
            if(e.clientX == undefined){
                var mx=parseInt(e.changedTouches[0].clientX-offsetX);
                var my=parseInt(e.changedTouches[0].clientY-offsetY);
            }
            else{
                var mx=parseInt(e.clientX-offsetX);
                var my=parseInt(e.clientY-offsetY);
            }
            // calculate the distance the mouse has moved
            // since the last mousemove
            var dx=mx-startX;
            var dy=my-startY;

            // move each rect that isDragging
            // by the distance the mouse has moved
            // since the last mousemove
            for (var i=0;i<scrollRegions.length;i++) {

                var r = scrollRegions[i];
                var r1 = scrollRegions[0];
                var r2 = scrollRegions[1];
                var r3 = scrollRegions[2];
                if(r.isDragging) {
                    if(r.id == 'left' && r.x + dx > 0 && ((r1.width+r2.width+r3.width-dx)>minScrollbar||(r2.width - dx)>minScrollbar)) {
                        r1.x += dx;
                        scroll_left_handle_x_position += dx;
                        r2.x += dx;
                        r2.width -= dx;
                        bar_mouse_up = 1;
                    }
                    else if(r.id == 'right' && r.x+r3.width+dx<canvas_div_w&&((r1.width+r2.width+r3.width+dx)>minScrollbar||(r2.width + dx)>minScrollbar)) {
                        r3.x += dx;
                        scroll_right_handle_x_position += dx;
                        r2.width += dx;
                        bar_mouse_up = 1;
                    }
                    else if(r.id == 'middle' && r1.x + dx > 0 && r3.x + r3.width + dx  < canvas_div_w) {
                        r1.x += dx;
                        scroll_left_handle_x_position += dx;
                        r2.x += dx;
                        scroll_right_handle_x_position += dx;
                        r3.x += dx;
                    }
                }
            }

            // redraw
            drawScrollbarBlock(.0001);
            redrawHypo(.0001);
            redrawEmpir(.0001);
            drawLines(.0001);
            // reset the starting mouse position for the next mousemove
            startX=mx;
            startY=my;
        }

        else if(dragok2) {
            // tell the browser we're handling this mouse event
            e.preventDefault();
            e.stopPropagation();
            var margin_value = parseInt(document.getElementById("canvas-wrapper-adaptations-div").style.marginLeft);

            // get the current mouse position
            if(e.clientX == undefined){
                var mx=parseInt(e.changedTouches[0].clientX-offsetX21-margin_value);
                var my=parseInt(e.changedTouches[0].clientY-offsetY21);
            }
            else{
                var mx=parseInt(e.clientX-offsetX21-margin_value);
                var my=parseInt(e.clientY-offsetY21);
            }
            // calculate the distance the mouse has moved
            // since the last mousemove
            var dx=mx-startX21;
            var dy=my-startY21;

            var date = adaptObj[selected_adaptation][1];
            if(date >= 1000000) {
                date = date + 4000000;
            }
            else {
                date = date * 5;
            }
            date = (date - (increment_per_pixel * dx));
            if(date >= 5000000) {
                date = date - 4000000;
            }
            else {
                date = date/5;
            }
            adaptObj[selected_adaptation][1] = date;

            // redraw
            redrawHypo(0);
            drawLines(0);

            startX21=mx;
            startY21=my;
            startX22=mx;
            startY22=my;
            startX23=mx;
            startY23=my;
            startX24=mx;
            startY24=my;
            startX25=mx;
            startY25=my;
            startX26=mx;
            startY26=my;
            startX27=mx;
            startY27=my;
            startX28=mx;
            startY28=my;
            startX29=mx;
            startY29=my;
            startX210=mx;
            startY210=my;
            startX211=mx;
            startY211=my;
            startX212=mx;
            startY212=my;
        }
        else if (dragok3) {

        }

        // Move main canvas on mouseMove
        timespan = (date_start - date_end);
        viewable_time = timespan * scroll_ratio;
        increment_per_pixel = (viewable_time/canvas_div_w);
        left_edge_date = timespan - (timespan * scroll_position) + date_end;
        var offset = 20+(-1 * ((12000000 - left_edge_date)/increment_per_pixel));
        $('#canvas-wrapper-lines-div').css("margin-left", offset + "px");
        $('#canvas-wrapper-adaptations-div').css("margin-left", offset + "px");
        $('#canvas-wrapper-empirical-adaptations-div').css("margin-left", (offset-20) + "px");
    }
};

function resizeCanvas() {
    $('#canvas-wrapper-lines-div').html(hypothesis_lines_canvas);
    $('#canvas-wrapper-adaptations-div').html(hypothesis_adapt_canvas);
    $('#canvas-wrapper-empirical-adaptations-div').html(empirical_canvas);

    // Set Canvas Div Size from Browser Realtime Values
    canvas_div_w = $('#hypothesis-canvas-div').width();
    canvas_div_h_hypo = $('#canvas-wrapper-adaptations-div').height();
    canvas_div_h_scroll = $('#scrollbar-canvas-div').height();
    canvas_div_h_empir = $('#empirical-canvas-div').height();
    canvas_timeline_w = canvas_div_w * 12;

    // Calculate Hypothetical Canvas Dimensions
    canvas1_1_w = canvas_div_w;
    canvas1_1_h = $('#timeline-increments-div').height();

    // Calculate Scrollbar Canvas Dimensions
    canvas2_w = canvas_div_w;
    canvas2_h = $('#scrollbar-canvas-div').height();

    // Resize Hypothetical Canvas
    $('#canvas-wrapper-lines-div').width = canvas_timeline_w;
    $('#canvas-wrapper-adaptations-div').width = canvas_timeline_w;

    // Resize Scrollbar Canvas
    $('#scrollbar-canvas-container').width = canvas_div_w;
    $('#scrollbar-canvas-block').width = canvas_div_w;
    minScrollbar = 1/12 * canvas_div_w;

    // Resize empirical Canvas
    $('empirical-canvas-div').width = canvas_div_w;
    $('#canvas-wrapper-empirical-adaptations-div').width = canvas_timeline_w;

    // Redefine Canvas Context(s)
    topcanvas1 = document.getElementById('hypothesis-canvas-1');
    topcanvas2 = document.getElementById('hypothesis-canvas-2');
    topcanvas3 = document.getElementById('hypothesis-canvas-3');
    topcanvas4 = document.getElementById('hypothesis-canvas-4');
    topcanvas5 = document.getElementById('hypothesis-canvas-5');
    topcanvas6 = document.getElementById('hypothesis-canvas-6');
    topcanvas7 = document.getElementById('hypothesis-canvas-7');
    topcanvas8 = document.getElementById('hypothesis-canvas-8');
    topcanvas9 = document.getElementById('hypothesis-canvas-9');
    topcanvas10 = document.getElementById('hypothesis-canvas-10');
    topcanvas11 = document.getElementById('hypothesis-canvas-11');
    topcanvas12 = document.getElementById('hypothesis-canvas-12');

    topcanvas21 = document.getElementById('hypothesis-canvas2-1');
    topcanvas22 = document.getElementById('hypothesis-canvas2-2');
    topcanvas23 = document.getElementById('hypothesis-canvas2-3');
    topcanvas24 = document.getElementById('hypothesis-canvas2-4');
    topcanvas25 = document.getElementById('hypothesis-canvas2-5');
    topcanvas26 = document.getElementById('hypothesis-canvas2-6');
    topcanvas27 = document.getElementById('hypothesis-canvas2-7');
    topcanvas28 = document.getElementById('hypothesis-canvas2-8');
    topcanvas29 = document.getElementById('hypothesis-canvas2-9');
    topcanvas210 = document.getElementById('hypothesis-canvas2-10');
    topcanvas211 = document.getElementById('hypothesis-canvas2-11');
    topcanvas212 = document.getElementById('hypothesis-canvas2-12');

    canvas1_1 = document.getElementById('timeline-increments');

    canvas2_1 = document.getElementById('scrollbar-canvas-container');
    canvas2_2 = document.getElementById('scrollbar-canvas-block');

    ctx_top_1 = topcanvas1.getContext("2d");
    ctx_top_1.canvas.width = canvas_div_w;
    ctx_top_1.canvas.height = canvas_div_h_hypo;
    ctx_top_2 = topcanvas2.getContext("2d");
    ctx_top_2.canvas.width = canvas_div_w;
    ctx_top_2.canvas.height = canvas_div_h_hypo;
    ctx_top_3 = topcanvas3.getContext("2d");
    ctx_top_3.canvas.width = canvas_div_w;
    ctx_top_3.canvas.height = canvas_div_h_hypo;
    ctx_top_4 = topcanvas4.getContext("2d");
    ctx_top_4.canvas.width = canvas_div_w;
    ctx_top_4.canvas.height = canvas_div_h_hypo;
    ctx_top_5 = topcanvas5.getContext("2d");
    ctx_top_5.canvas.width = canvas_div_w;
    ctx_top_5.canvas.height = canvas_div_h_hypo;
    ctx_top_6 = topcanvas6.getContext("2d");
    ctx_top_6.canvas.width = canvas_div_w;
    ctx_top_6.canvas.height = canvas_div_h_hypo;
    ctx_top_7 = topcanvas7.getContext("2d");
    ctx_top_7.canvas.width = canvas_div_w;
    ctx_top_7.canvas.height = canvas_div_h_hypo;
    ctx_top_8 = topcanvas8.getContext("2d");
    ctx_top_8.canvas.width = canvas_div_w;
    ctx_top_8.canvas.height = canvas_div_h_hypo;
    ctx_top_9 = topcanvas9.getContext("2d");
    ctx_top_9.canvas.width = canvas_div_w;
    ctx_top_9.canvas.height = canvas_div_h_hypo;
    ctx_top_10 = topcanvas10.getContext("2d");
    ctx_top_10.canvas.width = canvas_div_w;
    ctx_top_10.canvas.height = canvas_div_h_hypo;
    ctx_top_11 = topcanvas11.getContext("2d");
    ctx_top_11.canvas.width = canvas_div_w;
    ctx_top_11.canvas.height = canvas_div_h_hypo;
    ctx_top_12 = topcanvas12.getContext("2d");
    ctx_top_12.canvas.width = canvas_div_w;
    ctx_top_12.canvas.height = canvas_div_h_hypo;

    ctx_top2_1 = topcanvas21.getContext("2d");
    ctx_top2_1.canvas.width = canvas_div_w;
    ctx_top2_1.canvas.height = canvas_div_h_hypo;
    ctx_top2_2 = topcanvas22.getContext("2d");
    ctx_top2_2.canvas.width = canvas_div_w;
    ctx_top2_2.canvas.height = canvas_div_h_hypo;
    ctx_top2_3 = topcanvas23.getContext("2d");
    ctx_top2_3.canvas.width = canvas_div_w;
    ctx_top2_3.canvas.height = canvas_div_h_hypo;
    ctx_top2_4 = topcanvas24.getContext("2d");
    ctx_top2_4.canvas.width = canvas_div_w;
    ctx_top2_4.canvas.height = canvas_div_h_hypo;
    ctx_top2_5 = topcanvas25.getContext("2d");
    ctx_top2_5.canvas.width = canvas_div_w;
    ctx_top2_5.canvas.height = canvas_div_h_hypo;
    ctx_top2_6 = topcanvas26.getContext("2d");
    ctx_top2_6.canvas.width = canvas_div_w;
    ctx_top2_6.canvas.height = canvas_div_h_hypo;
    ctx_top2_7 = topcanvas27.getContext("2d");
    ctx_top2_7.canvas.width = canvas_div_w;
    ctx_top2_7.canvas.height = canvas_div_h_hypo;
    ctx_top2_8 = topcanvas28.getContext("2d");
    ctx_top2_8.canvas.width = canvas_div_w;
    ctx_top2_8.canvas.height = canvas_div_h_hypo;
    ctx_top2_9 = topcanvas29.getContext("2d");
    ctx_top2_9.canvas.width = canvas_div_w;
    ctx_top2_9.canvas.height = canvas_div_h_hypo;
    ctx_top2_10 = topcanvas210.getContext("2d");
    ctx_top2_10.canvas.width = canvas_div_w;
    ctx_top2_10.canvas.height = canvas_div_h_hypo;
    ctx_top2_11 = topcanvas211.getContext("2d");
    ctx_top2_11.canvas.width = canvas_div_w;
    ctx_top2_11.canvas.height = canvas_div_h_hypo;
    ctx_top2_12 = topcanvas212.getContext("2d");
    ctx_top2_12.canvas.width = canvas_div_w;
    ctx_top2_12.canvas.height = canvas_div_h_hypo;

    hypoCanvas[0] = ctx_top_1;
    hypoCanvas[1] = ctx_top_2;
    hypoCanvas[2] = ctx_top_3;
    hypoCanvas[3] = ctx_top_4;
    hypoCanvas[4] = ctx_top_5;
    hypoCanvas[5] = ctx_top_6;
    hypoCanvas[6] = ctx_top_7;
    hypoCanvas[7] = ctx_top_8;
    hypoCanvas[8] = ctx_top_9;
    hypoCanvas[9] = ctx_top_10;
    hypoCanvas[10] = ctx_top_11;
    hypoCanvas[11] = ctx_top_12;

    hypoCanvas2[0] = ctx_top2_1;
    hypoCanvas2[1] = ctx_top2_2;
    hypoCanvas2[2] = ctx_top2_3;
    hypoCanvas2[3] = ctx_top2_4;
    hypoCanvas2[4] = ctx_top2_5;
    hypoCanvas2[5] = ctx_top2_6;
    hypoCanvas2[6] = ctx_top2_7;
    hypoCanvas2[7] = ctx_top2_8;
    hypoCanvas2[8] = ctx_top2_9;
    hypoCanvas2[9] = ctx_top2_10;
    hypoCanvas2[10] = ctx_top2_11;
    hypoCanvas2[11] = ctx_top2_12;

    //empirical canvas
    botcanvas1 = document.getElementById('empirical-canvas-1');
    botcanvas2 = document.getElementById('empirical-canvas-2');
    botcanvas3 = document.getElementById('empirical-canvas-3');
    botcanvas4 = document.getElementById('empirical-canvas-4');
    botcanvas5 = document.getElementById('empirical-canvas-5');
    botcanvas6 = document.getElementById('empirical-canvas-6');
    botcanvas7 = document.getElementById('empirical-canvas-7');
    botcanvas8 = document.getElementById('empirical-canvas-8');
    botcanvas9 = document.getElementById('empirical-canvas-9');
    botcanvas10 = document.getElementById('empirical-canvas-10');
    botcanvas11 = document.getElementById('empirical-canvas-11');
    botcanvas12 = document.getElementById('empirical-canvas-12');

    ctx_bot_1 = botcanvas1.getContext("2d");
    ctx_bot_1.canvas.width = canvas_div_w;
    ctx_bot_1.canvas.height = canvas_div_h_empir;
    ctx_bot_2 = botcanvas2.getContext("2d");
    ctx_bot_2.canvas.width = canvas_div_w;
    ctx_bot_2.canvas.height = canvas_div_h_empir;
    ctx_bot_3 = botcanvas3.getContext("2d");
    ctx_bot_3.canvas.width = canvas_div_w;
    ctx_bot_3.canvas.height = canvas_div_h_empir;
    ctx_bot_4 = botcanvas4.getContext("2d");
    ctx_bot_4.canvas.width = canvas_div_w;
    ctx_bot_4.canvas.height = canvas_div_h_empir;
    ctx_bot_5 = botcanvas5.getContext("2d");
    ctx_bot_5.canvas.width = canvas_div_w;
    ctx_bot_5.canvas.height = canvas_div_h_empir;
    ctx_bot_6 = botcanvas6.getContext("2d");
    ctx_bot_6.canvas.width = canvas_div_w;
    ctx_bot_6.canvas.height = canvas_div_h_empir;
    ctx_bot_7 = botcanvas7.getContext("2d");
    ctx_bot_7.canvas.width = canvas_div_w;
    ctx_bot_7.canvas.height = canvas_div_h_empir;
    ctx_bot_8 = botcanvas8.getContext("2d");
    ctx_bot_8.canvas.width = canvas_div_w;
    ctx_bot_8.canvas.height = canvas_div_h_empir;
    ctx_bot_9 = botcanvas9.getContext("2d");
    ctx_bot_9.canvas.width = canvas_div_w;
    ctx_bot_9.canvas.height = canvas_div_h_empir;
    ctx_bot_10 = botcanvas10.getContext("2d");
    ctx_bot_10.canvas.width = canvas_div_w;
    ctx_bot_10.canvas.height = canvas_div_h_empir;
    ctx_bot_11 = botcanvas11.getContext("2d");
    ctx_bot_11.canvas.width = canvas_div_w;
    ctx_bot_11.canvas.height = canvas_div_h_empir;
    ctx_bot_12 = botcanvas12.getContext("2d");
    ctx_bot_12.canvas.width = canvas_div_w;
    ctx_bot_12.canvas.height = canvas_div_h_empir;

    empirCanvas = [ctx_bot_1, ctx_bot_2, ctx_bot_3, ctx_bot_4,
        ctx_bot_5, ctx_bot_6, ctx_bot_7, ctx_bot_8,
        ctx_bot_9, ctx_bot_10, ctx_bot_11, ctx_bot_12];

        ctx1_1 = canvas1_1.getContext("2d");
        ctx1_1.canvas.width = canvas1_1_w;
        ctx1_1.canvas.height = canvas1_1_h;

        ctx2_1 = canvas2_1.getContext("2d");
        ctx2_1.canvas.width = canvas2_w;
        ctx2_1.canvas.height = canvas2_h;

        ctx2_2 = canvas2_2.getContext("2d");
        ctx2_2.canvas.width = canvas2_w;
        ctx2_2.canvas.height = canvas2_h;
}
function setdate (start, end) {
    date_start = start;
    date_end = end;
}

// Canvas drawing functions
function boxCanvasWrapperDraw(x_pos,y_pos,width_length,height_length,text,eventID,empirical) {
    var c_value = x_pos/canvas_div_w;
    var selected_canvas = 0;

    if(c_value <= 1)
    selected_canvas = 0;
    else if(c_value <= 2)
    selected_canvas = 1;
    else if(c_value <= 3)
    selected_canvas = 2;
    else if(c_value <= 4)
    selected_canvas = 3;
    else if(c_value <= 5)
    selected_canvas = 4;
    else if(c_value <= 6)
    selected_canvas = 5;
    else if(c_value <= 7)
    selected_canvas = 6;
    else if(c_value <= 8)
    selected_canvas = 7;
    else if(c_value <= 9)
    selected_canvas = 8;
    else if(c_value <= 10)
    selected_canvas = 9;
    else if(c_value <= 11)
    selected_canvas = 10;
    else if(c_value <= 12)
    selected_canvas = 11;

    x_pos = x_pos%canvas_div_w;
    var temp_x = 0;
    for(var i = -1; i < 2; i++) {
        if(selected_canvas + i >= 0 && selected_canvas + i <= 11) {
            temp_x = x_pos - (i * canvas_div_w);

            if (empirical) {
                hypoCanvas[selected_canvas + i].fillStyle = hypo_box_fill_style_empirical;
            }
            else {
                hypoCanvas[selected_canvas + i].fillStyle = hypo_box_fill_style_relation;
            }
            hypoCanvas[selected_canvas + i].fillRect(temp_x, y_pos, width_length, height_length);
            hypoCanvas[selected_canvas + i].font = hypo_box_font_size_change + "px " + hypo_box_font_family;
            hypoCanvas[selected_canvas + i].fillStyle = hypo_box_font_color;
            hypoCanvas[selected_canvas + i].textAlign = "center";
            hypoCanvas[selected_canvas + i].textBaseline="hanging";
            if(eventID == selected_adaptation){
                hypoCanvas[selected_canvas + i].drawImage(img, temp_x + width_length - hypo_box_font_size_change - empir_text_in_box_padding_w/4, y_pos + ((height_length-hypo_box_font_size_change)/2), hypo_box_font_size_change, hypo_box_font_size_change);
            }
            for (j = 0; j < text.length; j++) {
                hypoCanvas[selected_canvas + i].fillText(text[j], temp_x + (0.5 * (width_length - ((selected_adaptation==eventID) ? hypo_box_font_size_change : 0))) , y_pos + (text_in_box_padding_h*.5) + ((hypo_box_font_size_change + ((j)?1:0)) * (j)));
            }
        }
    }
}
function boxCanvasWrapperClear(x_pos,y_pos,width_length,height_length) {
    var c_value = x_pos/canvas_div_w;
    var selected_canvas = 0;
    if(c_value <= 1)
    selected_canvas = 0;
    else if(c_value <= 2)
    selected_canvas = 1;
    else if(c_value <= 3)
    selected_canvas = 2;
    else if(c_value <= 4)
    selected_canvas = 3;
    else if(c_value <= 5)
    selected_canvas = 4;
    else if(c_value <= 6)
    selected_canvas = 5;
    else if(c_value <= 7)
    selected_canvas = 6;
    else if(c_value <= 8)
    selected_canvas = 7;
    else if(c_value <= 9)
    selected_canvas = 8;
    else if(c_value <= 10)
    selected_canvas = 9;
    else if(c_value <= 11)
    selected_canvas = 10;
    else if(c_value <= 12)
    selected_canvas = 11;
    x_pos = x_pos%canvas_div_w;
    var temp_x = 0;
    for(var i = -1; i < 2; i++) {
        if(selected_canvas + i >= 0 && selected_canvas + i <= 11) {
            temp_x = x_pos - (i * canvas_div_w);
            hypoCanvas[selected_canvas].clearRect((temp_x - 1), (y_pos - 1), (width_length + 3), (height_length + 3));
        }
    }
}
function lineCanvasWrapperDraw(x_pos,y_pos,x2_pos,y2_pos,color) {
    var c_value = x_pos/canvas_div_w;
    var selected_canvas = 0;

    if(c_value <= 1)
    selected_canvas = 0;
    else if(c_value <= 2)
    selected_canvas = 1;
    else if(c_value <= 3)
    selected_canvas = 2;
    else if(c_value <= 4)
    selected_canvas = 3;
    else if(c_value <= 5)
    selected_canvas = 4;
    else if(c_value <= 6)
    selected_canvas = 5;
    else if(c_value <= 7)
    selected_canvas = 6;
    else if(c_value <= 8)
    selected_canvas = 7;
    else if(c_value <= 9)
    selected_canvas = 8;
    else if(c_value <= 10)
    selected_canvas = 9;
    else if(c_value <= 11)
    selected_canvas = 10;
    else if(c_value <= 12)
    selected_canvas = 11;

    var c_value2 = x2_pos/canvas_div_w;
    var selected_canvas2 = 0;

    if(c_value2 <= 1)
    selected_canvas2 = 0;
    else if(c_value2 <= 2)
    selected_canvas2 = 1;
    else if(c_value2 <= 3)
    selected_canvas2 = 2;
    else if(c_value2 <= 4)
    selected_canvas2 = 3;
    else if(c_value2 <= 5)
    selected_canvas2 = 4;
    else if(c_value2 <= 6)
    selected_canvas2 = 5;
    else if(c_value2 <= 7)
    selected_canvas2 = 6;
    else if(c_value2 <= 8)
    selected_canvas2 = 7;
    else if(c_value2 <= 9)
    selected_canvas2 = 8;
    else if(c_value2 <= 10)
    selected_canvas2 = 9;
    else if(c_value2 <= 11)
    selected_canvas2 = 10;
    else if(c_value2 <= 12)
    selected_canvas2 = 11;

    var temp_x = 0;
    var temp_x2 = 0;

    for(var i = selected_canvas; i <= selected_canvas2; i++) {
        temp_x1 = x_pos - (i * canvas_div_w);
        temp_x2 = x2_pos - (i * canvas_div_w);
        hypoCanvas2[i].strokeStyle = color;
        hypoCanvas2[i].lineWidth = 2;
        hypoCanvas2[i].beginPath();
        hypoCanvas2[i].moveTo(temp_x1,y_pos);
        hypoCanvas2[i].lineTo(temp_x2,y2_pos);
        hypoCanvas2[i].closePath();
        hypoCanvas2[i].stroke();
    }
}

// Hypo Timeline function
function addHypoAdaptation(eventID) {
    // Pull in new changes
    adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
    adaptArray = JSON.parse(sessionStorage.getItem("adaptArray"));
    relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
    empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));

    // Draw new things if they all fit
    temp_text = hypo_box_font_size_change;
    // dir = (dir)? 0:1;
    if(adaptObj[eventID][4] < 1) {
        createAdaptBox(eventID, adaptObj[eventID][0], adaptObj[eventID][1], function(eventID, text, width, height, date) {
            positionAdaptBox(eventID, text, width, height, date);
        });
    }
    else{
        boxLocationObj[eventID][4] = adaptObj[eventID][5];
        boxLocationObj[eventID][5] = adaptObj[eventID][6];
    }
    relationsObj[eventID].forEach(function(item) {
        if(adaptObj[item[0]][4] == 0) {
            createAdaptBox(item[0], adaptObj[item[0]][0], adaptObj[item[0]][1], function(eventID, text, width, height, date) {
                positionAdaptBox(eventID, text, width, height, date);
            });
        }
        if(hypo_box_font_size_change != temp_text)
        return;
    });
    while(hypo_box_font_size_change != temp_text) {
        temp_text = hypo_box_font_size_change;
        boxLocation = [];
        dir = 1;
        for (var i = 0; i < adaptArray.length; i++) {
            createAdaptBox(adaptArray[i], adaptObj[adaptArray[i]][0], adaptObj[adaptArray[i]][1], function(eventID, text, width, height, date) {
                positionAdaptBox(eventID, text, width, height, date);
            });
            if(hypo_box_font_size_change != temp_text)
            break;
        }
    }
    // Draw all the boxes when done
    drawAllBoxes();
    drawLines(0);
}
function createAdaptBox(eventID, eventName, date, callback) {
    var textArray = [];
    if(hypo_box_font_size_change <= 5){
        text_in_box_padding_w = 1;
        text_in_box_padding_h = 1;
    }
    else if(hypo_box_font_size_change > 5){
        text_in_box_padding_w = std_text_in_box_padding_w;
        text_in_box_padding_h = std_text_in_box_padding_h;
    }
    ctx_top_1.font = hypo_box_font_size_change + "px " + hypo_box_font_family;
    var line = "";
    var temp_str = eventName.split(" ");
    temp_str.forEach(function(item) {
        if(line.length + item.length <= max_char_per_line) {
            line += item + " ";
        }
        else {
            textArray.push(line.trim().toUpperCase());
            line = item + " ";
        }
    });
    textArray.push(line.trim().toUpperCase());

    var longest_line = 0;
    var width = 0;
    textArray.forEach(function(item) {
        if(longest_line < ctx_top_1.measureText(item).width) {
            longest_line = ctx_top_1.measureText(item).width;
            width = parseInt((ctx_top_1.measureText(item).width + text_in_box_padding_w).toFixed(0));
        }
    });
    if (eventID == selected_adaptation) {
        width += hypo_box_font_size_change;
    }
    var height = (hypo_box_font_size_change * textArray.length) + ((textArray.length > 1)?(textArray.length-1):0) + text_in_box_padding_h;
    callback(eventID, textArray, width, height, date);
}
function positionAdaptBox(eventID, text, width, height, date) {
    var x_pos = 0;
    var y_pos = 0;
    if(date >= 1000000) {
        date = date + 4000000;
    }
    else {
        date = date * 5;
    }
    timespan = (date_start - date_end);
    viewable_time = timespan * scroll_ratio;
    increment_per_pixel = (viewable_time/canvas_div_w);
    x_pos = date/increment_per_pixel;
    x_pos = ((canvas_div_w/scroll_ratio) - x_pos) - width/2;
    y_pos = canvas_div_h_hypo/2 - height/2;

    var i = 0;
    var up = 0;
    var down = 0;
    var l_i = 0;
    while (i < boxLocation.length) {
        // Hit x or y
        if(((x_pos >= boxLocation[i][0] - box_to_box_padding_size && x_pos <= boxLocation[i][0] + boxLocation[i][2] + box_to_box_padding_size) ||
        (x_pos  <= boxLocation[i][0] + box_to_box_padding_size && x_pos + width >= boxLocation[i][0] + boxLocation[i][2] + box_to_box_padding_size) ||
        (x_pos + width >= boxLocation[i][0] - box_to_box_padding_size  && x_pos + width <= boxLocation[i][0] + boxLocation[i][2] + box_to_box_padding_size)) &&
        ((y_pos >= boxLocation[i][1] && y_pos <= boxLocation[i][1] + boxLocation[i][3]) ||
        (y_pos <= boxLocation[i][1] && y_pos + height >= boxLocation[i][1] + boxLocation[i][3]) ||
        (y_pos + height >= boxLocation[i][1] && y_pos + height <= boxLocation[i][1] + boxLocation[i][3]))) {
            if(i > l_i) {
                dir = (dir)? 0:1;
                l_i = i;
            }
            dir = (down)? 1:dir;
            dir = (up)? 0:dir;
            if(!down && !dir) {
                if (boxLocation[i][1] + boxLocation[i][3] + height + box_to_box_padding_size < canvas_div_h_hypo) {
                    y_pos = boxLocation[i][1] + boxLocation[i][3] + box_to_box_padding_size;
                    i = 0;
                }
                else
                down = 1;
            }
            else if(!up && dir) {
                if (boxLocation[i][1] - box_to_box_padding_size - height > 0) {
                    y_pos = boxLocation[i][1] - box_to_box_padding_size - height;
                    i = 0;
                }
                else
                up = 1;
            }
            else {
                if(temp_text == hypo_box_font_size_change){
                    hypo_box_font_size_change -= 1;
                    if(hypo_box_font_size_change > 5){}// TODO dots
                }
                break;
            }
        }
        else{
            i++;
        }
    }
    boxLocationObj[eventID] = [x_pos, y_pos, width, height, adaptObj[eventID][5], adaptObj[eventID][6]];
    boxLocation.push([x_pos,y_pos,width,height,text,eventID]);
    boxLocation.sort(function(a,b) {
        if(a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    });
    //sessionStorage.setItem("boxLocation", JSON.stringify(boxLocation));
}
function removeHypoAdaptation(eventID, callback) {
    // empirical undraw
    if(adaptObj[eventID][4] == 0) {
        delete boxLocationObj[eventID];
        for (var i = 0; i < boxLocation.length; i++) {
            if(boxLocation[i][5] == eventID) {
                //boxCanvasWrapperClear(boxLocation[i][0], boxLocation[i][1], boxLocation[i][2], boxLocation[i][3]);
                if(boxLocation.length == 1)
                boxLocation = [];
                else
                boxLocation.splice(i, 1);
                i = boxLocation.length;
            }
        }
    }
    else {
        for(var i = 0; i < boxLocation.length; i++) {
            if(boxLocation[i][5] == eventID) {
                //boxCanvasWrapperClear(boxLocation[i][0], boxLocation[i][1], boxLocation[i][2], boxLocation[i][3]);
                //boxCanvasWrapperDraw(boxLocation[i][0], boxLocation[i][1], boxLocation[i][2], boxLocation[i][3], boxLocation[i][4], false);
            }
        }
    }

    // Relations undraw
    relationsObj[eventID].forEach(function(item){
        if(adaptObj[item[0]][4] < 1) {
            for(var i = 0; i < boxLocation.length; i++) {
                if(boxLocation[i][5] == item[0]) {
                    if(boxLocation.length == 1)
                    boxLocation = [];
                    else
                    boxLocation.splice(i, 1);
                    i = boxLocation.length;
                }
            }
        }
    });
    //delete relationsObj[eventID];
    hypo_box_font_size_change = hypo_box_font_size; // reset font size
    adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
    adaptArray = JSON.parse(sessionStorage.getItem("adaptArray"));
    relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
    empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));
    redrawHypo(0);
    drawLines(0);
    callback(eventID);
}
function drawAllBoxes() {
    // Clear boxes
    for(var i = 0; i < 12; i++) {
        hypoCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
    }
    boxLocation.forEach(function(item){
        var empirical = (relationsObj[item[5]] == undefined)? false:true;
        boxCanvasWrapperDraw(item[0], item[1], item[2], item[3], item[4], item[5], empirical);
    });
}
function redrawHypo(size) {
    // Reposition boxes only
    if(Math.abs(last_scroll_ratio - scroll_ratio) > size && (last_hypo_font_size == hypo_box_font_size_change) && size != 0) {
        // Clear boxes
        for(var i = 0; i < 12; i++) {
            hypoCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
        }
        // Move then redraw the same box
        boxLocation.forEach(function(item){
            var date = adaptObj[item[5]][1];
            var empirical = (relationsObj[item[5]] != undefined)? true:false;
            if(date >= 1000000) {
                date = date + 4000000;
            }
            else {
                date = date * 5;
            }
            timespan = (date_start - date_end);
            viewable_time = timespan * scroll_ratio;
            increment_per_pixel = (viewable_time/canvas_div_w);
            x_pos = date/increment_per_pixel;
            x_pos = ((canvas_div_w/scroll_ratio) - x_pos) - item[2]/2;
            item[0] = x_pos;


            boxLocationObj[item[5]][0] = x_pos;
            boxCanvasWrapperDraw(item[0], item[1], item[2], item[3], item[4], empirical);
        });
        last_scroll_ratio = scroll_ratio;
    }

    else if(Math.abs(last_scroll_ratio - scroll_ratio) > size || size == 0) {
        last_scroll_ratio = scroll_ratio;
        last_hypo_font_size = hypo_box_font_size_change;
        hypo_box_font_size_change = hypo_box_font_size;
        temp_text = 0;
        // Clear boxes
        for(var i = 0; i < 12; i++) {
            hypoCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
        }

        while(hypo_box_font_size_change != temp_text) {
            temp_text = hypo_box_font_size_change;
            boxLocation = [];
            temp_text = hypo_box_font_size_change;
            dir = 1;
            for (var i = 0; i < adaptArray.length; i++) {
                createAdaptBox(adaptArray[i], adaptObj[adaptArray[i]][0], adaptObj[adaptArray[i]][1], function(eventID, text, width, height, date) {
                    positionAdaptBox(eventID, text, width, height, date);
                });
                if(hypo_box_font_size_change != temp_text)
                break;
            }
        }
        drawAllBoxes();
    }
}
function drawLines(size) {
    if(Math.abs(last_scroll_ratio_lines - scroll_ratio) > size || size == 0) {
        // Clearing old data
        last_scroll_ratio_lines = scroll_ratio;
        for(var i = 0; i < 12; i++) {
            hypoCanvas2[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
        }
        empiricalTable.forEach(function(item){
            // Loading data for the lines to be
            var temp = relationsObj[item[0]].slice();
            var temp_l = [];
            var temp_r = [];
            for(var i = 0; i < temp.length; i++){
                if(adaptObj[temp[i][0]][1] > adaptObj[item[0]][1])
                    temp_l.push(temp[i][0]);
                else
                    temp_r.push(temp[i][0]);

            }
            for (var i = 0; i < temp_l.length; i++) {
                temp_l[i] = boxLocationObj[temp_l[i]];
            }
            for (var i = 0; i < temp_r.length; i++) {
                temp_r[i] = boxLocationObj[temp_r[i]];
            }
            temp_r.sort(function(a,b) {if(a[1] === b[1]) {return 0;}else {return (a[1] < b[1]) ? -1 : 1;}});
            temp_l.sort(function(a,b) {if(a[1] === b[1]) {return 0;}else {return (a[1] < b[1]) ? -1 : 1;}});

            // Draw lines left of item (empirical)
            for(var i = 0; i < boxLocationObj[item[0]][4]; i++){
                var y_incr = boxLocationObj[item[0]][3]/(boxLocationObj[item[0]][4] + 1);

                // Box overlap case
                if((temp_l[i][0] >= boxLocationObj[item[0]][0] - box_to_box_padding_size && temp_l[i][0] <= boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + box_to_box_padding_size) ||
                   (temp_l[i][0]  <= boxLocationObj[item[0]][0] + box_to_box_padding_size && temp_l[i][0] + temp_l[i][1] >= boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + box_to_box_padding_size) ||
                   (temp_l[i][0] + temp_l[i][1] >= boxLocationObj[item[0]][0] - box_to_box_padding_size  && temp_l[i][0] + temp_l[i][1] <= boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + box_to_box_padding_size)) {
                    var x1 = boxLocationObj[item[0]][0] + (boxLocationObj[item[0]][2]/2);
                    var y1 = boxLocationObj[item[0]][1] + y_incr * (i+1);
                    var x2 =  boxLocationObj[item[0]][0] - box_to_box_padding_size / 2;
                    var y2 = (boxLocationObj[item[0]][1] > temp_l[i][1])? boxLocationObj[item[0]][1] - ((boxLocationObj[item[0]][1] - (temp_l[i][1] + temp_l[i][3])) / 2) : boxLocationObj[item[0]][1] + boxLocationObj[item[0]][3] + ((temp_l[i][1] - (boxLocationObj[item[0]][1] + boxLocationObj[item[0]][3])) / 2);
                    var x3 = temp_l[i][0] + temp_l[i][2] + box_to_box_padding_size / 2;
                    var y3 = temp_l[i][1] + (temp_l[i][3]/2);
                    var x4 = temp_l[i][0] + (temp_l[i][2]/2);

                    lineCanvasWrapperDraw(x1,y1,x2,y1);
                    lineCanvasWrapperDraw(x2,y1,x2,y2);
                    lineCanvasWrapperDraw(x2,y2,x3,y2);
                    lineCanvasWrapperDraw(x3,y2,x3,y3);
                    lineCanvasWrapperDraw(x3,y3,x4,y3);
                }
                // Ideal case
                else{
                    var x1 = boxLocationObj[item[0]][0] + (boxLocationObj[item[0]][2]/2);
                    var y1 = boxLocationObj[item[0]][1] + y_incr * (i+1);
                    var x2 = boxLocationObj[item[0]][0] - ((boxLocationObj[item[0]][0] - (temp_l[i][0] + temp_l[i][2]))/ 2);
                    var y2 = temp_l[i][1] + (temp_l[i][3]/2);
                    var x3 = temp_l[i][0] + (temp_l[i][2]/2);
                    lineCanvasWrapperDraw(x1,y1,x2,y1);
                    lineCanvasWrapperDraw(x2,y1,x2,y2);
                    lineCanvasWrapperDraw(x2,y2,x3,y2);
                }
            }

            // Draw lines right of item (empirical)
            for(var i = 0; i < boxLocationObj[item[0]][5]; i++){
                var y_incr = boxLocationObj[item[0]][3]/(boxLocationObj[item[0]][5] + 1);
                // Box overlap case
                if((temp_r[i][0] >= boxLocationObj[item[0]][0] - box_to_box_padding_size && temp_r[i][0] <= boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + box_to_box_padding_size) ||
                    (temp_r[i][0]  <= boxLocationObj[item[0]][0] + box_to_box_padding_size && temp_r[i][0] + temp_r[i][1] >= boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + box_to_box_padding_size) ||
                    (temp_r[i][0] + temp_r[i][1] >= boxLocationObj[item[0]][0] - box_to_box_padding_size  && temp_r[i][0] + temp_r[i][1] <= boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + box_to_box_padding_size)) {

                    var x1 = boxLocationObj[item[0]][0] + (boxLocationObj[item[0]][2]/2);
                    var y1 = boxLocationObj[item[0]][1] + y_incr * (i+1);
                    var x2 =  boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + box_to_box_padding_size / 2;
                    var y2 = (boxLocationObj[item[0]][1] > temp_r[i][1])? boxLocationObj[item[0]][1] - ((boxLocationObj[item[0]][1] - (temp_r[i][1] + temp_r[i][3])) / 2) : boxLocationObj[item[0]][1] + boxLocationObj[item[0]][3] + ((temp_r[i][1] - (boxLocationObj[item[0]][1] + boxLocationObj[item[0]][3])) / 2);
                    var x3 = temp_r[i][0] - (box_to_box_padding_size / 2);
                    var y3 = temp_r[i][1] + (temp_r[i][3]/2);
                    var x4 = temp_r[i][0] + (temp_r[i][2]/2);

                    lineCanvasWrapperDraw(x1,y1,x2,y1);
                    lineCanvasWrapperDraw(x2,y1,x2,y2);
                    lineCanvasWrapperDraw(x2,y2,x3,y2);
                    lineCanvasWrapperDraw(x3,y2,x3,y3);
                    lineCanvasWrapperDraw(x3,y3,x4,y3);
                }
                // Ideal case
                else{
                    var x1 = boxLocationObj[item[0]][0] + (boxLocationObj[item[0]][2]/2);
                    var y1 = boxLocationObj[item[0]][1] + y_incr * (i+1);
                    var x2 = boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2] + ((temp_r[i][0] -(boxLocationObj[item[0]][0] + boxLocationObj[item[0]][2]))/ 2);
                    var y2 = temp_r[i][1] + (temp_r[i][3]/2);
                    var x3 = temp_r[i][0] + (temp_r[i][2]/2);
                    lineCanvasWrapperDraw(x1,y1,x2,y1);
                    lineCanvasWrapperDraw(x2,y1,x2,y2);
                    lineCanvasWrapperDraw(x2,y2,x3,y2);
                }
            }

        });
    }
}

//Empirical Timeline functions
function empiCanvasWrapperDraw(x_pos,y_pos,width_length,height_length,text) {
    var c_value = x_pos/canvas_div_w;
    var selected_canvas = 0;

    if(c_value <= 1)
        selected_canvas = 0;
    else if(c_value <= 2)
        selected_canvas = 1;
    else if(c_value <= 3)
        selected_canvas = 2;
    else if(c_value <= 4)
        selected_canvas = 3;
    else if(c_value <= 5)
        selected_canvas = 4;
    else if(c_value <= 6)
        selected_canvas = 5;
    else if(c_value <= 7)
        selected_canvas = 6;
    else if(c_value <= 8)
        selected_canvas = 7;
    else if(c_value <= 9)
        selected_canvas = 8;
    else if(c_value <= 10)
        selected_canvas = 9;
    else if(c_value <= 11)
        selected_canvas = 10;
    else if(c_value <= 12)
        selected_canvas = 11;

    x_pos = x_pos%canvas_div_w;
    var temp_x = 0;

    for(var i = -1; i < 2; i++) {
        if(selected_canvas + i >= 0 && selected_canvas + i <= 11) {
            temp_x = x_pos - (i * canvas_div_w);
            empirCanvas[selected_canvas + i].fillStyle = hypo_box_fill_style_empirical;
            empirCanvas[selected_canvas + i].fillRect(temp_x, y_pos, width_length, height_length);
            empirCanvas[selected_canvas + i].font = empir_box_font_size_change + "px " + empir_box_font_family;
            empirCanvas[selected_canvas + i].fillStyle = hypo_box_font_color;
            empirCanvas[selected_canvas + i].textAlign = "center";
            empirCanvas[selected_canvas + i].textBaseline="hanging";

            for (j = 0; j < text.length; j++) {
                empirCanvas[selected_canvas + i].fillText(text[j], temp_x + (0.5 * width_length), y_pos + (empir_text_in_box_padding_h*.5) + ((empir_box_font_size_change + ((j)?1:0)) * (j)));
            }
        }
    }
}
function empiCanvasWrapperDrawLines(x_pos,y_pos,width_length,height_length) {
    var c_value = x_pos/canvas_div_w;
    var selected_canvas = 0;

    if(c_value <= 1)
    selected_canvas = 0;
    else if(c_value <= 2)
    selected_canvas = 1;
    else if(c_value <= 3)
    selected_canvas = 2;
    else if(c_value <= 4)
    selected_canvas = 3;
    else if(c_value <= 5)
    selected_canvas = 4;
    else if(c_value <= 6)
    selected_canvas = 5;
    else if(c_value <= 7)
    selected_canvas = 6;
    else if(c_value <= 8)
    selected_canvas = 7;
    else if(c_value <= 9)
    selected_canvas = 8;
    else if(c_value <= 10)
    selected_canvas = 9;
    else if(c_value <= 11)
    selected_canvas = 10;
    else if(c_value <= 12)
    selected_canvas = 11;

    x_pos = x_pos%canvas_div_w;
    var temp_x = 0;

    for(var i = -1; i < 2; i++) {
        if(selected_canvas + i >= 0 && selected_canvas + i <= 11) {
            temp_x = x_pos - (i * canvas_div_w);
            empirCanvas[selected_canvas + i].strokeStyle = 'white';
            empirCanvas[selected_canvas + i].lineWidth = 2;
            empirCanvas[selected_canvas + i].beginPath();
            empirCanvas[selected_canvas + i].moveTo(temp_x + (width_length / 2), y_pos + (height_length / 2));
            empirCanvas[selected_canvas + i].lineTo(temp_x + (width_length / 2), 0);
            empirCanvas[selected_canvas + i].closePath();
            empirCanvas[selected_canvas + i].stroke();
        }
    }
}
function addEmpirAdaptation(eventID) {
    // Pull in new changes
    empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));

    // Draw new things if they all fit
    empir_temp_text = empir_box_font_size_change;
    empir_dir = (empir_dir)? 0:1;
    empiricalBox = [];
    empiricalTable.forEach(function(item) {
        createEmpirBox(item[0], item[1], item[2], function(eventID, text, width, height, date) {
            positionEmpirBox(eventID, text, width, height, date);
        });
        if(empir_box_font_size_change != temp_text)
        return;
    });
    while(empir_box_font_size_change != empir_temp_text) {
        empir_temp_text = empir_box_font_size_change;
        empiricalBox = [];
        for (var i = 0; i < empiricalTable.length; i++) {
            createEmpirBox(empiricalTable[i][0], empiricalTable[i][1], empiricalTable[i][2], function(eventID, text, width, height, date) {
                positionEmpirBox(eventID, text, width, height, date);
            });
            if(empir_box_font_size_change != empir_temp_text)
            break;
        }
    }
    // Draw all the boxes when done
    drawAllEmpirBoxes();
}
function removeEmpirAdaptation(eventID, callback) {
    empiricalTable.forEach(function(item){
        if(item[0] == eventID) {
            for(var i = 0; i < empiricalBox.length; i++) {
                if(empiricalBox[i][5] == eventID) {
                    if(empiricalBox.length == 1)
                    empiricalBox = [];
                    else
                    empiricalBox.splice(i, 1);
                    i = empiricalBox.length;
                }
            }
        }
    });
    empir_box_font_size_change = empir_box_font_size; // reset font size
    empiricalTable = JSON.parse(sessionStorage.getItem("empiricalTable"));
    redrawEmpir(0);
    callback(eventID);
}
function createEmpirBox(eventID, eventName, date, callback) {
    var textArray = [];
    if(empir_box_font_size_change <= 10){
        empir_text_in_box_padding_w = 1;
        empir_text_in_box_padding_h = 1;
    }
    else if(empir_box_font_size_change > 10){
        empir_text_in_box_padding_w = empir_std_text_in_box_padding_w;
        empir_text_in_box_padding_h = empir_std_text_in_box_padding_h;
    }
    ctx_top_1.font = empir_box_font_size_change + "px " + empir_box_font_family;
    var line = "";
    var temp_str = eventName.split(" ");
    temp_str.forEach(function(item) {
        if(line.length + item.length <= max_char_per_line) {
            line += item + " ";
        }
        else {
            textArray.push(line.trim().toUpperCase());
            line = item + " ";
        }
    });
    textArray.push(line.trim().toUpperCase());

    var longest_line = 0;
    var width = 0;
    textArray.forEach(function(item) {
        if(longest_line < ctx_top_1.measureText(item).width) {
            longest_line = ctx_top_1.measureText(item).width;
            width = parseInt((ctx_top_1.measureText(item).width + empir_text_in_box_padding_w).toFixed(0));
        }
    });
    var height = (empir_box_font_size_change * textArray.length) + ((textArray.length > 1)?(textArray.length-1):0) + empir_text_in_box_padding_h;
    callback(eventID, textArray, width, height, date);
}
function positionEmpirBox(eventID, text, width, height, date) {
    var x_pos = 0;
    var y_pos = 0;
    if(date >= 1000000) {
        date = date + 4000000;
    }
    else {
        date = date * 5;
    }
    timespan = (date_start - date_end);
    viewable_time = timespan * scroll_ratio;
    increment_per_pixel = (viewable_time/canvas_div_w);
    x_pos = date/increment_per_pixel;
    x_pos = ((canvas_div_w/scroll_ratio) - x_pos) - width/2;
    y_pos = canvas_div_h_empir/2 - height/2;

    var i = 0;
    var up = 0;
    var down = 0;
    var l_i = 0;
    while (i < empiricalBox.length) {
        // Hit x or y
        if(((x_pos >= empiricalBox[i][0] - empir_box_to_box_padding_size && x_pos <= empiricalBox[i][0] + empiricalBox[i][2] + empir_box_to_box_padding_size) ||
        (x_pos  <= empiricalBox[i][0] + empir_box_to_box_padding_size && x_pos + width >= empiricalBox[i][0] + empiricalBox[i][2] + empir_box_to_box_padding_size) ||
        (x_pos + width >= empiricalBox[i][0] - empir_box_to_box_padding_size  && x_pos + width <= empiricalBox[i][0] + empiricalBox[i][2] + empir_box_to_box_padding_size)) &&
        ((y_pos >= empiricalBox[i][1] && y_pos <= empiricalBox[i][1] + empiricalBox[i][3]) ||
        (y_pos <= empiricalBox[i][1] && y_pos + height >= empiricalBox[i][1] + empiricalBox[i][3]) ||
        (y_pos + height >= empiricalBox[i][1] && y_pos + height <= empiricalBox[i][1] + empiricalBox[i][3]))) {
            if(i > l_i) {
                empir_dir = (empir_dir)? 0:1;
                l_i = i;
            }
            empir_dir = (down)? 1:empir_dir;
            empir_dir = (up)? 0:empir_dir;
            if(!down && !empir_dir) {
                if (empiricalBox[i][1] + empiricalBox[i][3] + height + empir_box_to_box_padding_size < canvas_div_h_empir) {
                    y_pos = empiricalBox[i][1] + empiricalBox[i][3] + empir_box_to_box_padding_size;
                    i = 0;
                }
                else
                down = 1;
            }
            else if(!up && empir_dir) {
                if (empiricalBox[i][1] - empir_box_to_box_padding_size - height > 0) {
                    y_pos = empiricalBox[i][1] - empir_box_to_box_padding_size - height;
                    i = 0;
                }
                else
                up = 1;
            }
            else {
                if(empir_temp_text == empir_box_font_size_change){
                    empir_box_font_size_change -= 1;
                    if(empir_box_font_size_change > 5){}// TODO dots
                }
                break;
            }
        }
        else{
            i++;
        }
    }
    empiricalBox.push([x_pos,y_pos,width,height,text,eventID]);
    empiricalBox.sort(function(a,b) {
        if(a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    });
}
function drawAllEmpirBoxes() {
    // Clear boxes
    for(var i = 0; i < 12; i++) {
        empirCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_empir);
    }
    empiricalBox.forEach(function(item){
        empiCanvasWrapperDrawLines(item[0], item[1], item[2], item[3]);
    });
    empiricalBox.forEach(function(item){
        empiCanvasWrapperDraw(item[0], item[1], item[2], item[3], item[4]);
    });
}
function redrawEmpir(size) {
    if(Math.abs(last_empir_scroll_ratio - scroll_ratio) > size || size == 0) {
        last_empir_scroll_ratio = scroll_ratio;
        last_empir_font_size = empir_box_font_size_change;
        empir_box_font_size_change = empir_box_font_size;
        empir_temp_text = 0;
        // Clear boxes
        for(var i = 0; i < 12; i++) {
            empirCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_empir);
        }

        empir_dir = (empir_dir)? 0:1;
        while(empir_box_font_size_change != empir_temp_text) {
            empir_temp_text = empir_box_font_size_change;
            empiricalBox = [];
            empir_temp_text = empir_box_font_size_change;
            for (var i = 0; i < empiricalTable.length; i++) {
                createEmpirBox(empiricalTable[i][0], empiricalTable[i][1], empiricalTable[i][2], function(eventID, text, width, height, date) {
                    positionEmpirBox(eventID, text, width, height, date);
                });
                if(empir_box_font_size_change != empir_temp_text)
                break;
            }
        }
        drawAllEmpirBoxes();
    }
}

// Scroolbar functions
function drawScrollbarContainer () {
    var container_height = 0.2;
    var container_radius = canvas2_h * container_height;
    var x_padding = container_radius;
    var center_left_x = x_padding;
    var center_left_y = container_radius;
    var center_right_x = canvas2_w - x_padding;
    var center_right_y = container_radius;
    var arc_top = 1.5 * Math.PI;
    var arc_bot = 0.5*Math.PI;

    // Scrollbar Container
    ctx2_1.clearRect(0,0,ctx2_1.canvas.width, ctx2_1.canvas.height);
    ctx2_1.fillStyle = scrollbar_container_fill_style;
    ctx2_1.beginPath();
    ctx2_1.arc(center_left_x,center_left_y,container_radius,arc_top,arc_bot,true);
    ctx2_1.arc(center_right_x,center_right_y,container_radius,arc_bot,arc_top,true);
    ctx2_1.lineTo(center_left_x,center_left_y - container_radius);
    ctx2_1.closePath();
    ctx2_1.fill();
}
function drawScrollbarBlock(size) {
    // Defining Handles
    ctx2_2.clearRect(0, 0, ctx2_2.canvas.width, ctx2_2.canvas.height);
    var block_height = 0.2;
    var block_radius = canvas2_h * block_height;
    var hndl_left_x_padding = scroll_left_handle_x_position + block_radius;
    var hndl_right_x_padding = scroll_right_handle_x_position + block_radius;
    var hndl_cnt_left_x = hndl_left_x_padding;
    var hndl_cnt_left_y = block_radius;
    var hndl_cnt_right_x =  hndl_right_x_padding;
    var hndl_cnt_right_y = block_radius;
    var arc_top = 1.5 * Math.PI;
    var arc_bot = 0.5*Math.PI;

    // Scrollbar
    ctx2_2.fillStyle = scrollbar_handle_fill_style;

    // draw left handle
    var regx = scroll_left_handle_x_position;
    var regy = hndl_cnt_left_y - block_radius;
    var regwidth = 4 * block_radius;
    var regheight = 2 * block_radius;

    ctx2_2.beginPath();
    ctx2_2.arc(hndl_cnt_left_x,hndl_cnt_left_y,block_radius,arc_top,arc_bot,true);
    ctx2_2.lineTo(hndl_cnt_left_x,hndl_cnt_left_y + block_radius);
    //ctx2_2.lineTo(hndl_cnt_left_x + block_radius,hndl_cnt_left_y + (2 * block_radius));
    ctx2_2.lineTo(hndl_cnt_left_x + (2 * block_radius),hndl_cnt_left_y + block_radius);
    ctx2_2.arc(hndl_cnt_left_x + (2 * block_radius),hndl_cnt_left_y,block_radius,arc_bot,arc_top,true);
    ctx2_2.closePath();
    ctx2_2.fill();
    if(scrollRegions.length < 1) {
        scrollRegions.push({id:'left',x:regx,y:regy,width:regwidth,height:regheight,isDragging:false});
    }

    ctx2_2.fillStyle = scrollbar_block_fill_style;
    // draw block between handles
    regx = scroll_left_handle_x_position + (4 * block_radius);
    regy = hndl_cnt_left_y - block_radius;
    regwidth = canvas2_w * scroll_ratio - (8 * block_radius);
    regheight = 2 * block_radius;

    ctx2_2.beginPath();
    ctx2_2.lineTo(hndl_cnt_left_x + (2 * block_radius),hndl_cnt_left_y - block_radius);
    ctx2_2.lineTo(hndl_cnt_left_x + (2 * block_radius),hndl_cnt_left_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_right_x - (2 * block_radius),hndl_cnt_right_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_right_x - (2 * block_radius),hndl_cnt_right_y - block_radius);
    ctx2_2.closePath();
    ctx2_2.fill();
    if(scrollRegions.length < 2) {
        scrollRegions.push({id:'middle',x:regx,y:regy,width:regwidth,height:regheight,isDragging:false});
    }

    ctx2_2.fillStyle = scrollbar_handle_fill_style;
    // draw right handle
    regx = scroll_right_handle_x_position - 2 * block_radius;
    regy = hndl_cnt_left_y - block_radius;
    regwidth = 4 * block_radius;
    regheight = 2 * block_radius;

    ctx2_2.beginPath();
    ctx2_2.arc(hndl_cnt_right_x,hndl_cnt_right_y,block_radius,arc_top,arc_bot,false);
    ctx2_2.lineTo(hndl_cnt_right_x,hndl_cnt_right_y + block_radius);
    //ctx2_2.lineTo(hndl_cnt_right_x - block_radius,hndl_cnt_right_y + (2 * block_radius));
    ctx2_2.lineTo(hndl_cnt_right_x - (2 * block_radius),hndl_cnt_right_y + block_radius);
    ctx2_2.arc(hndl_cnt_right_x - (2 * block_radius),hndl_cnt_right_y,block_radius,arc_bot,arc_top,false)
    ctx2_2.closePath();
    ctx2_2.fill();
    if(scrollRegions.length < 3) {
        scrollRegions.push({id:'right',x:regx,y:regy,width:regwidth,height:regheight,isDragging:false});
    }

    scroll_ratio = ((scrollRegions[2].x + (4 * block_radius) - scrollRegions[0].x)/(canvas_div_w));
    scroll_position = scrollRegions[0].x/canvas_div_w;

    timespan = (date_start - date_end);
    viewable_time = timespan * scroll_ratio;
    left_edge_date = timespan - (timespan * scroll_position) + date_end;
    right_edge_date = timespan - (timespan * scroll_position) + date_end - (timespan * scroll_ratio);

    // draw increment text under scrollbar handles
    var x = 0 + 2;
    var y = hndl_cnt_left_y + (3.5 * block_radius);
    var left_text = 0;
    if(left_edge_date > 5000000) {
        left_text = ((left_edge_date - 4000000) / 1000000).toFixed(1);
    }
    else {
        left_text = (left_edge_date / 5000000).toFixed(2);
    }

    draw_start = left_text;
    left_text += 'M';
    ctx2_2.font = scrollbar_font_size + "px " + scrollbar_font_family;
    ctx2_2.fillStyle = scrollbar_font_color;
    ctx2_2.textAlign = "left";
    ctx2_2.fillText(left_text, x, y);
    ctx2_2.textAlign = "right";
    x = canvas_div_w - 2;
    y = hndl_cnt_left_y + (3.5 * block_radius);
    var right_text = 0;
    if(right_edge_date > 5000000) {
        right_text = ((right_edge_date - 4000000) / 1000000).toFixed(1);
    }
    else {
        right_text = Math.abs(right_edge_date / 5000000).toFixed(2);
    }
    draw_end = right_text;
    right_text += 'M';
    ctx2_2.fillText(right_text, x, y);

    drawTimelineIncrements(size);
}
function drawTimelineIncrements(size) {
    if(Math.abs(last_scroll_ratio_inc - scroll_ratio) > size || Math.abs(last_scroll_position_inc - scroll_position) > size || size == 0 ) {
        last_scroll_ratio_inc = scroll_ratio;
        last_scroll_position_inc = scroll_position;
        ctx1_1.clearRect(0,0,ctx1_1.canvas.width,ctx1_1.canvas.height);
        ctx1_1.font = increments_font_size + "px " + increments_font_family;
        ctx1_1.fillStyle = increments_font_color;
        ctx1_1.textAlign = "center";
        ctx1_1.strokeStyle = increments_font_color;
        ctx1_1.lineWidth = 2;

        timespan = (date_start - date_end);
        viewable_time = timespan * scroll_ratio;
        left_edge_date = timespan - (timespan * scroll_position) + date_end;
        right_edge_date = timespan - (timespan * scroll_position) + date_end - (timespan * scroll_ratio);

        var total_increments = (timespan/1000000) + 1;

        var increment_per_pixel = (viewable_time/(ctx1_1.canvas.width-40));
        var total_scale_size = timespan / increment_per_pixel;
        var change = total_scale_size / (total_increments - 1);
        var xpos = 20+(0 - (total_scale_size * scroll_position));

        var textwidth = ctx1_1.measureText("0.2M").width;
        var text = '';
        for(var i = 0; i < total_increments; i++) {
            ctx1_1.font = increments_font_size + "px " + increments_font_family;
            ctx1_1.fillStyle = increments_font_color;
            ctx1_1.textAlign = "center";
            ctx1_1.strokeStyle = increments_font_color;
            ctx1_1.lineWidth = 2;
            text = '';
            if(((date_start - 4000000) / 1000000) - i >= 1) {
                text += ((date_start - 4000000) / 1000000) - i;
                text += 'M';
            }
            else {
                text = ((date_start-4000000)/1000000) - i;
                text = (.8 + (text * 0.2)).toFixed(1);
                text = (text < 0.09)?0:text;
                text += 'M';
            }
            ctx1_1.fillText(text, xpos, 20);
            if(change/4 > textwidth*3) {
                for(var j = 1; j < 10; j++ ) {
                    if (j == 5) {
                        ctx1_1.font = "13px " + increments_font_family;
                        ctx1_1.fillStyle = increments_font_color;
                        ctx1_1.textAlign = "center";
                        ctx1_1.strokeStyle = increments_font_color;
                        ctx1_1.lineWidth = 2;
                        text = '';
                        if(((date_start - 4000000) / 1000000) - i >= 2) {
                            text += ((date_start - 4500000) / 1000000) - i;
                            text += 'M';
                        }
                        else {
                            text = ((date_start-4000000)/1000000) - i;
                            text = (.8 + (text * 0.2) - 0.1).toFixed(1);
                            text = (text < 0.09)?0:text;
                            text += 'M';
                        }
                        ctx1_1.fillText(text, xpos + j * change/10, canvas1_1.height + 2 - 2 *canvas1_1.height/4 - 3);
                        ctx1_1.beginPath();
                        ctx1_1.moveTo(xpos + j * change/10,canvas1_1.height + 2 - canvas1_1.height/4);
                        ctx1_1.lineTo(xpos + j * change/10,canvas1_1.height + 2 - 2 * canvas1_1.height/4);
                        ctx1_1.closePath();
                        ctx1_1.stroke();
                    }
                    else {
                        ctx1_1.beginPath();
                        ctx1_1.moveTo(xpos + j * change/10,canvas1_1.height + 2 - canvas1_1.height/4);
                        ctx1_1.lineTo(xpos + j * change/10,canvas1_1.height + 2 - 1.5 * canvas1_1.height/4);
                        ctx1_1.closePath();
                        ctx1_1.stroke();
                    }
                }
            }
            else if(change/4 > textwidth) {
                for(var j = 1; j < 4; j++ ) {
                    if (j == 2) {
                        ctx1_1.font = "15px " + increments_font_family;
                        ctx1_1.fillStyle = increments_font_color;
                        ctx1_1.textAlign = "center";
                        ctx1_1.strokeStyle = increments_font_color;
                        ctx1_1.lineWidth = 2;
                        text = '';
                        if(((date_start - 4000000) / 1000000) - i >= 2) {
                            text += ((date_start - 4500000) / 1000000) - i;
                            text += 'M';
                        }
                        else {
                            text = ((date_start-4000000)/1000000) - i;
                            text = (.8 + (text * 0.2) - 0.1).toFixed(1);
                            text = (text < 0.09)?0:text;
                            text += 'M';
                        }
                        ctx1_1.fillText(text, xpos + j * change/4, canvas1_1.height + 2 - 2 *canvas1_1.height/4 - 3);
                        ctx1_1.beginPath();
                        ctx1_1.moveTo(xpos + j * change/4,canvas1_1.height + 2 - canvas1_1.height/4);
                        ctx1_1.lineTo(xpos + j * change/4,canvas1_1.height + 2 - 2 * canvas1_1.height/4);
                        ctx1_1.closePath();
                        ctx1_1.stroke();
                    }
                    else {
                        ctx1_1.beginPath();
                        ctx1_1.moveTo(xpos + j * change/4,canvas1_1.height + 2 - canvas1_1.height/4);
                        ctx1_1.lineTo(xpos + j * change/4,canvas1_1.height + 2 - 1.5 * canvas1_1.height/4);
                        ctx1_1.closePath();
                        ctx1_1.stroke();
                    }
                }
            }
            else {
                ctx1_1.beginPath();
                ctx1_1.moveTo(xpos + change/2,canvas1_1.height + 2 - canvas1_1.height/4);
                ctx1_1.lineTo(xpos + change/2,canvas1_1.height + 2 - 2 * canvas1_1.height/4);
                ctx1_1.closePath();
                ctx1_1.stroke();
            }



            xpos += change;
        }
    }
}

// HTML injection strings
var hypothesis_adapt_canvas = `
<canvas id="hypothesis-canvas-1" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-2" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-3" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-4" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-5" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-6" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-7" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-8" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-9" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-10" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-11" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas-12" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
`;
var hypothesis_lines_canvas = `
<canvas id="hypothesis-canvas2-1" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-2" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-3" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-4" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-5" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-6" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-7" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-8" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-9" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-10" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-11" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="hypothesis-canvas2-12" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
`;
var empirical_canvas = `
<canvas id="empirical-canvas-1" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-2" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-3" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-4" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-5" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-6" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-7" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-8" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-9" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-10" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-11" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
<canvas id="empirical-canvas-12" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
`;
