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

	
	project:	BIMsoup
	desc:		(B)uilding (I)nformation (M)odel (s)cript (o)riented (u)tility (p)ackage 
		
	module: 	part
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	27-Dec-2016
	
****************************************************************/

define(
// load dependencies...
['babylon', 'jquery'],

// then construct part object...
function(babylon, $){

//construct sphere handler, AKA bunch of static properties and methods.
var partHandlers = {

	// returns a new part 	
	'create':function(userData){ $.extend( {}, part, userData); },	 
	// returns a new part element with a random radius between 0 and 1
	'demo':function(){ return $.extend( {}, part, { 'radius':Math.random() }); },
	// list of propterty access functions - functions may just display property or provide means of editing
	'properties': [ this.name, this.position ],

	// babylon scene constructor
	'setScene':function(part, scene, canvas){
		
		part.baby = babylon.Mesh.CreateSphere(	
			part.name, 
			part.segment,
			part.radius*2,
			scene,
			scene.mutable,
			scene.babylon.Mesh.DEFAULTSIDE
		);
		// note two way reference between BIM part and babylon element 
		part.baby.BIMP=part;
		//set position
		part.baby.position=part.position;
	},
	
	//////////////////////////////////////
	// property access functions 
	// include these in properties list above to expose
	'host':function(part, dashboard){
		//part's parent
	},
	
	'name':function(part, dashboard){
		var callback=function(part){
			//no action required 
		};		
		//shows and allows edit of a position
		dashboard.editText('name', part.name,  callback);
		//note that editXXX should take care of undo functions and log
	},
		

	'position':function(part, dashboard){ 
		var callback=function(part){
			part.baby.position=part.position;
			//changed part will show with next scene render 
		};		
		//shows and allows edit of a position
		dashboard.editPosition('position', part.position,  callback);
		//note that editXXX should take care of undo functions and log
	}

	
	
}

// sphere properties 
// note, sphereHandler is defined first because it is referenced below
// remember, model may have many spheres but only one shpere handler
var part = {
	'baby':null, 
	'handlers':partHandlers,
	'name':'unnamed',
	'position':BABYLON.Vector3(0,0,0),
	'radius':1
});

return partHandlers;
});


