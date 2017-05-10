/************************************************************

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
	module: 	module
	desc: 
	author: 	Andrew Siddeley 
	started:	18-Feb-2017
	
*/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var Voxelite=require('handlers/Voxelite');
var vox=new Voxelite();

// library of part handlers
// remember - one handler for every type of Bim part
return {
	voxelite:vox,
	voxelite_isotope1:vox,
	voxelite_isotope2:vox
	//insert:i (instance, modelRef, ref, xref)
	//model:m (block, blueprint, definition, prototype)
	//ground:g
	//terrain:ter
	//stairFlight:sf
	//wall:w,
	//cube:c,
	//torus:tor,
};

});


