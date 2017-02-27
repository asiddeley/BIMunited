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
	module: 	part
	desc: 
	author: 	Andrew Siddeley 
	started:	26-Feb-2017
	
****************************************************************/

define(
// load dependencies...
['babylon', 'jquery', 'kernel/window'],

// then construct part object...
function(babylon, $, win){

//construct handler. static functions require part as input
var NAME = {
	bimSuperType:null,
	bimType:'moduleProperty',

	create:function(){return $.extend({}, name); },
	onName:function(ev, part, result){ part.name=result;},
	feature:function(part){ return name:{
		valu:part.name, 
		onChange:NAME.onName,
		widget:'text',
		onEdit:uiText, //instead of widget
		onEditOK:NAME.onName //instead of onChange
		};
	}
};

var name = {name:'unnamed' };


return NAME;
});


