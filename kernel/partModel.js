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
function($, Part, win) {
	
// Note Part vs part (Capital P vs lower case p)
// Part - part handlersm, one handler collection
// part - part data, constructed by Part.create(), many individual datas 

//alert('model...');

// modelHandlers inherits from partHandlers
var modelHandlers=$.extend( {}, Part, {

	// override - returns a new model
	'create':function(userData){ return $.extend({}, Part.create, model, userData); },
	
	// override - list of property access functions 
	'getProperties': function(){
		var that=this;
		// construct collection of property access functions, inherit from part
		return $.extend({}, Part.getProperties(), 
			{'tags': that.tags}
		); //extend
	},
	
	// override - babylon scene constructor
	'setScene':function(model){
		for (var i=0; i<model.parts.length; i++){
			model.parts[i].handlers.setScene( model.parts[i] );
		}
	},
	
	////////////////////
	// specific to model
	'addPart':function(model, part){
		// part.parent=this;
		model.parts.push(part);
		// check scene because setScene may be called before scene is initialized 
		// i.e	when decendent (archModel) model is constructed
		if (win.BIM.scene != null) { model.handlers.setScene(model);}
	},
	
	'tags':function(model, dashboard){
		var callback=function(){};
		dashboard.list('tags', model.tags, callback);		
	},
	
	'type':function(part, dashboard){
		var callback=function(part){ 
			//no action required since a part's type is unchanging.
			//or is it? Some type changes possible, eg cube to sphere 
		};
		dashboard.label('type', 'model', callback );
	},	
	
	'visit':function(model, visitor){ 
		visitor.welcome(model);
		//to do, access visit parts
	}
});


// Construct model data.  Used to extend part later in Model.Create()
var model={
	'disc':'all',
	'handlers':modelHandlers,
	'parts':[],
	'tags':[],
	'visible':true
};

//alert('Model constructed:'+modelHandlers);
return modelHandlers;

});











