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
	module: 	voxelite
	desc: 
	author: 	Andrew Siddeley 
	started:	24-Mar-2017
	
****************************************************************/
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module){

var babylon=require('babylon');
var $=require('jquery');
var Element=require('handlers/Element__Handler');
var Nameable=require('features/Nameable');
var Position=require('features/Position');
var Pickable=require('features/Pickable');
var McGrowable=require('features/McGrowable');

var Voxelite=function(topFeatures){
	Element.call(this, topFeatures);
	
	this.bimType='Voxelite'; //DEP?? - use instanceof or prototype.constructor
	this.desc='A volumetric pixel or 10 unit cube that can be placed at 10 unit coordinates.';
	//Note that the following method is inherited from Element...
	this.addFeatures(
		Nameable, 
		//userFeature('Desc', 'A 10 unit cube, that can be placed at 10 unit coordinates.'),
		Position,
		Pickable,
 	);

};

//inherit prototype from super
Voxelite.prototype=Object.create(Element.prototype);
Voxelite.prototype.constructor=Element;
//shortcut
var __=Voxelite.prototype;	

//override
__.getfeatures=function(mesh){
	return Element.prototype.getfeatures.call(this, mesh);
};

//static funtion so mesh first	arg ? No, mesh is optional so second arg
//override Element.setScene
__.setScene=function(scene, mesh){ 
	//why is mesh provided as an argument if it is meant to be created here?
	//Important convention - if calling prototype method then always do it first
	//except that it needs to be called at the end here after mesh is created
	//Element.prototype.setScene(scene, mesh); //...is at end of function.
	
	//__.BIM.func.dependency(babylon.StandardMaterial, 'voxelTexture', scene)
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
	
	var mesh=BABYLON.MeshBuilder.CreateBox('voxelite', options, scene);
	mesh.material=m;	
	Element.prototype.setScene.call(this, scene, mesh);
	return mesh;
};

return Voxelite;
});