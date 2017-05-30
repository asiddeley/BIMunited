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
	
var Feature=function(mesh, options){
	//Static function that returns a fresh name feature {}, scoped to a particular object ie. mesh
	//A feature is a hash used by a featuresUI to control
	//an object's (eg. babylon mesh) property (eg. position), and looks like this...
	//{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	
	this.alias='Name';
	this.control=TextFC;
	this.prop=mesh.name;
	this.propDefault='unnamed';
	this.propToBe=null;

};

Feature.prototype.propUpdate=function(propToBe){
	mesh.name=propToBe;
}

Feature.prototype.setScene=function(scene){


}


return Feature;

});


