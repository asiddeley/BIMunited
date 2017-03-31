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

	alias:'Parts',
	
	create:function(board, uiStore, evManager){
		// create only one instance of this ui - static
		// board - the DOM container 
		// uiStore - BIM.ui hash to store ui references
		// eRegistrar - Object that registers events or null
		this.div$=$('<div></div>');
		if (board != null) { $(board).append(this.div$);}
		if (evManager != null) {evManager.addEventHandlers(this.getEventHandlers());}
		if (uiStore != null) {uiStore.uiParts=this;	}
		BIM.input('_restock'); //this.onRestock(null, BIM.partsLib);
		return this;
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
			//eval creater function fn, and set cMesh to is (current Mesh).
			BIM.get.cMesh(fn()); 
			//message to uiFeatures to expose new mesh features
			BIM.input('_meshAdded'); 		
		};
		var b$=$('<button></button>').addClass('ui-widget-content').text(n); 
		b$.on('click', onClick);
		cg$.append(b$);
	},
	
	// DOM container elements with jquery wrapping initialized in create()
	div$:null, 
	
	getDiv$:function(){return this.div$;},
	
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
		case '_restock':	BIM.ui.uiBlackboard.trigger('bimRestock', [BIM.partsLib]); break;
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

