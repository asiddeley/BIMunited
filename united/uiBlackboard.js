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


var uiBlackboard={
	
	bimType:'Blackboard',

	create:function(board, uiStore){
		// create a blackboard and initialize
		//var ui=$.extend({}, uiBlackboard);
		this.board$=$(board, uiStore);
		//jquery wrapped DOM element for blackboard
		this.div$=$('<div></div>');
		this.board$.append(this.div$);
		//jquery wrapped DOM element for displaying messages
		this.divLog$=$('<xmp></xmp>').addClass('ui-dialog-content');
		this.div$.append(this.divLog$);
		
		//jquery wrapped DOM element for scene dumps
		this.divDump$=$('<xmp></xmp>').addClass('ui-dialog-content');
		this.divDump$.css('max-height', '300px', 'max-width', '300px');
		this.div$.append(this.divDump$);
		this.divDump$.hide();	
		
		//use jquery-ui to turn div$ into a floating dialog box
		//this.div$.dialog({draggable:true, title:this.bimType, autoOpen:true});

		uiStore.uiBlackboard=this;
		this.addEventHandlers(this.getEventHandlers());
		return this;
	},
	
	createTabs:function(uis){
		this.divTab$=$('<div></div>');
		this.div$.append(this.divTab$);
		
		this.divUl$=$('<ul></ul>');
		this.divTab$.append(this.divUl$);
		
		for (var i=0; i<uis.length; i++){this.addTab(i, uis[i]);}
		//use jquery-ui to turn tab$ into a tab widget
		this.divTab$.tabs();
		
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog({draggable:true, title:'BIM United', autoOpen:true});
	},
		
	/*************************
	For DOM structure of tabs, see example at https://api.jqueryui.com/tabs/
	<div id="tabs">
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
	
	createTab:function(i, ui){
		//check and remove any dialog functionality, keeping structure
		var id='tab'+i.toString();
		//if (ui.div$.hasClass('ui-dialog')){ui.div$.destroy();}
		var l$=$('<li></li>');
		var a$=$('<a></a>').attr('href', "#"+id).text(ui.bimType);
		var d$=$('<div></div>').attr('id', id).append(ui.div$);
		//BIM.fun.log('id:'+d$.attr('id'));
		l$.append(a$);
		this.divUl$.append(l$);
		this.divTab$.append(d$);		
	},
	////////////////////////////////////////////
	
	addEventHandlers:function(ee){
		for (var n in ee){
			//add custom bim events to blackboard with jquery 
			this.div$.on(n, ee[n].handler);
		}
		
	},	
	
	board$:null, //DOM element with jquery wrapper, provided via API and holds all UI
	div$:null, //DOM element for blackboard, logging user input etc
	divDump$:null, //DOM element for big text dumps
	divLog$:null,
	
	getKeywordHandlers:function(){
		//this.keywords defined here (in a function) because
		//it can't be defined until uiBlackboard is intanciated
		if (this.keywordHandlers==null){ this.keywordHandlers=[
			{keywords:['bb'], 
				handler:BIM.ui.uiBlackboard.toggle, 
				help:'open/close the blackboard'}
		];}
		return this.keywordHandlers;
	},
	
	getEventHandlers:function(){
		//beware of using 'this' in event handlers as it will refer to the callers context
		return { bimInput: {name:'bimInput',  handler:uiBlackboard.onInput } };
	},
	
	keywordHandlers:null,
	
	onInput:function(ev, input){
		BIM.ui.uiBlackboard.log(input);
		//call others to process input 
		//this.div$.trigger('bimInput', [command]);
		
		//blackboard responsible for following input 
		switch (input) {
			case 'bb':BIM.ui.uiBlackboard.toggle();break;
			case 'bbw':
				BIM.ui.uiBlackboard.logStore=[];
				BIM.ui.uiBlackboard.log$.html('');
				break;
			case 'debug':BIM.ui.uiBlackboard.toggleDebug();break;
			//dump scene
			case 'dump':
				if (BIM.ui.uiBlackboard.divDump$.is('visible')){
					BIM.ui.uiBlackboard.divDump$.hide();
				} else {
					var s=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene) );
					BIM.ui.uiBlackboard.divDump$.show().text(s);
				}
				break;
			//dump scene Geometry
			case 'dumpg':
				var g=BJS.SceneSerializer.Serialize(BIM.scene).geometries;
				BIM.ui.uiBlackboard.divDump$.show().text(JSON.stringify(g));
				break;
			//dump scene Meshes
			case 'dumpm':
				var m=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene).meshes);
				BIM.ui.uiBlackboard.divDump$.show().text(m);
				break;
			//Close dump dialog
			//case 'dumpx':BIM.ui.uiBlackboard.divDump$.hide();break;
		
		};
	},	

	
	log:function(msg){
		//add message to the store
		this.logStore.push(msg);
		//limit store to the last n messages
		if (this.logStore.length>50){this.logStore.shift();}
		//show last n items of the store
		var htm='', n=10, l=this.logStore.length;
		//make sure n is smaller or equal to the number of items to print
		n=(n>l)?l:n; 
		for (var i=l-n; i<l; i++){ htm+=this.logStore[i]+'<br>';}
		//$(BIM.options.boards.blackboard).html(htm);
		$(this.divLog$).html(htm);
	},
	
	logStore:[],
	
	
	toggle:function(){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	},
	
	toggleDebug:function(){
		if (!this.toggleDebugB) {
			BIM.scene.debugLayer.shouldDisplayLabel=function(node){return true;}
			BIM.scene.debugLayer.shouldDisplayAxis=function(mesh){return true;}
			BIM.scene.debugLayer.show();			
			this.toggleDebugB=true;
		} else {
			BIM.scene.debugLayer.hide();			
			this.toggleDebugB=false;
		};
	},
	toggleDebugB:false,
	
	trigger:function(bimEvent, argArray){
		if (typeof argArray=='undefined'){
			switch (bimEvent) {
				case 'bimInput':this.div$.trigger(bimEvent, ['nothing']); break;
				case 'bimRestock':this.div$.trigger(bimEvent, [BIM.ui.partsLib]); break;
				
			}			
		} else { this.div$.trigger(bimEvent, argArray);}
	}

};


return uiBlackboard;

});


