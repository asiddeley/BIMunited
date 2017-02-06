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
	module: 	uiPicker
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	6-Feb-2017
	
*/


define(
// load dependencies...
['jquery'],

// then do...
function($){

var uiPicker={

	//init instead of create
	create:function(el$){
		// create a new copy (of this template) and initialize
		var uip=$.extend({}, uiPicker);
		uip.el$=el$;
		el$.text('Picker...<br>Picked parts:');
		uip.pick$('<div></div>');
		el$.append(this.pick$);
		
		return uip;
	},
		
	el$:null,
	
	done:function(){
		el$.hide();
	},
	
	pick$:null,
	
	pick:[],
	
	push:function( part ){ 
		this.part.push(part);
		this.pick$.text(this.pick.length.toString()); //update board
	},
	
	remove:function(part){
		var i=this.pick.findIndex( function(item){ return (part===item); } );
		if (i > -1) this.pick.remove(part);
		this.pick$.text(this.pick.length.toString()); //update board
	},
	
	start:function(){ 
		this.el$.show();
		this.pick=[]; //clear
		this.pick$.text( '0' );  //update board
	},
	
	
};


return uiPicker;

});


