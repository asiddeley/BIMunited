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
var UI=require('united/UI');


var TabbedUI=function(board, title){

	// This class extends UI, call super constructor
	UI.call(this, board, title); 
	
	this.tabcount=0;
	//create empty tab group, add tabs child-uis later with addTabb
	this.createTabgroup(); 
	//use jquery-ui to turn div$ into a floating dialog box
	this.div$.dialog({
		draggable:true,
		title:this.alias,
		autoOpen:true, 
		width:500,
		position:{ my: "right bottom", at: "center", of: window }
	});

	return this;
};

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// Inherit prototype from UI
TabbedUI.prototype=Object.create(UI.prototype);
TabbedUI.prototype.constructor=TabbedUI;
var __=TabbedUI.prototype;

__.addTab=function(){ 

	var c, index, tab$, panel$, ui;
	this.divTabgroup$.tabs('destroy');

	for (index in arguments){
		ui=arguments[index];
		c=this.tabcount++;
		id='tab'+ c.toString();
		tab$=$('<li></li>').append( $('<a></a>').attr('href', "#"+id).text(ui.alias) );
		panel$=$('<div></div>').attr('id', id).append(ui.div$);
		this.divUL$.append(tab$);
		this.divTabgroup$.append(panel$);	
	}
	
	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs({
		// jquery-ui tabs activate event is triggered when tab in focus.
		// Get bim to broadcast it. 
		// listeners include partsUI to initialize mini sample scene
		// per jquery-ui docs, divs={newTab:{}, oldTab:{}, newPanel:{}, oldPanel:{}}
		activate: function( ev, divs ) {
			BIM.fun.trigger('tabsactivate', [divs]);
		}
	});
	return this;
};

__.tabs=function(){
	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs();
}

__.createTabgroup=function(){

	/*************************
	For DOM structure for jquery tabs, see example at https://api.jqueryui.com/tabs/
	<div id="tabs" > This is a group of tabs...
		<ul>
			<li><a href="#tab-1"><span>One</span></a></li>
			<li><a href="#tab-2"><span>Two</span></a></li>
			<li><a href="#tab-3"><span>Three</span></a></li>
		</ul>
		<div id="panel-tab-1">
		<p>First tab is active by default:</p>
		<pre><code>$( "#tabs" ).tabs(); </code></pre>
		</div>
		<div id="panel-tab-2">...
	</div>
	*******************************/

	this.divTabgroup$=$('<div></div>');
	this.div$.append(this.divTabgroup$);
	
	this.divUL$=$('<ul></ul>');
	this.divTabgroup$.append(this.divUL$);

	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs();
};

//DOM element with jquery wrapper, provided via API and holds all UI
//TabbedUI.prototype.board$=null;

//DOM element for blackboard, logging user input etc
__.div$=null;
	
__.divTabgroup$=null;

__.divUL$=null;

__.getInputHandlers=function(){
	//returns an array of {alias:['a'], desc:'about', handler:function}
	//these inputHamdlers are common for all UI if inheritor so chooses
	var ih=UI.prototype.getInputHandlers.call(this);
	
	return ih.concat([{
		inputs:['ui'],
		desc:'show the main UI', 
		handler:function(ev){ ev.data.toggle(); }
	}]);	
};

__.getEvents=function(){
	var eh=UI.prototype.getEvents.call(this);
	
	return eh.concat([
		////{name:'bimFeatureOK', data:this, handler:this.onFeatureOK },
		//{name:'input', data:this, handler:this.onInput },
		//{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	]);
};


return TabbedUI;

});


