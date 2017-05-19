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
	//Static function that returns a fresh name feature object {}, scoped to a particular mesh
	//A feature is a hash used by uiFeatures to control
	//an object's (eg. babylon mesh) property (eg. position), and looks like this...
	//{alias:'name', control:ChooserFC, prop:mesh.variable, propUpdate:fn(ev,mesh,res){...}, ...}
	return { 
		alias:'growable', //pick action
		control:ChooserFC, //requires choices
		//control:OptionsFC, //versatile
		choices:[
			{label:'enable', onChoose:function(ev){return true;}}, 
			{label:'disable', onChoose:function(ev){return false;}}
		],
		prop:mesh.bimData.pickenabled, //property path
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
			mesh.bimData.pickenabled=true;
			var peek=new BABYLON.ExecuteCodeAction(
				BABYLON.ActionManager.OnPickTrigger,
				function(ev){
					//alert( JSON.stringify(ev) ); //circular ref error
					BIM.fun.log(Object.keys(ev).toString() );
					//get the attention of PickerUI
					BIM.fun.trigger('meshPicked', ev.meshUnderPointer);
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


