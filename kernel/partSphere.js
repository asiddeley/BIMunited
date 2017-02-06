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

// load dependencies...
['babylon', 'jquery', 'kernel/part', 'kernel/window'],

// then do...
function(babylon, $, Part, win){
	
// Construct sphere handler, AKA list of static methods.
var sphereHandler = $.extend( {}, Part, {
	
	// Constructor - constructs and returns a new sphere inherits from part 
	create:function(userData){ return $.extend( {}, Part.create(), sphere, userData ); },
 	
	// Demonstrators - returns a new shere element (extended from part) with a random radius between 0 and 1
	demo:function(num){ 
		var that=this;
		switch(num){
			case 1: return that.create({ 'radius':Math.random() }); break;
			default: return that.create({ 'radius':Math.random() }); 			
		}
	},	

	getFeatures:function(){
		var that=this;
		return $.extend(Part.getFeatures(),{
			radius:that.radius
		});
	},

	// babylon scene constructor
	setScene:function(sphere){
		
		sphere.baby = babylon.Mesh.CreateSphere(	
			sphere.name, 
			sphere.segment,
			sphere.radius*2,
			win.BIM.scene,
			sphere.updatable,
			sphere.faceMode);
			
		// note two way relation between BIM part and babylon element 
		sphere.baby.bim=sphere;
		//set position
		sphere.baby.position=sphere.position;
	},

	radius:function(sphere, uiFeatureBoard){ 
		var onCommit=function(result){
			//BIM.fun.log(result);
			//update babylon element, should update with next render
			//sphere.radius=result;
			//sphere.baby.width=sphere.radius*2; <--does not update scene
			//so insead try recreating sphere or scaling...
			var s=result/sphere.radius;
			sphere.baby.scaling.x=s;
			sphere.baby.scaling.y=s;
			sphere.baby.scaling.z=s;	
		};		
		//shows and allows edit of real and maintains undo log
		uiFeatureBoard.text('radius', sphere.radius, onCommit);
	}
}); 


// Construct sphere properties.
// Used to extend part properties when Sphere.create() is called.
// SphereHandler is defined first because it is referenced below.
// there may have many spheres but only one shpere handler.
var sphere={
	handler:sphereHandler,
	position:babylon.Vector3(0,0,0),
	radius:1.0
};

return sphereHandler;

});