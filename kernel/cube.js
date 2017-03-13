/************************************************************
	license:

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

	
	project:	BIM united FC (Framework Concept)
	module: 	cube
	desc: 
	author: 	Andrew Siddeley 
	started:	27-Feb-2017
	
****************************************************************/
define(

// load dependencies...
['babylon', 'jquery', 'kernel/featureName', 'kernel/featurePosition'],

// then do...
function(babylon, $, NAM, POS){
	
var TEX={};
	
// Construct CUBE handler or hash of static methods - each method requires cube data as arguement except create().
// cube has position and material features.
var CUBE = $.extend( {}, NAM, POS, TEX, {

	bimSuperType:null, 
	bimType:'cube',
	
	// Constructor
	create:function(userData){ return $.extend( {}, Cube, userData ); },
 	
	// Constructors with various argument presets - demonstrators
	creaters:{
		basic:function(){ return CUBE.create();},
		random:function(){ return CUBE.create( { 
			position:BIM.fun.randomPosition(),  
			size:Math.random()*10
		});}
	},

	getFeatures:function(part){ return $.extend( 
		NAM.feature(part), 
		POS.feature(part)
		//TEX.feature(part), 
		//SIDE.feature(part) 
	);},

	// babylon scene constructor
	setScene:function(cube){
		
		cube.baby = babylon.Mesh.CreateBox(	
			cube.name, 
			cube.size,
			BIM.scene
		);

		cube.baby.bim=cube;
		cube.baby.position=cube.position; 
	}

	
}); 

// Cube template
var Cube=$.extend( {}, 
	NAM.getTemplate(),
	POS.getTemplate(),
	{ 
		updatable:true,
		size:1,
		faceMode:babylon.Mesh.DEFAULTSIDE,	//scene.babylon.Mesh.DEFAULTSIDE},
		//TEX.create(),
		//SIDE.create(),
		handler:CUBE //last so it overrides handlers if accidentally defined in features
	} 	
);

return CUBE;

});