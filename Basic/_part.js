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
	desc:		(B)uilding(I)nformation(M)odel
				(s)cript(o)riented(u)tility(p)ackage 
		
	module: 	part
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	27-Dec-2016
	
****************************************************************/

// properties of a part
// each instance carries properties 
// try to keep lean to conserve memory,
// consider making property static if it is large or constant

var prop = {
	// properties
	'name':'unnamed',
	'mutable':true,
	'babyData':null, //initialized during setScene
	'parent':null,
	'position':null, //initialize during construction
	'segment':16,
	'type':'part',
	'width':1,
	
	// methods
	'another':function(scene, canvas){
		var p=this.position;
		var baby=this.create(scene, canvas);
		//baby.position=new this.babylon.Vector3(Math.random()*10, Math.random()*10, Math.random()*10);
		baby.position=new BIMsoup.babylon.Vector3(Math.random()*10, Math.random()*10, Math.random()*10);

		return baby;
	},
	
	//override this method to create 
	'create':function(scene, canvas){
		//return this.babylon.Mesh.CreateSphere(this.name, this.segment, this.width, scene);
		return BIMsoup.babylon.Mesh.CreateSphere(this.name, this.segment, this.width, scene);		
		
	},
	
	'setScene':function(scene, canvas){

		//then link it to soup model
		var baby=this.create(scene, canvas);
		baby.position=this.position;
		baby.soupData=this;
		this.babyData=baby;
	}
};

//Static properties / methods of a part
//These are common to each instance of a part
//For static methods, first arg is always part

var stat = {
	//not tested
	'setScene':function(part, scene, canvas){
		var baby=part.create(scene, canvas);
		baby.position=part.position;
		baby.BIMdata=part;
		part.babyData=baby;
	}
};

//////////////////////////////////////////////

define(
// load dependencies...
['babylon','jquery'],

// then construct part object...
function(babylon, $){
	
	//prop.babylon=babylon; //embed babylon library reference
	prop.position=babylon.Vector3(0,0,0);
	
	return{
		'prop':function(){return prop;},
		'stat':function(){return stat;},
		'demo':function(){return $.extend({}, prop, {'width':0.1}); }
	}
});


