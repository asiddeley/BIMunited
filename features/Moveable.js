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

	
	project:	BIM united FC (Feature Collection)
	module: 	Moveable
	desc: 
	author: 	Andrew Siddeley 
	started:	5-Jun-2017
	
****************************************************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var Feature=require('features/Feature');
var TextFC=require('features/TextFC');
var ChooserFC=require('features/ChooserFC');

var trigger=BABYLON.ActionManager.OnPickTrigger;

var move=function(ev, data){
	//function for BABYLON.executeCodeAction in growableFA.setScene()
	//executed when mesh (or instance of mesh) is picked

	//not necessary to detach camera control
	//thanks http://www.html5gamedevs.com/topic/22709-stop-camera-rotation-mouse-drag/
	//BIM.fun.cameraPause('grown'); //unpaused when grown event triggered below 
	//BIM.scene.activeCamera.detachControl(BIM.options.canvas);

	//TO-DO show edit plane aka coaster
	var pickResult=data.scene.pick(data.scene.pointerX, data.scene.pointerY, function(mesh) { return mesh==data.coaster;} );
	if (pickResult.hit){
	
	
	}	
	
};

var Moveable=function(mesh, more){ 
	/***************
	Function that returns a fresh feature action object {}, scoped to a particular mesh
	mesh - scope or context of this feature
	more - {} with additional data such as bimHandler, scene or whatever
	growableFA creates instances of the mesh depending on were the user clicks
	****************/
	Feature.call(this, mesh, more);
	
	if (typeof mesh.bimData.growEnabled=='undefined') {mesh.bimData.growEnabled=true;}
	
	//should
	//feature=new Feature('growable', propPath, [true, false]); //first choice is default
	//feature.extend({}); //merge or mixin 
	
	this.alias='moveable';
	this.desc='Can be moved to any point on the plane provided';
	this.control=TextFC; //requires choices
	//this.choices=[ ];
	this.prop=mesh.bimData.moveable; //prop - meant for display only
	this.propDefault=true; //property in boolean
	this.propToBe=null; //to be determined
};

//Inherit from prototype of the super class in OOP
Moveable.prototype=Object.create(Feature.prototype);
Moveable.prototype.constructor=Moveable;

//override
Moveable.prototype.propUpdate=function(propToBe){
	//mesh.bimData[this.alias]=propToBe;
	//do nothing
};

//override
Moveable.prototype.setScene=function(scene, mesh){
	Feature.prototype.setScene.call(this, scene, mesh);

	if (typeof mesh.actionManager=='undefined'){
		mesh.actionManager = new BABYLON.ActionManager(scene);
	};
	
	var condition=BABYLON.StateCondition(
		mesh.actionManager, //action manager
		mesh.bimData.moveable,  //target
		true //value
	);
	
	mesh.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnLeftPickDown, //trigger
			function(ev){ move(ev, {scene:scene, mesh:mesh}); }, //code
			condition //condition - mesh.bimData.moveable == true
		)
	);


	return mesh;
};

return Moveable;
});


