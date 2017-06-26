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


// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

// load dependencies...
var $=require('jquery');
var BJS=require('babylon');

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
	
	//Add this UI instance to list all ui instances.
	if (typeof UI.instances =='undefined'){UI.instances=[];} 
	else {UI.instances.push(this);}
	
	return this;
};

var __=UI.prototype;
	

__.activeUI=function(ui){
	// triggers an activeui event
	// used by inputHandler to activate a ui with a command input
	BIM.fun.trigger('activeui', [ui]);
};

__.getInputHandlers=function(){
	//returns an array of {alias:['a'], desc:'about', handler:function}
	//these inputHamdlers are common for all UI if inheritor so chooses
		
	return [{
		inputs:['events', 'ev'],
		desc:'Lists the events the UI responds to',
		handler:this.listEvents
	},{
		inputs:['keywords', 'kw'],
		desc:'Lists the inputs or commands the UI responds to',
		handler:this.listInputs
	},{
		inputs:['clc'],
		desc:'Clear console',
		handler:function(ev){console.clear();}
	}];
};

__.getEvents=function(){
	// Returns a list of event handlers that all UIs respond to.  Event handler below -
	// {name:event_name_str, desc:description_str, data:passed_to_handler_as_arg0, handler:fn}
	// Beware of using 'this' in event handlers as it will refer to the callers context
	// Instead assume 'this' is passed in event data thus... handler(ev){ev.data.toggle();}
	return [{
		name:'input', 
		desc:'occurs when a user command is entered', 
		data:this, 
		handler:this.onInput
	},{
		name:'activeui',
		desc:'occurs when a UI takes control of mouse events so that UI with control can release it',
		data:this,
		handler:this.onActiveUI
	}];
};

__.listEvents=function(ev){
	//keys - Array of event names
	var eh=ev.data.getEvents(); 
	//BIM.fun.log('*** UI:'+ev.data.alias); 
	console.log('*** UI:',ev.data.alias); 
	//list commands and description for eash input handler
	for (var i in eh){
		//BIM.fun.log("event:"+eh[i].name, "description:"+eh[i].desc);
		console.log("event:"+eh[i].name, "description:"+eh[i].desc);
	}
};

__.listInputs=function(ev){
	var ih=ev.data.inputHandlers;
	//name of UI
	//BIM.fun.log('*** UI:'+ev.data.alias); 
	console.log('*** UI:',ev.data.alias); 
	//list commands and description for eash input handler
	for (var i in ih){
		//BIM.fun.log("command(aliases):"+ih[i].inputs.join(", "), "description:"+ih[i].desc);
		console.log("command(aliases):"+ih[i].inputs.join(", "), "description:"+ih[i].desc);
	}
};	

__.onActiveUI=function(ev, activeUI){
	// ev - event
	// ev.data - 'this' as passed from UI decendant instance
	// activeUI - ui in focus
	//console.log('onActiveUI:', activeUI.alias);
};

__.onInput=function(ev, input){
	//BIM.fun.log(input);
	//call others to process input 
	
	var firstWord;
	if (typeof input != 'undefined'){firstWord=input.split(' ',1)[0];} 
	else {firstWord='undefined';}
	
	//var ih=ev.data.getInputHandlers();
	var ih=ev.data.inputHandlers;

	var propagate=true;
	for (var i in ih){
		//if (ih[i].inputs.find(tester)){ //find not defined in Explorer 11
		if (ih[i].inputs.indexOf(firstWord) != -1) {
			//found inputHandler that matches input so execute handler so...
			propagate=false; //stop event propagation
			try{ih[i].handler(ev);} //safely execute handler
			catch(er){console.log(er);}
		}		
	}	
	return propagate;
};

__.onFocus=function(ev){
	// focus handler if UI is a dialog
	BIM.fun.trigger('activeui', [ev.data]);
};

__.toggle=function(){
	if (this.div$.is(':ui-dialog')){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}
};

return UI;

});


