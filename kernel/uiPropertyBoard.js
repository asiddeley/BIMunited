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
['jquery', 'kernel/widgetProperty'],

// then do...
function($, wp){


var UiPropertyBoard={
	
	aProperty:[],	// array for various property widgets

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
	
	clear:function(){
		//clear all values from aProperties
		this.count=0;
		for (i=0; i<this.aProperty.length; i++){
			$(this.aProperty[i]).hide();
		}
	},
	
	count:0,

	label:function(title, label, callback){
		var p=this.aProperty[this.count++];
		//Call widget method 'label', passing title, label & callback
		//see jquery-ui widget factory documentation for info on working with widgets
		$(p).wProperty('label', title, label, callback).show();
	},	

	point3d:function(title, point3d, callback){
		var p=this.aProperty[this.count++];
		$(p).wProperty('point3d', title, point3d.toString(), callback).show();
	},

	real:function(title, real, callback){
		var p=this.aProperty[this.count++];
		$(p).wProperty('text', title, real.toString(), callback).show();
	},
		
	text:function(title, text, callback){	
		var p=this.aProperty[this.count++];
		$(p).wProperty('text', title, text, callback).show();
	}

};

return UiPropertyBoard;

});


