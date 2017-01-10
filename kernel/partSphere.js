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
		
	module: 	sphere
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	27-Dec-2016
	
****************************************************************/
define(

//load dependencies...
['babylon', 'jquery', 'kernel/part'],

//then do...
function(babylon, $, part){

//construct sphere handler, AKA bunch of static properties and methods.
var sphereHandlers = $.extend( {}, part, {
 	
	// returns a new shere element (extended from part) with a random radius between 0 and 1
	'demo':function(){ return $.extend( part.make, sphere, { 'radius':Math.random() }  ); },
	// returns a new sphere element which includes the properties of part (ancestor of all elements)	
	'make':function(){ $.extend( {}, part.make(), sphere); },	 
	// list of propterty access functions - functions may just display property or provide means of editing
	'properties': [ this.radius ],

	// babylon scene constructor
	'setScene':function(sphere, scene, canvas){
		
		sphere.baby = babylon.Mesh.CreateSphere(	
			sphere.name, 
			sphere.segment,
			sphere.radius*2,
			scene,
			scene.mutable,
			scene.babylon.Mesh.DEFAULTSIDE
		);
		// note two way relation between BIM part and babylon element 
		sphere.baby.BIMP=sphere;
		//set position
		sphere.baby.position=sphere.position;
	},
		

	'radius':function(sphere){ 
		var whenDone=function(sphere){
			sphere.baby.width=sphere.radius*2;
			//changed sphere will show with next scene render 
		};		
		//showReal('Shpere radius', sphere.radius);		
		//shows and allows edit of real 
		editReal('Sphere radius', sphere.radius,  whenDone);
		//note that editReal should take care of undo functions and log
	},

	
	
}

// sphere properties 
// note, sphereHandler is defined first because it is referenced below
// remember, model may have many spheres but only one shpere handler
var sphere = {
	'baby':null, 
	'handler':sphereHandler,
	'name':'unnamed',
	'position':BABYLON.Vector3(0,0,0),
	'radius':1
});




return sphereHandler;

});