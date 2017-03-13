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
	started:	23-Feb-2017
	
************************************************************************/

define(
// load dependencies...
['jquery', 'babylon',  'kernel/tcm'],

// then do...
function($, babylon,  tcm) {
	
// modelHandlers inherits from partHandlers
var WORLDBOX=$.extend( {}, {

	bimSuperType:null,
	bimType:'worldBox',
	desc:'wrapper with skybox, ground, units, lights and views',
	
	create:function(userHash) { return $.extend( {}, Worldbox, userHash); },

	creaters:{
		sky:function(){
			var s=WORLDBOX.create(); 
			//WORLDBOX.setUnits(s, units.create( 'metres' ) );
			return s;
		},
		snow:function(){
			var s=WORLDBOX.create(); 
			//WORLDBOX.setUnits(s, units.create( 'feet' ) );
			return s;
		}
	},
		
	getFeatures:function(worldbox){
		return $.extend(
			//new object  
			{}, 
			//superType's (model) features - like calling super 
			//worldBox.handler.getFeatures(worldBox), 
			//space's features - overriding some things set by model such as bimType
			{ 
				bimType:{ valu:worldbox.handler.bimType, onFeature:function(){}, widget:'text'}, 
			}
		);
	},
	
	setScene:function(worldbox){

		worldbox.baby=BABYLON.Mesh.CreateBox(
			worldbox.name, 
			worldbox.size, 
			BIM.scene, 
			false, 
			babylon.Mesh.DEFAULTSIDE);
		// note two way relation between BIM part and babylon element 
		worldbox.baby.bim=worldbox;
		
		var m=new babylon.StandardMaterial("skyBox", BIM.scene);
		worldbox.baby.material = m;
		worldbox.baby.infiniteDistance = true;
		
		m.backFaceCulling = false;
		m.disableLighting = true;
		m.diffuseColor = new babylon.Color3(0, 0, 0);
		m.specularColor = new babylon.Color3(0, 0, 0);
		m.reflectionTexture = new babylon.CubeTexture("textures/worldBoxes/brownBlue", BIM.scene);
		m.reflectionTexture.coordinatesMode = babylon.Texture.SKYBOX_MODE;
	},
	
});


// Construct model data.  
var Worldbox={
	handler:WORLDBOX,
	lights:{},
	model:null,
	name:'unnamed',
	/*************
	textures:[
		tcm.create( $.extend( {name:'Up'}, tcm.colour.blue), 
		tcm.create( $.extend( {name:'Down') tcm.colour.fireBrick),
		tcm.create( $.extend( {name:'North'}, tcm.colour.cyan), 
		tcm.create( $.extend( {name:'East'}, tcm.colour.cyan), 	
		tcm.create( $.extend( {name:'South') tcm.colour.coral),
		tcm.create( $.extend( {name:'West') tcm.colour.coral),		
	],
	******************/
	size:100,
	views:{}

};

//alert('Model constructed:'+modelHandlers);
return WORLDBOX;

});











