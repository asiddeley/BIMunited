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
function($, $$, babylon, lib ){

//static 
var UIPARTS={

	create:function(board, uiStore){
		// create only one instance of uiPatrs - static
		// board - the DOM container all ui DOM elements
		// uiStore - BIM.ui hash to store ui references
		// var ui=$.extend({}, uiParts);
		this.div$=$('<div></div>');
		$(board).append(this.div$);
		//use jquery-ui to turn div$ into a floating dialog box
		this.div$.dialog({draggable:true, title:'Parts', autoOpen:false});
		
		//return the new and initialized uiParts
		//return this;
		BIM.ui.blackboard.addEventHandlers(this.getEventHandlers());
		uiStore.uiParts=this;	
		//BIM.ui.blackboard.trigger('bimRestock', [ BIM.partsLib ]);
	},

	addControlgroup:function(partHandler){
		var cg$=$('<div></div>').addClass('ui-widget-content');
		this.div$.append(cg$);
		
		//main creater
		this.addPartCreaterButton(cg$, partHandler.bimType, partHandler.create);
		
		//alternate creaters
		for (var n in partHandler.creaters){
			this.addPartCreaterButton(cg$, n, partHandler.creaters[n]);
		};

		//wigetize cg$, google jquery-ui controlgroup for documentation, items indicates what widgets to apply. 
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
	
	// DOM container elements with jquery wrapping initialized in create()
	div$:null, //for dialog
	
	getEventHandlers:function(){
		return { 
			bimInput:{name:'bimInput',  handler:UIPARTS.onInput },
			bimRestock:{name:'bimRestock', handler:UIPARTS.onRestock }
		};
	},

	//called by uiBlackboard when new BIM user input received
	onInput:function(event, input){ 
		//don't use keyword 'this' here as it will refer to the event caller's context, not uiPicker
		switch(input){
		case 'ap':
		case 'parts': UIPARTS.toggle(); break;
		case 'restock':	BIM.ui.blackboard.trigger('bimRestock', [BIM.partsLib]); break;
		}		
	},
	
	onRestock:function(ev, lib){
		//beware of meaning of keyword 'this' inside event handlers!
		//TODO - remove any existing controlgroup from divs
		for (var i in lib){UIPARTS.addControlgroup(lib[i]);}		
	},
				
	toggle:function(){
		if (this.div$.dialog("isOpen")) {this.div$.dialog("close");} 
		else {this.div$.dialog("open");}
	}
	
};

return UIPARTS;

});

