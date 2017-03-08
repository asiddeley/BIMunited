/************************************************************ license:

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
['jquery', 'kernel/part', 'babylon', 'kernel/partSphere', 'kernel/worldBox'],

// then do...
function($, Part, babylon, Sphere, WB) {
	
// Note Part vs part (Capital P vs lower case p)
// Part - part handlersm, one handler collection
// part - part data, constructed by Part.create(), many individual datas 

//alert('model...');

// modelHandlers inherits from partHandlers
var modelHandler=$.extend( {}, {

	bimSuperType:null,
	bimType:'model',

	//create:function(userData){ return $.extend({}, Part.create, model, userData); },	
	//model not extended from part anymore
	create:function(userHash){ 
		//might need to do some inits 
		//eg m.worldBox.model=m;
		
		
		return $.extend({}, model, userHash);

	},
	
	
	creaters:{
		demo:function(){
			//create a model
			var m=modelHandler.create(); 
			var v=babylon.Vector3;
			//and add some parts
			//m.handler.addPart(m, Sphere.create({'name':'s1', 'radius':1, 'position':new v(0,0,0)}));
			//m.handler.addPart(m, Sphere.create({'name':'s2', 'radius':1, 'position':new v(6,0,0)}));
			//m.handler.addPart(m, Sphere.create({'name':'s3', 'radius':1.5, 'position':new v(0,6,0)}));
			//m.handler.addPart(m, Sphere.create({'name':'s4', 'radius':2, 'position':new v(6,6,0)}));
		
			
			return m;
		}
	},
	
	
	getFeatures:function( m ){
		//mm could be a model (or decendant type)
		// construct and return a hash of features
		// name:{valu:refToProperty, onChange:Callback, widget:'text' }
		var mh=m.handler;
		
		/*
		//mix together various properties/features (if each is defined in a module) 
		return $.extend({}, 
			bimType:{valu:MODEL.bimType, onChange:function(){}, widget:'text'},
			fName.feature(m), 
			//fPosition.feature(m), //model has no position, only instance of model does
			fWorldBox.feature(m), 
			fCategories.feature(m)
			)
		*/
		
		return $.extend({},{
			bimType:{ valu:mh.bimType, onChange:function(){}, widget:'text'}, 
			name:{ valu:m.name, onChange:mh.onName, widget:'text'},
			categories:{ valu:m.categories, onChange:mh.onCategory, widget:'list'}
			}
		);
	},
	
	// override - babylon scene constructor
	setScene:function( model ){
		model.worldBox.handler.setScene( model.worldBox );
		for (var i=0; i<model.parts.length; i++){
			model.parts[i].handler.setScene( model.parts[i] );
		}
	},
	
	setWorldBox:function(model, wb){
		model.worldBox=wb;
		wb.model=model;
		//to do recalculate extent of parts
	},
	
	////////////////////
	// specific to model
	addPart:function(model, part){
		part.host=model;
		//to do set part.baby element so position changes of model translated also to parts
		
		model.parts.push(part);
		// check scene because setScene may be called before scene is initialized 
		// i.e	when decendent (archModel) model is constructed
		if (typeof BIM !='undefined') {
			if(BIM.scene) { model.handler.setScene(model);}
		}
		
		//model.worldBox.onAddPart(part);
	},
	
	addRef:function(model, ref){
		//ref must have unique name
	
	},	
	
	onName:function(ev, model, result){ 
		model.name=result;
	},

	
	onCategories:function(ev, model, result){
		//to do 
	},
	
	visit:function(model, visitor){ 
		visitor.welcome(model);
		//to do, access visit parts
	}
});


// Construct model data.  Used to extend part later in Model.Create()
var model={
	categories:[],
	handler:modelHandler,
	host:null,
	id:null,
	//lightRefs:{},
	//modelRefs:{},
	name:'unnamed',
	parts:[],
	references:{},
	worldBox:WB.create(),
	//textureRefs:{},
	//viewRefs:{},
};
//do like this instead
//mix together various properties/features (if each is defined in a module) 
/*
var model=$.extend({},
	fName.name, 
	fWorldBox
);

*/


//alert('Model constructed:'+modelHandlers);
return modelHandler;

});











