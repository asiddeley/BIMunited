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
['babylon', 'jquery', 'kernel/window'],

// then construct part object...
function(babylon, $, win){

//alert('part...');

//construct sphere handler, AKA bunch of static properties and methods.
var partHandler = {

	/////////////////////
	// Must haves...
	// returns a new part 	
	create:function(userData){ return $.extend( {}, part, userData); },	 
	
	// returns a new part element with a random radius between 0 and 1
	demo:function(){ return this.create({'radius':Math.random()}); },

	// return a bunch of propterty access functions
	getProperties:function(){
		var that=this;
		return {
			name:that.name,
			position:that.position
		};
	},
	
	// babylon scene constructor
	setScene:function(part){	
		part.baby = babylon.Mesh.CreateSphere(	
			part.name, 
			part.segment,
			part.radius*2,
			win.BIM.scene,
			part.mutable,
			part.faceOrientation
		);
		// note two way reference between BIM and babylon elements
		part.baby.bim=part;
		//set position
		part.baby.position=part.position;
	},
	
	//////////////////////////////////////
	// Property access functions 
	// Include these in list that is returned by getProperties() above.
	// Functions may just display property or provide means of editing
	host:function(part, dashboard){  /*expose the part's parent */   },
	
	name:function(part, dashboard){
		dashboard.text('name', part.name,  function(part){ 
		/* no action required */
		});
	},
		
	position:function(part, dashboard){ 
		var callback=function(part){
			part.baby.position=part.position;
			//changed part will show with next scene render 
		};		
		//shows and allows edit of a position
		dashboard.point3d('position', part.position,  callback);
		//note that editXXX should take care of undo functions and log
	},

	type:function(part, dashboard){
		var callback=function(part){ 
			//no action required since a part's type is unchanging.
			//or is it? Some type changes possible, eg cube to sphere 
		};
		dashboard.label('type', 'part', callback );
	}
	
};

// part properties 
// partHandler is defined first because it is referenced below
// the model may contain many part but only one set of part handlers
var part = {
	baby:null,  //set during setScene
	faceMode:babylon.Mesh.DEFAULTSIDE, //scene.babylon.Mesh.DEFAULTSIDE
	handler:partHandler,
	name:'unnamed',
	poked:false,
	pokeRestore:null,
	position:babylon.Vector3(0,0,0),
	radius:1,
	segment:12,
	updateable:true
};

//alert('Part constructed');
return partHandler;
});


