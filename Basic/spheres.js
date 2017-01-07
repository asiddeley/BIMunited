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
		
	module: 	sphere
	desc: 
	usage:

	by: 		Andrew Siddeley 
	started:	27-Dec-2016
	
****************************************************************/

// properties of a part
// each instance carries properties 
// try to keep lean to conserve memory,
// consider making property static if it is large or constant
var prop={
	'create':function(scene, canvas){
		return this.babylon.Mesh.CreateSphere(	
			this.name, 
			this.segment,
			this.width,
			scene,
			this.mutable,
			this.babylon.Mesh.DEFAULTSIDE
			);
		},
	'type':'sphere'
};

var stat={};

////////////////////////////////////////////////////////

define(

//load dependencies...
['babylon','jquery','basic/_part'],

//then do...
function(babylon, $, part){

//return sphere factories
return {	
	
	'prop':function(userData){$.extend({}, part.prop(), prop, userData);},
	'stat':function(userData){$.extend({}, part.stat(), stat, userData);},	
	'demo':function(){return $.extend({}, part.prop(), prop, {'width':1});},
	
	'simple':function(userData){return $.extend({}, part.prop(), prop, userData);},	

	'baseball':function(){return $.extend({}, part().props, sphere, {'width':0.25}); },	
	'beachball':function(){return $.extend({}, part, sphere, {'width':2}); },
	'oddball':function(){return $,extend({}, part, sphere, {'width':Math.random()}); },
	'one':function(){return $.extend({}, part, sphere, {'width':1}); }
	
}

});