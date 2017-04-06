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
['jquery', 'united/uiFeatureText'],

// then do...
function($, wc){

var Features=function(board, uiStore, evManager, isDialog){
		// board - the DOM container all ui DOM elements
		// uiStore - BIM.ui hash to store ui references
		// evManager - ui that sets up and triggers events
		// isDialog - if True, will turn this ui into it's own dialog box

		this.div$=$('<div></div>').addClass('ui-widget-content'); 
		if (typeof board != 'undefined' && board instanceof window.Element) { $(board).append(this.div$);}
		else if (typeof board != 'undefined' && board instanceof $) { board.append(this.div$);}
		if (typeof evManager != 'undefined' && evManager != null) {evManager.addEventHandlers(this.getEventHandlers());}
		if (typeof uiStore != 'undefined' && uiStore != null) {uiStore.FeaturesUI=this;	}
		if (typeof idDialog !='undefined' && isDialog==true) {this.isDialog=true; this.div$.dialog();}
		// return constructed ui object for chaining.
		return this;
};

Features.prototype.alias='Features';
	
Features.prototype.div$=null;
	
Features.prototype.getEventHandlers=function(){
		//don't use keywork 'this' here as it will refer to the callers context
		return {
			bimInput:{name:'bimInput',  handler:Features.prototype.onInput },
			bimPick:{name:'bimPick',  handler:Features.prototype.onPick }
		};
};
	
Features.prototype.onInput=function(ev, input){
		switch (input){
			case 'ff':
			case 'features':BIM.ui.FeaturesUI.toggle();break;
			case '_meshAdded':BIM.ui.FeaturesUI.start(BIM.get.cMesh());break;
			case '_meshPicked':BIM.ui.FeaturesUI.start(BIM.get.cMesh());break;
	} 
};

Features.prototype.onPick=function(ev, picks){
		//access features of the last bim part picked...
		//Beware of keyword 'this' in event handlers, use 'BIM.ui.features' instead 
		if (picks.length>0){
			//BIM.ui.uiFeatures.start(picks[picks.length-1]);
		} else {
			BIM.ui.FeaturesUI.reset();
		}
};

Features.prototype.reset=function(){	
		this.widgeta.forEach(function(item){item.remove();});	
		this.widgeta=[];
		this.widgeti=0;	
	};
		
Features.prototype.start=function(mesh){
		if (typeof mesh=='undefined' || mesh==null){ return false; }
		this.reset();
		var ff=mesh.bimHandler.getFeatures(mesh);
		var f;
		for (label in ff){
			f=ff[label];
			if (typeof f.editor == 'object') { this.widgetInit(mesh, f); }
			else { BIM.fun.log('Feature not editable'); }
		}
	};
	
Features.prototype.toggle=function(){
	if (this.isDialog && this.div$.dialog("isOpen")) {
		this.div$.dialog("close");
	} else if (this.isDialog) {this.div$.dialog("open");}
};
	
Features.prototype.widgeta=[]; //array
Features.prototype.widgeti=0; //index for array
Features.prototype.widgetInit=function(mesh, feature){
		if (this.widgeti==this.widgeta.length){
			this.widgeta.push(feature.editor.create(this.div$));
		};
		//if using jquery-ui widget then
		//$(this.wCell[this.wCelli++]).wCell('vlca', valu, label, onChange, part).show();	
		(this.widgeta[this.widgeti++]).start(mesh, feature);
};


/*
usage:
myFeaturesUI=new Features(board, uiStore, evManager, isDialog);
To create a feature editor UI that stands alone:
myFeaturesUI=new Features($("#myNavbar"), BIM.ui, BIM.ui.uiBlackboard, true);

*/
return Features;

});


