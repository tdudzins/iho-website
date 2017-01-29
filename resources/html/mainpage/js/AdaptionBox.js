/*
	Parameters: EventID (int), name (string), callback function. 
	The function should create the dimensions of the adaptation 
	box and flow of text within the box. 
	The final statement of the function should execute the callback 
	function with the appropriate outputs: callback(int EventID, 
	int x_length, int y_length, string[] text, [[int][int]] position).
*/

var maxCharactersPerLine = 20;
var x-length = 150;
var y-length = 70;
var nameLines = [];
var position = [[],[]]; 


function AdaptionBox(eventID, name, callback()){

	var nameLength = name.length;
	var i = 0;
	var j = 0;
	var x-length, y-length;
	
	position[0][0] = 5; //1st X-position
	
	//If the name length is less than 20, there is nothing more to do.
	if(nameLength <= maxCharactersPerLine){
		nameLines[0] = name;
	}else{
		nameSplit = name.split(" ");
		nameLines[0] = nameSplit[0];
		while(i < nameSplit.length - 1){
			if((nameLines[i].length + nameSplit[i+1].length + 1) <= maxCharactersPerLine){
				nameLines[j] = nameLines[i] + " " + nameSplit[i+1];
				++i;
			}else{
				++j;
			}
		}
		
		var numberLines = namesLines.length;
		y-length += ((numberLines -1) * 20);
	}
	
	if(scroll_ratio == 1/7){
		box_size = 16;
	}else if(scroll_ratio == 2/7){
		box_size = 15;
		x-length -= 5;
		y-length -= 5;
	}else if(scroll_ratio == 3/7){
		box_size = 14;
		x-length -= 10;
		y-length -= 10;
	}else if(scroll_ratio == 4/7){
		boz_size = 13;
		x-length -= 15;
		y-length -= 15;
	}else(scroll_ratio == 5/7){
		box_size = 12;
		x-length -= 20;
		y-length -= 20;
	}else{
		box_size = 0;
	}
	
	var spaceForText = numberLines * 10;
	position[1][0] = (y-length - spaceForText)/2; //1st Y-position
	for(var k = 1; k < numberLines; ++k){
		position[0][k] = 5; //X-position;
		position[1][k] = (position[1][k-1] + 10);
	}

	
	callback(eventID, x-length, y-length, nameLines[], position[][])
}