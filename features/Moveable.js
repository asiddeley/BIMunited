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
var Coaster=require('handlers/Coaster');
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
	this.moveStart=false; //need to click on mesh first while cosater is on, to start move
	//this.propKey='moveable'; //TO-DO instead of this.alias
	//this.propObj=mesh.bimData; //TO-DO instead of this.prop=... and this.mesh
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
	this.size=50; //size of coaster. TO-DO create a dual variable FC, for choices & sizes

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
		var pickResult=BIM.scene.pick(
			//point to test
			BIM.scene.pointerX,	BIM.scene.pointerY, 
			// predicate function for pickResult.hit
			function(pickedmesh){ 
				//console.log(pickedmesh.name);
				//Duh! ev.data.mesh is the one in the sample, not in the main scene
				return (pickedmesh===ev.data.mesh);
			} 
		);
		//console.log("mousedown hit "+pickResult.hit);
		if (pickResult.hit) {
			//console.log("moveStart/cameraPause");
			BIM.fun.cameraPause();
			ev.data.moveable.moveStart=true;
		}
		return false;
	}
	
	var moveOngoing=function(ev){ //event handler
		//console.log('mousemove');
		var pickResult=BIM.scene.pick(
			BIM.scene.pointerX, BIM.scene.pointerY,  //point to test
			// predicate function for pickResult.hit
			function(mesh){ return (mesh==BIM.resources.tools.coaster);} 
		);
		//console.log(pickResult.hit);
		if (pickResult.hit == true ){
			//console.log(BIM.scene.pointerX, BIM.scene.pointerY);
			//move mesh to position where pointer hit coaster...
			if (ev.data.moveable.moveStart==true){
				ev.data.mesh.position.copyFrom(pickResult.pickedPoint);
				//ev.data.mesh.position.y=pickResult.pickedPoint.y;
			}
		}
		//automatically call event.stopPropagation() and event.preventDefault() 
		return false; 
	};	

	var moveStop=function(ev){
		//console.log("moveStop/cameraPlay");
		BIM.fun.cameraPlay(); //harmless - will have no effect unless cameraPaused
		ev.data.moveable.moveStart=false;				
		return false;
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
	
		//Setup mouseup, mousedown and mousemove events for mesh to be moved by the pointer.
		//Babylon action manager doesn't have a mousemove trigger so use jquery instead for all - 
		//best not to mix jquery events and babylon action manager triggers to avoid conflicts
		//Note use of namespace ie.moveable in events below per jquery best practices
		$(BIM.options.canvas).on('mousedown.moveable', data, moveStart);
		$(BIM.options.canvas).on('mousemove.moveable', data, moveOngoing);
		$(BIM.options.canvas).on('mouseup.moveable', data, moveStop);		
	} else {
		//Off selected...
		//Ensure coaster exists before trying to dispose it
		if (BIM.resources.tools.coaster!=null){
			BIM.resources.tools.coaster.dispose();
			//BIM.resources.tools.coasterHandle.dispose();
		}
		//following are harmless if event handlers don't exist
		$(BIM.options.canvas).off('mousemove.moveable'); 
		$(BIM.options.canvas).off('mouseup.moveable');
		$(BIM.options.canvas).off('mousedown.moveable');			
		this.moveStart=false;
	}
};

return Moveable;
});


