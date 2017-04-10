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

var TabbedUI=function(board, title){
	// board - DOM element container for user intefaces (UI) 
	this.div$=$('<div></div>');		
	this.tabcount=0;
	
	if (typeof title != 'undefined' && title != null) {this.alias=title;}
	else {this.alias='Tabby';} 
	
	if (typeof board != 'undefined' && board != null){ 
		// board is a DOM element
		if (board instanceof window.Element){this.board$=$(board);}
		// board is a DOM element wrapped with jquery
		if (board instanceof $){this.board$=board;}	
		this.board$.append(this.div$);
	}
	
	BIM.fun.on(this.getEvents());	

	//create empty tab group, add tabs child-uis later with addTabb
	this.createTabgroup(); 
	
	//use jquery-ui to turn div$ into a floating dialog box
	this.div$.dialog({draggable:true, title:this.alias, autoOpen:true});

	return this;
};

TabbedUI.prototype.alias='Main';

TabbedUI.prototype.addTab=function(ui){ 
	//var rest=null;
	//if (ui instanceof Array){rest=ui.clone().shift(); ui=ui.shift;}
	//ui - Object eg. {alias:'...', create:function(){...}, $div:{$(jquery)} }
	
	this.divTabgroup$.tabs('destroy');
	
	var li$, tab$, id, i=this.tabcount++;
	id='tab'+ i.toString();
	li$=$('<li></li>').append( $('<a></a>').attr('href', "#"+id).text(ui.alias) );
	tab$=$('<div></div>').attr('id', id).append(ui.div$);
	this.divUL$.append(li$);
	this.divTabgroup$.append(tab$);	
	
	//use jquery-ui to turn it into a tab widget
	this.divTabgroup$.tabs();
	//if (rest instanceof Array) {this.addTab(rest);}
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
TabbedUI.prototype.board$=null;

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
		bimInput: {name:'bimInput',	handler:this.onInput, data:this }
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
			h=h.replace(/(.{65})/g, "$1\n");
			BIM.ui.blackboard.divDump$.show().text(h);
		break;
		
		
	};
};
			
TabbedUI.prototype.toggle=function(){
	if (this.div$.is(':ui-dialog')){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}
};

//TabbedUI.prototype.trigger=function(bimEvent, argArray){
//	if (typeof argArray=='undefined'){
//		switch (bimEvent) {
//			case 'bimInput':this.div$.trigger(bimEvent, ['nothing']); break;
//			case 'bimRestock':this.div$.trigger(bimEvent, [BIM.ui.partsLib]); break;
//		}			
//	} else { this.div$.trigger(bimEvent, argArray);}
//}

return TabbedUI;

});


