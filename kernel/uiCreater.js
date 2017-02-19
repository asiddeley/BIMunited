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
	module: 	uiCreater
	desc: 
	usage:
	by: 			Andrew Siddeley 
	started:	16-Feb-2017
	
*/


define(
// load dependencies...
['jquery', 'babylon' ],

// then do...
function($, babylon ){

var uiCreater={

	addCreaters:function(partHandler){
		var item$=$('<div></div>').text(partHandler.bimType).addClass('bimCell');
		this.menu$.append(item$);

		var cc=partHandler.creaters;
		for (var n in cc){	this.addButton(n, cc[n], item$);	}		
	},

	addButton:function(n, c, item$){
		var onClick=function(ev){ 
			var p=c();
			var m=BIM.get.host(); //could be main, active or currently picked model
			m.handler.addPart(m, p); 
			BIM.ui.picker.start().wipe().add(p); 
		};
		var b$=$('<button></button>').text(n).addClass('bimButton');
		b$.on('click', onClick);
		item$.append(b$);
	},

	create:function(div$){

		// create a new copy of this template and initialize
		var ui=$.extend({}, uiCreater);
		ui.div$=div$;
		ui.div$.text('creater').addClass('bimBoard');
		ui.menu$=$('<div></div>').addClass('bimCell');
		ui.div$.append(ui.menu$);
		ui.self=ui;
		return ui;
	},
	
	// DOM container element with jquery wrapping
	div$:null, //initialized in create()
	
	getEventHandlers:function(){
		return { 
			bimInput:{name:'bimInput',  handler:uiCreater.onInput },
		};
	},

	menu$:null,
	
	//called by uiBlackboard when new BIM input received
	onInput:function(event, input){ 
		//don't use keyword 'this' here as it will refer to the event caller's context, not uiPicker
		if (input == 'create' || input == 'cc'){
			//BIM.scene.onPointerDown=uiPicker.onScenePointerDown;
			//BIM.ui.picker.start();
			BIM.ui.creater.div$.toggle();
		}
	},
	
	onLibraryUpdate:function(partsLib){
		if (this.menu$==null) {return;} //exit early if not initialized
		//library changed so wipe and reload parts and their creaters 
		for (var p in partsLib){
			this.menu$.html(''); //wipe
			this.addCreaters(partsLib[p]);
		}		
	}
	
	
};

return uiCreater;

});

