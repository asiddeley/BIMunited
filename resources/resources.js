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
	module: 	resources
	desc: 
	author: 	Andrew Siddeley 
	started:	7-Jub-2017
	
*/

// Define a Module with Simplified CommonJS Wrapper...
// see http://requirejs.org/docs/api.html#cjsmodule
define(function(require, exports, module){

var Coaster=require('handlers/Coaster');
var Voxelite=require('handlers/Voxelite');
var TriAxis=require('handlers/TriAxis');
var vox=new Voxelite();

// Library of handler libraries
// Stored in BIM.resources
// Mainlu used by PartsUI

return {

	tools:{
		coasterHandle:new Coaster(), //handler
		coaster:null, //mesh
		triAxisHandle: new TriAxis(),
		triAxis:null,  //mesh
	},
	
	handlerLibraries:[
		{alias:'Arch', desc:'Arcitectural element collection', url:'Arch/archPartsLibrary.js'},
		{alias:'Geology', desc:'Geological element collection', url:'Geology/geologicalElements.js'},
		{alias:'Elec', desc:'Electrical Engineering element collection', url:'Elec/elecPartsLibrary.js'},
		{alias:'Handlers', desc:'BIM handler (element) collection', url:'handlers/handlers__elements.js'},
		{alias:'Mech', desc:'Mechanical Engineering element collection', url:'Mech/MechPartsLibrary.js'},
		{alias:'OpsMaint', desc:'Building Operations & Maintenance element collection', url:'OpsMaint/OpsMaintLibrary.js'},
		{alias:'QSCA', desc:'Quantity Surveying / Contract Administration element collection', url:'QSCA/QSCAelementsLibrary.js'}
	]
	
};

});


