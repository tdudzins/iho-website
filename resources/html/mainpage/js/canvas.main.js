/************** Canvas Main **************/

// Global Variables

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
var canvas1_1 = document.getElementById('hypothesis-canvas-timeline');
var canvas1_2 = document.getElementById('hypothesis-canvas-greyarea');
var canvas1_3 = document.getElementById('hypothesis-canvas-connection');
var canvas1_4 = document.getElementById('hypothesis-canvas-adaptation');
var canvas2_1 = document.getElementById('scrollbar-canvas-container');
var canvas2_2 = document.getElementById('scrollbar-canvas-block');
var canvas3_1 = document.getElementById('emperical-canvas-timeline');
var canvas3_2 = document.getElementById('emperical-canvas-adaptation');

var ctx1_1;
var ctx1_2;
var ctx1_3;
var ctx1_4;
var ctx2_1;
var ctx2_2;
var ctx3_1;
var ctx3_2;

// Global Variables
var scroll_ratio = 0.0; // Block/Container ratio in percent
var scroll_left_handle_x_position = 0;
var scroll_right_handle_x_position = 0;
var scrollRegions = [];
var draw_start = 0; // Redrawable Area start in pixels
var draw_end = 0; // Redrawable Area start in pixels
var date_start = 0; // Earliest date from selected adapations
var date_end = 0; // Latest date from selected adaptations
var largest_timespan = 8000000; // When user is all the way scaled out, what is the largest amount of time to be viewed
var smallest_timespan = 1000000; // When user is all the way scaled in, what is the smallest amount of time to be viewed
var box_size = 0; // Represents font-size of adaptation box from CSS, if value is 0 then represent adapation as a point

function drawHypothesisTimeline () {
    //canvas_timeline_w
    //smallest_timespan
    //largest_timespan
}

window.onload=function(){
    scrollRegions = [];

    // Resize Canvases
    resizeCanvas();

    var BB=canvas2_2.getBoundingClientRect();
    var offsetX=BB.left;
    var offsetY=BB.top;
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

    // handle mousedown events
    function scrollbarDown(e){

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx=parseInt(e.clientX-offsetX);
        var my=parseInt(e.clientY-offsetY);
        // test each rect to see if mouse is inside
        dragok=false;
        for(var i=0;i<scrollRegions.length;i++){
            var r=scrollRegions[i];
            if(mx>r.x && mx<r.x+r.width && my>r.y && my<r.y+r.height){
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
    function scrollbarUp(e){
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // clear all the dragging flags
        dragok = false;
        for(var i=0;i<scrollRegions.length;i++){
            scrollRegions[i].isDragging=false;
        }
    }


    // handle mouse moves
    function scrollbarMove(e){
        // if we're dragging anything...
        if (dragok){
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
            for(var i=0;i<scrollRegions.length;i++){
                r=scrollRegions[i];
                r1 = scrollRegions[0];
                r2 = scrollRegions[1];
                r3 = scrollRegions[2];
                if(r.isDragging){
                    if (r.id == 'left') {
                        r1.x += dx;
                        scroll_left_handle_x_position += dx;
                        r2.x += dx;
                        r2.width -= dx;
                    }
                    else if (r.id == 'right') {
                        r3.x += dx;
                        scroll_right_handle_x_position += dx;
                        r2.width += dx;
                    }
                    else if (r.id == 'middle') {
                        r1.x += dx;
                        scroll_left_handle_x_position += dx;
                        r2.x += dx;
                        scroll_right_handle_x_position += dx;
                        r3.x += dx;
                    }
                }
            }

            // redraw
            ctx2_2.clearRect(0, 0, ctx2_2.canvas.width, ctx2_2.canvas.height);
            drawScrollbarBlock();

            // reset the starting mouse position for the next mousemove
            startX=mx;
            startY=my;

        }
    }
}; // end $(function(){});

/* Function: resizeCanvas()
Purpose: Called to initialize all canvases based on the respective
canvas div's dimentions. This will resize all layers for the Hypothetical,
Scrollbar and Emperical Canvas.
*/
function resizeCanvas () {
    // Set Canvas Div Size from Browser Realtime Values
    canvas_div_w = $('#hypothesis-canvas-div').width();
    canvas_div_h_hypo = $('#hypothesis-canvas-div').height();
    canvas_div_h_scroll = $('#scrollbar-canvas-div').height();
    canvas_div_h_emper = $('#emperical-canvas-div').height();
    canvas_timeline_w = canvas_div_w * (largest_timespan/smallest_timespan);

    // Calculate Hypothetical Canvas Dimensions
    canvas1_1_h = canvas_div_h_hypo * .10;
    canvas1_234_h = canvas_div_h_hypo;

    // Calculate Scrollbar Canvas Dimensions
    canvas2_w = canvas_div_w;
    canvas2_h = $('#scrollbar-canvas-div').height();

    // Calculate Emperical Canvas Dimensions
    canvas3_1_h = canvas_div_h_emper * .10;
    canvas3_2_h = canvas_div_h_emper;

    // Resize Hypothetical Canvas
    $('#hypothesis-canvas-timeline').width = canvas_timeline_w;
    $('#hypothesis-canvas-timeline').height = canvas1_1_h;
    $('#hypothesis-canvas-greyarea').width = canvas_timeline_w;
    $('#hypothesis-canvas-connection').width = canvas_timeline_w;
    $('#hypothesis-canvas-adaptation').width = canvas_timeline_w;

    // Resize Scrollbar Canvas
    $('#scrollbar-canvas-container').width = canvas_div_w;
    $('#scrollbar-canvas-block').width = canvas_div_w;

    // Resize Emperical Canvas
    $('#emperical-canvas-timeline').width = canvas_timeline_w;
    $('#emperical-canvas-timeline').height = canvas3_1_h;
    $('#emperical-canvas-adaptation').width = canvas_timeline_w;

    // Redefine Canvas Context(s)
    ctx1_1 = canvas1_1.getContext("2d");
    ctx1_1.canvas.width = canvas_timeline_w;
    ctx1_1.canvas.height = canvas1_1_h;

    ctx1_2 = canvas1_2.getContext("2d");
    ctx1_2.canvas.width = canvas_timeline_w;
    ctx1_2.canvas.height = canvas1_234_h;

    ctx1_3 = canvas1_3.getContext("2d");
    ctx1_3.canvas.width = canvas_timeline_w;
    ctx1_3.canvas.height = canvas1_234_h;

    ctx1_4 = canvas1_4.getContext("2d");
    ctx1_4.canvas.width = canvas_timeline_w;
    ctx1_4.canvas.height = canvas1_234_h;

    ctx2_1 = canvas2_1.getContext("2d");
    ctx2_1.canvas.width = canvas2_w;
    ctx2_1.canvas.height = canvas2_h;

    ctx2_2 = canvas2_2.getContext("2d");
    ctx2_2.canvas.width = canvas2_w;
    ctx2_2.canvas.height = canvas2_h;

    ctx3_1 = canvas3_1.getContext("2d");
    ctx3_1.canvas.width = canvas_timeline_w;
    ctx3_1.canvas.height = canvas3_1_h;

    ctx3_2 = canvas3_1.getContext("2d");
    ctx3_2.canvas.width = canvas_timeline_w;
    ctx3_2.canvas.height = canvas3_2_h;
}
function drawScrollbarContainer () {
    container_height = 0.2;
    container_radius = canvas2_h * container_height;
    x_padding = container_radius;
    center_left_x = x_padding;
    center_left_y = container_radius;
    center_right_x = canvas2_w - x_padding;
    center_right_y = container_radius;
    arc_top = 1.5 * Math.PI;
    arc_bot = 0.5*Math.PI;

    // Scrollbar Container
    ctx2_1.fillStyle = 'rgba(220,220,220,0.3)';
    ctx2_1.beginPath();
    ctx2_1.arc(center_left_x,center_left_y,container_radius,arc_top,arc_bot,true);
    ctx2_1.arc(center_right_x,center_right_y,container_radius,arc_bot,arc_top,true);
    ctx2_1.lineTo(center_left_x,center_left_y - container_radius);
    ctx2_1.closePath();
    ctx2_1.fill();
}
function drawScrollbarBlock() {
    // Defining Handles
    block_height = 0.2;
    block_radius = canvas2_h * block_height;
    hndl_left_x_padding = scroll_left_handle_x_position + block_radius;
    hndl_right_x_padding = (-1 * scroll_right_handle_x_position) + block_radius;
    hndl_cnt_left_x = hndl_left_x_padding;
    hndl_cnt_left_y = block_radius;
    hndl_cnt_right_x = canvas2_w - hndl_right_x_padding;
    hndl_cnt_right_y = block_radius;
    arc_top = 1.5 * Math.PI;
    arc_bot = 0.5*Math.PI;

    // Scrollbar
    ctx2_2.fillStyle = 'rgba(239,185,37,0.5)';
    ctx2_2.lineWidth = 0;

    // draw left handle
    regx = scroll_left_handle_x_position;
    regy = hndl_cnt_left_y - block_radius;
    regwidth = 4 * block_radius;
    regheight = 2 * block_radius;

    ctx2_2.beginPath();
    ctx2_2.arc(hndl_cnt_left_x,hndl_cnt_left_y,block_radius,arc_top,arc_bot,true);
    ctx2_2.lineTo(hndl_cnt_left_x,hndl_cnt_left_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_left_x + block_radius,hndl_cnt_left_y + (2 * block_radius));
    ctx2_2.lineTo(hndl_cnt_left_x + (2 * block_radius),hndl_cnt_left_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_left_x + (3 * block_radius),hndl_cnt_left_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_left_x + (3 * block_radius),center_left_y - block_radius);
    ctx2_2.closePath();
    ctx2_2.fill();
    if (scrollRegions.length < 1) {
        scrollRegions.push({id:'left',x:regx,y:regy,width:regwidth,height:regheight,isDragging:false});
    }

    // draw block between handles
    regx = scroll_left_handle_x_position + (4 * block_radius);
    regy = hndl_cnt_left_y - block_radius;
    regwidth = canvas2_w - (8 * block_radius);
    regheight = 2 * block_radius;

    ctx2_2.beginPath();
    ctx2_2.lineTo(hndl_cnt_left_x + (3 * block_radius),center_left_y - block_radius);
    ctx2_2.lineTo(hndl_cnt_left_x + (3 * block_radius),hndl_cnt_left_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_right_x - (3 * block_radius),hndl_cnt_right_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_right_x - (3 * block_radius),hndl_cnt_right_y - block_radius);
    ctx2_2.closePath();
    ctx2_2.fill();
    if (scrollRegions.length < 2) {
        scrollRegions.push({id:'middle',x:regx,y:regy,width:regwidth,height:regheight,isDragging:false});
    }

    // draw right handle
    regx = canvas2_w - (4 * block_radius) - 1;
    regy = hndl_cnt_left_y - block_radius;
    regwidth = 4 * block_radius;
    regheight = 2 * block_radius;

    ctx2_2.beginPath();
    ctx2_2.arc(hndl_cnt_right_x,hndl_cnt_right_y,block_radius,arc_top,arc_bot,false);
    ctx2_2.lineTo(hndl_cnt_right_x,hndl_cnt_right_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_right_x - block_radius,hndl_cnt_right_y + (2 * block_radius));
    ctx2_2.lineTo(hndl_cnt_right_x - (2 * block_radius),hndl_cnt_right_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_right_x - (3 * block_radius),hndl_cnt_right_y + block_radius);
    ctx2_2.lineTo(hndl_cnt_right_x - (3 * block_radius),hndl_cnt_right_y - block_radius);
    ctx2_2.closePath();
    ctx2_2.fill();
    if (scrollRegions.length < 3) {
        scrollRegions.push({id:'right',x:regx,y:regy,width:regwidth,height:regheight,isDragging:false});
    }
    scroll_ratio = ((scrollRegions[2].x + (4 * block_radius) - scrollRegions[0].x)/(canvas_div_w));
    scroll_position = scrollRegions[0].x/canvas_div_w;
    console.log(scroll_position);
}
