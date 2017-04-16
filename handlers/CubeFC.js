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
['babylon', 'jquery', 'features/nameFeature', 'kernel/featurePosition'],

// then do...
function(babylon, $, nameFeature, position){

//DEP, use: var bimType=instanceOf (new Voxelite());
//	bimType:'Voxel', 
	
// Constructor - Used only once below  
// Voxelite() => voxelite {obj}, the handler with Static methods
var Voxelite=function(){
	this.bimType='Voxelite';
	this.description='A unit cube, locatable at integer coordinates';
	this.setScene=function(scene){ 
	
	var m=new babylon.StandardMaterial("voxelTexture", scene);
	m.diffuseTexture = new babylon.Texture("textures/voxelTextures.png", scene);
	m.uScale=1.0;
	m.vScale=1.0;
	//m.backFaceCulling=true;

	var options={
		width:10,
		height:10,
		depth:10,
		faceUV:[
			//faceUV order is: z+, z-, x+. x-, y+, y-
			//BABYLON.Vector4(uLL, vLL, uUR, vUR)
			new BABYLON.Vector4(9/16, 3/16, 8/16, 2/16), //sides
			new BABYLON.Vector4(8/16, 2/16, 9/16, 3/16), //note flip uUR, vUR, uLL, vLL
			new BABYLON.Vector4(9/16, 2/16, 10/16, 3/16),
			new BABYLON.Vector4(9/16, 2/16, 10/16, 3/16),
			new BABYLON.Vector4(11/16, 2/16, 12/16, 3/16), //grass top		
			new BABYLON.Vector4(10/16, 2/16, 11/16, 3/16), //dirt bottom		
		]
	};		
	
	var v=BABYLON.MeshBuilder.CreateBox('Voxelite', options, scene);
	//v.position=new babylon.Vector3(
	//	10*Math.floor(Math.random()*10), 
	//	10*Math.floor(Math.random()*10), 
	//	10*Math.floor(Math.random()*10)); 
	v.material=m;	
		
	//add bim handler to babylon mesh object
	v.bimHandler=voxelite;
		
	//return the new mesh that was added to the scene
	return v;
	};


	this.getFeatures=function(mesh) {
		// Returns a fresh hash of features:
		// {name:{feature}, position:{feature}...}
		// A feature is a hash scoped to a particular mesh like this:
		// {label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditer}
		// return $.extend({},name.getFeature(mesh) );
		return {
			name:nameFeature(mesh),
		}

	}
}

var voxelite=new Voxelite();
// return one voxelite handler for all voxelite meshes
return voxelite;
});