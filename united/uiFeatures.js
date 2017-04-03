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
// loading widgetCell defines wCell widget in jquery.
['jquery', 'united/uiFeatureText'],

// then do...
function($, wc){

var uiFeatures={

	alias:'Features',
	
	create:function(board, uiStore, evManager){
		// DEP create only one instance of this ui - static
		// create a new uiFeature ui - extended by uiPick and uiMake
		// board - the DOM container all ui DOM elements
		// uiStore - BIM.ui hash to store ui references
		var ui=$.extend({}, uiFeatures);
		ui.div$=$('<div></div>').addClass('ui-widget-content'); 
		if (typeof board == 'undefined' && board != null) { $(board).append(ui.div$);}
		if (typeof evManager == 'undefined' && evManager != null) {evManager.addEventHandlers(ui.getEventHandlers());}
		if (typeof uiStore == 'undefined' && uiStore != null) {uiStore.uiFeatures=ui;	}
		return ui;
	},
	
	div$:null,
	
	getEventHandlers:function(){
		//don't use keywork 'this' here as it will refer to the callers context
		return {
			bimInput:{name:'bimInput',  handler:uiFeatures.onInput },
			bimPick:{name:'bimPick',  handler:uiFeatures.onPick }
		};
	},
	
	onInput:function(ev, input){
		switch (input){
			case 'ff':
			case 'features':BIM.ui.uiFeatures.toggle();break;
			case '_meshAdded':BIM.ui.uiFeatures.start(BIM.get.cMesh());break;
			case '_meshPicked':BIM.ui.uiFeatures.start(BIM.get.cMesh());break;

		} 
	},

	onPick:function(ev, picks){
		//access features of the last bim part picked...
		//Beware of keyword 'this' in event handlers, use 'BIM.ui.features' instead 
		if (picks.length>0){
			//BIM.ui.uiFeatures.start(picks[picks.length-1]);
		} else {
			BIM.ui.uiFeatures.reset();
		}
	},

	reset:function(){	
		this.widgeta.forEach(function(item){item.remove();});	
		this.widgeta=[];
		this.widgeti=0;	
	},
		
	start:function(mesh){
		if (typeof mesh=='undefined' || mesh==null){ return false; }
		this.reset();
		var ff=mesh.bimHandler.getFeatures(mesh);
		var f;
		for (label in ff){
			f=ff[label];
			if (typeof f.editor == 'object') { this.widgetInit(mesh, f); }
			else { BIM.fun.log('Feature not editable'); }
		}
	},
	
	toggle:function(){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	},

	widgeta:[], //array
	widgeti:0, //index for array
	widgetInit:function(mesh, feature){
		if (this.widgeti==this.widgeta.length){
			this.widgeta.push(feature.editor.create(this.div$));
		};
		//if using jquery-ui widget then
		//$(this.wCell[this.wCelli++]).wCell('vlca', valu, label, onChange, part).show();	
		(this.widgeta[this.widgeti++]).start(mesh, feature);
	}

};

return uiFeatures;

});


