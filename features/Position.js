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

	
	project:	BIM united FC (Framework Concept)
	module: 	featurePosition
	desc: 
	author: 	Andrew Siddeley 
	started:	6-Apr-2017
	
****************************************************************/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define( function(require, exports, module) {

var babylon=require('babylon');
var $=require('jquery');
var Feature=require('features/Feature');
var ChooserFC=require('features/ChooserFC');

var Position=function(mesh, more){ 
	/***********
	Static function that returns a fresh feature {}, scoped to a particular mesh.
	A feature is a hash used by FeaturesUI to edit and update babylon mesh properties.
	feature Eg.: {label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	*************/
	Feature.call(this, mesh, more);

	this.alias='position';
	this.control=ChooserFC; //feature control - ChooserFC requires choices below...
	this.desc='Vertex rounded to the nearest 10 units';
	this.prop=mesh.position; //meant for display only - call this.propUpdate to change
	this.propDefault=new babylon.Vector3(0,0,0);
	//this.propInit=function(){this.propUpdater(this.propDefault);};
	this.propToBe=null;
	this.choices=[
		{label:'random', 
		onChoose:function(ev){ 
			return new babylon.Vector3(
				10*Math.floor(Math.random()*10), 
				10*Math.floor(Math.random()*10), 
				10*Math.floor(Math.random()*10)
			); 
		}}, 
		{label:'origin',
		onChoose:function(ev){ 
			return new babylon.Vector3(0,0,0); 
		}}
	]	
};


//Inherit from prototype or super class in OOP
Position.prototype=Object.create(Feature.prototype);
Position.prototype.constructor=Position;
//shortcut
var __=Position.prototype;

//override
__.propUpdate=function(propToBe){ 
	//call prototype, or super method in OOP, for default behaviour
	Feature.prototype.propUpdate.call(this, propToBe);
	//this.mesh.position=propToBe; 
};

//override
__.setScene=function(scene, mesh){
	//call prototype, or super method in OOP, for default behaviour
	Feature.prototype.setScene.call(this, scene, mesh);
	//TO-DO...
};

return Position;
});


