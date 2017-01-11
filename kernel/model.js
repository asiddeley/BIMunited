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
	desc:		Building Information Model source open utility program 
		
	module: 	model
	desc: 
	usage:

	author: 	Andrew Siddeley 
	started:	17-Dec-2016
	
*************************************************************************/


define(
// load dependencies...
['sylvester'],

// then do...
function(vmath) {

// return a constructed basicModel
return {

	'addPart':function(part){
		part.parent=this;
		this.parts.push(part);
		if (this.scene!=null)
			part.setScene(this.scene, this.canvas);
		},
		
	
		
	'canvas':null, //why?
	'discipline':null,
	'name':'unnamed',
	'parts':[],
	'scene':null, //why?
	
	'setScene':function(scene, canvas){
		if (this.scene==null) {this.scene=scene; this.canvas=canvas;}
		for (var i=0; i<this.parts.length; i++){
			//part_static(part[i],scene, canvas);
			this.parts[i].setScene(scene, canvas);
			}
		},
	'tags':[],
	'type':'model',
	'visit':function(visitor){visitor.welcome(this);},			
	'xyz':vmath.V([1,2,3])			
};

});











