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
	module: 	PickerUI
	desc: 
	author:		Andrew Siddeley 
	started:	6-Feb-2017
	
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

var PickerUI=function(board, title){
	//inherit constructor from UI
	UI.call(this, board, title); 
		
	var that=this;
	this.fui=new FeaturesUI(null, 'Features');

	this.canvas2D=null; //initialized in start() by which time BIM.scene is initialized 
	
	//Add features/editors for the pickerUI.  
	//yes, FEDs can be used on any object - note the this arg for mesh.
	//remember to start FEDs - see onTabsactivate
	this.pickModeFED=new ChooserFED(this.div$, this, {
		label:'pick mode',
		valu:that.pickMode,
		choices:[
			{label:'one - pick one at a time', 
			onChoose:function(ev){that.pickMode='one';}},
			{label:'many - pick multiple', 
			onChoose:function(ev){that.pickMode='many';}}			
		],
		onValuChange:function(ev,rv){}
	});
	this.pickLimitFED=new TextFED(this.div$, this, {
		label:'pick limit', 
		valu:this.pickLimit, 
		onFC:function(ev,r){that.pickLimit=Number(r);}
	});	
	
	this.pick$=null;
	this.div$.append(this.pickModeFED.div$,this.fui.div$);
	
	//max number of picks to track
	this.pickLimit=3;
	//how to handle picks, (one) by one or (many) add to sellection	
	this.pickMode="many";
	// array of picked parts 
	this.picks=[];
	// array of tags - reused for each pick set
	this.stickers=[];	
	// return constructed ui object for chaining.
	return this;
}
//inherit prototype from UI
PickerUI.prototype=Object.create(UI.prototype);
PickerUI.prototype.constructor=PickerUI;

var __=PickerUI.prototype;
	
__.alias='Pick';

__.add=function( part ){ 
	if (this.pickMode=="one"){this.picks=[];}
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
	this.stickersRegen();
	//trigger event - note that event is automatically passed as arg1
	//$.trigger('customEvent', ['arg2', 'arg3'...])
	BIM.fun.trigger('bimPick', [this.picks]);
}


__.first=function(){return this.picks[0];}
	
//called by ?? when ui's created to register events and callbacks
__.getEvents=function(){
	return { 
		bimFeatureOK:{name:'bimFeatureOK', data:this, handler:this.onFeatureOK },
		bimInput:{name:'bimInput', data:this, handler:this.onInput },
		bimPick:{},
		tabsactivate:{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	};
}
	
//called by BIM.board when ui's created for use with input autocomplete
//called by onInput() below
__.getKeywords=function(){
	//this.keywords defined here because it can't be defined until BIM.ui.picker is
	if (this.keywords==null){ this.keywords=[
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
	return this.keywords;
}
	
//deprecated
__.last=function(){
	if (this.picks.length==0) {return null;}
	else { return this.picks[this.picks.length-1];}
}

//called by ui.blackboard when there is BIM user input
__.onInput=function(ev, input){ 
	//beware of using 'this' inside an eventhandler function!
	//because 'this' will refer to the event caller's context, not uiPicker
	switch (input) {
		case 'pick':
		case 'pp':  
			//BIM.ui.uiPicker.toggle(); 
			ev.data.start();
			break;
		case 'ppw': BIM.ui.picker.wipe(); break;
		case 'ppx':	BIM.ui.picker.div$.dialog('close');
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
	that.pickModeFED.start(); 
	that.pickLimitFED.start(); 
	
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
	this.picks=[];
	this.stickerRegen();
	//for chaining
	return this; 
}	

return PickerUI;

});

