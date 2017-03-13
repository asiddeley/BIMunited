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

var uiParts={

	addCreaters:function(partHandler){
		var item$=$('<div></div>').text(partHandler.bimType).addClass('bimCell');
		BIM.ui.parts.menu$.append(item$);

		var cc=partHandler.creaters;
		for (var n in cc){	BIM.ui.parts.addButton(n, cc[n], item$);	}		
	},

	addButton:function(n, c, item$){
		//n - name of part
		//c - creater function of part
		var onClick=function(ev){ 
			var p=c(); //new part created
			var m=BIM.get.activeModel(); //model to put part
			m.handler.addPart(m, p); 
			//pick new part and show its features for convenience
			BIM.ui.picker.start().wipe().add(p); 
		};
		var b$=$('<button></button>').text(n).addClass('bimButton');
		b$.on('click', onClick);
		item$.append(b$);
	},

	create:function(board){
		// board is the container div for all user-interactors
		// create a new copy of this template and initialize
		var ui=$.extend({}, uiParts);
		ui.div$=$('<div></div>'); 
		$(board).append(ui.div$);
		ui.div$.text('available parts').addClass('bimBoard');
		ui.menu$=$('<div></div>').addClass('bimCell');
		ui.div$.append(ui.menu$);
		return ui;
	},
	
	// DOM container element with jquery wrapping
	div$:null, //initialized in create()
	
	getEventHandlers:function(){
		return { 
			bimInput:{name:'bimInput',  handler:uiParts.onInput },
			bimRestock:{name:'bimRestock', handler:uiParts.onRestock }
		};
	},

	menu$:null,
	
	//called by uiBlackboard when new BIM input received
	onInput:function(event, input){ 
		//don't use keyword 'this' here as it will refer to the event caller's context, not uiPicker
		if (input == 'parts' || input == 'ap'){
			//BIM.scene.onPointerDown=uiPicker.onScenePointerDown;
			//BIM.ui.picker.start();
			BIM.ui.parts.div$.toggle();
		} else if (input == 'restock'){
			BIM.ui.blackboard.div$.trigger('bimRestock', [BIM.partsLib]);			
		}
		
		
	},
	
	onRestock:function(ev, partsLib){
		//beware of meaning of keyword 'this' inside event handlers!
		var ui=BIM.ui.parts;
		if (ui.menu$==null) {return;} //exit early if not initialized
		//wipe and reload parts
		ui.menu$.html(''); 
		for (var p in partsLib){
			ui.addCreaters(partsLib[p]);
		}		
	}
	
	
};

return uiParts;

});

