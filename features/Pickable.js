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
	module: 	pickableFA
	desc: 
	author: 	Andrew Siddeley 
	started:	13-May-2017
	
****************************************************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var ChooserFC=require('features/ChooserFC');


var PickableFA=function(mesh, more){ 
	//Constructor of pickable Features
	//mesh - mesh or any object to act as the container of the features
	//more - options to be merged into this features

	Feature.call(this, mesh, more);
	
	this.alias='pickable'; //pick action
	this.control=ChooserFC; //requires choices
	this.choices=[
		{label:'enable', onChoose:function(ev){return true;}}, 
		{label:'disable', onChoose:function(ev){return false;}}
	];

	this.prop=null;	//mesh.bimData.pickenabled; //property path
	this.propDefault=true; //property in boolean 
		//propInit:function(scene, mesh){return this.setScene(scene);};
	this.propToBe=null; //to be determined
	this.propUpdate=function(propToBe){
		if (propToBe){
			//enable action
		}
		/*TO DO register/unregister action */
	};
};

//Inherit from the super class
Pickable.prototype=Object.create(Feature.prototype);
Pickable.prototype.constructor=Pickable;
//shortcut
var __=Pickable.prototype;

//override
__.propUpdate.prototype=function(propToBe){
	//first call super, don't care what it returns
	Feature.prototype.propUpdate(propToBe);

	Feature.propUpdate(propToBe);
	if (propToBe){
		//enable action
	}
	/*TO DO register/unregister action */
};

//override
__.setScene.prototype=function(scene, mesh){

	//first call super, don't care what it returns
	Feature.prototype.setScene(scene);

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
};

return PickableFA;
});


