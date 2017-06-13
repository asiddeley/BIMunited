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

var Element=require('handles/Handle');
//var Element=require('handles/Triaxis');
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

//Override
Coaster.prototype.setScene=function(scene, mesh, size, plane){
	/****
	scene - 
	mesh - parent mesh | null
	size - 
	plane - XY yellow|YZ cyan|ZX magenta	
	****/
	if(typeof size=='undefined') size=50;
	if(typeof plane=='undefined') plane='XY yellow';
	
	var coaster=BABYLON.Mesh.CreatePlane( 'coaster', size, scene, false, BABYLON.Mesh.DOUBLESIDE);
	if (plane=='YZ cyan'){coaster.rotation=new BABYLON.Vector3(0, Math.PI*0.5, 0)}
	else if (plane=='ZX magenta'){coaster.rotation = new BABYLON.Vector3(Math.PI*0.5, 0, 0);}

	if (typeof mesh!='undefined') {
		//DO NOT do the following with position, causes a babylonian error. 
		//Must be a new BABYLON.Vector3 obj
		//coaster.position=mesh.position;
		//coaster moves with mesh
		//coaster.parent=mesh; 
	}
	
	coaster.material=new BABYLON.StandardMaterial("coaster", scene);
	coaster.material.alpha=0.25; //opacity
	if (plane=='XY yellow') {coaster.material.diffuseColor=new BABYLON.Color3(1, 1, 0);}
	else if (plane=='YZ cyan') {coaster.material.diffuseColor=new BABYLON.Color3(0, 1, 1);}
	else if (plane=='ZX magenta') {coaster.material.diffuseColor=new BABYLON.Color3(1, 0, 1);}
	
	//add bimHandler and bimData info to coaster then return it
	//Element.prototype.setScene(scene, coaster);
	bimhandle=this;
	return coaster;
};

return Coaster;

}); //end of define

