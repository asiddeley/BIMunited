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
	
var TextFC=require('features/textFC');	
var nameable=function(mesh){ 
	//Static function that returns a fresh name feature {}, scoped to a particular object ie. mesh
	//A feature is a hash used by a featuresUI to control
	//an object's (eg. babylon mesh) property (eg. position), and looks like this...
	//{label:'name', valu:mesh.variable, onFeatureChange:fn(ev,mesh,res){...}, editor:featureEditor}
	return { 
		alias:'Name',
		control:TextFC,
		prop:mesh.name,
		propDefault:'unnamed',
		propToBe:null,
		propUpdate:function(propToBe){mesh.name=propToBe;},
		setScene:function(scene){
			//scene contributer not applicable
		}
	};
};

return nameable;

});


