/************************************************************

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

	project:	BIM
	module: 	uiPartProperties
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	19-Jan-2017
	
*/


define(
// load dependencies...
// just loading widgetPartProperty initialized the widget factory in jquery.  Passed argument wp not used.
['jquery', 'kernel/widgetCell', 'kernel/widgetCellReal'],

// then do...
function($, wp, wcr){

var UiPropertyBoard={
	
	//aProperty:[],	// array for various property widgets
	
	/*
	create:function(el){
		// create a new copy (of this template) and initialize
		var r=$.extend({}, UiPropertyBoard);
		// el DOM element (div reference) to contain elements (div references) for multiple property widgets
		var div, i;
		for (i=0; i<10; i++){
			// create nested div element and widgetize it as a wProperty 
			div=$('<div></div>').text(i.toString());
			$(el).append(div);
			div.wProperty({'text':i.toString()}).hide();
			r.aProperty.push(div); 
		}
		return r;		
	},
	*/
	
	//count:0,
	
	display:function(part){
		//clear all values from aProperties
		//this.count=0;
		//for (i=0; i<this.aProperty.length; i++){$(this.aProperty[i]).hide();};
		
		//reset counters and hide cells
		this.xCell=0;
		this.wCell.forEach(function(item){item.hide();});
		this.xCellinfo=0;
		this.wCellinfo.forEach(function(item){item.hide();});
		this.xCellreal=0;
		this.wCellreal.forEach(function(item){item.hide();});
		this.xCellxyz=0;
		this.wCellxyz.forEach(function(item){item.hide();});

		
		//call each of the part's property accessor functions, each will call
		//this propertyBoard via functions below, info, real, text, xyz, etc
		var pp=part.handler.getProperties();
		//BIM.fun.log('properties...');
		for (var k in pp){ 
			//BIM.fun.log(k);
			pp[k](part, this); 
		}
	},
	
	element:null,
	
	init:function(element){
		this.element=element;
		return this; //to allow chaining
	},
	
	/////////////////
	//API functions
	
	//readonly property 
	info:function(name, valu, callback){
		//create wCellinfo widgets as they are needed. 
		//note that the index counter xCellinfo is reset to zero when a new bim part is picked
		//and cells are reused, not destroyed
		if (this.xCell>=this.wCell.length){
			var cell=$('<div></div>');
			$(this.element).append(cell);
			cell.wCell().hide();
			this.wCell.push(cell); 
		}
		//Call widget method 'vnc', passing valu, name & callback to set and show the cell 
		//see jquery-ui widget factory documentation
		$(this.wCell[this.xCell++]).wCell('vnc', valu, name, callback).show();
	},	

	point3d:function(name, valu, callback){
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('point3d', title, point3d.toString(), callback).show();
	},

	real:function(name, valu, callback){
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('text', title, real.toString(), callback).show();
		if (this.xCellreal>=this.wCellreal.length){
			var div=$('<div></div>');
			$(this.element).append(div);
			div.wCellreal().hide();
			this.wCellreal.push(div); 
		}
		$(this.wCellreal[this.xCellreal++]).wCellreal('vnc', valu, name, callback).show();			
	},
		
	text:function(name, valu, callback){	
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('text', title, text, callback).show();
		if (this.xCell>=this.wCell.length){
			var div=$('<div></div>');
			$(this.element).append(div);
			div.wCell().hide();
			this.wCell.push(div); 
		}
		//Call widget method 'vnc', passing valu, name & callback to set and show the cell 
		//see jquery-ui widget factory documentation
		$(this.wCell[this.xCell++]).wCell('vnc', valu, name, callback).show();			
	},
	
	xyz:function(name, valu, callback){
		//var p=this.aProperty[this.count++];
		//$(p).wProperty('point3d', title, point3d.toString(), callback).show();
	},
	
	////////////////////////
	//widget storage
	
	wCell:[], //text
	wCellinfo:[], //non editable
	wCellreal:[], //float
	wCellxyz:[], //x,y,z coordinate

	
	//index counters
	xCell:0,
	xCellinfo:0,
	xCellreal:0,
	xCellxyz:0 //x,y,z coordinate


};

return UiPropertyBoard;

});


