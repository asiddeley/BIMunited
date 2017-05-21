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

var ChooserFC=require('features/ChooserFC');

var growableFn=function(ev, more){
	//function for BABYLON.executeCodeAction in growableFA.setScene()
	//executed when mesh (or instance of mesh) is picked

	//thanks http://www.html5gamedevs.com/topic/22709-stop-camera-rotation-mouse-drag/
	BIM.fun.cameraPause('grown'); //unpaused when grown event triggered below
	
	var mori=ev.meshUnderPointer; //mesh or instance
	var inst; //reserved for new instance
	var pm=mori.position;
	var pc=more.scene.activeCamera.position;
	var pd=pm.subtract(pc);
	var aa=BIM.fun.closestAxis(pd);
	var pi=new BABYLON.Vector3(pm.x-aa.x*10, pm.y-aa.y*10, pm.z-aa.z*10);
	
	if (typeof mori.createInstance!='undefined'){
		inst=mori.createInstance('grown');
		//important to add bimData to instance
		inst.bimData={mesh:mori}; //  TO-DO make this bimableFE??
	} else {
		inst=mori.bimData.mesh.createInstance('grown');
		//important to add bimData to instance
		inst.bimData=$.extend({}, mori.bimData); //add bimData to inst by cloning it from source
	}
	
	inst.position.copyFromFloats(pi.x, pi.y, pi.z);
	//add growable functionality to instance
	growableFA(inst).setScene(more.scene);
	
	//trigger grow event for any interested UIs, including unpause camera
	BIM.fun.trigger('grown', inst);
};

var growableFA=function(mesh){ 
	/***************
	Static function that returns a fresh feature action object {}, scoped to a particular mesh
	mesh - scope or context of this feature
	more - {} with additional data such as bimHandler, scene or whatever
	growableFA creates instances of the mesh depending on were the user clicks
	*/
	return { 
		alias:'growable',
		control:ChooserFC, //requires choices
		//control:OptionsFC, //versatile
		choices:[ 'enabled - clone', 'enabled - instance', 'disable'],
		prop:mesh.bimData.growEnabled, //property path
		propDefault:true, //property in boolean 
		//propInit:function(scene, mesh){return this.setScene(scene);};
		propToBe:null, //to be determined
		propUpdate:function(propToBe){
			if (propToBe){
				//enable action
			}
			/*TO DO register/unregister action */
		},
		setScene:function(scene){
			if (typeof mesh.bimData=='undefinded') {mesh.bimData={};}
			mesh.bimData.growEnabled=true;
			mesh.actionManager = new BABYLON.ActionManager(scene);
			mesh.actionManager.registerAction(
				new BABYLON.ExecuteCodeAction(
					BABYLON.ActionManager.OnPickTrigger,
					function(ev){ growableFn(ev, {scene:scene});}
				)
			);
			return mesh;
		}
	};
};

return growableFA;
});


