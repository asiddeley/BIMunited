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

	project:	BIM United FC
	module: 	FeaturesUI
	by: 		Andrew Siddeley 
	started:	19-Jan-2017
*/


// Define module with simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var $=require('jquery');
var UI=require('united/UI');
var FC=require('features/FC');

var FeaturesUI=function(board, title){
	//inherit constructor from UI
	UI.call(this, board, title); 

	this.alias='Features';
	this.controls=[];

	// return constructed ui object for chaining.
	return this;
};

//inherit prototype from UI
FeaturesUI.prototype=Object.create(UI.prototype);
FeaturesUI.prototype.constructor=FeaturesUI;

var __=FeaturesUI.prototype;

	
__.getEvents=function(){
	//For events, keyword 'this' refers to the event callers context
	//The 'this' that refers to the FeaturesUI instance, is passed in ev.data 
	return [
		{name:'bimInput', data:this, handler:this.onInput},
		{name:'bimPick', data:this, handler:this.onPick}
	];
};
	
__.onInput=function(ev, input){
	switch (input){
		case 'ff':
		case 'features':ev.data.toggle();break;
		case '_meshAdded':ev.data.start(BIM.get.cMesh());break;
		case '_meshPicked':ev.data.start(BIM.get.cMesh());break;
		case 'events':
			//keys - Array of event names
			var keys=Object.keys(ev.data.getEvents()); 
			BIM.fun.log(ev.data.alias.toUpperCase()+'\n'+keys.join("\n"));
			break;	
		case 'keywords':
			var keys=['ff', 'features', 'keywords', 'events'];
			BIM.fun.log(ev.data.alias.toUpperCase()+'\n'+keys.join("\n"));
			break;			
	} 
};

//utility
__.matchAll=function(sourceMesh, targetMesh) {
	if (sourceMesh.bimHandler.bimType == targetMesh.bimHandler.bimType){
		var tfc=targetMesh.bimHandler.getFeatures(targetMesh);
		var sfc=sourceMesh.bimHandler.getFeatures(sourceMesh);
		//go thru each source feature and apply the target property updater with the source prop as argument
		for (var i in sfc) { tfc[i].propUpdate(sfc[i].prop);	}
	} else {BIM.func.log('warning, cannot match features of different bimTypes');}
}

__.start=function(mesh){
	if (typeof mesh=='undefined' || mesh==null){ return false; }
	//this.reset();
	//delete widgets so new ones can be made
	this.controls.forEach(function(fc){fc.remove();});
	this.controls=[];
	
	var f, fc, ff=mesh.bimHandler.getFeatures(mesh);
	for (label in ff){
		f=ff[label];
		if (f.control.prototype instanceof FC) {
			fc=new f.control(this.div$, f);
			fc.start();
			this.controls.push(fc);
		} else { BIM.fun.log('Feature not editable'); }
	}
};
	
__.toggle=function(){
	if (this.div$.is(':ui-dialog')){ this.div$.dialog("close"); }
	else if (this.isDialog) { this.div$.dialog("open"); }
};
	
/*
usage:
myFeaturesUI=new Features(board, uiStore, evManager, isDialog);
To create a feature editor UI that stands alone:
myFeaturesUI=new Features($("#myNavbar"), BIM.ui, BIM.ui.uiBlackboard, true);
*/

return FeaturesUI;

});


