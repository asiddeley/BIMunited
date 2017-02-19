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

	
	project:	BIM united FC (Framework Concept)
	module: 	part
	desc: 
	author: 	Andrew Siddeley 
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
	
	bimSuperType:null,
	bimType:'part',
	
	// Constructor - returns a new part
	create:function(userData){ return $.extend( {}, part, userData); },	 
	
	creaters:{
		basic:function(){ return partHandler.create({name:'basic'});},
		randimized:function(){ return sphereHandler.create({ 
			position:new babylon.Vector3(Math.random()*5, Math.random()*5, Math.random()*5),
			radius:Math.random()*2
		});}
	},

	// Demonstrators - returns a new part element with a random radius between 0 and 1
	//demo:function(){ return this.create({'radius':Math.random()}); },

	// Accessors - returns a hash of propterty access functions
	getFeatures:function(part){
		var ph=part.handler; //same as 'this'
		return {
			partName:{valu:part.name, onChange:ph.onName, widget:'text'},
			partType:{valu:ph.bimType, onChange:ph.onType, widget:'text'}, 
			position:{valu:part.position, onChange:ph.onPosition, widget:'text'}
		};
	},
	
	// Babylon scene constructor
	setScene:function(part){	
		part.baby = babylon.Mesh.CreateSphere(	
			part.name, 
			part.segment,
			part.radius*2,
			win.BIM.scene,
			part.updateable,
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
	
	onHost:function(ev, part, result){  /*expose the part's parent */   },
	
	onName:function(ev, part, result){ part.name=result;},
	
	onPosition:function(ev, part, result){
		//update position in babylon element, should show on next scene render 
		//BIM.fun.log(result);
		//part.baby.position=part.position;
		BIM.fun.log('warning, position is read-only at this time');
	},
	
	onType:function(ev, part, result){
		//empty callback since a part's type is unchanging, read-only, private.
		var callback=function(){
			BIM.fun.log('warning, type is read-only');
		};
	}
	
};

// part features 
// partHandler is defined first because it is referenced below
// the model may contain many part but only one set of part handlers
var part = {
	baby:null,  //set during setScene
	faceMode:babylon.Mesh.DEFAULTSIDE, //scene.babylon.Mesh.DEFAULTSIDE
	handler:partHandler,
	name:'unnamed',
	position:babylon.Vector3(0,0,0),
	radius:1,
	segment:12,
	updateable:true
};

//alert('Part constructed');
return partHandler;
});


