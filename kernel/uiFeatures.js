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
	desc: 
	usage:
	by: 		Andrew Siddeley 
	started:	19-Jan-2017
	
*/


define(
// load dependencies...
// loading widgetCell defines wCell widget in jquery.
['jquery', 'kernel/uiFeatureText'],

// then do...
function($, wc){

var UIfeatures={

	create:function(board){
		var ui=$.extend({}, UIfeatures);
		ui.div$=$('<div></div>'); 
		$(board).append(ui.div$);		

		//use jquery-ui to turn div$ into a floating dialog box
		ui.div$.dialog({draggable:true, title:'Features', autoOpen:false});

		return ui;
	},
	
	div$:null,
	
	//deprecated
	init:function(div$){
		this.div$=div$;
		div$.text('features..').addClass('bimFeatures');
		return this; //to allow chaining
	},
	
	getEventHandlers:function(){
		//don't use 'this' here as it will refer to the callers context
		return {
			bimInput:{name:'bimInput',  handler:UIfeatures.onInput },
			bimPick:{name:'bimPick',  handler:UIfeatures.onPick }
		};
	},
	
	minimize:function(){
		this.div$.minimize();		
	},
	
	//function to respond to onPick event triggered by uiPicker
	onInput:function(ev, input){
		switch (input){
			case 'ff':
			case 'features':BIM.ui.features.toggle();break;
		} 
		//BIM.fun.log('uiFeature.onInput '+data);
	},

	onPick:function(ev, picks){
		//access features of the last bim part picked...
		//Beware of keyword 'this' in event handlers, use 'BIM.ui.features' instead 
		if (picks.length>0){
			BIM.ui.features.start(picks[picks.length-1]);
		} else {
			BIM.ui.features.reset();
		}
	},

	reset:function(){	
		this.wCellreset();
	},
		
	start:function(part){
		if (typeof part=='undefined' || part==null){ return false; }
		
		//reset counters and hide widgets
		this.reset();
		
		//var feature={name:'n', valu:this.x, type:'t', onChange:function(part, revisedvalu){}};
		var ff=part.handler.getFeatures(part);
		var f, i;
		for (label in ff){
			f=ff[label];
			
			switch(f.widget){
				case('point3d'):
					this.wCellinit(label, f.valu, f.onChange, part);
					break;
				case('real'):
					this.wCellinit(label, f.valu, f.onChange, part);
					break;
				case('text'):
					this.wCellinit(label, f.valu, f.onChange, part);
					break;
				default:
					this.wCellinit(label, f.valu, f.onChange, part);
			}		
		}		
	},
	
	toggle:function(){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	},
	
	////////////////////////
	//widgets for feature editing
	
	//text editor
	wCell:[], //storage
	wCelli:0, //index
	wCellinit:function(label, valu, onChange, part){
		if (this.wCelli==this.wCell.length){
			//var div$=$('<div></div>');
			//this.div$.append(div$);
			//div$.wCell().hide();
			//this.wCell.push(div$);
			this.wCell.push(wc.create(this.div$));
		};
		//widget version
		//$(this.wCell[this.wCelli++]).wCell('vlca', valu, label, onChange, part).show();	
		(this.wCell[this.wCelli++]).start(valu, label, onChange, part);
	},
	
	wCellreset:function(){
		this.wCelli=0;
		this.wCell.forEach(function(item){
			//widget version
			//item.hide();
			item.div$.hide();
		});
	},
	


};

return UIfeatures;

});


