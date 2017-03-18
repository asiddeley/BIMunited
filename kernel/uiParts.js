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
	initiator: 	Andrew Siddeley 
	initiated:	16-Feb-2017
	
*/


define(
// load dependencies...
['jquery', 'jquery-ui','babylon' ],

// then do...
function($, $$, babylon ){

var uiParts={

	addCreaters:function(partHandler){
		var item$=$('<div></div>').text(partHandler.bimType+':'); //.addClass('bimCell');
		BIM.ui.parts.menu$.append(item$);

		var cc=partHandler.creaters;
		for (var n in cc){BIM.ui.parts.addButton(item$, n, cc[n]);	}		
	},

	addButton:function(item$, n, c){
		//n - name of part
		//c - creater function of part
		//item$ - jquery wrapped element to contain buttons
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
		// board is the container div for all uis
		// create a new ui of available parts
		var ui=$.extend({}, uiParts);
		ui.div$=$('<div></div>');
		$(board).append(ui.div$);
		//ui.div$.text('available parts').addClass('bimBoard');
		ui.menu$=$('<div></div>'); //.addClass('bimCell');
		ui.div$.append(ui.menu$);
		ui.divCreater$=$('<div></div>');
		ui.div$.append(ui.divCreater$);
		//Using jquery-ui turn div$ into a dialog
		ui.div$.dialog({draggable:true, title:'Parts', autoOpen:false});
		return ui;
	},
	
	// DOM container element with jquery wrapping
	div$:null, //initialized in create()
	divCreater$:null,
	
	getEventHandlers:function(){
		return { 
			bimInput:{name:'bimInput',  handler:uiParts.onInput },
			bimRestock:{name:'bimRestock', handler:uiParts.onRestock }
		};
	},

	menu$:null,
	
	//called by uiBlackboard when new BIM user input received
	onInput:function(event, input){ 
		//don't use keyword 'this' here as it will refer to the event caller's context, not uiPicker
		switch(input){
		case 'ap':
		case 'parts': BIM.ui.parts.toggle(); break;
		case 'restock':	BIM.ui.blackboard.trigger('bimRestock', [BIM.partsLib]); break;
		}		
	},
	
	onRestockOld:function(ev, partsLib){
		//beware of meaning of keyword 'this' inside event handlers!
		var ui=BIM.ui.parts;
		if (ui.menu$==null) {return;} //exit early if not initialized
		//wipe and reload parts
		ui.menu$.html(''); 
		for (var p in partsLib){
			ui.addCreaters(partsLib[p]);
		}		
	},	
	
	onRestock:function(ev, partsLib){
		//beware of meaning of keyword 'this' inside event handlers!
		var ui=BIM.ui.parts;
		if (ui.divCreater$==null) {return;} //exit early if not initialized
		//wipe and reload parts
		ui.menu$.html(''); 
		for (var p in partsLib){
			ui.addCreaters(partsLib[p]);
		}		
	},
				
	toggle:function(){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}

	
};

return uiParts;

});

