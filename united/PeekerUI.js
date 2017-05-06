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
	module: 	PeekerUI
	desc: 
	author:		Andrew Siddeley 
	started:	6-May-2017
	
*/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var $=require('jquery');
var babylon=require('babylon');
var babylon2D=require('babylon2D');
var UI=require('united/UI');
var FeaturesUI=require('united/FeaturesUI');
var ChooserFED=require('features/chooserFED');
var TextFED=require('features/textFED');

var PeekerUI=function(board, title){
	//inherit UI constructor
	UI.call(this, board, title); 
		
	var that=this;
	this.alias='Peek';
	this.fui=new FeaturesUI(null, 'Features');
	this.canvas2D=null; //initialized in start() by which time BIM.scene is initialized 
	
	//Note that FEDs can be used on any object as below, not just babylon meshes.
	//Remember to start FEDs - see onTabsactivate
	
	this.peekMode='single';
	this.peekModeFED=new ChooserFED(this.div$, {
		label:'peek mode',
		valu:this.peekMode,
		choices:[
			{label:'single', 
			onChoose:function(ev){return 'single';}},
			{label:'multiple',
			onChoose:function(ev){return 'multiple';}}			
		],
		onValuChange:function(ev, rv){}
	});
	this.peekModeFED.start();
	
	//max number of picks to track
	this.peekLimit=3;
	this.peekLimitFED=new TextFED(this.div$, {
		label:'peek limit', 
		valu:that.peekLimit, 
		onFC:function(ev,r){
			//that.peekLimit=Number(r);
		}
	});	
	this.peekLimitFED.start();
	
	this.peek$=null;
	//this.div$.append(this.peekModeFED.div$,this.fui.div$);

	// array of picked parts 
	this.peeks=[];
	// array of tags - reused for each pick set
	this.stickers=[];	
	// return constructed ui object for chaining.
	return this;
}

//inherit UI prototype
PeekerUI.prototype=Object.create(UI.prototype);
PeekerUI.prototype.constructor=PeekerUI;
var __=PeekerUI.prototype; //define __ as shortcut
	
__.add=function( part ){ 
	if (this.peekMode=="single"){this.picks=[];}
	//if part not in pick list...
	if (this.peeks.indexOf(part) == -1) {
		//add part to pick list
		this.peeks.push(part);
		//ensure number of picks does not exceed pick limit set by user
		if (this.peeks.length>this.peekLimit) {this.peeks.shift();}
	} else {
		//remove part from pick list by filtering it out
		this.peeks=$.grep(this.peeks, function(v, i){return (part !== v);});
	}
	//refresh
	this.divPeek$.text(this.picks.length.toString()); //update board
	this.stickersRegen();
	//trigger event - note that event is automatically passed as arg1
	//$.trigger('customEvent', ['arg2', 'arg3'...])
	//BIM.fun.trigger('bimPeek', [this.peeks]);
}
	
//called by UI when ui's created to register events and callbacks
__.getEvents=function(){
	return [
		//{name:'bimFeatureOK', data:this, handler:this.onFeatureOK },
		{name:'bimInput', data:this, handler:this.onInput },
		{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	];
}
	
//called by BIM.board when ui's created, may be used for input autocomplete
//called by onInput() below
__.getKeywords=function(){
	//this.keywords defined here because it can't be defined until BIM.ui.picker is
	if (this.keywords==null){ this.keywords=[
		{keywords:['peek','pe'], 
			handler:function(){
				//BIM.fun.log('Poke function TBD');
				this.toggle();
			},
			help:'show/hide the peek dialog'}, 
		{keywords:['close', 'peekx'], 
			handler:function(){
				//BIM.ui.uiPicker.div$.dialog('close');
				BIM.fun.log('close peek WIP');
			},
			help:'close peek TBD'
		}
	];}
	return this.keywords;
}
	
//called by ui.blackboard when there is BIM user input
__.onInput=function(ev, input){ 
	//beware of using 'this' inside an eventhandler function!
	//because 'this' will refer to the event caller's context, not uiPicker
	switch (input) {
		case 'peek':
			//BIM.ui.uiPicker.toggle(); 
			ev.data.start();
			break;
		case 'peek wipe': BIM.ui.picker.wipe(); break;
		//case 'ppx':	BIM.ui.picker.div$.dialog('close');
	};		
}
	
__.onFeatureOK=function(ev, part, valu){
	//BIM.fun.log('picker onFeature '+ part + '-' + valu);
	ev.data.stickersRegen();		
}
	
__.onPointerDown=function (ev, pickResult) {
	if (pickResult.hit) {
		if (pickResult.pickedMesh != null) {
			if (typeof pickResult.pickedMesh.BimFC == "undefined"){
				BIM.fun.log("Mesh has no BIM features");
			} else {
				BIM.get.cMesh(pickResult.pickedMesh); //set cMech to pick
				BIM.input("_meshPicked"); //announce it to all uis
				//BIM.ui.uiPicker.add(pickResult.pickedMesh.bimHandler);
				ev.data.add(pickResult.pickedMesh);
			}				
		}
	}
}

//start the picker
__.onTabsactivate=function(ev){ 
	var that=ev.data;
	that.peekModeFED.start(); 
	that.peekLimitFED.start(); 
	
	BIM.scene.onPointerDown=that.onPointerDown;
	if (that.canvas2D==null) {
		//BIM.fun.log('picker start, BIM.scene ' + BIM.scene);
		that.canvas2D=new babylon2D.ScreenSpaceCanvas2D( BIM.scene, {
			id:"uiPickerCanvas",
			//don't cache as bitmap, keep canvas2d fresh
			cachingStrategy:babylon2D.CACHESTRATEGY_DONTCACHE  
		} );
	};
	//this.div$.dialog('open');
	//for chaining
	return this; 
}
	
__.stickersCreate=function(mesh, i){
	//first pick blue #0000FFFF 
	//middle picks silver #C0C0C0FF 
	//last pick red #FF0000FF and tiebreaker is last pick rules (if only 1 item picked)
	//colour = # RR GG BB AA
	var colour=(i==0)?'#0000FFFF':(i==this.picks.length-1)?'#FF0000FF':'#C0C0C0FF';
	var colour=(i==0 && this.picks.length==1)?'#FF0000FF':colour;  //red rules if 1 part picked
	
	// thanks to 
	// http://www.html5gamedevs.com/topic/7228-get-visible-meshes-octree/
	if (BIM.scene.isActiveMesh(mesh) == true ) { 
		//BIM.fun.log('colour'+colour);
		return new babylon2D.Group2D( {
			parent: this.canvas2D, 
			id: "GroupTag" + i, 
			isVisible:true,
			width: 60, 
			height: 30, 		
			trackNode: mesh, //picked babylon object to track
			origin: babylon2D.Vector2.Zero(),
			opacity:0.5,
			children: [ new BABYLON.Rectangle2D({ 
					id: "firstRect", 
					width: 80, 
					height: 26, 
					x: 0, 
					y: 0, 
					origin: BABYLON.Vector2.Zero(),
					border: "#FFFFFFFF", 
					fill:colour, 
					children: [new BABYLON.Text2D(
						mesh.name, 
						{marginAlignment:"h:center, v:center", fontName:"bold 10px Arial"}
					)]
				})			
			]
		});
	}
}
	
__.stickersRegen=function(){
	//delete and remake stickers
	for (i=0; i<this.stickers.length; i++){	this.stickers[i].dispose();};
	this.stickers=[]; 
	var sticker;
	for (i=0; i<this.picks.length; i++){
		//tag=this.tagCreate(this.picks[i], i);
		sticker=this.stickersCreate(this.picks[i], i);
		this.stickers.push(sticker);
	};
	
	this.divPick$.text('picked items:'+this.picks.length);
}
	
__.wipe=function(){
	this.peeks=[];
	this.stickerRegen();
	//for chaining
	return this; 
}	

return PeekerUI;

});

