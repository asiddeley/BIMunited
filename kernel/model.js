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

	
	project:	BIMsoup
	desc:		Building Information Model source open utility program 
		
	module: 	model
	desc: 
	usage:

	author: 	Andrew Siddeley 
	started:	17-Dec-2016
	
************************************************************************/

define(
// load dependencies...
['jquery', 'kernel/part', 'kernel/window'],

// then do...
function($, part, win) {

// construct and return model handlers
var modelHandlers={
	/////////////////////
	// Must haves...
	// returns a new model
	'create':function(userData){ return $.extend( {}, model, userData); },	 
	// returns a new model
	'demo':function(){ return $.extend( {}, model, { 'radius':Math.random() }); },
	// list of propterty access functions - functions may just display property or provide means of editing
	'properties': [ this.name, this.position ],
	// babylon scene constructor
	
	'setScene':function(model){
		//may be called before scene is initialized i.e when decendent (archModel) model is constructed
		if (win.BIM.scene != null) {
			for (var i=0; i<this.parts.length; i++){
				model.parts[i].setScene( parts[i] );
			}
		}
	},
	
	////////////////////
	// specific to model
	'addPart':function(model, part){
		//part.parent=this;
		model.parts.push(part);
		model.handlers.setScene(model);
	},
	
	'visit':function(model, visitor){ 
		visitor.welcome(model);
		
	}
};


// model data, inherits stuff from part
var model=$.extend( part.create(), {
	'discipline':'all',
	'handlers':modelHandlers,
	'parts',[],
	'tags':[],
	'type':'model'
});

return modelHandlers;

});











