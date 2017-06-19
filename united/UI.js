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

var UI=function(board, title, options){

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
	if (typeof options == 'undefined') {options={ignoreInput:false};}
	
	// REGISTER EVENTS 
	BIM.fun.on(this.getEvents());
	
	// Init inputHandlers, array of {alias:['a'], desc:'about', handler:function}
	// or an empty array [] if options.ignoreInput is true. Ignoring input 
	// may be necessary if UI is not a stand-alone or used within another dialog
	if (!options.ignoreInput) {this.inputHandlers=this.getInputHandlers();}
	else {this.inputHandlers=[];}
	
	return this;
};

var __=UI.prototype;
	
__.getInputHandlers=function(){
	//returns an array of {alias:['a'], desc:'about', handler:function}
	//these inputHamdlers are common for all UI if inheritor so chooses
		
	return [{
		inputs:['events', 'ev'],
		desc:'Lists the events the UI responds to',
		handler:function(ev){
			//keys - Array of event names
			var eh=ev.data.getEvents(); 
			BIM.fun.log('*** User Interface:'+ev.data.alias); 
			//list commands and description for eash input handler
			for (var i in eh){BIM.fun.log("event:"+eh[i].name, "desc.:"+eh[i].desc);}
		}
	},{
		inputs:['keywords', 'kw'],
		desc:'Lists the inputs or commands the UI responds to',
		handler:function(ev){
			var ih=ev.data.inputHandlers;
			//name of UI
			BIM.fun.log('*** User Interface:'+ev.data.alias); 
			//list commands and description for eash input handler
			for (var i in ih){BIM.fun.log("commands:"+ih[i].inputs.join(", "), "desc.:"+ih[i].desc);}
		}
	}];
};

__.getEvents=function(){
	// Beware of using 'this' in event handlers as it will refer to the callers context
	// Instead assume 'this' is passed in event data thus... handler(ev){ev.data.toggle();}
	return [{
		name:'input', 
		desc:'handles user command input', 
		data:this, 
		handler:this.onInput
	}];
};

__.onInput=function(ev, input){
	//BIM.fun.log(input);
	//call others to process input 
	var firstWord=input.split(' ',1)[0];
	var tester=function(item){return item == firstWord;};
	var ih=ev.data.inputHandlers;
	var propagate=true;
	for (var i in ih){
		if (ih[i].inputs.find(tester)){
			//found inputHandler that matches input so execute handler so...
			propagate=false; //stop event propagation
			try{ih[i].handler(ev);} //safely execute handler
			catch(er){console.log(er);}
		}		
	}	
	return propagate;
};

__.toggle=function(){
	if (this.div$.is(':ui-dialog')){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}
};

return UI;

});


