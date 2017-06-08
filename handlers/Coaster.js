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
	module: 	Coaster - for use with Moveable feature
	desc: 
	author: 	Andrew Siddeley 
	started:	7-Jun-2017
	
****************************************************************/
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var Element=require('handlers/Handler__Element');
//var babylon=require('babylon');
var $=require('jquery');
//var Namable=require('features/nameable');
//var Position=require('features/Position');

var Coaster=function(){
	Element.call(this);
	
	this.bimType='Coaster';
	this.desc='Temporary plane for moving elements';
	//no features 
	//this.features=[ Nameable, Position];
}

//Inherit from the super class
Coaster.prototype=Object.create(Element.prototype);
Coaster.prototype.constructor=Coaster;
//shortcut
var __=Coaster.prototype;

//override
__.setScene=function(scene, mesh){


	var coaster=BABYLON.Mesh.CreatePlane( 'coaster', 100, scene, false, BABYLON.Mesh.DOUBLESIDE);

	if (typeof mesh!='undefined') {
		//DO NOT do this with position, causes a babylonian error. Must be a new BABYLON.Vector3 obj
		//coaster.position=mesh.position;

		//coaster moves with mesh
		//coaster.parent=mesh; 
	}
	
	var red=new BABYLON.Color3(1, 0, 0);
	var green=new BABYLON.Color3(0, 1, 0);
	var blue=new BABYLON.Color3(0, 0, 1);	
	
	coaster.material=new BABYLON.StandardMaterial("coaster", scene);
	
	coaster.material.alpha=0.5; //50% opacity
	coaster.material.diffuseColor=red;

	
	//add bimHandler and bimData info to coaster then return it
	return 	Element.prototype.setScene(scene, coaster);
};

return Coaster;

}); //end of define

