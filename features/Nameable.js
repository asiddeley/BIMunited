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
	module: 	nameable
	desc: 
	author: 	Andrew Siddeley 
	started:	26-Feb-2017, 25-May, 2017
	
****************************************************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var Feature=require('features/Feature');
var TextFC=require('features/textFC');

var Nameable=function(mesh, options){ 

	Feature.call(this, mesh, options);
	
	this.alias='name';
	this.control=TextFC;
	this.prop=mesh.name;
	this.propDefault='unnamed';
	this.propToBe=null;
}

//Inherit from prototype, or super class in OOP
Nameable.prototype=Object.create(Feature.prototype);
Nameable.prototype.constructor=Nameable;
//shortcut
var __=Nameable.prototype;

//override
__.propUpdate=function(propToBe){
	//call prototype, or super method in OOP 
	Feature.prototype.propUpdate.call(this, propToBe);
	//mesh.name=propToBe;
};

//override
__.setScene=function(scene, mesh){
	//call prototype, same as super method in OOP 
	Feature.prototype.setScene.call(this, scene, mesh);
	//scene contributer not applicable
};



return Nameable;

});


