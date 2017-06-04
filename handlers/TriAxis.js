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
	module: 	triad
	desc: 
	author: 	Andrew Siddeley 
	started:	24-Mar-2017
	
****************************************************************/
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var Element=require('handlers/Element__Handler');
var babylon=require('babylon');
var $=require('jquery');
//var Namable=require('features/nameable');
//var Position=require('features/Position');

var TriAxis=function(){
	Element.call(this);
	
	this.bimType='TriAxis';
	this.desc='Three axiis of a coordinate system';
	/*************** 
	// triAxis is a constant with inaccessible properties so no features 
	this.features=[ Nameable, Position];
	*/
	
	return this;
}

//Inherit from the super class
TriAxis.prototype=Object.create(Element.prototype);
TriAxis.prototype.constructor=TriAxis;
//shortcut
var __=TriAxis.prototype;

__.axis=function(v1, v2, colour, scene) {
	/*
	var ax=BABYLON.Mesh.CreateTube(
		"tube", //name
		[v1, v2], //vertices
		0.5, //radius, 
		4, //tesselation, 
		null, //radiusFunction, 
		BABYLON.Mesh.CAP_ALL, //cap,
		scene //scene
	);
	ax.material=new babylon.StandardMaterial('triad axis', scene);
	ax.material.diffuseColor=colour;
	*/
	var ax=babylon.Mesh.CreateLines('axis', [v1, v2], scene);
	ax.color=colour;
	return ax;
};

__.cone=function(v1, v2, v3, colour, scene){

	//https://doc.babylonjs.com/overviews/how_rotations_and_translations_work
		
	var tip=babylon.Mesh.CreateCylinder('tip', //name
		10,	//height, 
		0,	//diameterTop,
		5,	//diameterBottom, 
		4,	//tessellation, 
		1,	//subdivisions
		scene,	//scene 
		false,	//canBeRegenerated(opt), 
		babylon.Mesh.DEFAULTSIDE //	
	);
	tip.material=new babylon.StandardMaterial("triad", scene);
	tip.material.diffuseColor=colour;
	//Note that RotationFromAxis() changes the vertex objects provided by normalizing them
	//so if they are used elsewhere, then it's best to provide copies (clones) as arguments
	tip.rotation = new babylon.Vector3.RotationFromAxis(v1.clone(), v2.clone(), v3.clone());
	tip.position=v2;
	
	return tip;
}



//override
__.setScene=function(scene){

	//Element.prototype.setScene(scene);

	var red=new babylon.Color3(1, 0, 0);
	var green=new babylon.Color3(0, 1, 0);
	var blue=new babylon.Color3(0, 0, 1);	
	
	var v0=new babylon.Vector3(0, 0, 0);
	var vx=new babylon.Vector3(20, 0, 0);
	var vy=new babylon.Vector3(0, 20, 0);
	var vz=new babylon.Vector3(0, 0, 20);
	
	var xx=this.axis(v0, vx, red, scene);
	var xxtip=this.cone( vz, vx, vy, red, scene);
	var yy=this.axis(v0, vy, green, scene);
	var yytip=this.cone( vx, vy, vz, green, scene);
	var zz=this.axis(v0, vz, blue, scene);
	var zztop=this.cone( vy, vz, vx, blue, scene);
	
	//add bim handler to babylon mesh object
	//assuming xx is the head mesh 
	xx.bimHandler=this;
		
	//return the new mesh that was added to the scene
	return xx;
};

return TriAxis;

}); //end of define

