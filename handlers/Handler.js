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

	
	project:	BIM united FC (Feature & Function Collection)
	module: 	__PartHandler
	desc: 		Abstract base class for all part handlers.  Constructor function creates a handler Object, one handler per bimType
	author: 	Andrew Siddeley 
	started:	8-May-2017
	
****************************************************************/
// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module){

var $=require('jquery');
var babylon=require('babylon');
var nameFeature=require('features/nameFeature');
var positionFeature=require('features/positionFeature');

//DEP, use: var bimType=instanceOf (new Voxelite());
//	bimType:'Voxel', 

// Constructor - Used only once below  to create a static part handler or function Collection
// Voxelite() => voxelite {obj}, the handler with Static methods
var __PartHandler=function(){

	this.bimType='Voxelite';
	this.desc='A unit cube, that can be placed at integer coordinates.';

};
var __=__PartHandler.prototype;	
	
__.setScene=function(scene){  

	//return babylon mesh
};		
	
	var v=BABYLON.MeshBuilder.CreateBox('voxelite', options, scene);
	//v.position=new babylon.Vector3(
	//	10*Math.floor(Math.random()*10), 
	//	10*Math.floor(Math.random()*10), 
	//	10*Math.floor(Math.random()*10)); 
	v.material=m;	
		
	//add bim handler to babylon mesh object
	v.bimHandler=voxelite;
		
	//return the new mesh that was added to the scene
	return v;
	};

	

	this.getFeatures=function(mesh) {
		// Returns a fresh hash of features:
		// {name:{feature}, position:{feature}...}
		// A feature is a hash scoped to a particular mesh like this:
		// {label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditer}
		// return $.extend({},name.getFeature(mesh) );
		return {
			name:nameFeature(mesh),
			position:positionFeature(mesh)
		}

	}
}

return __PartHandler;
});