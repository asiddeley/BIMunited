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
	module: 	uiPartProperties
	by: 		Andrew Siddeley 
	started:	19-Jan-2017
*/

define(
// load dependencies...
['jquery', 'united/UI', 'features/FED'],

// then do...
function($, UI, FED){

var FeaturesUI=function(board, title){
	//inherit constructor from UI
	UI.call(this, board, title); 
	
	// return constructed ui object for chaining.
	return this;
};

//inherit prototype from UI
FeaturesUI.prototype=Object.create(UI.prototype);
FeaturesUI.prototype.constructor=FeaturesUI;

var __=FeaturesUI.prototype;
__.alias='Features';
	
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

//depricated
__.onPick=function(ev, picks){
	//Beware of keyword 'this' in event handlers, use ev.data instead 
	if (picks.length>0){
		//access features of the last picked mesh
		ev.data.start(picks[picks.length-1]);
	} else {
		ev.data.reset();
	}
};

__.reset=function(){	
	this.widgets.forEach(function(item){ item.remove();	});	
	this.widgets=[];
	this.widgeti=0;	
};
		
__.start=function(mesh){
	if (typeof mesh=='undefined' || mesh==null){ return false; }
	this.reset();
	var f, fc=mesh.bimHandler.getFeatures(mesh);
	for (label in fc){
		f=fc[label];
		//BIM.fun.log(JSON.stringify(f));
		if (f.editor.prototype instanceof FED) {
			this.widgets.push(new f.editor(this.div$, f).start());
			//this.widgetinit(mesh, f);
		} else { BIM.fun.log('Feature not editable'); }
	}
};
	
__.toggle=function(){
	if (this.div$.is(':ui-dialog')){
		this.div$.dialog("close");
	} else if (this.isDialog) {this.div$.dialog("open");}
};
	
__.widgets=[]; //array

__.widgeti=0; //index for array

__.widgetinit=function(feature){
	if (this.widgeti==this.widgeta.length){
		// feature.editor is a constructor function
		this.widgets.push(new feature.editor(this.div$, feature));
	};
	//if using jquery-ui widget then
	//$(this.wCell[this.wCelli++]).wCell('vlca', valu, label, onChange, part).show();	
	(this.widgets[this.widgeti++]).start(feature);
};

/*
usage:
myFeaturesUI=new Features(board, uiStore, evManager, isDialog);
To create a feature editor UI that stands alone:
myFeaturesUI=new Features($("#myNavbar"), BIM.ui, BIM.ui.uiBlackboard, true);
*/

return FeaturesUI;

});


