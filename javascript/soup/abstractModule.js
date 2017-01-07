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
	desc:		(B)uilding(I)nformation(M)odel(s)ource(o)pen(u)tility(p)rogram 
		
	module: 	module
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	28-Dec-2016
	
*/


define(
// load dependencies...
['babylon'],

// then do...
function(babylon){
	
// return basic part
return {
	// properties
	'name':'unnamed',
	'mutable':false,
	'partobj':null,
	'position':new babylon.Vector3(0,0,0),
	'segment':16,
	'type':'part',
	'width':1
	
	// methods
	'setScene':function(scene, canvas){
		this.partobj=new Babylon.CreateSphere(this.name, this.segment, this.width, scene);
		this.partobj.position=this.position;	
		//this.partobj.rotation.x = Math.PI/4;	//rotate around x axis
		//this.partobj.scaling = new BABYLON.Vector3(2,1,1);
		//this.partobj.parent = otherPartObj; //all of parent's Tx will be applies to this
	},

}

});


