/************** Canvas Main **************/

/* Canvas Div Dimensions */
var canvas_div_w = 0; // Container of Canvas width in pixels
var canvas_div_h_hypo = 0; // Container of Hypothetical Canvas height in pixels
var canvas_div_h_scroll = 0; // Container of Scrollbar Canvas height in pixels
var canvas_div_h_emper = 0; // Container of Emperical Canvas height in pixels

/* Canvas Dimensions */

// Hypothetical Canvas Dimensions
var canvas1_1_h = 0; // Hypothetical Canvas (Layer 1: Timeline) height in pixels
var canvas1_234_h = 0; // Hypothetical Canvas (Layer 2: Grey Areas, Layer 3: Connections, Layer 4: Adaptaions) height in pixels

// Scrollbar Canvas Dimentsions
var canvas2_12_w = 0; // Scrollbar Canvas (Layer 1: Scrollbar Container, Layer 2: Scrollbar Block) width in pixels
var canvas2_12_h = 0; // Scrollbar Canvas (Layer 1: Scrollbar Container, Layer 2: Scrollbar Block) height in pixels

// Emperical Canvas Dimensions
var canvas3_1_h = 0; // Emperical Canvas (Layer 1: Timeline) height in pixels
var canvas3_2_h = 0; // Emperical Canvas (Layer 2: Connections, Layer 3: Adaptations) height in pixels

// Canvas Drawing Variables
var topcanvas1;
var topcanvas2;
var topcanvas3;
var topcanvas4;
var topcanvas5;
var topcanvas6;
var topcanvas7;
var topcanvas8;
var topcanvas9;
var topcanvas10;
var topcanvas11;
var topcanvas12;

var topcanvas21;
var topcanvas22;
var topcanvas23;
var topcanvas24;
var topcanvas25;
var topcanvas26;
var topcanvas27;
var topcanvas28;
var topcanvas29;
var topcanvas210;
var topcanvas211;
var topcanvas212;

var botcanvas1;
var botcanvas2;
var botcanvas3;
var botcanvas4;
var botcanvas5;
var botcanvas6;
var botcanvas7;
var botcanvas8;
var botcanvas9;
var botcanvas10;
var botcanvas11;
var botcanvas12;

var canvas1_1;

var canvas2_1;
var canvas2_2;

var ctx_top_1;
var ctx_top_2;
var ctx_top_3;
var ctx_top_4;
var ctx_top_5;
var ctx_top_6;
var ctx_top_7;
var ctx_top_8;
var ctx_top_9;
var ctx_top_10;
var ctx_top_11;
var ctx_top_12;

var ctx_top2_1;
var ctx_top2_2;
var ctx_top2_3;
var ctx_top2_4;
var ctx_top2_5;
var ctx_top2_6;
var ctx_top2_7;
var ctx_top2_8;
var ctx_top2_9;
var ctx_top2_10;
var ctx_top2_11;
var ctx_top2_12;

var ctx_bot_1;
var ctx_bot_2;
var ctx_bot_3;
var ctx_bot_4;
var ctx_bot_5;
var ctx_bot_6;
var ctx_bot_7;
var ctx_bot_8;
var ctx_bot_9;
var ctx_bot_10;
var ctx_bot_11;
var ctx_bot_12;

var ctx1_1;

var ctx2_1;
var ctx2_2;

// Global Variables
var scroll_ratio = 0.0; // Block/Container ratio in percent
var last_scroll_ratio = 1.0; // Used in redrawHypo
var scroll_position = 0.0; // Block/Container ratio in percent
var scroll_left_handle_x_position = 0;
var scroll_right_handle_x_position = 0;
var minScrollbar = 151;
var scrollRegions = [];
var hypoCanvas = [];
var hypoCanvas2 = [];
var draw_start = 0; // Redrawable Area start in pixels
var draw_end = 0; // Redrawable Area start in pixels
var date_start = 12000000; // Earliest date from selected adapations
var date_end = 000000; // Latest date from selected adaptations
var largest_timespan = 12000000; // When user is all the way scaled out, what is the largest amount of time to be viewed
var smallest_timespan = 1000000; // When user is all the way scaled in, what is the smallest amount of time to be viewed
var max_char_per_line = 15; // Used in positionAdaptBox
var hypo_box_fill_style_relation = "rgba(111,130,145,1.0)";
var hypo_box_fill_style_emperical = "rgba(6,74,121,1.0)";
var hypo_box_font_color = "rgba(255,255,255,1)";
var box_to_box_padding_size = 18;
var text_in_box_padding_w = 5;
var text_in_box_padding_h = 5;
var hypo_box_font_size = 25;
var hypo_box_font_size_change = 25;
var last_hypo_font_size = 25; // Used in redrawHypo
var hypo_box_font_family = "Roboto";
var scrollbar_container_fill_style = "rgba(220,220,220,0.3)";
var scrollbar_block_fill_style = "rgba(250,250,250,0.5)";
var scrollbar_handle_fill_style = "rgba(255,255,255,1.0)";
var scrollbar_font_color = "rgba(255,255,255,0)";
var scrollbar_font_size = 13;
var scrollbar_font_family = "Roboto";
var increments_font_color = "rgba(0,0,0,1)";
var increments_font_size = 25;
var increments_font_family = "Roboto";
var hypo_timeline_font_color = "rgba(255,255,255,1)";

var adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
var relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
var boxLocation = JSON.parse(sessionStorage.getItem("boxLocation"));
var lineLocation = [];

var timespan;
var viewable_time;
var left_edge_date;
var right_edge_date;
var bar_mouse_up = 0;

var canvasAdaptation = [];

function initCanvas() {
    scrollRegions = [];
    hypo_box_font_size_change = hypo_box_font_size;

    // Resize Canvases
    resizeCanvas();

    var BB = canvas2_2.getBoundingClientRect();
    var offsetX = BB.left;
    var offsetY = BB.top;
    // drag related variables
    var dragok = false;
    var startX;
    var startY;

    // listen for mouse events
    canvas2_2.onmousedown = scrollbarDown;
    window.onmouseup = scrollbarUp;
    window.onmousemove = scrollbarMove;

    // Initialize Scrollbar
    drawScrollbarContainer();
    drawScrollbarBlock();
    last_scroll_ratio = scroll_ratio;

    // handle mousedown events
    function scrollbarDown(e) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx=parseInt(e.clientX-offsetX);
        var my=parseInt(e.clientY-offsetY);
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

    // handle mouseup events
    function scrollbarUp(e) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        if(bar_mouse_up) {
            redrawLines(0);
            redrawHypo(0);
            bar_mouse_up = 0;
        }

        // clear all the dragging flags
        dragok = false;
        for (var i=0;i<scrollRegions.length;i++) {
            scrollRegions[i].isDragging=false;
        }
    }

    // handle mouse moves
    function scrollbarMove(e) {
        // if we're dragging anything...
        if(dragok) {
            // tell the browser we're handling this mouse event
            e.preventDefault();
            e.stopPropagation();

            // get the current mouse position
            var mx=parseInt(e.clientX-offsetX);
            var my=parseInt(e.clientY-offsetY);

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
            drawScrollbarBlock();
            redrawLines(.00001);
            redrawHypo(.00001);
            // reset the starting mouse position for the next mousemove
            startX=mx;
            startY=my;
        }

        // Move main canvas on scrollbarMove
        timespan = (date_start - date_end);
        viewable_time = timespan * scroll_ratio;
        increment_per_pixel = (viewable_time/canvas_div_w);
        canvas_usage = timespan/12000000;
        usable_canvas = canvas_timeline_w * canvas_usage;
        left_edge_date = timespan - (timespan * scroll_position) + date_end;
        var offset = -1 * ((12000000 - left_edge_date)/increment_per_pixel);
        $('#canvas-wrapper-lines-div').css("margin-left", offset + "px");
        $('#canvas-wrapper-adaptations-div').css("margin-left", offset + "px");
    }
};
function resizeCanvas() {
    $('#canvas-wrapper-lines-div').append(hypothesis_lines_canvas);
    $('#canvas-wrapper-adaptations-div').append(hypothesis_adapt_canvas);
    $('#emperical-canvas-div').append(emperical_canvas);

    // Set Canvas Div Size from Browser Realtime Values
    canvas_div_w = $('#hypothesis-canvas-div').width();
    canvas_div_h_hypo = $('#canvas-wrapper-adaptations-div').height();
    canvas_div_h_scroll = $('#scrollbar-canvas-div').height();
    canvas_div_h_emper = $('#emperical-canvas-div').height();
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
    // Resize Emperical Canvas
    // TODO set emperical canvas wrapper width to canvas_timeline_w

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

    botcanvas1 = document.getElementById('emperical-canvas-1');
    botcanvas2 = document.getElementById('emperical-canvas-2');
    botcanvas3 = document.getElementById('emperical-canvas-3');
    botcanvas4 = document.getElementById('emperical-canvas-4');
    botcanvas5 = document.getElementById('emperical-canvas-5');
    botcanvas6 = document.getElementById('emperical-canvas-6');
    botcanvas7 = document.getElementById('emperical-canvas-7');
    botcanvas8 = document.getElementById('emperical-canvas-8');
    botcanvas9 = document.getElementById('emperical-canvas-9');
    botcanvas10 = document.getElementById('emperical-canvas-10');
    botcanvas11 = document.getElementById('emperical-canvas-11');
    botcanvas12 = document.getElementById('emperical-canvas-12');

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


    ctx_bot_1 = botcanvas1.getContext("2d");
    ctx_bot_2 = botcanvas2.getContext("2d");
    ctx_bot_3 = botcanvas3.getContext("2d");
    ctx_bot_4 = botcanvas4.getContext("2d");
    ctx_bot_5 = botcanvas5.getContext("2d");
    ctx_bot_6 = botcanvas6.getContext("2d");
    ctx_bot_7 = botcanvas7.getContext("2d");
    ctx_bot_8 = botcanvas8.getContext("2d");
    ctx_bot_9 = botcanvas9.getContext("2d");
    ctx_bot_10 = botcanvas10.getContext("2d");
    ctx_bot_11 = botcanvas11.getContext("2d");
    ctx_bot_12 = botcanvas12.getContext("2d");

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
function boxCanvasWrapperDraw(x_pos,y_pos,width_length,height_length,text,emperical) {
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

            if (emperical) {
                    hypoCanvas[selected_canvas + i].fillStyle = hypo_box_fill_style_emperical;
            }
            else {
                hypoCanvas[selected_canvas + i].fillStyle = hypo_box_fill_style_relation;
            }

            hypoCanvas[selected_canvas + i].fillRect(temp_x, y_pos, width_length, height_length);
            hypoCanvas[selected_canvas + i].font = hypo_box_font_size + "px " + hypo_box_font_family;
            hypoCanvas[selected_canvas + i].fillStyle = hypo_box_font_color;
            hypoCanvas[selected_canvas + i].textAlign = "center";
            for (j = 0; j < text.length; j++) {
                hypoCanvas[selected_canvas + i].fillText(text[j], temp_x + (0.5 * width_length), y_pos + ((hypo_box_font_size + ((j)?1:0)) * (j + 1)));
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
    relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
    boxLocation = JSON.parse(sessionStorage.getItem("boxLocation"));
    var temp_text = hypo_box_font_size_change;
    if(adaptObj[eventID][4] < 1) {
        createAdaptBox(eventID, adaptObj[eventID][0], adaptObj[eventID][1], function(eventID, text, width, height, date) {
            positionAdaptBox(eventID, text, width, height, date);
        });
        if(hypo_box_font_size_change != temp_text)
            break;
    }
    relationsObj[eventID].forEach(function(item) {
        if(adaptObj[item[0]][4] == 0) {
            createAdaptBox(item[0], adaptObj[item[0]][0], adaptObj[item[0]][1], function(eventID, text, width, height, date) {
                positionAdaptBox(eventID, text, width, height, date);

            });
        }
        if(hypo_box_font_size_change != temp_text)
            break;
    });

    while(hypo_box_font_size_change != temp_text) {
        temp_text = hypo_box_font_size_change;
        redrawHypo(0);
    }

    drawLines();
    drawAllBoxes();
}
function createAdaptBox(eventID, eventName, date, callback) {
    var textArray = [];
    ctx_top_1.font = hypo_box_font_size + "px " + hypo_box_font_family;
    var line = "";
    var temp_str = eventName.split(" ");
    temp_str.forEach(function(item) {
        if(line.length + item.length <= max_char_per_line) {
            line += item + " ";
        }
        else {
            textArray.push(line.trim());
            line = item + " ";
        }
    });
    textArray.push(line.trim());

    var longest_line = 0;
    var width = 0;
    textArray.forEach(function(item) {
        if(longest_line < item.length) {
            longest_line = item.length;
            width = parseInt((ctx_top_1.measureText(item).width + text_in_box_padding_w).toFixed(0));
        }
    });
    var height = (hypo_box_font_size * textArray.length) + (text_in_box_padding_h * ((textArray.length > 1)?2:1));
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

    var canvas_usage = timespan/12000000;
    var usable_canvas = canvas_timeline_w * canvas_usage;
    var viewable_canvas = canvas_div_w / viewable_time;

    x_pos = date/increment_per_pixel;
    x_pos = ((canvas_div_w/scroll_ratio) - x_pos) - width/2;

    y_pos = canvas_div_h_hypo/2 - height/2;

    var i = 0;
    var up = 0;
    var down = 0;
    var dir = 0;
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
                    console.log('brk');
                    hypo_box_font_size_change -= 2;
                    return;
                }
        }
        else{
            i++;
        }
    }

    boxLocation.push([x_pos,y_pos,width,height,text,eventID]);
    boxLocation.sort(function(a,b) {
        if(a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    });
    sessionStorage.setItem("boxLocation", JSON.stringify(boxLocation));
}
function removeHypoAdaptation(eventID, callback) {
    // Emperical undraw
    relationsObj = JSON.parse(sessionStorage.getItem("relationsObj"));
    adaptObj = JSON.parse(sessionStorage.getItem("adaptObj"));
    hypo_box_font_size_change = hypo_box_font_size; // reset font size
    if(adaptObj[eventID][4] == 0) {
        for (var i = 0; i <= boxLocation.length; i++) {
            if(boxLocation[i][5] == eventID) {
                boxCanvasWrapperClear(boxLocation[i][0], boxLocation[i][1], boxLocation[i][2], boxLocation[i][3]);
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
                boxCanvasWrapperClear(boxLocation[i][0], boxLocation[i][1], boxLocation[i][2], boxLocation[i][3]);
                boxCanvasWrapperDraw(boxLocation[i][0], boxLocation[i][1], boxLocation[i][2], boxLocation[i][3], boxLocation[i][4], false);
            }
        }
    }

    // Relations undraw
    relationsObj[eventID].forEach(function(item) {
        if(adaptObj[item[0]][4] < 1) {
            for(var i = 0; i <= boxLocation.length; i++) {
                if(boxLocation[i][5] == item[0]) {
                    boxCanvasWrapperClear(boxLocation[i][0], boxLocation[i][1], boxLocation[i][2], boxLocation[i][3]);
                    if(boxLocation.length == 1)
                        boxLocation = [];
                    else
                        boxLocation.splice(i, 1);
                    i = boxLocation.length;
                }
            }
        }
    });
    sessionStorage.setItem("boxLocation", JSON.stringify(boxLocation));
    redrawLines(0);
    callback(eventID);
}
function drawLines() {
    var middleBoxObj = {};
    lineLocation = [];
    boxLocation.forEach(function(item){
        middleBoxObj[item[5]] = [(item[0] + (item[2]/2)), (item[1] + (item[3]/2))];
    });
    boxLocation.forEach(function(item){
        if(relationsObj[item[5]] != undefined){
                relationsObj[item[5]].forEach(function(item2){
                    if(middleBoxObj[item[5]][0] < middleBoxObj[item2[0]][1])
                        lineLocation.push([middleBoxObj[item[5]][0], middleBoxObj[item[5]][1], middleBoxObj[item2[0]][0], middleBoxObj[item2[0]][1], "black"]);
                    else
                        lineLocation.push([middleBoxObj[item2[0]][0], middleBoxObj[item2[0]][1], middleBoxObj[item[5]][0], middleBoxObj[item[5]][1], "black"]);
                });
        }
    });
    lineLocation.forEach(function(item){
        lineCanvasWrapperDraw(item[0], item[1], item[2], item[3], item[4]);
    });
}
function drawAllBoxes() {
    // Clear boxes
    for(var i = 0; i < 12; i++) {
        hypoCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
    }
    boxLocation.forEach(function(item){
        var emperical = (relationsObj[item[5]] == undefined)? false:true;
        boxCanvasWrapperDraw(item[0], item[1], item[2], item[3], item[4], emperical);
    });
}
function redrawHypo(size) {

        // Reposition boxes only
        if(Math.abs(last_scroll_ratio - scroll_ratio) > size && (last_hypo_font_size == hypo_box_font_size) && size != 0) {
            // Clear boxes
            for(var i = 0; i < 12; i++) {
                hypoCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
            }
            // Move then redraw the same box
            boxLocation.forEach(function(item){
                var date = adaptObj[item[5]][1];
                var emperical = (relationsObj[item[5]] != undefined)? true:false;
                if(date >= 1000000) {
                    date = date + 4000000;
                }
                else {
                    date = date * 5;
                }
                timespan = (date_start - date_end);
                viewable_time = timespan * scroll_ratio;
                increment_per_pixel = (viewable_time/canvas_div_w);
                var canvas_usage = timespan/12000000;
                var usable_canvas = canvas_timeline_w * canvas_usage;
                var viewable_canvas = canvas_div_w / viewable_time;
                x_pos = date/increment_per_pixel;
                x_pos = ((canvas_div_w/scroll_ratio) - x_pos) - item[2]/2;
                item[0] = x_pos;
                /*
                if(last_scroll_ratio < scroll_ratio){
                    var i = 0;
                    while (i < boxLocation.length) {
                        // Hit x or y
                        if(((x_pos >= boxLocation[i][0] - box_to_box_padding_size && x_pos <= boxLocation[i][0] + boxLocation[i][2] + box_to_box_padding_size) ||
                            (x_pos  <= boxLocation[i][0] + box_to_box_padding_size && x_pos + item[2] >= boxLocation[i][0] + boxLocation[i][2] + box_to_box_padding_size) ||
                            (x_pos + item[2] >= boxLocation[i][0] - box_to_box_padding_size  && x_pos + item[2] <= boxLocation[i][0] + boxLocation[i][2] + box_to_box_padding_size)) &&
                            ((item[2] >= boxLocation[i][1] && item[2] <= boxLocation[i][1] + boxLocation[i][3]) ||
                            (item[2] <= boxLocation[i][1] && item[2] + item[3] >= boxLocation[i][1] + boxLocation[i][3]) ||
                            (item[2] + item[3] >= boxLocation[i][1] && item[2] + item[3] <= boxLocation[i][1] + boxLocation[i][3]))) {
                                last_hypo_font_size = 0;
                        }
                        else{
                            i++;
                        }
                    }
                }*/
                boxCanvasWrapperDraw(item[0], item[1], item[2], item[3], item[4], emperical);
            });

            last_scroll_ratio = scroll_ratio;
            sessionStorage.setItem("boxLocation", JSON.stringify(boxLocation));
        }

        // TODO if needed medium redraw speedm, redraw and move without remaking boxes
         // Slowest redraw
        else if(Math.abs(last_scroll_ratio - scroll_ratio) > size || size == 0) {
            last_scroll_ratio = scroll_ratio;
            last_hypo_font_size = hypo_box_font_size;
            // Clear boxes
            for(var i = 0; i < 12; i++) {
                hypoCanvas[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
            }
            var tempLoc = boxLocation;
            boxLocation = [];
            for (var i = 0; i < tempLoc.length; i++) {
                createAdaptBox(tempLoc[i][5], adaptObj[tempLoc[i][5]][0], adaptObj[tempLoc[i][5]][1], function(eventID, text, width, height, date) {
                    positionAdaptBox(eventID, text, width, height, date);
                });
                if(hypo_box_font_size_change != temp_text)
                    return;
            }
            redrawLines(0);
            drawAllBoxes();
        }
}
function redrawLines(size) {
    if(Math.abs(last_scroll_ratio - scroll_ratio) > size || size == 0) {
        for(var i = 0; i < 12; i++) {
            hypoCanvas2[i].clearRect(0, 0, canvas_div_w, canvas_div_h_hypo);
        }
        drawLines();
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
    ctx2_1.fillStyle = scrollbar_container_fill_style;
    ctx2_1.beginPath();
    ctx2_1.arc(center_left_x,center_left_y,container_radius,arc_top,arc_bot,true);
    ctx2_1.arc(center_right_x,center_right_y,container_radius,arc_bot,arc_top,true);
    ctx2_1.lineTo(center_left_x,center_left_y - container_radius);
    ctx2_1.closePath();
    ctx2_1.fill();
}
function drawScrollbarBlock() {
    // Defining Handles
    ctx2_2.clearRect(0, 0, ctx2_2.canvas.width, ctx2_2.canvas.height);
    var block_height = 0.2;
    var block_radius = canvas2_h * block_height;
    var hndl_left_x_padding = scroll_left_handle_x_position + block_radius;
    var hndl_right_x_padding = (-1 * scroll_right_handle_x_position) + block_radius;
    var hndl_cnt_left_x = hndl_left_x_padding;
    var hndl_cnt_left_y = block_radius;
    var hndl_cnt_right_x = canvas2_w - hndl_right_x_padding;
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
    regwidth = canvas2_w - (8 * block_radius);
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
    regx = canvas2_w - (4 * block_radius);
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
    var x = scroll_left_handle_x_position + (2 * block_radius);
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
    ctx2_2.textAlign = "center";
    ctx2_2.fillText(left_text, x, y);
    x = scrollRegions[2].x + (2 * block_radius);
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

    drawTimelineIncrements();
}
function drawTimelineIncrements() {
    ctx1_1.clearRect(0,0,ctx1_1.canvas.width,ctx1_1.canvas.height);
    ctx1_1.font = increments_font_size + "px " + increments_font_family;
    ctx1_1.fillStyle = increments_font_color;
    ctx1_1.textAlign = "center";

    timespan = (date_start - date_end);
    viewable_time = timespan * scroll_ratio;
    left_edge_date = timespan - (timespan * scroll_position) + date_end;
    right_edge_date = timespan - (timespan * scroll_position) + date_end - (timespan * scroll_ratio);

    var total_increments = (timespan/1000000) + 1;

    var increment_per_pixel = (viewable_time/ctx1_1.canvas.width);
    var total_scale_size = timespan / increment_per_pixel;
    var change = total_scale_size / (total_increments - 1);
    var xpos = 0 - (total_scale_size * scroll_position);

    var text = '';
    for(var i = 0; i < total_increments; i++) {
        text = '';
        if(((date_start - 4000000) / 1000000) - i >= 1) {
          text += ((date_start - 4000000) / 1000000) - i;
          text += 'M';
        }
        else {
          text = ((date_start-4000000)/1000000) - i;
          text = (.8 + (text * 0.2)).toFixed(1);
          text += 'M';
        }
        ctx1_1.fillText(text, xpos, 20);
        xpos += change;
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
var emperical_canvas = `
    <canvas id="emperical-canvas-1" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-2" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-3" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-4" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-5" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-6" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-7" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-8" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-9" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-10" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-11" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    <canvas id="emperical-canvas-12" class="canvas-wrapper">Your browser doesn't support canvas</canvas>
    `;
