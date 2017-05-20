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

var growableFA=function(mesh){ 
	/***************
	Static function that returns a fresh name feature object {}, scoped to a particular mesh
	A feature is a hash used by uiFeatures to control
	an object's (eg. babylon mesh) property (eg. position), eg.
	{alias:'name', control:ChooserFC, prop:mesh.variable, propUpdate:fn(ev,mesh,res){...}, ...}

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
			var peek=new BABYLON.ExecuteCodeAction(
				BABYLON.ActionManager.OnPickTrigger,
				function(ev){
					//alert( JSON.stringify(ev) ); //circular ref error
					//BIM.fun.log(Object.keys(ev).toString() );
					//BIM.fun.log(ev.pointerX, ev.pointerY);
					//BIM.fun.log(ev.meshUnderPointer.position);
					//BIM.fun.log(scene.activeCamera.position);
					//BIM.fun.log('mesh',Object.keys(ev.meshUnderPointer));
					
					var m=ev.meshUnderPointer.position;
					var c=scene.activeCamera.position;
					var d=m.subtract(c);
					var a=BIM.fun.closestAxis(d);
					//BIM.fun.log('diff',d,'closet axix',a);
					var r=new BABYLON.Vector3(m.x-a.x*10, m.y-a.y*10, m.z-a.z*10);
					//check to see if 
					
					var meshInst=ev.meshUnderPointer.createInstance('grown');					
					meshInst.position.copyFromFloats(m.x-a.x*10, m.y-a.y*10, m.z-a.z*10);
					//add growable functionality to instance
					meshInst.bimData={}; //TO-DO make this bimableFE
					growableFA(meshInst).setScene(scene);
					
					//trigger grow event for any interested UIs
					BIM.fun.trigger('grow', ev.meshUnderPointer);
				}
			);
			mesh.actionManager = new BABYLON.ActionManager(scene);
			mesh.actionManager.registerAction(peek);
			return mesh;
		}
	};
};

return growableFA;
});


