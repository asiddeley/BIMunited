/************************************************************ licence:

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
	module: 	model
	author: 	Andrew Siddeley 
	started:	17-Dec-2016
	
************************************************************************/

define(
// load dependencies...
['jquery', 'kernel/part', 'babylon', 'kernel/partSphere'],

// then do...
function($, Part, babylon, Sphere) {
	
// Note Part vs part (Capital P vs lower case p)
// Part - part handlersm, one handler collection
// part - part data, constructed by Part.create(), many individual datas 

//alert('model...');

// modelHandlers inherits from partHandlers
var modelHandler=$.extend( {}, {

	bimSuperType:null,
	bimType:'model',

	create:function(userData){ return $.extend({}, Part.create, model, userData); },
	
	creaters:{
		demo:function(){
			//create a model
			var m=modelHandler.create(); 
			var v=babylon.Vector3;
			//and add some parts
			m.handler.addPart(m, Sphere.create({'name':'s1', 'radius':0.5, 'position':new v(0,0,0)}));
			m.handler.addPart(m, Sphere.create({'name':'s2', 'radius':1, 'position':new v(6,0,0)}));
			m.handler.addPart(m, Sphere.create({'name':'s3', 'radius':1.5, 'position':new v(0,6,0)}));
			m.handler.addPart(m, Sphere.create({'name':'s4', 'radius':2, 'position':new v(6,6,0)}));
			return m;
		}
	},
	
	
	getFeatures:function(model){
		var M=model.handler;
		var readonly=function(){}; //do nothing
		// construct and return a hash of features
		// name:{valu:refToProperty, onChange:Callback, widget:'text' }
		return $.extend({},{
			bimType:{valu:M.bimType, onChange:readonly, widget:'text'}, 
			name:{valu:model.name, onChange:this.ocName, widget:'text'},
			tags:{valu:model.tags, onChange:model.onTag, widget:'text'}
			}
		);
	},
	
	// override - babylon scene constructor
	setScene:function(model){
		for (var i=0; i<model.parts.length; i++){
			model.parts[i].handler.setScene( model.parts[i] );
		}
	},
	
	////////////////////
	// specific to model
	addPart:function(model, part){
		// part.parent=this;
		model.parts.push(part);
		// check scene because setScene may be called before scene is initialized 
		// i.e	when decendent (archModel) model is constructed
		if (typeof BIM !='undefined') {
			if(BIM.scene) { model.handler.setScene(model);}
		}
	},
	
	onName:function(ev, model, result){ 
		model.name=result;
	},

	
	onTag:function(ev, model, tag){
		//to do 
	},
	
	visit:function(model, visitor){ 
		visitor.welcome(model);
		//to do, access visit parts
	}
});


// Construct model data.  Used to extend part later in Model.Create()
var model={
	'name':'unnamed',
	'handler':modelHandler,
	'parts':[],
	'tags':[],
	'visible':true
};

//alert('Model constructed:'+modelHandlers);
return modelHandler;

});











