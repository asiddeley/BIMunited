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

	
	project:	BIM united FC 
	module: 	Feature
	desc: 
	author: 	Andrew Siddeley 
	started:	29-May, 2017
	
****************************************************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var TextFC=require('features/TextFC');
	
var Feature=function(mesh, options){
	//Static function that returns a fresh name feature {}, scoped to a particular object ie. mesh
	//A feature is a hash used by a featuresUI to control
	//an object's (eg. babylon mesh) property (eg. position), and looks like this...
	//{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	
	this.alias='name'; //meant to be overriden
	this.control=TextFC;//meant to be overriden
	this.mesh=mesh;
	this.prop=mesh.name; //meant for display only
	this.propDefault='unnamed'; //meant to be overriden
	this.propToBe=null; //meant to be overriden

};

Feature.prototype.propUpdate=function(propToBe){
	this.mesh[this.alias]=propToBe;
};

Feature.prototype.setScene=function(scene, mesh){
	/**********
	note that this function is also meant to be called as via 
	prototype.setScene (ie. as a static function)
	in which case is mesh is not available via this.mesh 
	hence mesh is an argument
	************/
	
	//check if this function is being called as a method or via prototype...
	if (typeof this.mesh != 'undefined'){
		//setup property if not already there
		if (typeof this.mesh[this.alias] == 'undefined'){
			this.mesh[this.alias]=this.propDefault;
		} else {
		/*
		TO-DO 
		Consider further; Property already exists so either
		it's a property being harnessed or that	
		there's a conflict with another feature...  
		
		*/
		}
	}

};


return Feature;

});


