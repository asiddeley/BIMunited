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

	create:function(board, uiStore){
		// create a blackboard and initialize
		//var ui=$.extend({}, uiBlackboard);
		this.board$=$(board, uiStore);
		//jquery wrapped DOM element for blackboard
		this.div$=$('<div></div>');
		this.board$.append(this.div$);
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog({draggable:true, title:'Blackboard', autoOpen:true});
		//jquery wrapped DOM element for displaying messages
		this.log$=$('<div></div>');
		this.div$.append(this.log$);
		
		//jquery wrapped DOM element for scene dumps
		this.dump$=$('<div></div>').css('max-height', '300px');
		this.div$.append(this.dump$);
		this.dump$.hide();	
		
		uiStore.uiBlackboard=this;
		this.addEventHandlers(this.getEventHandlers());
	},
	
	addEventHandlers:function(ee){
		for (var n in ee){
			//add custom bim events to blackboard with jquery 
			this.div$.on(n, ee[n].handler);
		}
	},	
	
	board$:null, //DOM element with jquery wrapper, provided via API and holds all UI
	div$:null, //DOM element for blackboard, logging user input etc
	dump$:null, //DOM element for big text dumps
	
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
			case 'bbw':BIM.ui.uiBlackboard.logStore=[]; this.log$.html('');break;
			case 'debug':BIM.ui.uiBlackboard.toggleDebug();break;
			//dump scene
			case 'dump':
				var s=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene) );
				BIM.ui.uiBlackboard.dump$.show().text(s);
				break;
			//dump scene Geometry
			case 'dumpg':
				var g=BJS.SceneSerializer.Serialize(BIM.scene).geometries;
				BIM.ui.uiBlackboard.dump$.show().text(JSON.stringify(g));
				break;
			//dump scene Meshes
			case 'dumpm':
				var m=JSON.stringify(BJS.SceneSerializer.Serialize(BIM.scene).meshes);
				BIM.ui.uiBlackboard.dump$.show().text(m);
				break;
			//Close dump dialog
			case 'dumpx':BIM.ui.uiBlackboard.dump$.hide();break;
		
		};
	},	
	
	log$:null,
	
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
		$(this.log$).html(htm);
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


