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

var FeaturesUI=function(board, title){
	
	// board - the DOM container all ui DOM elements
	this.div$=$('<div></div>');	
	if (typeof title != 'undefined' && title != null) {this.alias=title;}
	else  {this.alias='Log';}
		
	if (typeof board != 'undefined' && board != null){ 
		if (board instanceof window.Element){this.board$=$(board);}
		//board is jquery wrapped DOM element
		if (board instanceof $){this.board$=board;}	
		this.board$.append(this.div$);
	}
	
	//register events that this UI responds to
	BIM.fun.on(this.getEvents());
	
	// return constructed ui object for chaining.
	return this;
};

var FP=FeaturesUI.prototype;

FP.alias='Features';
FP.div$=null;
	
FP.getEvents=function(){
	//For events, keyword 'this' refers to the event callers context
	//The 'this' that refers to the FeaturesUI instance, is passed in ev.data 
	return {
	bimInput:{name:'bimInput', data:this, handler:this.onInput},
	bimPick:{name:'bimPick', data:this, handler:this.onPick}
	};
};
	
FP.onInput=function(ev, input){
	switch (input){
		case 'ff':
		case 'features':ev.data.toggle();break;
		case '_meshAdded':ev.data.start(BIM.get.cMesh());break;
		case '_meshPicked':ev.data.start(BIM.get.cMesh());break;
		case 'keywords':
			var keys=['ff', 'features', 'keywords', 'events'];
			BIM.fun.log('// Features UI\n'+keys.join("\n"));
			break;			
		case 'events':
			//keys - Array of event names
			var keys=Object.keys(ev.data.getEvents()); 
			BIM.fun.log('// Features UI\n'+keys.join("\n"));
			break;	
	} 
};

FP.onPick=function(ev, picks){
		//access features of the last bim part picked...
		//Beware of keyword 'this' in event handlers, use 'BIM.ui.features' instead 
		if (picks.length>0){
			//BIM.ui.uiFeatures.start(picks[picks.length-1]);
		} else {
			BIM.ui.FeaturesUI.reset();
		}
};

FP.reset=function(){	
		this.widgeta.forEach(function(item){item.remove();});	
		this.widgeta=[];
		this.widgeti=0;	
};
		
FP.start=function(mesh){
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
	
FP.toggle=function(){
	if (this.div$.is(':ui-dialog')){
		this.div$.dialog("close");
	} else if (this.isDialog) {this.div$.dialog("open");}
};
	
FP.widgeta=[]; //array

FP.widgeti=0; //index for array

FP.widgetInit=function(mesh, feature){
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
return FeaturesUI;

});


