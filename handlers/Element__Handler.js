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

//var $=require('jquery');
//var babylon=require('babylon');
//var Nameable=require('features/Nameable');
//var Position=require('features/Position');

//DEP, use: var bimType=instanceOf (new Voxelite());
//	bimType:'Voxel', 

// Constructor - Used only once below  to create a static part handler or function Collection
// Voxelite() => voxelite {obj}, the handler with Static methods
var Element__Handler=function(){

	this.bimType='Voxelite';
	this.desc='A unit cube, that can be placed at integer coordinates.';
	this.Features=[];

};
var __=Element__Handler.prototype;	

//Static and Method function - mesh is optional
__.setScene=function(scene, mesh){  

	//return babylon mesh
};

__.addFeatures=function(Features){
	//adds a feature constructor function to this Element__Handler
	if (Features instanceof Array) {
		for (var i in Features){ this.Features.push(Features[i]); }
	}
};	

__.getfeatures=function(mesh) {
	// Returns a fresh hash of features:
	// {name:{feature}, position:{feature}...}
	// A feature is a hash scoped to a particular mesh like this:
	// {label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditer}
	// return $.extend({},name.getFeature(mesh) );
	
	//Hope there's no confusion on Features, features & feature.
	var features={}, feature, i;
	for (i in this.Features){
		feature=new this.Features[i](mesh);
		features[feature.alias]=feature;
	}
	return features;
}

return Element__Handler;
});