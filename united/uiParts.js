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
	module: 	uiParts
	initiator: 	Andrew Siddeley 
	initiated:	16-Feb-2017
	
*/


define(
// load dependencies...
['jquery', 'jquery-ui','babylon' ],

// then do...
function($, $$, babylon ){

var uiParts={

	addControlgroup:function(partHandler){
		var cg$=$('<div></div>');
		this.div$.append(cg$);
		
		cg$.append($('<button></button>').text(partHandler.bimType+':'));	
		cg$.addClass('ui-widget-content');
		
		for (var n in partHandler.creaters){
			this.addPartCreaterButton(cg$, n, partHandler.creaters[n]);
		};
		//wigetize cg$, google jquery-ui controlgroup for documentation
		//items indicates what widgets to apply. 
		cg$.controlgroup({items:{button:'button'}});
	},
	
	addPartCreaterButton:function(cg$, n, fn){
		//n - name of part
		//fn - creater function of part
		//cg$ - jquery wrapped element to contain buttons
		var onClick=function(ev){ 
			var p=fn(); //call creater to make new part p
			var m=BIM.get.activeModel(); //model to put part
			m.handler.addPart(m, p); //add new part to model
			//pick new part and show its features for convenience
			BIM.ui.picker.start().wipe().add(p); 
		};
		var b$=$('<button></button>').text(n); //.addClass('bimButton');
		b$.on('click', onClick);
		cg$.append(b$);
	},
	

	create:function(board){
		// board is the container div for all ui's
		var ui=$.extend({}, uiParts);
		ui.div$=$('<div></div>');
		$(board).append(ui.div$);
		//use jquery-ui to turn div$ into a floating dialog box
		ui.div$.dialog({draggable:true, title:'Parts', autoOpen:false});
		//return the new and initialized uiParts
		return ui;
	},
	
	// DOM container elements with jquery wrapping initialized in create()
	div$:null, //for dialog
	
	getEventHandlers:function(){
		return { 
			bimInput:{name:'bimInput',  handler:uiParts.onInput },
			bimRestock:{name:'bimRestock', handler:uiParts.onRestock }
		};
	},

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
	
	onRestock:function(ev, lib){
		//beware of meaning of keyword 'this' inside event handlers!
		//TODO - remove any existing controlgroup from divs

		
		for (var i in lib){BIM.ui.parts.addControlgroup(lib[i]);}		
	},
				
	toggle:function(){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}

	
};

return uiParts;

});

