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

var $=require('jquery');
var TextFC=require('features/TextFC');
	
var Feature=function(mesh, options){
	//Static function that returns a fresh name feature {}, scoped to a particular object ie. mesh
	//A feature is a hash used by a featuresUI to control
	//an object's (eg. babylon mesh) property (eg. position), and looks like this...
	//{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	
	this.alias='unnamedfeature'; //key or name - meant to be overriden
	this.control=TextFC;//User control - meant to be overriden
	this.mesh=mesh;
	this.prop=mesh.name; //string, number or object - meant for display only
	//this.propDefault='defaultvalue'; //meant to be overriden
	this.propToBe=null; //meant to be overriden
	/**********
	//propUpdate must not be defined here but further below as prototype
	//it does make a difference - it doesn't appear to be overridable if defined here! 
	this.propUpdate=function(){console.log('feature propUpdate', propToBe);} 
	***********/
	if (typeof mesh.bimData=='undefined') {mesh.bimData={};}
	if (typeof options!='undefined') {$.extend(this, options);}
};


Feature.prototype.propUpdate=function(prop, propToBe){
	/***************
	Meant to be overriden.
	If propToBe is primitive (number, string, boolean, null, undefined) then 
	update is easy, prop=propToBe
	If propToBe is complex (object, function) then prop is meant to match propToBe so
	update is an operation such as prop.x=propToBe.x, prop.y=propToBe.y etc 
	simply doing prop=propToBe will just assign the prop to another one which
	will continue to change with future unrelated feature operations 
	****************/
	//console.log('feature propUpdate', propToBe);
};


Feature.prototype.setScene=function(scene){
	/**********
	If used then call as a static function then call it on the applicable mesh ie
	Feature.prototype.setScene.call(mesh, scene)
	**********/

};


return Feature;

});


