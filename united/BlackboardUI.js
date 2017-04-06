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

var BlackboardUI = function(board, uiStore, uis){
		// board - the DOM container all ui DOM elements
		// uiStore - BIM.ui hash to store ui references
		// evManager - ui that sets up and triggers events
		// isDialog - if True, will turn this ui into it's own dialog box
		
		this.self=this; // use self instead of this inside event callback funcitons
		this.div$=$('<div></div>');		
		
		if (typeof board != 'undefined' && board instanceof window.Element) { $(board).append(this.div$);}
		else if (typeof board != 'undefined' && board instanceof $) { board.append(this.div$);}
		if (typeof uiStore != 'undefined' && uiStore != null) {uiStore.BlackboardUI=this;	}
	
		this.addEventHandlers(this.getEventHandlers());		
		
		//create Log/Dump for displaying input and small messages/large texts.
		//note how array with [uiLog] is concat with other uis provided
		this.createTabgroup(null, uiStore, [  this.createMsg() ] .concat(uis)  ); 
		
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog({draggable:true, title:this.alias, autoOpen:true});

		return this;
};

BlackboardUI.prototype.alias='Blackboard';

BlackboardUI.prototype.addTab=function(){ 
};

BlackboardUI.prototype.createMsg=function(){

		//jquery wrapped DOM element to contain log and dump
		this.divMsg$=$('<div></div>');

		//using <xmp> to escape any html code that may be input, such as "<button>...</button>"
		this.divLog$=$('<xmp></xmp>').addClass('ui-dialog-content');
		this.divMsg$.append(this.divLog$);
		
		//jquery wrapped DOM element for scene dumps
		this.divDump$=$('<xmp></xmp>');
		this.divMsg$.append(this.divDump$);
		this.divDump$.addClass('ui-dialog-content').css('height', '300px').hide();
		
		//important - define local var for inclusion in {..} below, since 'this' will have a different meaning in another context.
		var divMsg$=this.divMsg$;
		
		// wrap with minimum ui requirements
		var uiMsg={alias:'Msg', create:function(){return uiMsg;}, div$:divMsg$};
		return uiMsg;
};
	
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
BlackboardUI.prototype.createTabgroup=function(board, uiStore, uis){
		//uis - array of ui objects eg. [ {alias:'...', create:function(){...}, $div:{jquery wrapped DOM element} }...]
		var li$, id, ui;
		this.divTabgroup$=$('<div></div>');
		this.div$.append(this.divTabgroup$);
		
		this.divUL$=$('<ul></ul>');
		this.divTabgroup$.append(this.divUL$);
		
		for (var i=0; i<uis.length; i++){	
			//this.addTab(tab$, ul$, i, uis[i] .create(board, uiStore)   );
			ui=uis[i];
			if (typeof ui == 'function'){ ui=new ui(board, uiStore, this); }
			else if (typeof ui == 'object') {ui=ui.create(board, uiStore, this); }
			id='tab'+i.toString();
			li$=$('<li></li>').append( $('<a></a>').attr('href', "#"+id).text(ui.alias) );
			tab$=$('<div></div>').attr('id', id).append(ui.div$);
			this.divUL$.append(li$);
			this.divTabgroup$.append(tab$);		
		}
		//use jquery-ui to turn it into a tab widget
		this.divTabgroup$.tabs();
};
	
BlackboardUI.prototype.addEventHandlers=function(ee){
		for (var n in ee){
			//add custom bim events to blackboard with jquery 
			this.div$.on(n, ee[n].handler);
		}		
};
	
BlackboardUI.prototype.board$=null;		//DOM element with jquery wrapper, provided via API and holds all UI
BlackboardUI.prototype.div$=null;			//DOM element for blackboard, logging user input etc
	
BlackboardUI.prototype.divMsh$=null;	//DOM container for both divDump$ & divLog$ below
BlackboardUI.prototype.divDump$=null; 	//DOM element for big text dumps
BlackboardUI.prototype.divLog$=null;
	
BlackboardUI.prototype.divTabgroup$=null;
BlackboardUI.prototype.divUL$=null;
	
BlackboardUI.prototype.getKeywordHandlers=function(){
	//this.keywords defined here (in a function) because
	//it can't be defined until uiBlackboard is intanciated
	if (this.keywordHandlers==null){ this.keywordHandlers=[
		{keywords:['bb'], 
			handler:BIM.ui.uiBlackboard.toggle, 
			help:'open/close the blackboard'}
	];}
	return this.keywordHandlers;
};
	
BlackboardUI.prototype.getEventHandlers=function(){
	//beware of using 'this' in event handlers as it will refer to the callers context
	return { bimInput: {name:'bimInput',  handler:uiBlackboard.onInput } };
};
	
BlackboardUI.prototype.keywordHandlers=null;
	
BlackboardUI.prototype.onInput=function(ev, input){
	BIM.ui.uiBlackboard.log(input);
	//call others to process input 
	//this.div$.trigger('bimInput', [command]);
	
	//blackboard responsible for following input 
	switch (input) {
		case 'bb':BIM.ui.BlackboardUI.toggle();break;
		case 'bbw':
			BIM.ui.uiBlackboard.logStore=[];
			BIM.ui.uiBlackboard.log$.html('');
			break;
		case 'debug':BIM.ui.uiBlackboard.toggleDebug();break;
		//dump scene
		case 'dump':
			//alert ('dump');
			//BIM.fun.log('visible '+BIM.ui.uiBlackboard.divDump$.is(':visible'));
			if (BIM.ui.uiBlackboard.divDump$.is(':visible')==true){
				BIM.ui.uiBlackboard.divDump$.hide();
			} else {
				var s=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene) );
				s=s.replace(/(.{100})/g, "$1\n");
				BIM.ui.uiBlackboard.divDump$.show().html(s);
			}
			break;
		//dump scene Geometry
		case 'dumpg':
			var g=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene).geometries);
			g=g.replace(/(.{100})/g, "$1\n");
			BIM.ui.uiBlackboard.divDump$.show().text(g);
			break;
		//dump scene Meshes
		case 'dumpm':
			var m=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene).meshes);
			m=m.replace(/(.{100})/g, "$1\n");
			BIM.ui.uiBlackboard.divDump$.show().text(m);
			break;
		//Close dump dialog
		//case 'dumpx':BIM.ui.uiBlackboard.divDump$.hide();break;
	
	};
};

	
BlackboardUI.prototype.log=function(msg){
	//insert returns every 100 characters
	msg=msg.replace(/(.{100})/g, "$1\n");
	
	//add message to the store
	this.logStore.push(msg);
	//limit store to the last n messages
	if (this.logStore.length>50){this.logStore.shift();}
	//show last n items of the store
	var htm='', n=10, l=this.logStore.length;
	//make sure n is smaller or equal to the number of items to print
	n=(n>l)?l:n; 
	//for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'<br>';}
	for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'\n';}
	$(this.divLog$).html(htm);
};
	
BlackboardUI.prototype.logStore=[],
		
BlackboardUI.prototype.toggle=function(){
	if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
	else {this.div$.dialog("open");}
};
	
BlackboardUI.prototype.toggleDebug=function(){
	if (!this.toggleDebugB) {
		BIM.scene.debugLayer.shouldDisplayLabel=function(node){return true;}
		BIM.scene.debugLayer.shouldDisplayAxis=function(mesh){return true;}
		BIM.scene.debugLayer.show();			
		this.toggleDebugB=true;
	} else {
		BIM.scene.debugLayer.hide();			
		this.toggleDebugB=false;
	};
};
	
BlackboardUI.prototype.toggleDebugB=false;
	
BlackboardUI.prototype.trigger=function(bimEvent, argArray){
		if (typeof argArray=='undefined'){
			switch (bimEvent) {
				case 'bimInput':this.div$.trigger(bimEvent, ['nothing']); break;
				case 'bimRestock':this.div$.trigger(bimEvent, [BIM.ui.partsLib]); break;
			}			
		} else { this.div$.trigger(bimEvent, argArray);}
	}
};

// Only one instance
return new BlackboardUI();

});


