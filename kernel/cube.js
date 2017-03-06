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
['babylon', 'jquery', 'kernel/featureName', 'kernel/featurePosition', 'kernel/featureTexture'],

// then do...
function(babylon, $, POS, TEX){
	
// Construct CUBE handler or hash of static methods - each method requires cube data as arguement except create().
// cube has position and material features.
var CUBE = $.extend( {}, NAM, POS, TEX, {

	bimSuperType:'part', //features added individually, not inherited from part
	bimType:'cube',
	
	// Constructor
	create:function(userData){ return $.extend( {}, Cube, userData ); },
 	
	// Constructors with various argument presets - demonstrators
	creaters:{
		basic:function(){ return CUBE.create();},
		randomized:function(){ return CUBE.create({ 
			position:BIM.fun.randomPosition(),  //   new babylon.Vector3(Math.random()*5, Math.random()*5, Math.random()*5),
			side:Math.random()*2
		});}
	},

	getFeatures:function(part){
		return $.extend( NAM.feature(part), POS.feature(part), TEX.feature(part), SIDE.feature(part) );
	},

	// babylon scene constructor
	setScene:function(part){
		/*
		size (number) size of each box side 1 
		height (number) height size, overwrites size property size 
		width (number) width size, overwrites size property size 
		depth (number) depth size, overwrites size property size 
		faceColors (Color4[]) array of 6 Color4, one per box face Color4(1, 1, 1, 1) for each side 
		faceUV (Vector4[]) array of 6 Vector4, one per box face UVs(0, 0, 1, 1) for each side 
		updatable (boolean) true if the mesh is updatable false 
		sideOrientation (number) side orientation DEFAULTSIDE 
		*/
		
		part.baby = babylon.Mesh.CreateBox(	
			part.name, 
			{
				size:part.size,
				updatable:part.updatable,
				//sideOrientation:part.faceMode
			},
			BIM.scene
		);

		part.baby.bim=part; //to access BIM information about babylon shape when picked
		part.baby.position=part.position; 
	}

	
}); 

// construct CUBE data template from various hashes - one CUBE, many cubes
var Cube=$.extend( 
	NAM.create(),
	POS.create(),
	TEX.create(),
	SIDE.create(),
	{ handler:CUBE } 	//last so it overrides handlers if accidentally defined in features
);

return CUBE;

});