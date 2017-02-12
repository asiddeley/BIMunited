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
	////////////////
	// Must Haves...
	
	// Constructor - returns a new part
	create:function(userData){ return $.extend( {}, part, userData); },	 
	
	// Demonstrators - returns a new part element with a random radius between 0 and 1
	demo:function(){ return this.create({'radius':Math.random()}); },

	// Accessors - returns a hash of propterty access functions
	getFeatures:function(part){
		return {
			partName:{valu:part.name, onChange:this.ocName, widget:'text'},
			partType:{valu:this.partType, onChange:this.ocType, widget:'text'}, 
			position:{valu:part.position, onChange:this.ocPosition, widget:'text'}
		};
	},
	
	// Babylon scene constructor
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
	// Feature access functions 
	// Include these in list that is returned by getProperties() above.
	// Functions may just display property or provide means of editing
	
	host:function(part, uiPropBrd){  /*expose the part's parent */   },
	
	ocName:function(part, result){ part.name=result;},
	
	ocPosition:function(part, result){
		//update position in babylon element, should show on next scene render 
		//BIM.fun.log(result);
		//part.baby.position=part.position;
		BIM.fun.log('warning, position is read-only at this time');
	},
	
	ocType:function(part, result){
		//empty callback since a part's type is unchanging, read-only, private.
		var callback=function(){
			BIM.fun.log('warning, type is read-only');
		};
	},
	
	partType:'part'
	
};

// part features 
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


