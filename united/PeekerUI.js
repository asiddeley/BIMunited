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
var ChooserFC=require('features/chooserFC');
var TextFC=require('features/textFC');

var PeekerUI=function(board, title){
	//inherit UI constructor
	UI.call(this, board, title); 
		
	var that=this;
	this.alias='Peek';
	this.canvas2D=null; //initialized in start() by which time BIM.scene is initialized 
	
	//Note that FCs can be used on any object as below, not just babylon meshes.
	//Remember to start FCs - see onTabsactivate
	
	this.mode='single';
	this.modeFC=new ChooserFC(this.div$, {
		alias:'peek mode',
		prop:this.peekMode,
		propToBe:'byChoices',
		propUpdate:function(ev, rv){ },
		choices:[ 'single', 'multiple']
		//choices long form...
		//choices:[
			//{label:'single', onChoose:function(ev){return 'single';}},
			//{label:'multiple', onChoose:function(ev){return 'multiple';}}			
		//]
	});
	this.modeFC.start();
	
	//max number of picks to track
	this.limit=3;
	this.limitFC=new TextFC(this.div$, {
		alias:'peek limit', 
		prop:this.peekLimit,
		propToBe:'TBD by user input',	
		propUpdate:function(ev,r){	return r;}
	});	
	//this.peekLimitFC.start(); //see onTabsActivate
	
	this.count$=$('<div>0</div>');

	// array of picked meshes 
	this.picks=[];
	// array of tags - reused for each pick set
	this.stickers=[];	
	// return constructed ui object for chaining.
	
	this.fui=new FeaturesUI(null, 'Features');
	this.div$.append(this.fui.div$);
	//this.fui.start(); //see onTabsActivate
	
	return this;
}

//inherit UI prototype
PeekerUI.prototype=Object.create(UI.prototype);
PeekerUI.prototype.constructor=PeekerUI;
var __=PeekerUI.prototype; //define __ as shortcut
	
__.add=function( mesh ){ 
	if (this.mode=="single"){this.picks=[];}
	//if part not in pick list...
	if (this.picks.indexOf(mesh) == -1) {
		//add part to pick list
		this.picks.push(mesh);
		//ensure number of picks does not exceed pick limit set by user
		if (this.picks.length>this.limit) {this.picks.shift();}
	} else {
		//remove part from pick list by filtering it out
		this.picks=$.grep(this.picks, function(v, i){return (mesh !== v);});
	}
	//refresh
	this.count$.text('meshes picked: '+this.picks.length.toString()); //update board
	this.stickersRegen();
	//trigger event - note that event is automatically passed as arg1
	//$.trigger('customEvent', ['arg2', 'arg3'...])
	//BIM.fun.trigger('bimPeek', [this.peeks]);
}
	
//called by UI when ui's created to register events and callbacks
__.getEvents=function(){
	return [
		//{name:'bimFeatureOK', data:this, handler:this.onFeatureOK },
		{name:'input', data:this, handler:this.onInput },
		{name:'tabsactivate', data:this, handler:this.onTabsactivate }
	];
};

__.getInputHandlers=function(){
	return[
		{inputs:['peek', 'pe'], desc:'show the Peek UI', handler:function(ev){ ev.data.toggle(); }  }	
	];
}

__.onFeatureOK=function(ev, part, valu){
	//BIM.fun.log('picker onFeature '+ part + '-' + valu);
	ev.data.stickersRegen();		
}
	
__.onPointerDown=function (ev, pickResult) {
	pickResult=BIM.scene.pick(
		BIM.scene.pointerX, 
		BIM.scene.pointerY
		// predicate function for pickResult.hit
		//, function(mesh){ return mesh;} 
	);

	console.log('pointer down');
	if (pickResult.hit) {
		if (pickResult.pickedMesh != null) {
			if (typeof pickResult.pickedMesh.bimhandle == "undefined"){
				console.log("Mesh has no BIM features");
			} else {
				BIM.get.cMesh(pickResult.pickedMesh); //set cMech to pick
				//BIM.input("_meshPicked"); //announce it to all uis
				//BIM.ui.uiPicker.add(pickResult.pickedMesh.bimHandler);
				ev.data.add(pickResult.pickedMesh);
			}				
		}
	}
}

//start the picker
__.onTabsactivate=function(ev){ 
	console.log('PeekerUI tabsactivate');	
	var that=ev.data;
	//console.log(that.onPointerDown);
	that.modeFC.start(); 
	that.limitFC.start();
	//that.countFC.start();
	that.fui.start();
	
	//BIM.fun.cameraPause();
	$(BIM.options.canvas).on('mousedown.peekerui', that, that.onPointerDown);

	//babylon deprecated
	//BIM.scene.onPointerDown=that.onPointerDown();
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
};

	
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
}
	
__.wipe=function(){
	this.peeks=[];
	this.stickerRegen();
	//for chaining
	return this; 
}	

return PeekerUI;

});

