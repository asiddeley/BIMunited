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

var $=require('jquery');
var Feature=require('features/Feature');
var TextFC=require('features/TextFC');
var ChooserFC=require('features/ChooserFC');
var Coaster=require('handles/Coaster');
var coasterHandler=new Coaster();


//////////////////////////////////////////////////////////////////////////////////////////////

var Moveable=function(mesh, options){ 
	/***************
	Function that returns a fresh feature object {}, scoped to a particular mesh
	mesh - scope or context of the feature
	more - {} with additional data such as bimHandler, scene or whatever
	****************/
	Feature.call(this, mesh, options);
	
	if (typeof mesh.bimData.moveable=='undefined') {mesh.bimData.moveable='Off';}
	
	//override following
	this.alias='moveable'; //property key
	this.desc='Element can be moved to any point on the coaster';
	this.control=ChooserFC; //requires choices
	this.choices=['Off','XY yellow','YZ cyan', 'ZX magenta'];
	this.coaster=null; //mesh movement stencil, a plane for pointer to intersect to get position 
	this.mesh=mesh;
	//this.propKey='moveable'; //TO-DO instead of this.alias
	//this.propJar=mesh.bimData; //TO-DO instead of this.prop=... and this.mesh
	this.prop=mesh.bimData.moveable; //prop - meant for display only 
	this.propToBe=null; //proposed new value for property
	this.propUpdate=function(propToBe){
		//Feature.prototype.propUpdate.call(this, propToBe);
		this.mesh.bimData[this.alias]=propToBe;
		this.coasterManager(propToBe);
	};
	this.setScene=function(scene, mesh){
		Feature.prototype.setScene(scene, mesh);	
		return mesh;
	};
	//TO-DO create a dual variable FC, for choices & sizes
	this.size=50; //size of coaster. 

};

//Inherit from prototype 
Moveable.prototype=Object.create(Feature.prototype);
Moveable.prototype.constructor=Moveable;

//Override
Moveable.prototype.coasterManager=function(propToBe){
	//this function is called by this.control (chooserFC) when a choice is selected 
	var data={mesh:this.mesh, moveable:this};
	var tools=BIM.resources.tools;

	var moveStart=function(ev){ 
		console.log("moveStart");
		var pickResult=BIM.scene.pick(
			//point to test
			BIM.scene.pointerX,	BIM.scene.pointerY, 
			// predicate function for pickResult.hit
			function(pickedmesh){ 
				//console.log("pickedMesh/featureMesh="+pickedmesh.name+"/"+ev.data.mesh.name);
				return (pickedmesh.name==ev.data.mesh.name);
			} 
		);
		//console.log("hit "+pickResult.hit);
		if (pickResult.hit) {
			//BIM.fun.cameraPause();
			$(BIM.options.canvas).on('mousemove.moveable', data, movement);
		}
		//return false;
	}
	
	var movement=function(ev){ //event handler
		//console.log('moveSome');
		var pickResult=BIM.scene.pick(
			BIM.scene.pointerX, BIM.scene.pointerY,  //point to test
			// predicate function for pickResult.hit
			function(mesh){ return (mesh==BIM.resources.tools.coaster);} 
		);
		//console.log(pickResult.hit);
		if (pickResult.hit){
			//console.log(BIM.scene.pointerX, BIM.scene.pointerY);
			//move mesh to position where pointer hit coaster...
			ev.data.mesh.position.copyFrom(pickResult.pickedPoint);
		}
		//return false to call event.stopPropagation() & event.preventDefault() 
		//return false; 
	};	

	var moveStop=function(ev){
		//console.log("moveStop");
		$(BIM.options.canvas).off('mousemove.moveable');
		BIM.fun.cameraPlay(); //harmless - will have no effect unless cameraPaused
		BIM.fun.trigger("propertychanged", [ev.data.mesh, "position"]);
		//return false;
	};
	
	if (propToBe!='Off'){
		//dispose existing coaster
		if (tools.coaster!=null){
			tools.coaster.dispose();
			//tools.coasterHandle.dispose(tools.coaster);
		}
		//make new coaster
		tools.coaster=tools.coasterHandle.setScene(BIM.scene, null, this.size, propToBe);	
		tools.coaster.position.copyFrom(this.mesh.position);
	
		//Babylon action manager doesn't have a mousemove trigger so used jquery instead for all - 
		//best not to mix jquery events and babylon action manager triggers to avoid conflicts
		//Note use of namespace ie.moveable in events below per jquery best practices
		BIM.fun.cameraPause(); //first need to pause camera i.e. detach camera mouse events so they're freed up
		$(BIM.options.canvas).on('mousedown.moveable', data, moveStart);
		$(BIM.options.canvas).on('mouseup.moveable', data, moveStop);		
	} else {
		//Off selected...
		//Ensure coaster exists before trying to dispose it
		if (BIM.resources.tools.coaster!=null){
			BIM.resources.tools.coasterHandle.dispose(BIM.resources.tools.coaster);
		}
		//following are harmless if event handlers don't exist
		$(BIM.options.canvas).off('mousedown.moveable');
		$(BIM.options.canvas).off('mousemove.moveable');
		$(BIM.options.canvas).off('mouseup.moveable');
	}
};

return Moveable;
});


