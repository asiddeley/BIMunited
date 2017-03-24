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

	
	project:	BIM united FC (Function Collection)
	module: 	voxel
	desc: 
	author: 	Andrew Siddeley 
	started:	24-Mar-2017
	
****************************************************************/
define(

// load dependencies...
['babylon', 'jquery', 'kernel/featureName', 'kernel/featurePosition'],

// then do...
function(babylon, $, NAM, POS){
	
var TEX={};
	
// Construct CUBE handler or hash of static methods - each method requires cube data as arguement except create().
// cube has position and material features.
var VOXEL = $.extend( {}, NAM, POS, TEX, {

	bimSuperType:null, 
	bimType:'voxel',
	
	// Constructor
	create:function(userData){ 

		var m=new babylon.StandardMaterial("voxelTexture", BIM.scene);
		m.diffuseTexture = new babylon.Texture("textures/voxelTextures.png", BIM.scene);
		
		//rotate faces as required to make good -- tricky with sprites as whole atlas rotates
		//m.diffuseTexture.uAng=Math.PI;
		//m.diffuseTexture.vAng=0;
		//m.diffuseTexture.wAng=Math.PI*2;

		m.uScale=1.0;
		m.vScale=1.0;
		m.backFaceCulling=true;

		var options={
			width:10,
			height:10,
			depth:10,
			faceUV:[
				//face order: z+, z-, x+. x-, y+, y-
				//BABYLON.Vector4(uLL, vLL, uUR, vUR)
				new BABYLON.Vector4(9/16, 3/16, 8/16, 2/16), 
				new BABYLON.Vector4(8/16, 2/16, 9/16, 3/16), //note flip uUR, vUR, uLL, vLL
				
				new BABYLON.Vector4(9/16, 2/16, 10/16, 3/16),
				new BABYLON.Vector4(9/16, 2/16, 10/16, 3/16),

				new BABYLON.Vector4(11/16, 2/16, 12/16, 3/16), //grass top		
				new BABYLON.Vector4(10/16, 2/16, 11/16, 3/16), //dirt bottom		
			]
		};		
		var v=BABYLON.MeshBuilder.CreateBox('voxel', options, BIM.scene);
		var s=10;
		v.position=new babylon.Vector3(
			10*Math.floor(Math.random()*s), 
			10*Math.floor(Math.random()*s), 
			10*Math.floor(Math.random()*s)); 
		v.material=m;	
	},

	creaters:{},

	getFeatures:function(mesh){ return $.extend( 
		NAM.feature(mesh), 
		POS.feature(mesh)
		//TEX.feature(part), 
		//SIDE.feature(part) 
	);},


}); 


return VOXEL;

});