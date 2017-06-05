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
	module: 	growableFA
	desc: 
	author: 	Andrew Siddeley 
	started:	19-May-2017
	
****************************************************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var Feature=require('features/Feature');
var ChooserFC=require('features/ChooserFC');

var trigger=BABYLON.ActionManager.OnPickTrigger;

var cull=function(ev){
	var mori=ev.meshUnderPointer; //mesh or instance
	ok=true;
	//contains instances therefore it's a mesh
	if (typeof mori.instances!='undefined' && mori.instances.length>0){
		var msg='Contains '+ 
		mori.instances.length.toString()+
		' instances.\n Please confirm disposal...';
		ok=confirm(msg);		
	}
	if (ok) {
		//trigger an event for any interested listeners such as undo...
		BIM.fun.trigger('operation', {name:'dispose', item:mori});
		mori.dispose();
	}
	
};

var grow=function(ev, more){
	//function for BABYLON.executeCodeAction in growableFA.setScene()
	//executed when mesh (or instance of mesh) is picked

	//not necessary to detach camera control
	//thanks http://www.html5gamedevs.com/topic/22709-stop-camera-rotation-mouse-drag/
	//BIM.fun.cameraPause('grown'); //unpaused when grown event triggered below 
	//BIM.scene.activeCamera.detachControl(BIM.options.canvas);
	
	var mori=ev.meshUnderPointer; //mesh or instance
	var inst; //reserved for new instance
	var pm=mori.position;
	var pc=more.scene.activeCamera.position;
	var pd=pm.subtract(pc);
	var aa=BIM.fun.closestAxis(pd);
	var np=new BABYLON.Vector3(pm.x-aa.x*10, pm.y-aa.y*10, pm.z-aa.z*10); //new position
	
	if (typeof mori.createInstance!='undefined'){
		inst=mori.createInstance('grown');
		//important to add bimData to instance
		inst.bimData={mesh:mori}; //  TO-DO make this bimableFE??
	} else {
		inst=mori.bimData.mesh.createInstance('grown');
		//important to add bimData to instance
		inst.bimData=$.extend({}, mori.bimData); //add bimData to inst by cloning it from source
	}
	
	inst.position.copyFromFloats(np.x, np.y, np.z);
	//add growable functionality to instance
	McGrowable.prototype.setScene(more.scene, inst);
	
	//trigger grow event for any interested UIs
	//BIM.fun.trigger('grown', inst);
	//BIM.scene.activeCamera.attachControl(BIM.options.canvas);
};

var McGrowable=function(mesh, more){ 
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
	
	this.alias='growable';
	this.control=ChooserFC; //requires choices
	this.choices=[ 'enabled - clone', 'enabled - instance', 'disable'];
	this.prop=mesh.bimData.growEnabled; //prop - meant for display only
	this.propDefault=true; //property in boolean
	this.propToBe=null; //to be determined
};

//Inherit from prototype of the super class in OOP
McGrowable.prototype=Object.create(Feature.prototype);
McGrowable.prototype.constructor=McGrowable;
//shortcut
var __=McGrowable.prototype;

//override
__.propUpdate=function(propToBe){
	if (propToBe){
		//enable action
	}
	/*TO DO register/unregister action */
};

//override
__.setScene=function(scene, mesh){
	//first call prototype (or super in OOP), don't care what it returns
	Feature.prototype.setScene.call(this, scene, mesh);
	
	if (typeof mesh.bimData=='undefinded') {mesh.bimData={};}
	mesh.bimData.growEnabled=true;
	if (typeof mesh.actionManager=='undefined'){
		mesh.actionManager = new BABYLON.ActionManager(scene);
	};
	
	mesh.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnLeftPickTrigger,
			function(ev){ grow(ev, {scene:scene});}
		)
	);
	
	mesh.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnRightPickTrigger,
			cull
		)
	);
	
	return mesh;
};

return McGrowable;
});


