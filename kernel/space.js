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
	module: 	space
	author: 	Andrew Siddeley 
	started:	22-Jan-2017
	
************************************************************************/

define(
// load dependencies...
['jquery', 'babylon', 'kernel/model', 'kernel/units'],

// then do...
function($, babylon, model, units) {
	
// Note Part vs part (Capital P vs lower case p)
// Part - part handlersm, one handler collection
// part - part data, constructed by Part.create(), many individual datas 

//alert('model...');

// modelHandlers inherits from partHandlers
var spaceHandler=$.extend( {}, model, {

	bimSuperType:'model',
	bimType:'space',
	desc:'model with skybox, ground, light and views'
	
	create:function(userHash){ return $.extend({}, model.create(), space, userHash); },

	creaters:{
		metres:function(){
			var s=spaceHandler.create(); 
			s.handler.setUnits(s, units.create( 'metres' ) );
			return s;
		},
		feet:function(){
			var s=spaceHandler.create(); 
			s.handler.setUnits(s, units.create( 'feet' ) );
			return s;
		}
	},
		
	getFeatures:function(space){
		return $.extend(
			//new object  
			{}, 
			//superType's (model) features - like calling super 
			model.handler.getFeatures(space), 
			//space's features - overriding some things set by model such as bimType
			{ 
				bimType:{ valu:space.handler.bimType, onFeature:function(){}, widget:'text'}, 
				categories:{ valu:model.categories, onFeature:M.onCategory, widget:'list'}
			}
		);
	},
	

	setUnits:function(space, units ){
		space.units=units;	
	
	},	
	

	
});


// Construct model data.  Used to extend part later in Model.Create()
var space={
	units:null
	parts:[
		reference.create( {refname:'ground'} ),
		reference.create( {refname:'hemi'} ),
		reference.create( {refname:'view'} ),
		reference.create( {refname:'ground'} ),
		reference.create( {refname:'hemi'} ),
		reference.create( {refname:'yonder'} )
	],
	
	references:{
		ground:ground.create( {name:'ground', size:100} ),
		light:light.create( {name:'hemi' } ),
		view:view.create( {name:'view' } ),
		viewN:view.create( {name:'viewN' } ),
		viewW:view.create( {name:'viewW' } ),
		yonder:yonder.create( {name:'yonder', size:100} ),
	}

	//Following inherited from model...
	//categories:[],
	//handler:modelHandler,
	//id:null,
	//lightRefs:{},
	//modelRefs:{},
	//name:'unnamed',
	//parts:[],
	//textureRefs:{},
	//viewRefs:{},
};

//alert('Model constructed:'+modelHandlers);
return spaceHandler;

});











