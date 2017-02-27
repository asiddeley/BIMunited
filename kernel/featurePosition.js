/************************************************************
	license:
	
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
	module: 	featurePosition
	desc: 
	author: 	Andrew Siddeley 
	started:	26-Feb-2017
	
****************************************************************/

define(
// load dependencies...
['babylon', 'jquery'],

// then construct part object...
function(babylon, $){

// This module allows for a bim feature or property to be added to a host.

// Construct handler or static functions. 
// Each static function requires host as input
var POSITION = {

	create:function(host){
		//return a new position hash
		return $.extend({}, position);
	},
	
	onPosition:function(ev, host, result){
		//update position in babylon element, should show on next scene render 
		//host.baby.position=host.position;
		BIM.fun.log('warning, position is read-only at this time');
	},

	feature:function(host){ 
		return position:{
			valu:host.position, 
			onChange:POSITION.onPosition,
			widget:'position', //replace with module ref
			//onEdit:uiPosition, //instead of widget
			//onEditOK:POSITION.onPosition //instead of onChange
		};
	}
};

var position = {
	handler:POSITION, //this will get overriden
	position:new babylon.Vector3(0,0,0),
};


return POSITION;
});


