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
	
	alias:'Blackboard',

	create:function(board, uiStore){
		//create a blackboard and initialize - static
		//var ui=$.extend({}, uiBlackboard);
		this.board$=$(board);
		//jquery wrapped DOM element for blackboard
		this.div$=$('<div></div>');
		this.board$.append(this.div$);
		uiStore.uiBlackboard=this;
		this.addEventHandlers(this.getEventHandlers());		
		
		//create Log/Dump for displaying input and small messages/large texts. Treat as a ui so it gets its own tab
		var log=this.createLogDump(); 
		this.createTabStruct(log); 
		
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog({draggable:true, title:this.alias, autoOpen:true});

		return this;
	},
	
	createLogDump:function(){

		//jquery wrapped DOM element for displaying messages
		//using <xmp> to escape any html code that may be input, such as "<button>...</button>"
		this.divLog$=$('<xmp></xmp>').addClass('ui-dialog-content');
		this.div$.append(this.divLog$);
		
		//jquery wrapped DOM element for scene dumps
		this.divDump$=$('<xmp></xmp>').addClass('ui-dialog-content');
		this.divDump$.css('max-height', '300px');
		this.div$.append(this.divDump$);
		this.divDump$.hide();	
		
		// wrap with minimum ui requirements
		var uiLog={alias:'Msg', create:function(){return uiLog;}, div$:this.div$};
		return uiLog;
	},
	
	createTabStruct:function(uis){
		this.divTab$=$('<div></div>');
		this.div$.append(this.divTab$);
		
		this.divUi$=$('<ul></ul>');
		this.divTab$.append(this.divUi$);
		
		for (var i=0; i<uis.length; i++){
			//note that each ui's create function is called before it is passed
			this.createTab(i, uis[i].create( this.board$, BIM.ui)   );
		}
		//use jquery-ui to turn tab$ into a tab widget
		this.divTab$.tabs();
		
		//use jquery-ui to turn div$ into a floating dialog box
		//this.div$.dialog({draggable:true, title:'BIM United', autoOpen:true});
	},
		
	/*************************
	For DOM structure for jquery tabs, see example at https://api.jqueryui.com/tabs/
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
		var a$=$('<a></a>').attr('href', "#"+id).text(ui.alias);
		var d$=$('<div></div>').attr('id', id).append(ui.div$);
		//BIM.fun.log('id:'+d$.attr('id'));
		l$.append(a$);
		this.divUi$.append(l$);
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
	divTab$:null,
	divUi$:null,
	
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
	},	

	
	log:function(msg){
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


