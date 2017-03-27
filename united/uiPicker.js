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

	project:	BIM united FC
	module: 	uiPicker
	desc: 
	author:		Andrew Siddeley 
	started:	6-Feb-2017
	
*/


define(
// load dependencies...
['jquery', 'jquery-ui', 'babylon', 'babylon2D' ],

// then do...
function($, $$, babylon, babylon2D ){

var uiPicker={
	
	bimType:'Picker',
	
	create:function(board, uiStore){
		// create only one instance of this ui - static
		// board - the DOM container all ui DOM elements
		// uiStore - BIM.ui hash to store ui references
		this.div$=$('<div></div>');
		$(board).append(this.div$);		

		this.divPick$=$('<div></div>').text('picked items:0');
		this.divMode$=$('<div></div>').text('pick mode:many');
		this.div$.append(this.divPick$, this.divMode$);	
		
		//use jquery-ui to turn div$ into a floating dialog box
		//this.div$.dialog({draggable:true, title:this.bimType, autoOpen:true});

		BIM.fun.addEventHandlers(this.getEventHandlers());
		uiStore.uiPicker=this;
		return this;
	},
	
	add:function( part ){ 
		if (this.pickMode=="many|ONE"){this.picks=[];}
		//if part not in pick list...
		if (this.picks.indexOf(part) == -1) {
			//add part to pick list
			this.picks.push(part);
			//ensure number of picks does not exceed pick limit set by user
			if (this.picks.length>this.pickLimit) {this.picks.shift();}
		} else {
			//remove part from pick list by filtering it out
			this.picks=$.grep(this.picks, function(v, i){return (part !== v);});
		}
		//refresh
		this.divPick$.text(this.picks.length.toString()); //update board
		//this.tagRegen();
		//trigger event - note that event is automatically passed as arg1
		//$.trigger('customEvent', ['arg2', 'arg3'...])
		BIM.ui.uiBlackboard.trigger('bimPick', [this.picks]);
	},


	
	canvas2D:null, //initialized in start() by which time BIM.scene is initialized 
	
	// DOM container elements with jquery wrapping, set by create()
	div$:null, 
	divMode$:null,
	divPick$:null,
	
	//deprecated
	first:function(){return this.picks[0];},
	
	//called by BIM.board when ui's created to register events and callbacks
	getEventHandlers:function(){
		return { 
			bimFeatureChange:{name:'bimFeatureChange',  handler:uiPicker.onFeatureChange },
			bimInput:{name:'bimInput',  handler:uiPicker.onInput },
			bimPick:{}
		};
	},
	
	//called by BIM.board when ui's created for use with input autocomplete
	//called by onInput() below
	getKeywordHandlers:function(){
		//this.keywords defined here because it can't be defined until BIM.ui.picker is
		if (this.keywordHandlers==null){ this.keywordHandlers=[
			{keywords:['pp'], 
				handler:BIM.ui.uiPicker.toggle, 
				help:'open the picker dialog'}, 
			{keywords:['wipe','ppw'], 
				handler:BIM.ui.uiPicker.wipe, 
				help:'clear selection'}, 
			{keywords:['close','ppx'], 
				handler:function(){BIM.ui.uiPicker.div$.dialog('close');},
				help:'close the picker dialog'
			}
		];}
		return this.keywordHandlers;
	},
	
	keywordHandlers:null,
	
	//deprecated
	last:function(){
		if (this.picks.length==0) {return null;}
		else { return this.picks[this.picks.length-1];}
	},

	//called by uiBlackboard when new BIM input received
	onInput:function(ev, input){ 
		//beware of using 'this' inside an eventhandler function!
		//because 'this' will refer to the event caller's context, not uiPicker
		switch (input) {
			case 'pick':
			case 'pp':  
				//BIM.ui.uiPicker.toggle(); 
				BIM.ui.uiPicker.start();
				break;
			case 'ppw': BIM.ui.uiPicker.wipe(); break;
			case 'ppx':	BIM.ui.uiPicker.div$.dialog('close');
		};
		
	},
	
	onFeatureChange:function(ev, part, valu){
		//BIM.fun.log('picker onFeature '+ part + '-' + valu);
		//BIM.ui.picker.tagRegen();		
	},
	
	onPointerDown:function (evt, pickResult) {
		if (pickResult.hit) {
			if (pickResult.pickedMesh != null) {
				if (typeof pickResult.pickedMesh.bimHandler == "undefined"){
					BIM.fun.log("Mesh has no BIM features");
				} else {
					BIM.get.cMesh(pickResult.pickedMesh); //set cMech to pick
					BIM.input("_meshPicked"); //announce it to all uis
					//BIM.ui.picker.add(pickResult.pickedMesh.bimHandler);
				}				
			}
		}
	},	
	
	//max number of picks to track
	pickLimit:3,
	
	pickMode:"many|ONE", 

	// array of picked parts 
	picks:[],
	
	//UI standard function
	start:function(){ 
		BIM.scene.onPointerDown=uiPicker.onPointerDown;
		if (this.canvas2D==null) {
			//BIM.fun.log('picker start, BIM.scene ' + BIM.scene);
			this.canvas2D=new babylon2D.ScreenSpaceCanvas2D( BIM.scene, {
				id:"uiPickerCanvas",
				//don't cache as bitmap, keep canvas2d fresh
				cachingStrategy:babylon2D.CACHESTRATEGY_DONTCACHE  
			} );
		};
		//this.div$.dialog('open');
		return this; //for chaining
	},

	// array of tags - reused for each pick set
	tags:[],
	
	tagCreate:function(part, i){
		//first pick blue (begin with blue #0000FFFF), middle picks silver #C0C0C0FF, 
		//last pick red #FF0000FF and tiebreaber is last pick rules (if only 1 item picked)
		//colour = # RR GG BB AA
		var colour=(i==0)?'#0000FFFF':(i==this.picks.length-1)?'#FF0000FF':'#C0C0C0FF';
		var colour=(i==0 && this.picks.length==1)?'#FF0000FF':colour;  //red rules if 1 part picked
				
		//BIM.fun.log('colour'+colour);
		return new babylon2D.Group2D({
		parent: this.canvas2D, 
		id: "GroupTag" + i, 
		isVisible:true,
		width: 80, 
		height: 40, 		
		trackNode: part.baby, //picked babylon object to track
		origin: babylon2D.Vector2.Zero(),
		opacity:0.5,
		children: [ 
		   new BABYLON.Rectangle2D({ 
				id: "firstRect", 
				width: 80, 
				height: 26, 
				x: 0, 
				y: 0, 
				origin: BABYLON.Vector2.Zero(),
				border: "#FFFFFFFF", 
				fill:colour, 
				children: [
					new BABYLON.Text2D(
						part.name, //part name
						{marginAlignment:"h: center, v:center", fontName:"bold 12px Arial"}
					)
				]
			})			
		]
		});
	},
	
	tagRegen:function(){
		//delete existing tags
		for (i=0; i<this.tags.length; i++){
			this.tags[i].dispose();
		};
		this.tags=[]; 
		
		//recreate tags
		var tag;
		for (i=0; i<this.picks.length; i++){
			tag=this.tagCreate(this.picks[i], i);
			this.tags.push(tag);
		};
		
		this.divPick$.text('picked items:'+this.picks.length);
		
		//trigger event - note that event is automatically passed as arg1
		//$.trigger('customEvent', ['arg2', 'arg3'...])
		//BIM.ui.blackboard.div$.trigger('bimPick', [this.picks]);
	},
	
	toggle:function(){
		if (this.div$.dialog("isOpen")) {	
			this.div$.dialog("close");	
			//this.stop();
		} 
		else {
			//div$.dialog("open") is done inside start()
			this.div$.dialog('open');
			this.start();
		};
	},
	
	wipe:function(){
		this.picks=[];
		this.tagRegen();
		return this; //for chaining
	}
	
	
};

return uiPicker;

});

