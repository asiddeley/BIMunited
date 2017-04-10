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
	module: 	uiBlackboard
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	22-Jan-2017
	
*/


define(
// load dependencies...
['jquery', 'babylon'],

// then do...
function($, BJS){

var UI=function(board, title){

	// board - DOM element container for user intefaces (UI) 
	this.div$=$('<div></div>');
	if (typeof title != 'undefined' && title != null) {this.alias=title;}
	else {this.alias='UI';} 
	// If board is provided, then the intention is to make this UI its own dialog otherwise
	// it's assumed this will be a ui contianed in and managed by another UI 
	if (typeof board != 'undefined' && board != null){ 
		this.board$=$(board).append(this.div$);
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog({draggable:true, title:this.alias, autoOpen:true});
	}
	
	BIM.fun.on(this.getEvents());	
	return this;
};
	
UI.prototype.getKeywords=function(keywords){
	//get or set keyword-handlers
	if (typeof keywords==Array){this.keywords=keywords}
	else if (this.keywords==null){ this.keywords=[{
			aliases:['dd', 'toggle'],
			desc:'Open/close this dialog',
			handler:function(that){return that.toggle();}	
		}];
	}
	return this.keywords;
};

UI.prototype.getEvents=function(){
	// Beware of using 'this' in event handlers as it will refer to the callers context
	// Instead assume 'this' is passed in event data thus... handler(ev){ev.data.toggle();}
	return { 
		bimInput: {name:'bimInput',	handler:this.onInput, data:this }
	};
};

UI.prototype.keywords=null;
	
UI.prototype.onInput=function(ev, input){
	//BIM.fun.log(input);
	//call others to process input 
	//this.div$.trigger('bimInput', [command]);
	
	//Tabbed responsible for following input 
	//ev.data=this which is context of TabbedUI instance
	switch (input) {
		case 'dd':ev.data.toggle();break;
	};
};
			
UI.prototype.toggle=function(){
	if (this.div$.is(':ui-dialog')){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}
};

return UI;

});


