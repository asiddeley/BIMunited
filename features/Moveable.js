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
var Coaster=require('handlers/Coaster');
var coasterHandler=new Coaster();


var moveStart=function(ev, data){
	//function for BABYLON.executeCodeAction in growableFA.setScene()
	//executed when mesh (or instance of mesh) is picked

	//not necessary to detach camera control
	//thanks http://www.html5gamedevs.com/topic/22709-stop-camera-rotation-mouse-drag/
	//BIM.fun.cameraPause('grown'); //unpaused when grown event triggered below 
	//BIM.scene.activeCamera.detachControl(BIM.options.canvas);

	//TO-DO show travelling plane for pointer collision AKA coaster
	//if (data.coaster==null){data.coaster=new Coaster(data.mesh);}
	
	var pickResult=data.scene.pick(
		data.scene.pointerX, 
		data.scene.pointerY, 
		function(mesh) { console.log('mesh name '+mesh.name);return mesh==data.coaster; }
	);
	
	if (pickResult.hit){
		//TO-DO revise mesh position based on pointer/coaster collision point
		console.log('coaster hit');
	}	
	
};

var moveStop=function(ev, data){
	//data.coaster.dispose();
};


//////////////////////////////////////////////////////////////////////////////////////////////

var Moveable=function(mesh, more){ 
	/***************
	Function that returns a fresh feature action object {}, scoped to a particular mesh
	mesh - scope or context of this feature
	more - {} with additional data such as bimHandler, scene or whatever
	****************/
	Feature.call(this, mesh, more);
	
	if (typeof mesh.bimData.moveable=='undefined') {mesh.bimData.moveable=true;}

	
	this.alias='moveable';
	this.desc='Element can be moved to any point on the coaster';
	this.control=ChooserFC; //requires choices
	this.coaster=null; //a plane that follows the mesh, to intersect with the pointer to get a revised position for the mesh
	this.choices=['off','XY-red','YZ-green', 'XZ-blue'];
	this.prop=mesh.bimData.moveable; //prop - meant for display only
	this.propDefault=true; //property in boolean
	this.propToBe=null; //to be determined
};

//Inherit from prototype 
Moveable.prototype=Object.create(Feature.prototype);
Moveable.prototype.constructor=Moveable;

//override
Moveable.prototype.propUpdate=function(propToBe){
	//this function is called by this.control (chooserFC) when a choice is selected 
	this.mesh.bimData[this.alias]=propToBe;
	console.log(propToBe);
	//TO-DO change coaster or turn of depending on choices

};

//override
Moveable.prototype.setScene=function(scene, mesh){
	// static function so don't even think of using keyword 'this' here
	// call prototype function first...
	Feature.prototype.setScene(scene, mesh);

	mesh.bimData.coaster=coasterHandler.setScene(scene, mesh); 
	
	if (typeof mesh.actionManager=='undefined'){
		mesh.actionManager = new BABYLON.ActionManager(scene);
	};
	
	var condition=BABYLON.StateCondition(
		mesh.actionManager, //action manager
		mesh.bimData.moveable,  //target
		true //value
	);

	var data={scene:scene, mesh:mesh, coaster:mesh.bimData.coaster};
	
	mesh.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnLeftPickTrigger, //trigger
			function(ev){ moveStart(ev, data)} //code
			//condition //condition - mesh.bimData.moveable == true
		)
	);
	
	mesh.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnRightPickTrigger, //trigger
			function(ev){ moveStop(ev, data); } //code
			//condition //condition - mesh.bimData.moveable == true
		)
	);


	return mesh;
};

return Moveable;
});


