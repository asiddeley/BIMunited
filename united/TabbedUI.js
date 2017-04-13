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
['jquery', 'babylon', 'united/UI'],

// then do...
function($, BJS, UI){

var TabbedUI=function(board, title){

	// This class extends UI, call super constructor
	UI.call(this, board, title); 
	
	this.tabcount=0;
	//create empty tab group, add tabs child-uis later with addTabb
	this.createTabgroup(); 
	//use jquery-ui to turn div$ into a floating dialog box
	this.div$.dialog({draggable:true, title:this.alias, autoOpen:true});

	return this;
};

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// Inherit prototype from UI
TabbedUI.prototype=Object.create(UI.prototype);
TabbedUI.prototype.constructor=TabbedUI;

TabbedUI.prototype.addTab=function(){ 

	var c, index, li$, tab$, ui;
	this.divTabgroup$.tabs('destroy');

	for (index in arguments){
		ui=arguments[index];
		c=this.tabcount++;
		id='tab'+ c.toString();
		li$=$('<li></li>').append( $('<a></a>').attr('href', "#"+id).text(ui.alias) );
		tab$=$('<div></div>').attr('id', id).append(ui.div$);
		this.divUL$.append(li$);
		this.divTabgroup$.append(tab$);	
	}
	
	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs();
	//if (rest instanceof Array) {this.addTab(rest);}
	return this;
};

TabbedUI.prototype.tabs=function(){
	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs();
}

TabbedUI.prototype.createTabgroup=function(){

	/*************************
	For DOM structure for jquery tabs, see example at https://api.jqueryui.com/tabs/
	<div id="tabs" > This is a group of tabs...
		<ul>
			<li><a href="#tab-1"><span>One</span></a></li>
			<li><a href="#tab-2"><span>Two</span></a></li>
			<li><a href="#tab-3"><span>Three</span></a></li>
		</ul>
		<div id="tab-1">
		<p>First tab is active by default:</p>
		<pre><code>$( "#tabs" ).tabs(); </code></pre>
		</div>
		<div id="tab-2">...
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
TabbedUI.prototype.div$=null;
	
TabbedUI.prototype.divTabgroup$=null;
TabbedUI.prototype.divUL$=null;
	
TabbedUI.prototype.getKeywords=function(keywords){
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

TabbedUI.prototype.getEvents=function(){
	// Beware of using 'this' in event handlers as it will refer to the callers context
	// Instead assume 'this' is passed in event data thus... handler(ev){ev.data.toggle();}
	return { 
		bimInput: {name:'bimInput',	data:this, handler:this.onInput, data:this }
	};
};

TabbedUI.prototype.keywords=null;
	
TabbedUI.prototype.onInput=function(ev, input){
	//BIM.fun.log(input);
	//call others to process input 
	//this.div$.trigger('bimInput', [command]);
	
	//Tabbed responsible for following input 
	//ev.data=this which is context of TabbedUI instance
	switch (input) {
		case 'mm':ev.data.toggle();break;
		case 'mmdump':
			var h=ev.data.divTabgroup$.html();
			BIM.fun.dump( h.replace(/(.{65})/g, "$1\n") );
		break;
			case 'events':
			//keys - Array of event names
			var keys=Object.keys(ev.data.getEvents()); 
			BIM.fun.log(ev.data.alias.toUpperCase()+'\n' + keys.join("\n"));
			break;	
		case 'keywords':
			var keys=['bb', 'bbw', 'keywords', 'events'];
			BIM.fun.log(ev.data.alias.toUpperCase()+'\n' + keys.join("\n"));
			break;		
	};
};

return TabbedUI;

});


